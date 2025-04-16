namespace server.Classes;

public class ModelFile
{
  public int id { get; set; }
  public string modelfile { get; set; }
  public int company_id { get; set; }


  public ModelFile(int id, string modelfile, int company_id)
  {
    this.id = id;
    this.modelfile = modelfile;
    this.company_id = company_id;
  }
}