
using Npgsql;
using server;
using server.Classes;

public static class ScrappedMethods
{
  static async Task<List<Ticket>> GetTickets(NpgsqlDataSource db)
  {
    var tickets = new List<Ticket>();
    await using var cmd = db.CreateCommand("SELECT * FROM tickets_company_name ORDER BY id DESC");
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

  static async Task<List<User>> GetUsers(NpgsqlDataSource db)
  {
    var users = new List<User>();
    await using var cmd = db.CreateCommand("SELECT * FROM users_company_name ORDER BY id ASC");
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
          Enum.Parse<Role>(reader.GetString(6)),
          reader.IsDBNull(7) ? String.Empty : reader.GetString(7)
        ));
      }
    }

    return users;
  }
}