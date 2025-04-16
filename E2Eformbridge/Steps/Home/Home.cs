namespace E2Eformbridge.Steps;

using Microsoft.Playwright;
using TechTalk.SpecFlow;
using Xunit;

[Binding]
public class Home
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

    [GivenAttribute(@"I am on the home page")]
    public async Task GivenIAmOnTheHomePage()
    {
        await _page.GotoAsync("http://localhost:5120");
    }


    [WhenAttribute(@"I click on the sign in button")]
    public async Task WhenIClickOnTheSignInButton()
    {
        await _page.ClickAsync(".sign-in-btn");
    }

    [ThenAttribute(@"I should be navigated to the login page")]
    public async Task ThenIShouldBeNavigatedToTheLoginPage()
    {
        var url = _page.Url;
        Assert.Contains("/login", url);
    }
    
    
}