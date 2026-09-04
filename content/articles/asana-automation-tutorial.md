---
title: "Asana Automation Tutorial: Rules, Forms & Integrations"
description: "Automate Asana with built-in Rules, Forms, and external workflows. Task routing, status updates, recurring projects, and cross-tool sync."
date: "2026-09-03"
category: "how-to"
tags: ["Asana", "project management", "tutorial", "task automation", "Asana Rules"]
keywords: ["Asana automation", "Asana Rules tutorial", "automate Asana", "Asana Zapier", "Asana workflows"]
featured: false
---

## Asana Rules Eliminate the Project Manager's Busywork

Moving tasks between sections, assigning based on category, setting due dates, notifying stakeholders — a project manager does these hundreds of times weekly. Asana Rules do them automatically. Combined with Forms for intake and external automation for cross-tool workflows, Asana becomes a self-maintaining project system.

Rules are available on Starter plan and above ($10.99/user/month). This tutorial builds seven rules and three external integrations.

## Rules Basics

**Access:** Open a project → Customize (top right) → Rules → Add rule

**Structure:** Trigger → Conditions (optional, Advanced plan) → Actions

**Triggers:** Task added to project/section, Task moved to section, Task completed, Due date approaching/changed, Custom field changed, Assignee changed, Comment added, Attachment added

**Actions:** Move to section, Assign to, Set due date, Add/Remove tag, Set custom field, Add comment, Create subtasks, Add to another project, Notify (Slack/email via app)

## Rule 1: Auto-Assign by Category

**What it does:** When a task's "Type" custom field is set, assign to the right person.

1. Create custom field "Type" (dropdown: Design, Development, Content, QA)
2. Rule → Trigger: Custom field "Type" changes to "Design" → Action: Assign to [designer]
3. Repeat for each type (one rule per value, or one rule with conditions on Advanced plan)

## Rule 2: Section-Based Status Flow

**Sections:** Backlog → To Do → In Progress → Review → Done

- Trigger: Task moved to "In Progress" → Action: Set custom field "Status" = Active, Add comment "Work started on {{date}}"
- Trigger: Task moved to "Review" → Action: Assign to [reviewer], Set due date to 2 days from now, Add comment "@reviewer please review"
- Trigger: Task moved to "Done" → Action: Mark complete, Remove from project "Active Sprint"
- Trigger: Task completed → Action: Move to "Done" (handles completion from anywhere)

## Rule 3: Due Date Escalation

- Trigger: Due date is approaching (1 day before) → Action: Add comment "@assignee due tomorrow", Add tag "due-soon"
- Trigger: Task is overdue → Action: Add tag "overdue", Add to project "Overdue Tasks" (a cross-project view for managers), Notify via Slack #pm-alerts

## Rule 4: Subtask Templates

- Trigger: Task added to section "New Feature Request" → Action: Create subtasks: "Write spec", "Design mockup", "Estimate effort", "Stakeholder review"
- Each subtask can have a relative due date and assignee

## Rule 5: Priority Handling

- Trigger: Custom field "Priority" changes to "Urgent" → Actions: Move to top of section, Assign to team lead, Set due date today, Notify Slack #urgent

## Rule 6: Attachment Processing

- Trigger: Attachment added → Action: Add comment "New file uploaded — @reviewer please check", Add tag "has-attachment"

## Rule 7: Cross-Project Sync

- Trigger: Task added to project "Client Work" → Action: Add to project "Weekly Review" (so it appears in both)
- Trigger: Task completed → Action: Remove from project "Weekly Review"

## Asana Forms for Intake

**Access:** Project → Customize → Forms

**What it does:** External or internal requests become structured tasks.

**Example: Design Request Form**
- Fields: Requester name, Project name, Request type (dropdown → maps to custom field), Description, Deadline (maps to due date), Attachments
- Settings: Anyone with link can submit (external) or organization only
- Submissions create tasks in the "New Requests" section, triggering Rule 1 for auto-assignment

Forms + Rules = zero-touch intake and routing.

## External Integration 1: Slack Two-Way

Asana's native Slack app: install from Asana → Apps. Then:
- Create tasks from Slack messages (message actions → Create task)
- Task notifications to channels (project → Customize → Apps → Slack → choose channel and events)
- Rule action: "Send Slack message" for custom notifications

For richer workflows, see our [Slack automation guide](/blog/slack-workflow-automation).

## External Integration 2: Email/Form to Task via Make

**What it does:** Any external event creates an Asana task with mapped fields.

**Steps ([Make](/blog/getting-started-with-make)):**

1. Trigger: Typeform New Response (or Gmail Watch Emails, HubSpot Deal Won, etc.)
2. **Asana** → **Create a Task**:
   - Workspace, Project, Section
   - Name: "{{form.subject}} — {{form.name}}"
   - Notes: full form content
   - Due date: {{form.deadline}} or calculated
   - Custom fields: map form answers to Asana fields
   - Assignee: static or from lookup
3. Optional: **Asana** → **Add Attachment** from form file upload

## External Integration 3: Asana to Google Sheets Reporting

**Steps (Make):**

1. Schedule → daily 6 PM
2. **Asana** → **Search Tasks** → Project: X, Completed since: today
3. Iterator
4. **Google Sheets** → Add Row: task name, assignee, completed date, custom fields
5. Aggregator → Slack summary: "{{count}} tasks completed today"

See our [report generation automation guide](/blog/automate-report-generation).

## Recurring Project Templates

**What it does:** Every month/quarter, a full project with tasks and dependencies is created.

**Native:** Save project as template (Project → ... → Save as template). Then manually create from template or use:

**Automated (Make):**
1. Schedule → 1st of each month
2. **Asana** → **Duplicate Project** from template
3. **Asana** → Update Project name: "Monthly Report — {{month}}"
4. Iterator over tasks → set due dates relative to today
5. Slack notify team

## Asana Automation Limits

- Rules: 20 per project (Starter), unlimited (Advanced)
- Rule actions: up to 5 per rule
- Conditions (if/then within a rule): Advanced plan only
- Forms: 1 per project (Starter), unlimited (Advanced)

For workflows exceeding these, orchestrate via external platforms. See our [project management automation guide](/blog/automate-project-management).

## Does Asana have automation on the free plan?

No. Asana Rules, Forms, and custom fields require the Starter plan ($10.99/user/month). The free Personal plan supports basic task management without automation. If you need automation at no cost, [Trello](/blog/trello-automation-guide) includes Butler automation on its free tier, or use an external platform like [Make](/blog/getting-started-with-make) (free 1,000 ops/month) to automate task creation and updates in free Asana via the API — though this cannot replicate in-app Rules like auto-assign on section move.

## How do I create a rule in Asana?

Open a project, click Customize in the top right, select Rules, then Add rule. Choose a trigger (task moved to section, custom field changed, due date approaching, etc.), optionally add conditions (Advanced plan), and select up to 5 actions (assign, move, set field, add comment, create subtasks). Name the rule and save. Rules run automatically for all future tasks matching the trigger. Test by creating a sample task and triggering the condition. Rules are project-specific — create them in each project where needed, or save the project as a template with rules included.

## Can Asana integrate with other tools?

Yes. Asana has native integrations with Slack, Google Workspace, Microsoft Teams, Zoom, Salesforce, Adobe, and 200+ apps (Asana → Apps). For anything not covered natively, [Zapier](/blog/getting-started-with-zapier), [Make](/blog/getting-started-with-make), and [n8n](/blog/getting-started-with-n8n) support Asana triggers (new task, task updated, task completed) and actions (create, update, search tasks, projects, and comments). Common integrations: form submissions to tasks, CRM deals to projects, completed tasks to spreadsheets, and Asana events to Slack channels.
