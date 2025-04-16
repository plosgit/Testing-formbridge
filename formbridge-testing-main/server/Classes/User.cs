using System.Reflection.Metadata.Ecma335;

namespace server.Classes;

using System.Text.Json.Serialization;

public class User
{
  public int id { get; set; }
  public string firstname { get; set; }
  public string lastname { get; set; }
  public string email { get; set; }
  public string password { get; set; }
  public int company_id { get; set; }

  [JsonConverter(typeof(JsonStringEnumConverter))]
  public Role role { get; set; }

  public string company_name { get; set; }

  public User(int id, string firstname, string lastname, string email, string password, int company_id, Role role, string company_name)
  {
    this.id = id;
    this.firstname = firstname;
    this.lastname = lastname;
    this.email = email;
    this.password = password;
    this.company_id = company_id;
    this.role = role;
    this.company_name = company_name;
  }

  public override string ToString()
  {
    return $"id: {id}, name: {firstname} {lastname}, email {email}, company id: {company_id}, role: {role}, company: {company_name}";
  }
}