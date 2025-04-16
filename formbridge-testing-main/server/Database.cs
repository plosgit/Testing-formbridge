namespace server;

using Npgsql;

public class Database
{
    /* To use Database.cs you need to create Credentials.cs.
       Make Credentials.cs static and add these lines...
       
        namespace server;

        public static class Credentials
        {
            public static readonly string Host = "localhost";
            public static readonly string Port = "5432";
            public static readonly string Username = "postgres";
            public static readonly string Password = "your_password";
            public static readonly string Database = "formbridge";
        }
     */
    private readonly string _host = Credentials.Host;
    private readonly string _port = Credentials.Port;
    private readonly string _username = Credentials.Username;
    private readonly string _password = Credentials.Password;
    private readonly string _database = Credentials.Database;

    private NpgsqlDataSource _connection;

    // get the connection
    public NpgsqlDataSource Connection()
    {
        return _connection;
    }

    // connects to the database (in the constructor)
    public Database()
    {
        // builds the connectionstring (adress and login to the database) 
        string connectionString = $"Host={_host};Port={_port};Username={_username};Password={_password};Database={_database}";
        // used for getting the connection
        var dataSourceBuilder = new NpgsqlDataSourceBuilder(connectionString);
        dataSourceBuilder.MapEnum<Role>();
        dataSourceBuilder.MapEnum<Subject>();
        _connection = dataSourceBuilder.Build();
    }
}