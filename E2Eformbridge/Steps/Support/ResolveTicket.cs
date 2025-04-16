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

    [GivenAttribute(@"I am logged in as support")]
    public async Task GivenIAmLoggedInAsSupport()
    {
        await _page.GotoAsync(" http://localhost:5120/support");
    }

    [GivenAttribute(@"I click active tickets")]
    public async Task GivenIClickActiveTickets()
    {
        await _page.WaitForSelectorAsync("#active-tickets");
        
    }

    [GivenAttribute(@"I see a list of active tickets")]
    public async Task GivenISeeAListOfActiveTickets()
    {
        await _page.WaitForSelectorAsync("table");
    }
    
    [GivenAttribute(@"I see the top ticket")]
    public async Task GivenISeeTheTopTicket()
    {
        await _page.WaitForSelectorAsync("tbody tr:first-child .table-text");
    }
    
    [WhenAttribute(@"I click on the checkmark icon")]
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
    
    [WhenAttribute(@"I click on resolved tickets")]
    public async Task WhenIClickOnResolvedTickets()
    {
        await _page.QuerySelectorAsync("id=resolved-tickets");
    }

    [ThenAttribute(@"the ticket should appear in the resolved list")]
    public async Task ThenTheTicketShouldAppearInTheResolvedList()
    {
        await _page.WaitForSelectorAsync("text=anastasia.harrington@example.com");
    }
    
    
}