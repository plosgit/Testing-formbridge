Feature: Admin add user
    As an admin
    I want to add new users
    
    Scenario: Admin add user
        Given I am logged in as admin
        When I click on add user
        And I see a input row
        And I enter "test" as first name
        And I enter "test" as last name
        And I enter "testmail" as email
        And I enter click on the add user button
        Then A new test user should appear in the list