---
title: "Jira Automation Tutorial: Rules, Smart Values & Integrations"
description: "Master Jira Automation with practical rules for issue routing, sprint management, SLA tracking, and cross-tool sync. Includes smart values reference."
date: "2026-09-03"
category: "how-to"
tags: ["Jira", "software development", "tutorial", "issue tracking", "agile"]
keywords: ["Jira automation", "Jira automation rules", "Jira automation tutorial", "Jira smart values", "automate Jira"]
featured: false
---

## Jira Automation Is Free and Most Teams Barely Use It

Every Jira Cloud site includes Automation with a generous free allowance (project rules unlimited; global/multi-project rules limited by plan). Yet most teams still manually transition issues, assign reviewers, update parent tickets, and post status to Slack. This tutorial builds ten rules that eliminate that overhead, then connects Jira to external tools.

## Automation Basics

**Access:** Project Settings → Automation (project-scoped) or Settings → System → Global automation

**Structure:** Trigger → Conditions → Actions (with optional branches for related issues)

**Triggers:** Issue created/transitioned/updated/assigned/commented, Field value changed, Sprint started/completed, Version released, Scheduled, Incoming webhook, Manual (button)

**Conditions:** Issue fields, JQL, User, Related issues, If/else blocks

**Actions:** Transition, Assign, Edit fields, Comment, Create issue/subtask, Link issues, Send email/Slack/Teams, Send web request, Log work, Lookup issues

**Smart values:** `{{issue.key}}`, `{{issue.summary}}`, `{{issue.assignee.displayName}}`, `{{issue.status.name}}`, `{{triggerIssue}}`, `{{now}}` — dynamic data in actions.

## Rule 1: Auto-Assign by Component

- Trigger: Issue created
- Condition: Component = "Frontend"
- Action: Assign to → user or "Balanced workload" among a group (round-robin for the component)
- Duplicate rule per component, or use If/Else blocks in one rule

## Rule 2: Parent Status From Subtasks

- Trigger: Issue transitioned (any subtask)
- Branch: For Parent
- Condition: All subtasks match JQL `status = Done`
- Action: Transition parent to Done
- Second rule: subtask moves to In Progress → parent to In Progress (if parent is To Do)

## Rule 3: PR Linked to Issue Transitions

Requires GitHub/GitLab/Bitbucket integration (Jira → Apps).

- Trigger: Pull request created
- Action: Transition issue to "In Review"
- Trigger: Pull request merged
- Action: Transition to "Done" (or "Ready for QA"), Comment "PR merged: {{pullRequest.url}}"

## Rule 4: SLA Breach Alerts

- Trigger: Scheduled — every hour, JQL: `priority = Highest AND status != Done AND created <= -4h`
- Condition: Issue has no comment in last 2 hours (via `{{issue.comments.last.created}}` compare)
- Actions: Add comment "@lead SLA at risk", Send Slack to #incidents, Edit field "SLA Status" = Breached

For support projects, Jira Service Management has native SLAs — this pattern is for software projects.

## Rule 5: Sprint Hygiene

**Rule A — Carry over:**
- Trigger: Sprint completed
- Branch: For issues in sprint, JQL `status != Done`
- Action: Comment "Carried over from {{sprint.name}}", Edit field "Carried Over Count" += 1

**Rule B — Flag overloaded:**
- Trigger: Sprint started
- Condition: Sum of story points (via Lookup Issues + `{{lookupIssues.Story Points.sum}}`) > 40
- Action: Slack #team: "Sprint {{sprint.name}} has {{lookupIssues.Story Points.sum}} points — over capacity"

## Rule 6: Stale Issue Reminder

- Trigger: Scheduled daily, JQL: `status = "In Progress" AND updated <= -5d`
- Action: Comment "@{{issue.assignee}} this has been in progress 5+ days without update — still active?", Add label "stale"
- Follow-up rule: updated → remove label "stale"

## Rule 7: Bug Triage Routing

- Trigger: Issue created, Issue type = Bug
- If/Else:
  - Priority = Highest → Assign to on-call (from a custom field or fixed), Slack #urgent-bugs, Add to current sprint
  - Description contains "payment" or "checkout" → Component = Payments, Assign to payments lead
  - Else → Assign to triage queue, Label "needs-triage"

## Rule 8: Auto-Create Subtasks From Template

- Trigger: Issue created, Issue type = Story, Label contains "feature"
- Action: Create subtasks: "Design review", "Implementation", "Unit tests", "QA", "Documentation" — each with assignee by role and relative due date
- Advanced: Lookup a "Template" issue and clone its subtasks

## Rule 9: Release Notes Draft

- Trigger: Version released
- Action: Lookup Issues JQL `fixVersion = "{{version.name}}" AND status = Done`
- Action: Send email / Confluence page (via web request) with `{{#lookupIssues}}- {{key}}: {{summary}}{{/}}`
- Action: Slack #releases with count and link

## Rule 10: Customer Feedback Loop

- Trigger: Issue transitioned to Done, Issue has custom field "Reporter Email"
- Action: Send email to reporter: "Your reported issue {{issue.key}} — {{issue.summary}} has been resolved in version {{issue.fixVersions}}."

## External Integration: Jira to Anything via Webhooks

**Outbound:** Action "Send web request" → POST to [Make](/blog/getting-started-with-make) / [n8n](/blog/getting-started-with-n8n) webhook with `{{issue.toJson}}` or custom body. Use for: create Notion doc, update customer in HubSpot, log to Google Sheets, trigger deploy.

**Inbound:** Trigger "Incoming webhook" → generates a URL. External systems POST issue keys and data → rule acts. Use for: create Jira issue from Zendesk ticket, from form, from monitoring alert.

**Example — Support Ticket to Jira Bug (Make):**
1. Zendesk → Watch tickets tagged "bug"
2. **Jira** → **Create an Issue**: project, type Bug, summary, description with ticket link, custom field Zendesk ID
3. Zendesk → add internal note with Jira key
4. Jira rule: on Done → web request to Make → Zendesk update ticket "Fixed in {{fixVersion}}"

## Slack Integration (Native)

Jira Cloud for Slack app: `/jira create`, unfurl issue links, subscribe channels to project events (Slack → /jira subscribe). Rules can also post via "Send Slack message" action with webhook URL.

For deeper Slack workflows, see our [Slack automation guide](/blog/slack-workflow-automation).

## Smart Values Cheat Sheet

| Smart Value | Returns |
|---|---|
| `{{issue.key}}` | PROJ-123 |
| `{{issue.summary}}` | Title |
| `{{issue.assignee.displayName}}` | Name |
| `{{issue.reporter.emailAddress}}` | Email |
| `{{issue.status.name}}` | Current status |
| `{{issue.priority.name}}` | Priority |
| `{{issue.customfield_10042}}` | Custom field by ID |
| `{{issue.Story Points}}` | Custom field by name |
| `{{issue.url}}` | Link |
| `{{triggerIssue.key}}` | Original issue in branches |
| `{{now.plusDays(3).format("yyyy-MM-dd")}}` | Date math |
| `{{issue.comments.size}}` | Comment count |
| `{{lookupIssues.size}}` | Lookup result count |

Test with the "Log action" to print values to the audit log.

## Automation Limits (Cloud)

| Plan | Single-project rules | Multi-project/global executions |
|---|---|---|
| Free | Unlimited | 100/month |
| Standard | Unlimited | 1,700/month |
| Premium | Unlimited | 1,000/user/month |

Rule executions count when the rule runs (not per action). Scheduled rules with JQL count once per run. Keep global rules minimal; prefer project rules.

For agile team workflows beyond Jira, see our [project management automation guide](/blog/automate-project-management).

## Is Jira automation free?

Yes. Every Jira Cloud plan including Free includes Automation. Single-project rules are unlimited on all plans. Multi-project and global rules have monthly execution limits: 100 on Free, 1,700 on Standard, 1,000 per user on Premium, unlimited on Enterprise. Most teams never hit these limits if they scope rules to projects. Jira Data Center (self-hosted) includes Automation for Jira as a bundled app. There is no separate cost for triggers, actions, or smart values.

## What are smart values in Jira automation?

Smart values are placeholders like `{{issue.key}}` or `{{issue.assignee.displayName}}` that pull live data from the triggering issue, related issues, the sprint, or the system into your rule actions. Use them in comments, emails, field edits, and web requests. They support formatting and logic: date math (`{{now.plusDays(2)}}`), text functions (`{{issue.summary.toUpperCase()}}`), lists (`{{#lookupIssues}}...{{/}}`), and conditionals. Access custom fields by name (`{{issue.Story Points}}`) or ID. Use the "Log action" to debug what a smart value returns.

## How do I connect Jira to Slack or other tools?

For Slack, install the Jira Cloud for Slack app (creates issues, unfurls links, channel subscriptions) and use the "Send Slack message" action in rules with an incoming webhook URL. For any other tool, use the "Send web request" action to POST issue data to [Make](/blog/getting-started-with-make), [Zapier](/blog/getting-started-with-zapier), or [n8n](/blog/getting-started-with-n8n), which then update CRMs, sheets, docs, or support desks. In reverse, the "Incoming webhook" trigger accepts POSTs from external tools to create or update Jira issues. Native Marketplace apps also cover GitHub, Confluence, Figma, Zendesk, and hundreds more.
