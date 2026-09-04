---
title: "Make Tutorial: Build 5 Scenarios From Scratch"
description: "Hands-on Make (Integromat) tutorial. Build 5 scenarios covering modules, routers, iterators, aggregators, and error handling."
date: "2026-09-03"
category: "how-to"
tags: ["Make", "Integromat", "tutorial", "scenarios", "step by step"]
keywords: ["Make tutorial", "how to use Make", "Make.com tutorial", "Integromat tutorial", "Make scenarios beginners"]
featured: false
---

## Make Rewards Visual Thinkers

Make (formerly Integromat) shows your automation as a flowchart — circles connected by lines, data flowing left to right. If Zapier feels like filling out forms, Make feels like drawing a diagram. That visual model makes complex workflows easier to understand and debug.

This tutorial builds five scenarios of increasing complexity. You need a free Make account (make.com), Gmail, and Google Sheets. Each scenario introduces one core concept.

For platform overview and pricing, see our [Make getting started guide](/blog/getting-started-with-make).

## Scenario 1: Gmail to Google Sheets Logger (Modules and Mapping)

**Concept:** Modules are Make's building blocks. Each circle is a module that does one thing — watch for events, search data, create records.

**What it does:** Log every email from a specific sender into a spreadsheet.

**Steps:**

1. Click **Create a new scenario**
2. Click the **+** in the center → search **Gmail** → choose **Watch Emails**
3. Click **Add** to create a connection (OAuth with Google)
4. Configure:
   - Folder: INBOX
   - Filter type: Simple filter
   - Criteria: From contains "invoices@vendor.com" (or any sender)
   - Maximum results: 10
5. Click **OK**, then right-click the module → **Run this module only** to pull sample data
6. Click the **+** to the right of Gmail → search **Google Sheets** → choose **Add a Row**
7. Connect Google account, select spreadsheet and sheet
8. Map fields: click each column field and select data from the Gmail module (Subject, From, Date, Text content)
9. Click **Run once** at bottom left to test
10. Toggle **Scheduling** ON (bottom left), set interval to 15 minutes
11. Click **Save**

**What you learned:** Data flows left to right. The mapping panel shows all available data from previous modules. Run once tests without activating.

## Scenario 2: Form Submission Router (Router)

**Concept:** Router splits the flow into multiple paths, each with its own filter.

**What it does:** When a Google Form is submitted, route to different actions based on the request type.

**Prerequisites:** A Google Form with fields Name, Email, Request Type (Support / Sales / Partnership), Details. Linked to a response Sheet.

**Steps:**

1. New scenario → **Google Sheets** → **Watch Rows** (select the form response sheet)
2. Run once to get sample data
3. Click **+** → search **Flow Control** → **Router**
4. The router creates two paths by default. Click **+** on the router to add a third.
5. **Path 1:** Click the wrench between Router and the empty module → **Set up a filter**
   - Label: Support
   - Condition: Request Type → Text operators → Equal to → "Support"
   - Then add module: **Slack** → **Create a Message** to #support channel
6. **Path 2:** Filter for "Sales" → **Gmail** → **Send an Email** to sales team
7. **Path 3:** Filter for "Partnership" → **Notion** → **Create a Database Item** in your partnerships tracker
8. Run once with each request type
9. Schedule and save

**What you learned:** Routers evaluate all paths — an item can match multiple filters and go down multiple paths. Filters use Make's operator categories (Text, Number, Date, Boolean).

## Scenario 3: Process Multiple Items (Iterator and Aggregator)

**Concept:** Iterator splits an array into individual items processed one at a time. Aggregator combines them back into one bundle.

**What it does:** Read all rows from a spreadsheet, send a personalized email to each, then post a single Slack summary of how many were sent.

**Steps:**

1. New scenario → **Google Sheets** → **Search Rows** (returns all rows matching a filter, e.g., Status = "Pending")
2. Run once — note that the module outputs multiple bundles
3. Click **+** → **Gmail** → **Send an Email**
   - To: Email column
   - Subject: "Hello {Name}"
   - Body: personalized content
4. This runs once per row automatically (Make handles the loop)
5. Click **+** after Gmail → **Flow Control** → **Array Aggregator**
   - Source module: Google Sheets (Search Rows)
   - Target structure: choose fields to aggregate
6. Click **+** → **Slack** → **Create a Message**
   - Text: "Sent {length(Array)} emails today" (use the length function on the aggregator output)
7. Run once — you should see multiple emails sent and ONE Slack message

**What you learned:** Make automatically iterates when a module outputs multiple bundles. Aggregators collect results back into one bundle for summary operations.

## Scenario 4: Text Parsing and Data Transformation (Functions)

**Concept:** Make's function library (in the mapping panel) transforms data inline — no separate Formatter module needed.

**What it does:** Parse a raw email containing an order number, extract it, format the date, and create a structured record.

**Steps:**

1. **Gmail** → **Watch Emails** (filter for order confirmation emails)
2. Click **+** → **Google Sheets** → **Add a Row**
3. In the mapping panel, use functions:
   - Order Number: `{{substring(Subject; indexOf(Subject; "#") + 1; indexOf(Subject; "#") + 8)}}` — extracts 7 characters after "#"
   - Date: `{{formatDate(Date; "YYYY-MM-DD")}}` — reformats to ISO
   - Amount: `{{parseNumber(replace(Text; "$"; ""))}}` — removes $ and converts to number
   - Customer: `{{upper(first(split(From; "@")))}}` — extracts name before @ and uppercases
4. Run once and verify the parsed output

**What you learned:** Functions are grouped by category (General, Math, Text, Date, Array). Click any field, then the function tabs at the top of the mapping panel. Functions nest: `upper(first(split(...)))`.

## Scenario 5: Error Handling (Error Handlers)

**Concept:** Error handlers define what happens when a module fails — retry, ignore, roll back, or take alternative action.

**What it does:** Attempt to create a CRM contact; if the API fails, log to a Sheet and notify via Slack instead of stopping the scenario.

**Steps:**

1. **Webhook** → **Custom Webhook** (create a webhook, copy the URL for testing)
2. **HubSpot** (or any CRM) → **Create a Contact** mapped from webhook data
3. Right-click the HubSpot module → **Add error handler**
4. Choose **Resume** (continues the scenario with a substitute value) or **Ignore** (skips and continues)
5. For this tutorial, choose **Resume** — the error path appears as a dotted line
6. On the error path, add **Google Sheets** → **Add a Row** to log the failure (map webhook data + error message)
7. Add **Slack** → **Create a Message** to alert #automation-errors
8. Test by sending a webhook payload with invalid email (should trigger the error path)

**What you learned:** Four error handler types: Ignore (skip silently), Resume (substitute value and continue), Break (store incomplete execution for manual retry), Rollback (undo). Every production scenario should have error handling on critical modules.

## Operations and Cost

Every module execution counts as one operation. Scenario 3 with 50 rows: 1 (search) + 50 (emails) + 1 (aggregator) + 1 (Slack) = 53 operations.

Free plan: 1,000 operations/month. Core plan: 10,000 for $10.59/month.

Reduce operations by filtering early (before iterators), using Search instead of Watch when appropriate, and scheduling less frequently for non-urgent workflows.

## Next Steps

- [Make advanced scenarios](/blog/make-advanced-scenarios) for sub-scenarios, data stores, and webhooks
- [Best Make templates](/blog/make-templates-best) for pre-built starting points
- [Make vs Zapier](/blog/make-vs-zapier) if comparing platforms
- [Make Google Sheets automation](/blog/make-google-sheets-automation) for spreadsheet-heavy workflows

## Is Make harder to learn than Zapier?

Slightly, but the visual model pays off quickly. Zapier's linear form-based interface is faster for a first single-step automation (10 minutes vs 20). Make's flowchart interface takes an extra hour to feel natural but makes multi-step workflows with branching and loops much easier to build and debug. If you plan to build anything beyond simple trigger-action pairs, Make's learning investment returns within the first week. Most users are comfortable with modules, routers, and iterators within 3-5 hours of practice.

## What is a Make scenario?

A scenario is Make's term for an automation workflow — the equivalent of a Zap in Zapier. It consists of modules (circles) connected by lines showing data flow. A scenario starts with a trigger module (watch for events or scheduled run), passes data through processing modules (filters, routers, transformations), and ends with action modules (create records, send messages). Scenarios can be run manually for testing, scheduled at intervals, or triggered instantly by webhooks.

## How many operations does a Make scenario use?

Each module execution counts as one operation. A scenario with 3 modules that runs once uses 3 operations. If a module processes 10 items (iterating), it uses 10 operations. The free plan includes 1,000 operations monthly; Core plan offers 10,000 for $10.59/month. Optimize by filtering early (reduce items before expensive modules), using Search Rows instead of Watch Rows when you only need specific records, and running scheduled scenarios less frequently when real-time processing is not required.
