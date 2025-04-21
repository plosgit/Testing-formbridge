namespace E2Eformbridge.Steps;

using Microsoft.Playwright;
using TechTalk.SpecFlow;
using Xunit;

[Binding]
public class SubmitForm
{
    private IPlaywright _playwright;
    private IBrowser _browser;
    private IBrowserContext _context;
    private IPage _page;

    [BeforeScenario]
    public async Task Setup()
    {
        _playwright = await Playwright.CreateAsync();
        _browser = await _playwright.Chromium.LaunchAsync(new() { Headless = false, SlowMo = 1000 });
        _context = await _browser.NewContextAsync();
        _page = await _context.NewPageAsync();
    }

    [AfterScenario]
    public async Task TearDown()
    {
        Console.WriteLine("TearDown runs");
        await _browser.CloseAsync();
        _playwright.Dispose();
    }

    [Given(@"I am on the home page for form submission")]
    public async Task GivenIAmOnTheHomePageForFormSubmission()
    {
        await _page.GotoAsync("http://localhost:5120/");
    }

    [Given(@"I click on customer forms")]
    public async Task GivenIClickOnCustomerForms()
    {
        await _page.ClickAsync("text=[Demo] Customer Forms");
    }
    

    [Given(@"I click on the pick button")]
    public async Task GivenIClickOnThePickButton()
    {
        await _page.ClickAsync("button#submit");
    }


    [Given(@"I enter ""(.*)"" as my first name")]
    public async Task GivenIEnterAsMyFirstName(string firstname)
    {
        await _page.FillAsync("#firstname", firstname);
    }

    [Given(@"I enter ""(.*)"" as my last name")]
    public async Task GivenIEnterAsMyLastName(string lastname)
    {
        await _page.FillAsync("#lastname", lastname);
    }

    [Given(@"I enter ""(.*)"" as email")]
    public async Task GivenIEnterAsEmail(string email)
    {
        await _page.FillAsync("#email", email);
    }
    
    [Given(@"I enter ""(.*)"" as message")]
    public async Task GivenIEnterAsMessage(string message)
    {
        await _page.FillAsync("#message", message);
    }

    [When(@"I click submit")]
    public async Task WhenIClickSubmit()
    {
        await _page.ClickAsync("input[type='submit'][value='Submit']");
    }

    [Then(@"I should get a prompt")]
    public async Task ThenIShouldGetAPrompt()
    {
       // provade olika dialog syntax men hittade aldrig nån lösning för att nå alert.
    }

}