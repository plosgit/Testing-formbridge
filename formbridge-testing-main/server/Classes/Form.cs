namespace server.Classes;

public class Form
{
    public int id { get; set; }

    public string name { get; set; }

    public int companyId { get; set; }

    public Form(int id, string name, int companyId)
    {
        this.id = id;
        this.name = name;
        this.companyId = companyId;
    }

    public override string ToString()
    {
        return $"id: {id}, name: {name}, company id: {companyId}";
    }
}

