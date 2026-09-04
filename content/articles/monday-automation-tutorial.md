---
title: "Monday.com Automation Tutorial: Recipes That Run Your Board"
description: "Build Monday.com automations with recipes, custom triggers, and integrations. Status flows, notifications, cross-board sync, and external workflows."
date: "2026-09-03"
category: "how-to"
tags: ["Monday.com", "project management", "tutorial", "automation recipes", "work OS"]
keywords: ["Monday.com automation", "Monday automations tutorial", "monday.com recipes", "automate monday.com", "monday.com Zapier"]
featured: false
---

## Monday.com Automations Read Like Sentences

Monday's automation builder uses "recipes" — natural-language templates like "When status changes to Done, notify someone." Fill in the blanks and the automation runs. This makes Monday one of the easiest platforms for non-technical teams to automate, with 200+ pre-built recipes and a custom builder for anything else.

This tutorial builds eight automations covering the most common board workflows, then connects Monday to external tools.

## Automations Basics

**Access:** Any board → Automate (top right) → Automations Center

**Structure:** Trigger → Condition (optional) → Action, expressed as a sentence

**Trigger types:** Status change, Date arrives, Item created, Column changes, Person assigned, Subitem changes, Button clicked, Recurring (every day/week/month), Form submitted

**Actions:** Notify, Change status, Assign person, Set date, Move to group/board, Create item/subitem, Create update (comment), Send email, Duplicate item, Archive, Webhook

**Limit:** Automation actions per month by plan — 250 (Basic), 25,000 (Standard), 250,000 (Pro), unlimited (Enterprise).

## Automation 1: Status Flow

**Board groups:** Not Started → Working On It → Stuck → Review → Done

- "When status changes to **Working On It**, set **Start Date** to today and notify **@assignee**"
- "When status changes to **Stuck**, notify **@project manager** and change **Priority** to **High**"
- "When status changes to **Review**, assign **@reviewer** and set **Due Date** to **2 days from now**"
- "When status changes to **Done**, move item to group **Completed** and set **Completion Date** to today"

## Automation 2: Due Date Reminders and Escalation

- "When **Due Date** arrives and status is not **Done**, notify **@assignee**: 'Due today'"
- "**2 days before** Due Date, notify **@assignee** and **@manager**"
- "When Due Date has passed and status is not **Done**, change status to **Overdue** and notify **@manager**"

## Automation 3: Auto-Assign by Column Value

**Setup:** Dropdown column "Department" (Sales, Marketing, Engineering)

- "When **Department** changes to **Sales**, assign **@sales lead**"
- "When **Department** changes to **Marketing**, assign **@marketing lead**"
- "When **Department** changes to **Engineering**, assign **@eng lead**"

## Automation 4: Cross-Board Sync

- "When status changes to **Approved** in **Requests Board**, create item in **Active Projects Board** with **name, owner, deadline**"
- "When item is created in **Active Projects Board**, create an update in **Requests Board** linked item: 'Project started'"

Use the "Connect boards" column type to maintain links between items across boards.

## Automation 5: Recurring Items

- "**Every Monday at 9:00 AM**, create item **Weekly Status Report** in group **This Week**, assigned to **@PM**"
- "**Every month on the 1st**, duplicate group **Monthly Template** and rename to **[Month] Tasks**"

## Automation 6: Subitem Rollup

- "When all subitems are **Done**, change parent item status to **Done**"
- "When subitem is created, notify **@parent item owner**"

## Automation 7: Form Intake Routing

**Setup:** Board → Views → Add Form. Share the form link.

- "When form is submitted (item created), change status to **New Request** and notify **@intake team**"
- "When **Request Type** (form field) is **Bug**, move item to **Bug Board**"
- "When **Priority** (form field) is **Urgent**, notify **@on-call** and set Due Date to **today**"

## Automation 8: Button-Triggered Actions

**Setup:** Add a Button column "Send to Client"

- "When **Send to Client** is clicked, send email to **@client email column** with **item name and status**, and change status to **Sent**"
- Button + automation = one-click multi-step processes

## External Integration 1: Monday Webhooks

The Webhook action in any automation sends item data to a URL:

- "When status changes to **Won**, send webhook to **[Make/Zapier URL]**"

On the receiving end ([Make](/blog/getting-started-with-make)): parse the payload, look up additional item data via Monday module, then create invoice, Slack alert, or CRM update.

## External Integration 2: Slack (Native)

Monday → Integrations Center → Slack:
- "When status changes to **Done**, send message to **#project-updates** with **item name**"
- "When item is created, send DM to **@owner**"
- Create Monday items from Slack via `/monday` command

See our [Slack workflow automation guide](/blog/slack-workflow-automation).

## External Integration 3: External Events to Monday

**Steps (Make):**
1. Trigger: HubSpot Deal Won / Typeform submission / Gmail email
2. **Monday** → **Create an Item**:
   - Board, Group
   - Name: from source
   - Column values: JSON mapping fields (status, person, date, text columns)
3. Optional: **Monday** → **Create an Update** with additional context

Monday's API uses GraphQL — Make and Zapier abstract this into dropdown mapping.

## Integrations Center

Monday offers native two-way integrations with Gmail, Outlook, Google Calendar, Zoom, GitHub, Jira, Salesforce, HubSpot, Mailchimp, Stripe, Shopify, and 200+ apps. Each uses recipe format:

- "When email is received in **Gmail** with label **Client**, create item in **Inbox Board**"
- "When deal is won in **HubSpot**, create item in **Onboarding Board**"
- "When item is created, create event in **Google Calendar** on **Due Date**"

Check Integrations Center before building external workflows — native may already cover it.

## Automation Design Tips

**Use groups as status.** Moving items between groups is visually clear and triggers "when item moves to group" automations.

**Name automations descriptively.** With 50+ automations on a board, "Status Done → Move to Completed" beats "Automation 23."

**Watch action limits.** Each action counts. A recipe with notify + change status + set date = 3 actions per trigger.

**Test with a sample item.** Create a test item and walk it through the workflow before enabling for the team.

For broader patterns, see our [project management automation guide](/blog/automate-project-management).

## Does Monday.com have free automations?

The Free plan does not include automations. Basic plan ($9/user/month) includes 250 automation actions monthly; Standard ($12/user) includes 25,000 — the practical starting point for teams that rely on automation. Each action (notify, change status, set date) counts separately, so a single trigger firing 3 actions uses 3 of your monthly allocation. Pro ($19/user) offers 250,000. For heavy automation on a budget, [ClickUp](/blog/clickup-automation-tutorial) offers more generous limits at similar pricing.

## What is a Monday.com automation recipe?

A recipe is a pre-built automation template written as a sentence with fill-in-the-blank parts: "When [status] changes to [something], [notify someone]." Monday offers 200+ recipes in the Automations Center covering status changes, dates, assignments, notifications, and cross-board actions. Click a recipe, fill in the specifics (which status, which person, which board), and activate. Custom recipes let you combine any trigger with any action for workflows the templates do not cover. Recipes make automation accessible without understanding triggers and actions as abstract concepts.

## Can Monday.com integrate with Zapier and Make?

Yes. [Zapier](/blog/getting-started-with-zapier) and [Make](/blog/getting-started-with-make) both have Monday.com integrations with triggers (item created, column value changed, status changed, update posted) and actions (create item, update column values, create update, search items). Connect via API token (Monday → Profile → Developers → My Access Tokens). Monday also supports outbound webhooks as an automation action on Standard plan and above, which push item data to external URLs instantly — faster than polling and useful for triggering [Make](/blog/getting-started-with-make) or [n8n](/blog/getting-started-with-n8n) workflows.
