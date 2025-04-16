# General Rules

### Language
English will be the main language throughout all documentation, code, and git hygiene.

### Absence Policy
Absence must be communicated within 24 hours. At the very least, a sign of life must be shown. Uncommunicated “no-shows” are unfair to team members and demoralize the work ethic of our team.

### Trello Usage
Trello is a central part of this project and the team. It is an extension of our communication that everyone must master and contribute to.

- When a team member joins a task, all contributors must click “join” and move the task to the `In Progress` column.
- Once you have joined a task, you take ownership of it, meaning you are responsible for communicating about and managing the task until it is moved to `Done`, `Tasks for Deconstruction`, or back to `To-Do` for someone else to complete.

---

# Git

## Methodology
To keep our code clean and organized, we follow these rules and structures.

### Creating a Feature
```bash
git checkout dev
git pull
git branch "feature/systempart/entity/featurename"  # Create a fitting name under the correct entity
git checkout "branchname"
git push  # This provides the upstream command
git push -u origin branchname  # Set upstream
```
Start developing:
```bash
git add .
git commit -m "message"
git push
```
> **Tip:** Make a habit of running these commands frequently to continuously save progress and prevent errors.

### Git Merge
A merge should only be done after a **Code Review** and fulfilling all the **Definition-of-Done** requirements.

### Naming Conventions
- Git branches use **only lowercase**, with no special characters (`-`, `_`, etc.).
- The branch naming follows this pattern:
  ```
  feature/fe/entity/featurename
  feature/be/entity/featurename
  feature/db/entity/featurename
  ```
  - `fe` = Front-End
  - `be` = Back-End
  - `db` = Database
  
  **Examples:**
  ```
  feature/fe/chat/sendmessage
  feature/be/chat/savesession
  ```

## **Step-by-step Guide**

### **Setup the Project**
1. Open a terminal with a POSIX-compliant shell.
2. Navigate to the directory containing all projects, e.g., `cd ~/repos/`.
3. Create a new .NET solution:
   ```sh
   dotnet new sln -o <projekt-namn>
   ```
4. Change directory into the project:
   ```sh
   cd <projekt-namn>
   ```
5. Create a `.gitignore` file:
   ```sh
   dotnet new gitignore
   ```
6. Initialize a new Git repository:
   ```sh
   git init
   ```
7. Create a new .NET Web API project:
   ```sh
   dotnet new web -o server
   ```
8. Add the server project to the solution:
   ```sh
   dotnet sln add server
   ```

### **Setup the Frontend (React with Vite)**
9. Create a new Vite React project (ensure it's the latest version):
   ```sh
   npm create vite@latest client -- --template react
   ```
10. Change directory into the client:
    ```sh
    cd client
    ```
11. Verify the installed React and Vite versions:
    ```sh
    cat package.json
    ```
    - If the wrong version is installed:
12. Uninstall existing React packages:
    ```sh
    npm uninstall react react-dom
    ```
13. Reinstall the correct versions:
    ```sh
    npm install react react-dom react-router
    ```
14. Return to the root project directory:
    ```sh
    cd ..
    ```

### **Update .gitignore**
15. Append `client/.gitignore` to the main `.gitignore`:
    ```sh
    cat client/.gitignore >> .gitignore
    ```
16. Open `.gitignore` to edit:
    ```sh
    nano .gitignore
    ```
    - Remove the line containing `*.sln` at the bottom.
    - Save and exit (CTRL + X, then Y, then Enter).
17. Remove the extra `.gitignore` file:
    ```sh
    rm client/.gitignore
    ```

### **Setup GitHub Repository**
18. Create a new repository on GitHub with the same name as `<projekt-namn>`.
19. Link the local repository to GitHub:
    ```sh
    git remote add origin git@github.com:<användarnamn>/<projekt-namn>.git
    ```
20. Stage all files:
    ```sh
    git add .
    ```
21. Commit the changes:
    ```sh
    git commit -m "first push"
    ```
22. Push to the GitHub repository:
    ```sh
    git push -u origin <branch-namn>  # Usually 'main'
    ```

### **Run the Project**
23. Start the frontend development server:
    ```sh
    cd client && npm run dev
    ```



---

# Trello

## Columns
### Sprint Backlog
Contains all tasks for the current sprint. Every morning starts with a **Daily Standup**, where tasks are broken down into:
- **Front-End**: `feature/fe/entity/featurename`
- **Back-End**: `feature/be/entity/featurename`
- **Database**: `feature/db/entity/featurename`

Tasks are color-coded based on priority. When a task is deconstructed, all parts should have the same uniform color according to the priority index.

### In Progress
Tasks in production should be moved here until they are ready for Code Review.

### Tasks for Deconstruction
If a task turns out to be more extensive than expected, move it here for team review and further breakdown.

### Code Review (15:00 Daily)
Tasks pending review should be placed in this column.

### Done
Completed tasks go here.

### Resources
A collection of **Important Documents** such as:
- User Stories
- MVP Scope
- Wireframes
- README
- Any other shared resources

### Technical Debt
When technical debt is identified, it must be documented under this column for better tracking and decision-making.

### Ideas
A space for ideas outside the MVP scope. Between sprints, the team reviews these ideas for potential inclusion in future work.

---

# SCRUM

## General Methodology
We follow **SCRUM**, working in **two sprint iterations**. Each sprint has a **SCRUM Master** responsible for:
- Coaching the team
- Handling structure, administration, and project overview

### Daily Standups (09:00, 13:00)
During each standup, every team member answers:
1. What did you work on yesterday?
2. What are you working on today?
3. Have you encountered any issues?

In the first standup, we also assess, prioritize, and deconstruct tasks across **Front-End, Back-End, and Database**.

### Code Review (15:00 Daily)
At 15:00, we review all tasks in the `Code Review` column. The responsible member walks the team through their code and thought process. If the task passes the **DoD checklist**, it will be merged into the `dev` branch.

### Definition of Done (DoD)
A condensed checklist derived from a larger document, ensuring quality assurance. Each task must meet all criteria in this checklist to be considered **Done**.



# Product README

### MailKit usage:
MailKit is a library used for sending emails to Customers and Customer Support Agents. The email address connected to this functionality is set inside MailKit.cs. Companies will be able to connect their own Email inside Company Dashboard -> Settings. 
Setting a sender-email requires an App Password generated from your SMTP-provider. 

Currently, we lack support for the automation of this functionality (via Settings). Instead, we will provide assistance with setting your credentials inside the codebase (Ex: Inside MailKit.cs, client.Authenticate("official.formbridge@gmail.com", "nmcg qbws oqoq gshp").

---
