using System.ComponentModel.DataAnnotations;

namespace server.Classes;

public class Chat
{
  public int id { get; set; }
  public int ticket_id { get; set; }
  public int? support_id { get; set; }
  public DateTime created_at { get; set; }
  public string message { get; set; }
  public bool from_support { get; set; }
  public bool from_ai { get; set; } = false;
  public string? company_name { get; set; }
  public string? firstname { get; set; }
  public string? lastname { get; set; }
  public string? ticket_message { get; set; }

  // Needed for model binding from JSON
  public Chat() { }

  public Chat(int id, int ticket_id, int support_id, DateTime created_at, string message, bool from_support, bool from_ai, string company_name, string firstname, string lastname, string ticket_message)
  {
    this.id = id;
    this.ticket_id = ticket_id;
    this.support_id = support_id;
    this.created_at = created_at;
    this.message = message;
    this.from_support = from_support;
    this.company_name = company_name;
    this.firstname = firstname;
    this.lastname = lastname;
    this.ticket_message = ticket_message;
    this.from_ai = from_ai;
  }
}