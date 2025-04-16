using System.Reflection.Metadata.Ecma335;
using System.Text.Json.Serialization;

namespace server.Classes;

public class Ticket
{
  public int id { get; set; }
  public string firstname { get; set; }
  public string lastname { get; set; }
  public string email { get; set; }
  public string message { get; set; }

  [JsonConverter(typeof(JsonStringEnumConverter))]
  public Subject subject { get; set; }
  
  public DateTime created_at { get; set; }
  public bool resolved { get; set; }
  public int rating { get; set; }
  public int company_id { get; set; }
  public string company_name { get; set; }

  public Ticket(int id, string firstname, string lastname, string email, string message, Subject subject, DateTime created_at, bool resolved, int rating, int company_id, string company_name)
  {
    this.id = id;
    this.firstname = firstname;
    this.lastname = lastname;
    this.email = email;
    this.message = message;
    this.subject = subject;
    this.created_at = created_at;
    this.resolved = resolved;
    this.rating = rating;
    this.company_id = company_id;
    this.company_name = company_name;
  }

  public override string ToString()
  {
    return $"id: {id}, name: {firstname} {lastname}, email {email}, message: {message}, subject: {subject}, created: {created_at.ToString("yyyy-mm-dd")}, resolved: {resolved}, rating: {rating}, company id: {company_id}, company_name: {company_name}";
  }
}