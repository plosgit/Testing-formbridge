Feature: Customer submit form
    As a customer
    I want to fill out a form
    And submit it
    
    Scenario: Customer submit form
        Given I am on the home page for form submission
        And I click on customer forms
        And I click on the pick button
        And I enter "testcustomer" as my first name
        And I enter "testcustomer" as my last name
        And I enter "testmail" as email
        And I enter "test message" as message
        When I click submit
        Then I should get a prompt