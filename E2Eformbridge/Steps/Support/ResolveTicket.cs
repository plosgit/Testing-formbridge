
namespace E2Eformbridge.Steps;

using Microsoft.Playwright;
using TechTalk.SpecFlow;
using Xunit;

[Binding]
public class ResolveTicket
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

    [Given(@"I am logged in as support")]
    public async Task GivenIAmLoggedInAsSupport()
    {
        await _page.GotoAsync("http://localhost:5120/login");
        await _page.FillAsync("input[name='email']", "support1");
        await _page.FillAsync("input[name='password']", "a");
        await _page.ClickAsync(".login");
        
        await _page.WaitForURLAsync("**/support");
    }
    
    [Given(@"I click on active tickets")]
    public async Task GivenIClickOnActiveTickets()
    {
        await _page.ClickAsync("#active-tickets");
    }

    
    [Given(@"I see the top ticket")]
    public async Task GivenISeeTheTopTicket()
    {
        await _page.WaitForSelectorAsync("tbody tr:first-child .table-text");
    }
    
    [When(@"I click on the checkmark icon")]
    public async Task WhenIClickOnTheCheckmarkIcon()
    {
        var resolveButtons = await _page.QuerySelectorAllAsync(".ticket-checkicon");

        if (resolveButtons.Count > 0)
        {
            await resolveButtons[0].ClickAsync();
        }
        else
        {
            throw new Exception("No resolve buttons found");
        }
        
        await _page.WaitForTimeoutAsync(500);
    }

    [Then(@"the ticket should be resolved")]
    public async Task ThenTheTicketShouldBeResolved()
    {
        await _page.IsVisibleAsync("text=anastasia.harrington@example.com");
    }
}