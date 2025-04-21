namespace E2Eformbridge.Steps;

using Microsoft.Playwright;
using TechTalk.SpecFlow;
using Xunit;

[Binding]
public class AddUser
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

    [Given(@"I am logged in as admin")]
    public async Task GivenIAmLoggedInAsAdmin()
    {
        await _page.GotoAsync("http://localhost:5120/login");
        await _page.FillAsync("input[name='email']", "admin1");
        await _page.FillAsync("input[name='password']", "a");
        await _page.ClickAsync(".login");
        await _page.WaitForURLAsync("**/admin");
    }

    [When(@"I click on add user")]
    public async Task WhenIClickOnAddUser()
    {
        await _page.ClickAsync("text=Add User"); // text match funkar för knappen
    }

    [When(@"I see a input row")]
    public async Task WhenISeeAInputRow()
    {
        await _page.WaitForSelectorAsync("input[placeholder='First name']"); // eller justera efter hur raden ser ut
    }

    [When(@"I enter ""(.*)"" as first name")]
    public async Task WhenIEnterAsFirstName(string firstName)
    {
        await _page.FillAsync("input[placeholder='First name']", firstName);
    }

    [When(@"I enter ""(.*)"" as last name")]
    public async Task WhenIEnterAsLastName(string lastName)
    {
        await _page.FillAsync("input[placeholder='Last name']", lastName);
    }

    [When(@"I enter ""(.*)"" as email")]
    public async Task WhenIEnterAsEmail(string email)
    {
        await _page.FillAsync("input[placeholder='Email']", email);
    }

    [When(@"I enter click on the add user button")]
    public async Task WhenIEnterClickOnTheAddUserButton()
    {
        await _page.ClickAsync("img.add-user-btn");
    }

    [Then(@"A new test user should appear in the list")]
    public async Task ThenANewTestUserShouldAppearInTheList()
    {
        await _page.WaitForSelectorAsync("text=testmail");
        var content = await _page.ContentAsync();
        Assert.Contains("testmail", content);
    }

}