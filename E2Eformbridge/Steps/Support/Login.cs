namespace E2Eformbridge.Steps;

using Microsoft.Playwright;
using TechTalk.SpecFlow;
using Xunit;

[Binding]
public class LoginTest
{
    private IPlaywright _playwright;
    private IBrowser _browser;
    private IBrowserContext _context;
    private IPage _page;

    [BeforeScenario]
    public async Task Setup()
    {
        _playwright = await Playwright.CreateAsync();
        _browser = await _playwright.Chromium.LaunchAsync(new() { Headless = false, SlowMo = 200 });
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
    

    [Given(@"I am on the login page")]
    public async Task GivenIAmOnTheLoginPage()
    {
        await _page.GotoAsync("http://localhost:5120/login");
    }

    [Given(@"I enter ""(.*)"" in the email field")]
    public async Task GivenIEnterInTheEmailField(string email)
    {
        await _page.FillAsync("input[name='email']", email);
    }

    [Given(@"I enter ""(.*)"" in the password field")]
    public async Task GivenIEnterInThePasswordField(string password)
    {
        await _page.FillAsync("input[name='password']", password);
    }

    [When(@"I click the sign in button")]
    public async Task WhenIClickTheSignInButton()
    {
        await _page.ClickAsync(".login");
    }

    [Then(@"I should be logged in")]
    public async Task ThenIShouldBeLoggedIn()
    {
        await _page.WaitForURLAsync("**/support");
        Assert.Contains("/support", _page.Url);
    }

    
}

    
