namespace server.Classes;

public class Message
{
  public string message { get; set; }
  public int? id { get; set; }

  public Message(string message, int? id = 0)
  {
    this.message = message;
    this.id = id;
  }
}
