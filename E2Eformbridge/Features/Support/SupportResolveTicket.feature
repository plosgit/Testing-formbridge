Feature: Resolve support tickets
As a support user
I want to resolve tickets
So that customers get help

    Scenario: Resolve an open ticket
        Given I am logged in as support
        And I click on active tickets
        And I see the top ticket
        When I click on the checkmark icon
        Then the ticket should be resolved