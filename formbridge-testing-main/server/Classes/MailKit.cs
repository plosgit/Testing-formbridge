using System;
using MailKit.Net.Smtp;
using MimeKit;

public class EmailService
{
  public async Task SendEmail(string email, string subject, string body)
  {
    var message = new MimeMessage();
    message.From.Add(new MailboxAddress("FormBridge", "official.formbridge@gmail.com"));
    message.To.Add(new MailboxAddress("", email));
    message.Subject = subject;

    // Email body
    message.Body = new TextPart("plain")
    {
      Text = body
    };

    using (var client = new SmtpClient())
    {
      client.Connect("smtp.gmail.com", 587, MailKit.Security.SecureSocketOptions.StartTls);
      client.Authenticate("official.formbridge@gmail.com", "nmcg qbws oqoq gshp"); // Email and App Password
      client.Send(message);
      client.Disconnect(true);
      Console.WriteLine("Email Sent Successfully!");
    }
  }
}
