---
title: "Trello Automation: Butler Rules & Integrations"
description: "Automate Trello boards with Butler rules, card automation, scheduled commands, and integrations with Zapier, Make, and n8n."
date: "2026-08-12"
updated: "2026-09-03"
category: "how-to"
tags: ["Trello automation", "Trello Butler", "project management automation", "board automation"]
keywords: ["Trello automation", "Trello Butler automation", "automate Trello"]
featured: false
---

Trello's simplicity is its greatest strength and its biggest limitation. Dragging cards across lists is intuitive, but as boards grow, the manual work of moving cards, assigning members, setting due dates, and posting updates consumes time that should go toward the actual work the cards represent.

Butler, Trello's built-in automation engine, eliminates most of that overhead. Combined with external platforms like [Zapier](/blog/getting-started-with-zapier), [Make](/blog/getting-started-with-make), and [n8n](/blog/getting-started-with-n8n), Trello becomes a powerful automation hub that scales well beyond simple kanban boards.

If you are new to automation concepts, our [no-code automation guide](/blog/no-code-automation-explained) covers the fundamentals before you dive into Trello-specific patterns.

## Butler Automation Fundamentals

Butler is available on all Trello plans, though free plans have a limited number of automation runs per month. It operates through four types of automation: rules, card buttons, board buttons, and scheduled commands.

### Setting Up Butler

1. Open a Trello board
2. Click "Automation" in the top menu bar (or the Butler icon in the board menu)
3. Choose the automation type you want to create
4. Define triggers and actions using Butler's natural-language command builder

Butler uses a sentence-style interface: you describe what should happen in near-plain English, and Butler translates it into an automation rule. For example: "when a card is moved to list Done, check all the checklist items and set the due date as complete."

## Card Rules

Card rules are trigger-action pairs that fire automatically when a specific event occurs on any card in the board.

### Trigger Types for Card Rules

- **Card moved to list** — When a card enters a specific list
- **Card added to board** — When a new card is created on the board
- **Label added/removed** — When a label is applied or taken off a card
- **Member added/removed** — When someone is assigned or unassigned
- **Due date marked complete/incomplete** — When the due date checkbox is toggled
- **Checklist completed** — When all items in a checklist are checked
- **Attachment added** — When a file is attached to a card
- **Comment added** — When someone posts a comment
- **Card name/description changed** — When the card title or description is edited
- **Custom field changed** — When a custom field value is modified

### Practical Card Rule Examples

**Auto-assign on list move:**
When a card is moved to the "In Review" list, add the reviewer (a specific member) and remove the original assignee from the card.

**Priority labeling pipeline:**
When a card is moved to "Urgent," add the red label, set the due date to 2 days from now, and move the card to the top of the list.

**Completion cleanup:**
When a card is moved to "Done," mark the due date as complete, check all checklist items, remove all members, and post a comment: "Completed on {date}."

**Escalation on overdue:**
When a card's due date is marked as overdue (past due and incomplete), add the red "Overdue" label, move the card to the top of its list, and add the project manager as a member.

## Board Buttons

Board buttons appear in the board's toolbar and execute a set of actions across multiple cards when clicked. They are useful for batch operations.

### Common Board Button Setups

**Weekly Reset:**
Create a board button called "Start New Week" that:
- Moves all cards from "Done" to an "Archive" list
- Removes all members from cards in "To Do"
- Sorts the "To Do" list by due date
- Resets the "In Progress" list by removing the "Blocked" label from all cards

**Sprint Planning:**
Create a "Start Sprint" button that:
- Creates a new list named "Sprint [current date]"
- Moves cards labeled "Next Sprint" from the Backlog into the new sprint list
- Removes the "Next Sprint" label from those cards
- Sets due dates on moved cards to 2 weeks from today

**Daily Standup Prep:**
A "Prepare Standup" button that:
- Sorts "In Progress" by member
- Adds a comment to each card in "In Progress" that has not been updated in 2 days: "Status update needed"
- Moves any cards in "In Progress" with a past due date to the top of the list

## Scheduled Commands

Scheduled commands run automatically at specified times without any user action required.

### Schedule Options

- **Daily** at a specific time
- **Weekly** on specified days at a specific time
- **Monthly** on a specified date at a specific time

### Scheduled Command Examples

**Daily Overdue Check:**
Every day at 9 AM, find all cards on the board with a due date in the past that is not marked complete. Add the "Overdue" label and move them to the top of their current list.

**Weekly Archive:**
Every Friday at 5 PM, move all cards from the "Done" list to an "Archive" list. This keeps the Done list clean without manual cleanup.

**Monthly Report Card:**
On the first of every month, create a new card in the "Reports" list with a checklist containing: "Review last month's metrics," "Update client status," "Send monthly summary," and "Archive completed projects."

**Recurring Task Generation:**
Every Monday at 8 AM, create cards in the "To Do" list for recurring weekly tasks:
- "Review pull requests" assigned to the tech lead, due Wednesday
- "Update project dashboard" assigned to the PM, due Friday
- "Team retrospective" assigned to the scrum master, due Friday

## Due Date Commands

Butler includes specific automation capabilities around due dates that go beyond basic scheduling.

### Due Date Trigger Patterns

**Approaching deadline warnings:**
2 days before a card is due, add the yellow "Due Soon" label and post a comment mentioning the assigned member: "@member, this card is due in 2 days."

**Overdue escalation chain:**
- 1 day overdue: Add the orange "Overdue" label
- 3 days overdue: Add the project manager as a member and post a comment
- 7 days overdue: Move to a "Blocked/Escalated" list and add the red "Critical" label

**Auto-extend deadlines:**
When a card with a due date is moved from "In Progress" back to "To Do" (indicating a reprioritization), extend the due date by 5 business days.

## Calendar Commands

Calendar commands integrate Trello cards with date-based operations.

### Useful Calendar Automations

**Sprint cycle management:**
On the 1st and 15th of every month, archive the current sprint list and create a new one. Move cards labeled "Carry Over" from the archived list into the new sprint.

**Quarterly review setup:**
On January 1, April 1, July 1, and October 1, create a "Q[X] Review" card with a comprehensive checklist of quarterly tasks: OKR review, budget reconciliation, team performance reviews, and roadmap updates.

**Holiday/event awareness:**
Scheduled commands can shift workloads around known dates. For example, the Friday before a company holiday, move all cards due during the holiday period to the end of the following week.

## Connecting Trello to External Platforms

Butler handles on-board automation well, but cross-platform workflows require external tools.

### Trello and Zapier

Zapier's Trello integration supports comprehensive triggers and actions. For setup basics, see our [Zapier guide](/blog/getting-started-with-zapier).

**Popular Trello Zaps:**

- **Email → Trello**: Create cards from starred emails in Gmail or forwarded emails to a dedicated address
- **Trello → Slack**: Post a message when a card moves to a specific list
- **Google Forms → Trello**: Create cards from form submissions with form fields mapped to card fields
- **Trello → Google Sheets**: Log completed cards in a spreadsheet for reporting
- **GitHub → Trello**: Create cards from new GitHub issues and sync status changes
- **Trello → Calendar**: Create Google Calendar events from cards with due dates

**Setting up a Trello Zap:**
1. Choose "Trello" as the trigger app
2. Select the trigger event: New Card, Card Moved to List, Card Updated, etc.
3. Connect your Trello account and select the board
4. Configure filters (specific list, label, or member)
5. Add your action app and map the data fields

### Trello and Make

Make's Trello modules provide granular control over cards, lists, boards, and members. See our [Make guide](/blog/getting-started-with-make) for setup.

**Client Onboarding Scenario:**
1. **Trigger**: New row in a Google Sheet (client details)
2. **Trello Create Board**: Create a new board from a template for the client
3. **Trello Create Cards**: Populate the board with onboarding tasks, each with due dates calculated from the start date
4. **Trello Add Members**: Assign team members to their respective cards
5. **Slack**: Notify the team channel about the new client board

**Project Status Dashboard:**
1. **Scheduled trigger**: Every weekday at 5 PM
2. **Trello List Cards**: Pull all cards from "In Progress" and "Done" lists across multiple boards
3. **Aggregator**: Group by board and calculate completion percentages
4. **Google Sheets**: Update a dashboard spreadsheet with current metrics
5. **Slack**: Post a daily summary with progress bars for each project

### Trello and n8n

n8n's Trello node supports CRUD operations on boards, lists, cards, and checklists. For setup, see our [n8n guide](/blog/getting-started-with-n8n).

**Support Ticket Pipeline:**
1. **Webhook trigger**: Receives data from a support form or email parsing service
2. **n8n Function node**: Determines priority based on keywords and customer tier
3. **Trello Create Card**: Creates a card in the appropriate priority list with labels
4. **Trello Create Checklist**: Adds a resolution checklist to the card
5. **Slack**: Notifies the support channel with card details and a direct link

**Cross-Board Synchronization:**
1. **Trello trigger**: Card updated on Board A
2. **n8n Search**: Find the corresponding card on Board B (matched by a custom field or naming convention)
3. **Trello Update Card**: Sync the status, labels, and due date to Board B
4. **Conditional**: If the status changed to "Blocked," create a linked card on the Blockers board

## Card Creation From External Sources

Automating card creation from outside Trello reduces context switching and ensures nothing falls through the cracks.

### Email-to-Card Pipelines

**Method 1: Trello's built-in email-to-board feature**
Each Trello board has a unique email address. Forwarding an email to this address creates a card with the email subject as the title and body as the description. Find it in Board Menu → Settings → Email-to-board Settings.

**Method 2: Automated email parsing**
For more control, use n8n or Zapier to watch a specific email inbox, extract structured data from the email body, and create a card with the appropriate list, labels, and members based on the email content.

### Form-to-Card Automation

Connect web forms (Google Forms, Typeform, Jotform) to Trello:

1. Form submission triggers the automation
2. Map form fields to card properties: title, description, due date, labels
3. Assign to the correct list based on a form field (e.g., request type → corresponding list)
4. Attach any uploaded files to the card
5. Notify the assigned team member

### Chat-to-Card Integration

Create Trello cards from Slack messages:

1. A user reacts to a Slack message with a specific emoji (e.g., a clipboard)
2. The automation captures the message text and author
3. A Trello card is created with the message as the description
4. The Slack thread receives a reply with a link to the new Trello card

## Status Update Notifications

Keep stakeholders informed without requiring them to check Trello.

### Automated Progress Reports

**Daily board summary:**
1. Count cards in each list
2. Calculate the percentage of cards in "Done" vs. total
3. List any cards that became overdue today
4. Post the summary to Slack or email to stakeholders

**Client-facing updates:**
When a card moves to "Done" on a client project board, send an automated email to the client contact with the completed item's title and description. This keeps clients informed without the project manager having to write update emails.

For more notification automation patterns, see our [notifications and alerts guide](/blog/automate-notifications-alerts).

## Best Practices

**Use labels consistently.** Define a standard label scheme (colors mapped to priorities, categories, or teams) and enforce it across boards. Butler rules depend on consistent labeling to route and prioritize correctly.

**Keep lists to a manageable number.** Butler rules reference specific list names. If you have 15 lists that change frequently, your automations will break. Stick to a standard pipeline (Backlog, To Do, In Progress, Review, Done) and use labels or custom fields for additional categorization.

**Limit card rule complexity.** Each card rule should do one thing clearly. A rule that moves, labels, assigns, comments, and sets a due date is hard to debug when something goes wrong. Use multiple simple rules instead of one complex one.

**Monitor Butler usage.** Free Trello plans limit Butler runs. Check your usage in the Butler dashboard and prioritize automations that save the most time. Upgrade to a paid plan if you consistently hit the limit.

**Test rules on a dummy board.** Before deploying Butler rules on a production board, clone the board and test with sample cards. Verify that rules fire in the correct order and do not conflict with each other.

**Name custom fields descriptively.** When using custom fields as triggers for Butler rules or external integrations, use clear names like "Client Tier" or "Sprint Number" instead of generic labels. This makes automations self-documenting.

## Conclusion

Trello automation through Butler covers the majority of on-board workflow needs — card rules handle real-time events, board buttons handle batch operations, and scheduled commands handle recurring tasks. For cross-platform workflows, connect Trello to [Zapier](/blog/getting-started-with-zapier), [Make](/blog/getting-started-with-make), or [n8n](/blog/getting-started-with-n8n) to route data between Trello and your other tools.

Start with the card rule that eliminates your most repetitive manual step. For most teams, that is either auto-assigning cards when they move to a specific list or sending notifications when status changes. Build from there, adding scheduled commands for recurring maintenance and external integrations for cross-tool workflows. For broader project management automation strategies, see our [project management automation guide](/blog/automate-project-management).
