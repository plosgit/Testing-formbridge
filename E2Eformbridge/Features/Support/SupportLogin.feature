Feature: Log in as support
    Support login
    
    Scenario: Log in as support
        Given I am on the login page
        And I enter "support1" in the email field
        And I enter "a" in the password field
        When I click the sign in button
        Then I should be logged in