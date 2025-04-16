namespace server.Classes;

public class Customer
{
  public string email { get; set; }
  public string firstname { get; set; }
  public string lastname { get; set; }
  public int ticket_id { get; set; }


  public Customer(string email, string firstname, string lastname, int ticket_id)
  {
    this.email = email;
    this.firstname = firstname;
    this.lastname = lastname;
    this.ticket_id = ticket_id;
  }

}