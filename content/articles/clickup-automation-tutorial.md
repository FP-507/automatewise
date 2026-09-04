---
title: "ClickUp Automation Tutorial: Native + External Workflows"
description: "Master ClickUp Automations with 8 practical examples. Status flows, assignments, dependencies, recurring tasks, and integrations with Slack and CRMs."
date: "2026-09-03"
category: "how-to"
tags: ["ClickUp", "project management", "tutorial", "task automation", "productivity"]
keywords: ["ClickUp automation", "ClickUp automations tutorial", "automate ClickUp", "ClickUp Zapier", "ClickUp workflows"]
featured: false
---

## ClickUp Ships With the Most Generous Native Automation in Its Class

ClickUp Automations are available on every paid plan with high monthly limits (1,000 on Unlimited, 10,000 on Business, unlimited on Enterprise) and even 100/month on the Free Forever plan. Combined with ClickUp's flexibility — custom fields, multiple views, docs, goals — you can build a self-running workspace.

This tutorial covers eight native automations and three external integrations.

## Automations Basics

**Access:** Any Space, Folder, or List → click the lightning bolt icon (Automations) → Add Automation

**Structure:** When [trigger] + If [conditions] → Then [actions]

**Triggers:** Status changes, Assignee added/removed, Priority changes, Due date arrives, Custom field changes, Task created, Task moved, Tag added, Comment added, Time tracked, Subtask completed

**Actions:** Change status, Assign/Unassign, Set priority, Set due date (relative), Set custom field, Add tag, Add comment, Create task/subtask, Move task, Send email, Webhook, Add to watchers

**Scope:** Automations apply at Space, Folder, or List level — set at the highest level that makes sense.

## Automation 1: Status-Driven Assignment

- When: Status changes to "In Review" → Then: Assign to [QA lead], Add comment "@QA ready for review"
- When: Status changes to "Approved" → Then: Unassign [QA lead], Assign to [original creator via custom field], Change status to "Ready to Deploy"

## Automation 2: Priority Escalation

- When: Priority changes to "Urgent" → Then: Set due date to Today, Add to watchers [team lead], Move to List "Urgent Queue", Send email to team lead

## Automation 3: Due Date Management

- When: Due date arrives + If: Status is not "Complete" → Then: Add tag "overdue", Set priority "High", Add comment "@assignee this is overdue"
- When: Task created + If: Due date is empty → Then: Set due date to 7 days from now

## Automation 4: Dependency Chain

ClickUp has native dependencies (waiting on / blocking). Automate around them:

- When: Status changes to "Complete" → Then: For each dependent task: Change status to "Ready" (available via "Change status of dependent tasks" action on Business+)

Alternative on lower plans: When: Task completed + If: Tag contains "unblocks-design" → Then: Create task "Design phase" in [Design List], Assign to [designer]

## Automation 5: Recurring Task Generation

Native recurring tasks exist (task settings → Recurring), but automation adds logic:

- When: Task completed + If: Custom field "Recurrence" = "Weekly" → Then: Create task [same name] with due date 7 days from now, Assign to [same assignee], Copy custom fields

Or for sprint resets:
- When: Status changes to "Sprint Closed" (on a sprint container task) → Then: Create task "Sprint Planning" in next sprint list, Create task "Retrospective"

## Automation 6: Custom Field Triggers

**Setup:** Custom field "Client" (dropdown) and "Budget" (number)

- When: Custom field "Client" changes → Then: Move task to Folder "[Client name]" (requires one automation per client on non-Enterprise)
- When: Custom field "Budget" changes + If: Budget > 10000 → Then: Add tag "high-budget", Add to watchers [finance lead]

## Automation 7: Comment-Based Routing

- When: Comment added + If: Comment contains "@blocked" → Then: Change status to "Blocked", Add tag "blocked", Send email to project manager

## Automation 8: Time Tracking Alerts

- When: Time tracked + If: Time tracked > Time estimate → Then: Add tag "over-estimate", Add comment "Time exceeded estimate by {{overage}}", Notify [manager]

## External Integration 1: Webhook Actions

The **Webhook** action sends task data to any URL — the bridge to [Make](/blog/getting-started-with-make), [Zapier](/blog/getting-started-with-zapier), or [n8n](/blog/getting-started-with-n8n).

**Example: Task Completed → Client Notification**
1. ClickUp automation: When Status changes to "Delivered" → Then: Webhook → [Make webhook URL]
2. Make: Webhook trigger → Get task details via ClickUp module → Look up client email from custom field → Gmail send "Your deliverable is ready"

## External Integration 2: Form to ClickUp Task

**Steps (Make):**
1. Trigger: Typeform / Tally / Website form
2. **ClickUp** → **Create a Task**:
   - List: Intake
   - Name: "{{request type}}: {{title}}"
   - Description: form content
   - Custom fields: map form answers
   - Priority: based on form urgency field
3. Native ClickUp automations take over from there (assignment, routing)

ClickUp also has native Forms (Form view on any List) that create tasks directly — use external forms only when you need branding or logic ClickUp Forms lack.

## External Integration 3: ClickUp to CRM Sync

**Steps (Make):**
1. **ClickUp** → **Watch Tasks** (updated, filter: List = Client Projects)
2. **HubSpot** → Search Deal by ClickUp task ID (stored in a custom property)
3. **HubSpot** → Update Deal: Project Status = {{ClickUp status}}, Last Updated = now
4. If status = "Complete" → HubSpot → Create Task "Send invoice" for account manager

See our [CRM automation guide](/blog/automate-crm-workflows).

## Slack Integration (Native)

ClickUp → Integrations → Slack:
- Create tasks from Slack messages
- Post task updates to channels
- Unfurl ClickUp links in Slack with task details

Configure per-List notifications: List settings → Slack → choose channel and events (status change, new task, comments).

## ClickUp Automation Templates

ClickUp offers pre-built automation templates in the Automation panel → Templates. Useful starters:
- "Auto-assign based on status"
- "Move to Complete when all subtasks done"
- "Set priority based on due date proximity"

Clone and modify rather than building from scratch.

## Automation Limits by Plan

| Plan | Automations/month | Webhooks | Conditions |
|------|-------------------|----------|------------|
| Free | 100 | No | Basic |
| Unlimited ($7/user) | 1,000 | No | Basic |
| Business ($12/user) | 10,000 | Yes | Advanced |
| Enterprise | Unlimited | Yes | Advanced |

Webhook actions (for external integration) require Business plan. On lower plans, use external platform polling triggers instead.

For broader project workflows, see our [project management automation guide](/blog/automate-project-management).

## Is ClickUp automation free?

ClickUp's Free Forever plan includes 100 automation executions per month — enough for light use in a small workspace. Unlimited plan ($7/user/month) raises this to 1,000, Business ($12/user) to 10,000, and Enterprise removes the limit. Each time an automation fires counts as one execution. Free plan automations cover basic triggers and actions (status changes, assignments, due dates) but not webhook actions, which require Business. For most teams under 10 people, the Unlimited plan's 1,000 monthly automations handle daily operations comfortably.

## How do I set up ClickUp automations?

Open the List, Folder, or Space you want to automate, click the lightning bolt icon in the top right, and select Add Automation. Choose a trigger (when status changes, when assignee changes, when due date arrives, etc.), optionally add conditions (if priority is Urgent, if custom field equals X), then pick actions (change status, assign, set due date, add comment, create task, send webhook). Name it, save, and it runs on all future matching events. Start at the Space level to apply automations across all Lists inside it.

## Can ClickUp connect to Zapier and Make?

Yes. Both [Zapier](/blog/getting-started-with-zapier) and [Make](/blog/getting-started-with-make) have full ClickUp integrations with triggers (task created, updated, status changed, comment added) and actions (create, update, search tasks; create comments, lists, folders). Connect via OAuth (Make, Zapier) or API token (n8n, found in ClickUp → Settings → Apps → API Token). Additionally, ClickUp's native Webhook automation action (Business plan) pushes task events to external URLs instantly, which is faster than polling triggers.
