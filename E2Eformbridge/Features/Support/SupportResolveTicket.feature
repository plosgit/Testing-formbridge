Feature: Resolve support tickets
As a support user
I want to resolve tickets
So that customers get help

    Scenario: Resolve an open ticket
        Given I am logged in as support
        And I click active tickets
        And I see a list of active tickets
        And I see the top ticket
        When I click on the checkmark icon
        And I click on resolved tickets
        Then the ticket should appear in the resolved list