using Microsoft.Extensions.ObjectPool;
using System.Text.Json;
using Npgsql;
using server;
using server.Classes;
using server.Extensions;
using Microsoft.AspNetCore.Http.HttpResults;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddDistributedMemoryCache();
builder.Services.AddSession(options =>
{
  options.IdleTimeout = TimeSpan.FromMinutes(20);
  options.Cookie.HttpOnly = true;
  options.Cookie.IsEssential = true;
});

Database database = new Database();
NpgsqlDataSource db = database.Connection();
builder.Services.AddSingleton(db);

var app = builder.Build();

app.UseDefaultFiles();         // serves index.html by default
app.UseStaticFiles();        // allows access to JS, CSS, images
app.MapFallbackToFile("index.html"); // handles SPA routing

app.UseSession();

app.MapGet("/api/login", (Func<HttpContext, Task<IResult>>)GetLogin);
app.MapPost("/api/login", (Func<HttpContext, LoginRequest, NpgsqlDataSource, Task<IResult>>)Login);
app.MapDelete("/api/login", (Func<HttpContext, Task<IResult>>)Logout);

app.MapGet("/api/forms", GetForms);
app.MapGet("/api/messages/{ticket_id}", GetMessages); //dynamic
app.MapGet("api/users/{company_id}", GetUsers).RequireRole(Role.ADMIN); // dynamic + protect route
app.MapGet("/api/tickets/{company_id}", GetTickets).RequireRole(Role.SUPPORT, Role.ADMIN); // dynamic + protect route
app.MapGet("/api/tickets/{ticket_id}/single", GetSingleTicket); // cannot be protected or customer cannot load messages!!

app.MapPut("/api/tickets/{ticket_id}/resolve", ResolveTicket).RequireRole(Role.SUPPORT, Role.ADMIN); // dynamic + protect route

//app.MapPost("/api/tickets", PostTicket);
app.MapPost("/api/tickets/{company_id}", PostTicket); // dynamic
app.MapPost("/api/sendemail", SendEmail);
app.MapPost("/api/sendemail/{company_id}", SendEmail); // dynamic
app.MapPost("/api/users", AddUser).RequireRole(Role.ADMIN); // protect route
app.MapPost("/api/messages/{ticket_id}", SendMessage); // dynamic
app.MapPost("/api/ratings/{ticked_id}", SubmitRating);

app.MapDelete("/api/users/{user_id}", DeleteUser).RequireRole(Role.ADMIN); // dynamic + protect route

app.MapPut("/api/users/setpassword", SetPassword);
app.MapPost("/api/users/sendwelcomeemail", SendWelcomeEmail);

app.MapGet("api/ai/{company_id}", GetModelFile);
app.MapPut("api/ai/{company_id}", UpdateModelFile);


static async Task<IResult> GetLogin(HttpContext context)
{
  Console.WriteLine("GetSession is called..Getting session");
  var key = await Task.Run(() => context.Session.GetString("User"));
  if (key == null)
  {
    return Results.NotFound(new { message = "No one is logged in." });
  }

  var user = JsonSerializer.Deserialize<User>(key);
  Console.WriteLine("user: " + user);
  return Results.Ok(user);
}


static async Task<IResult> Login(HttpContext context, LoginRequest request, NpgsqlDataSource db)
{
  if (context.Session.GetString("User") != null)
  {
    return Results.BadRequest(new { message = "Someone is already logged in." });
  }

  Console.WriteLine("SetSession is called...Setting session");

  await using var cmd = db.CreateCommand("SELECT * FROM users_company_name WHERE email = $1 and password = $2");
  cmd.Parameters.AddWithValue(request.Email);
  cmd.Parameters.AddWithValue(request.Password);

  await using (var reader = await cmd.ExecuteReaderAsync())
  {
    if (reader.HasRows)
    {
      while (await reader.ReadAsync())
      {
        User user = new User(
          reader.IsDBNull(0) ? 0 : reader.GetInt32(0),
          reader.IsDBNull(1) ? String.Empty : reader.GetString(1),
          reader.IsDBNull(2) ? String.Empty : reader.GetString(2),
          reader.IsDBNull(3) ? String.Empty : reader.GetString(3),
          reader.IsDBNull(4) ? String.Empty : reader.GetString(4),
          reader.IsDBNull(5) ? 0 : reader.GetInt32(5),
          Enum.Parse<Role>(reader.GetString(6)),
          reader.IsDBNull(7) ? String.Empty : reader.GetString(7)
        );
        await Task.Run(() => context.Session.SetString("User", JsonSerializer.Serialize(user)));
        Console.WriteLine(user);
        return Results.Ok(user);
      }
    }
  }

  return Results.NotFound(new { message = "No user found." });
}

static async Task<IResult> Logout(HttpContext context)
{
  if (context.Session.GetString("User") == null)
  {
    return Results.Conflict(new { message = "No login found." });
  }

  Console.WriteLine("ClearSession is called..Clearing session");
  await Task.Run(context.Session.Clear);
  return Results.Ok(new { message = "Logged out." });
}

async Task<List<Form>> GetForms()
{
  var forms = new List<Form>();
  await using var cmd = db.CreateCommand("SELECT * FROM forms ORDER BY name ASC");
  await using (var reader = await cmd.ExecuteReaderAsync())
  {
    while (await reader.ReadAsync())
    {
      forms.Add(new Form(
        reader.IsDBNull(0) ? 0 : reader.GetInt32(0),
        reader.IsDBNull(1) ? String.Empty : reader.GetString(1),
        reader.IsDBNull(2) ? 0 : reader.GetInt32(2)
      ));
    }
  }

  return forms;
}

async Task<List<Chat>> GetMessages(int ticket_id)
{
  // FIXME: SELECT * FROM view instead
  var messages = new List<Chat>();
  await using var cmd = db.CreateCommand(@"
      SELECT
          chats.id,
          chats.ticket_id,
          chats.support_id,
          chats.created_at,
          chats.message,
          chats.from_support,
          chats.from_ai,
          companies.name,
          tickets.firstname,
          tickets.lastname,
          tickets.message AS ticket_message
      FROM chats
      JOIN tickets ON chats.ticket_id = tickets.id
      JOIN companies ON tickets.company_id = companies.id
      WHERE chats.ticket_id = $1
      ORDER BY chats.created_at ASC
      ");

  cmd.Parameters.AddWithValue(ticket_id);

  await using (var reader = await cmd.ExecuteReaderAsync())
  {
    while (await reader.ReadAsync())
    {
      messages.Add(new Chat(
        reader.GetInt32(0), // chats.id
        reader.GetInt32(1), // chats.ticket_id
        reader.IsDBNull(2) ? 0 : reader.GetInt32(2), // chats.support_id
        reader.GetDateTime(3), // chats.created_at
        reader.GetString(4), // chats.message
        reader.GetBoolean(5), // chats.from_support
        reader.GetBoolean(6), // chats.from_ai (needed to be in correct order inside chat.cs!)
        reader.GetString(7), // company name
        reader.GetString(8), // firstname
        reader.GetString(9), // lastname
        reader.GetString(10) //ticket_message

      ));
    }
  }

  return messages;
}

async Task<Message> PostTicket(Ticket ticket)
{
  try
  {
    int? id;
    await using (var cmd = db.CreateCommand(
                   "INSERT INTO tickets (firstname, lastname, email, message, subject, company_id) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id"))
    {
      cmd.Parameters.AddWithValue(ticket.firstname);
      cmd.Parameters.AddWithValue(ticket.lastname);
      cmd.Parameters.AddWithValue(ticket.email);
      cmd.Parameters.AddWithValue(ticket.message);
      cmd.Parameters.AddWithValue(ticket.subject);
      cmd.Parameters.AddWithValue(ticket.company_id);
      id = (int?)await cmd.ExecuteScalarAsync();
    }

    return new Message($"Ticket {id} has been succefully added to database!", id);
  }
  catch (Exception error)
  {
    Console.WriteLine("Error: " + error.Message);
    return new Message("Unable to add ticket to database.. Error: " + error.Message);
  }
}

async Task<List<Ticket>> GetTickets(int company_id)
{
  var tickets = new List<Ticket>();
  await using var cmd = db.CreateCommand("SELECT * FROM tickets_company_name WHERE company_id = $1 ORDER BY id DESC");

  cmd.Parameters.AddWithValue(company_id);

  await using (var reader = await cmd.ExecuteReaderAsync())
  {
    while (await reader.ReadAsync())
    {
      tickets.Add(new Ticket(
        reader.IsDBNull(0) ? 0 : reader.GetInt32(0),
        reader.IsDBNull(1) ? String.Empty : reader.GetString(1),
        reader.IsDBNull(2) ? String.Empty : reader.GetString(2),
        reader.IsDBNull(3) ? String.Empty : reader.GetString(3),
        reader.IsDBNull(4) ? String.Empty : reader.GetString(4),
        reader.IsDBNull(5) ? 0 : Enum.Parse<Subject>(reader.GetString(5)),
        reader.IsDBNull(6) ? DateTime.Now : reader.GetDateTime(6),
        reader.IsDBNull(7) ? false : reader.GetBoolean(7), // resolved bool
        reader.IsDBNull(8) ? 0 : reader.GetInt32(8),
        reader.IsDBNull(9) ? 0 : reader.GetInt32(9),
        reader.IsDBNull(10) ? String.Empty : reader.GetString(10)
      ));
    }
  }
  
  return tickets;
}

async Task<Ticket?> GetSingleTicket(int ticket_id)
{
  Ticket? ticket = null;
  await using var cmd = db.CreateCommand("SELECT * FROM tickets_company_name WHERE id = $1");

  cmd.Parameters.AddWithValue(ticket_id);

  await using (var reader = await cmd.ExecuteReaderAsync())
  {
    while (await reader.ReadAsync())
    {
      ticket = new Ticket(
        reader.IsDBNull(0) ? 0 : reader.GetInt32(0),
        reader.IsDBNull(1) ? String.Empty : reader.GetString(1),
        reader.IsDBNull(2) ? String.Empty : reader.GetString(2),
        reader.IsDBNull(3) ? String.Empty : reader.GetString(3),
        reader.IsDBNull(4) ? String.Empty : reader.GetString(4),
        reader.IsDBNull(5) ? 0 : Enum.Parse<Subject>(reader.GetString(5)),
        reader.IsDBNull(6) ? DateTime.Now : reader.GetDateTime(6),
        reader.IsDBNull(7) ? false : reader.GetBoolean(7), // resolved bool
        reader.IsDBNull(8) ? 0 : reader.GetInt32(8),
        reader.IsDBNull(9) ? 0 : reader.GetInt32(9),
        reader.IsDBNull(10) ? String.Empty : reader.GetString(10)
      );
    }
  }

  return ticket;
}

async Task ResolveTicket(int ticket_id)
{
  // add try-catch
  await using var
    cmd = db.CreateCommand(
      "UPDATE tickets SET resolved = TRUE WHERE id = $1"); //Importat to update in tickets table and not a view

  cmd.Parameters.AddWithValue(ticket_id);

  await cmd.ExecuteNonQueryAsync();
  //add Task<IResult> with a return Results.Ok...
}

async Task<List<User>> GetUsers(int company_id)
{
  var users = new List<User>();
  await using var cmd = db.CreateCommand("SELECT * FROM users_company_name WHERE company_id = $1 ORDER BY id ASC");

  cmd.Parameters.AddWithValue(company_id);

  await using (var reader = await cmd.ExecuteReaderAsync())
  {
    while (await reader.ReadAsync())
    {
      users.Add(new User(
        reader.IsDBNull(0) ? 0 : reader.GetInt32(0),
        reader.IsDBNull(1) ? String.Empty : reader.GetString(1),
        reader.IsDBNull(2) ? String.Empty : reader.GetString(2),
        reader.IsDBNull(3) ? String.Empty : reader.GetString(3),
        reader.IsDBNull(4) ? String.Empty : reader.GetString(4),
        reader.IsDBNull(5) ? 0 : reader.GetInt32(5),
        reader.IsDBNull(6) ? 0 : Enum.Parse<Role>(reader.GetString(6)),
        reader.IsDBNull(7) ? String.Empty : reader.GetString(7)
      ));
    }
  }

  return users;
}


async Task<Message> SendMessage(Chat chat)
{
  try
  {
    await using (var cmd = db.CreateCommand(
                   "INSERT INTO chats (ticket_id, support_id, message, from_support, from_ai) VALUES ($1, $2, $3, $4, $5)"))
    {
      cmd.Parameters.AddWithValue(chat.ticket_id);
      cmd.Parameters.AddWithValue(chat.support_id == 0 ? System.DBNull.Value : chat.support_id);
      //cmd.Parameters.AddWithValue(chat.created_at);
      cmd.Parameters.AddWithValue(chat.message);
      cmd.Parameters.AddWithValue(chat.from_support);
      cmd.Parameters.AddWithValue(chat.from_ai);
      await cmd.ExecuteNonQueryAsync();
    }

    return new Message("Message has been succefully added to database!");
  }
  catch (Exception error)
  {
    Console.WriteLine("Error: " + error.Message);
    return new Message("Unable to add message to database.. Error: " + error.Message);
  }
}

async Task<Message> SubmitRating(Rating rating)
{
  try
  {
    await using (var cmd = db.CreateCommand(
                  "INSERT INTO ratings (rating, ticket_id) VALUES ($1, $2)"))
    {
      cmd.Parameters.AddWithValue(rating.rating);
      cmd.Parameters.AddWithValue(rating.ticket_id);
      await cmd.ExecuteNonQueryAsync();
    }

    return new Message("Rating has successfully been submitted!");
  }
  catch (Exception error)
  {
    Console.WriteLine("Error: " + error.Message);
    return new Message("Failed INSERTING rating to database. Error: " + error.Message);
  }
}

async Task<Message> SendEmail(Customer customer)
{
  var emailService = new EmailService();
  await emailService.SendEmail(customer.email, "Your Support-Link",
    $"Hello {customer.firstname} {customer.lastname}. This is the link to your support-chat http://localhost:5173/chat/{customer.ticket_id}");

  Console.WriteLine("Email Sent Successfully!");
  return new Message("Email Sent Successfully!");
}

async Task<Message> AddUser(User user)

{
  try
  {
    await using (var cmd = db.CreateCommand(
                   "INSERT INTO users (firstname, lastname, email, company_id) VALUES ($1, $2, $3, $4)"))

    {
      cmd.Parameters.AddWithValue(user.firstname);
      cmd.Parameters.AddWithValue(user.lastname);
      cmd.Parameters.AddWithValue(user.email);
      cmd.Parameters.AddWithValue(user.company_id);
      await cmd.ExecuteNonQueryAsync();
    }

    return new Message("User has been succefully added to database!");
  }
  catch (Exception error)
  {
    Console.WriteLine("Error: " + error.Message);
    return new Message("Unable to add user to database.. Error: " + error.Message);
  }
}

async Task DeleteUser(int user_id)
{
  await using (var cmd = db.CreateCommand("DELETE FROM users WHERE id = $1"))
  {
    cmd.Parameters.AddWithValue(user_id);
    await cmd.ExecuteNonQueryAsync();
  }
}

async Task<Message> SetPassword(LoginRequest newPassword)
{
  await using (var cmd = db.CreateCommand("UPDATE users SET password = $2 WHERE email = $1"))
  {
    cmd.Parameters.AddWithValue(newPassword.Email);
    cmd.Parameters.AddWithValue(newPassword.Password);
    await cmd.ExecuteNonQueryAsync();
  }
  return new Message("Password updated successfully");
}

async Task SendWelcomeEmail(SupportAgent agent)
{
  var emailService = new EmailService();
  await emailService.SendEmail(agent.email, "Set your password",
    $"Hello! This is the link to set your new password: http://localhost:5173/setpassword");

  Console.WriteLine("Email Sent Successfully!");
}

async Task<ModelFile?> GetModelFile(int company_id)
{

  ModelFile? modelFile = null;
  await using var cmd = db.CreateCommand("SELECT * FROM chatbot WHERE id = $1");

  cmd.Parameters.AddWithValue(company_id);

  await using (var reader = await cmd.ExecuteReaderAsync())
  {
    while (await reader.ReadAsync())
    {
      modelFile = new ModelFile(
        reader.IsDBNull(0) ? 0 : reader.GetInt32(0),
        reader.IsDBNull(1) ? String.Empty : reader.GetString(1),
        reader.IsDBNull(0) ? 0 : reader.GetInt32(0)
      );
    }
  }

  return modelFile;
}

async Task<Message> UpdateModelFile(ModelFile modelFile)
{
  await using (var cmd = db.CreateCommand("UPDATE chatbot SET modelfile = $2 WHERE company_id = $1"))
  {
    cmd.Parameters.AddWithValue(modelFile.company_id);
    cmd.Parameters.AddWithValue(modelFile.modelfile);
    await cmd.ExecuteNonQueryAsync();
  }
  return new Message("Your AI has been updated!");
}


await app.RunAsync();