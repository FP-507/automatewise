---
title: "Make.com Tutorial for Beginners: 6 Scenarios Step by Step"
description: "Learn Make step by step: the interface, your first scenario, then five hands-on builds covering mapping, routers, iterators, functions and error handlers."
date: "2026-06-21"
updated: "2026-11-06"
category: "getting-started"
tags: ["Make", "Integromat", "beginner guide", "visual automation", "no-code"]
keywords: ["getting started with make", "make.com tutorial", "integromat beginner guide", "make automation tutorial", "make.com guide", "Make tutorial", "how to use Make", "Integromat tutorial", "Make scenarios beginners"]
featured: false
---

## What Is Make and Why Use It?

Make (formerly Integromat) is a visual automation platform that lets you connect apps and automate workflows using a drag-and-drop interface. Unlike text-based automation tools, Make displays your workflows as visual flowcharts where data flows through connected modules — making complex logic easy to understand at a glance.

Make stands out in the automation landscape for several reasons:

- **Visual scenario builder** -- Your automations look like flowcharts, making them intuitive to build and debug
- **Granular control** -- More configuration options than Zapier, with filters, routers, and iterators built in
- **Competitive pricing** -- Operations-based pricing that is often cheaper than Zapier for similar workloads
- **1000+ app integrations** -- Connects to most popular business tools
- **Advanced features** -- Built-in data transformation, error handling, and scheduling without premium add-ons
- **HTTP module** -- Connect to any app with an API, even without a dedicated integration

If you are evaluating platforms, our [Make vs Zapier comparison](/blog/make-vs-zapier) and [n8n vs Make comparison](/blog/n8n-vs-make) cover the detailed differences. For a broader overview, read about [no-code automation](/blog/no-code-automation-explained).

## Creating Your Make Account

Getting started takes under two minutes:

1. Go to **make.com** and click "Get started free"
2. Sign up with your email, Google, or GitHub account
3. Complete the brief onboarding questions about your role and goals
4. You land on the dashboard — ready to build

The free plan includes 1,000 operations per month, which is plenty for learning and building your first automations. No credit card required.

## Understanding Make's Interface

### The Dashboard

Your dashboard shows all your scenarios (Make's term for workflows), their status, execution history, and organization folders. From here you create new scenarios, monitor running ones, and manage your connections.

### The Scenario Editor

The scenario editor is Make's visual canvas. This is where you build automations by adding modules (individual steps) and connecting them with lines that represent data flow. The editor includes:

- **Module palette** -- Search and add app modules to your canvas
- **Connection lines** -- Drag between modules to define the flow
- **Filters** -- Click on connection lines to add conditions
- **The toolbar** -- Run, schedule, save, and configure your scenario
- **The inspector** -- Click any module to configure its settings

### Modules

Modules are the building blocks of Make scenarios. Each module represents one action: "Watch new emails in Gmail," "Create a row in Google Sheets," "Send a Slack message." Modules come in several types:

- **Triggers** -- Start your scenario when an event occurs (new email, new row, webhook received)
- **Actions** -- Perform an operation (send email, create record, update spreadsheet)
- **Searches** -- Look up existing data (find a contact, search for a file)
- **Aggregators** -- Combine multiple items into one (merge array items, concatenate text)
- **Iterators** -- Split one item into many for individual processing
- **Routers** -- Branch your scenario into multiple paths based on conditions

## Building Your First Scenario: Form to Spreadsheet + Email

Let us build a practical scenario that captures form submissions, logs them to a spreadsheet, and sends a notification email.

### Step 1: Create a New Scenario

Click "Create a new scenario" from the dashboard. You will see an empty canvas with a single starting circle.

### Step 2: Add the Trigger Module

Click the starting circle and search for your trigger. For this example, we will use a **Webhook** trigger since it works with any form tool.

1. Search for "Webhooks" and select "Custom webhook"
2. Click "Add" to create a new webhook
3. Name it "Form Submissions"
4. Make generates a unique URL — copy this URL
5. Configure your form tool (Typeform, Google Forms, your website) to send submissions to this URL

To test the webhook, click "Run once" in the toolbar, then submit a test entry through your form. Make will capture the data structure automatically and show you the available fields.

### Step 3: Add the Google Sheets Module

Click the "+" icon after the webhook module and search for "Google Sheets."

1. Select "Add a Row"
2. Connect your Google account (Make will prompt you to authenticate)
3. Select your spreadsheet and sheet
4. Map the webhook data to your columns:
   - Column A (Name): Drag the `name` field from the webhook data
   - Column B (Email): Drag the `email` field
   - Column C (Message): Drag the `message` field
   - Column D (Date): Use Make's `now` function for the current timestamp

### Step 4: Add the Email Notification

Click "+" after the Google Sheets module and search for "Email" or "Gmail."

1. Select "Send an Email"
2. Connect your email account
3. Configure the email:
   - **To**: Your email address
   - **Subject**: `New form submission from {{1.name}}`
   - **Content**: Build a message using mapped fields from the webhook

```
New form submission received:

Name: {{1.name}}
Email: {{1.email}}
Message: {{1.message}}

Submitted at: {{now}}
```

The `{{1.name}}` syntax references data from module 1 (the webhook). Make uses module numbers to identify data sources.

### Step 5: Test and Activate

1. Click "Run once" in the toolbar
2. Submit another test form entry
3. Watch the scenario execute — each module shows a green checkmark on success
4. Verify: check your Google Sheet for the new row and your inbox for the notification email
5. If everything works, click the scheduling toggle to activate the scenario
6. Set the schedule (how often Make checks for new data) — for webhooks, this is instant

## Working with Filters and Routers

### Adding Filters

Filters let you conditionally pass data between modules. Click on the connection line between two modules to add a filter.

Example: Only send email notifications for form submissions that include the word "urgent" in the message.

1. Click the line between the webhook and the email module
2. Set the condition: Message → Text operators → Contains → "urgent"
3. Now only urgent messages trigger the email; all submissions still go to the spreadsheet

### Using Routers

Routers split your scenario into multiple paths. Add a router after any module by clicking "+" and selecting "Router."

Example: Route form submissions based on the inquiry type:

- **Path 1** (Sales inquiries): Create a lead in your CRM
- **Path 2** (Support requests): Create a ticket in your helpdesk
- **Path 3** (General): Log to spreadsheet only

Each path has its own filter condition and subsequent modules. This is one of Make's most powerful features — it handles complex branching logic visually.

## Data Transformation in Make

Make includes built-in functions for transforming data between modules. You access these in any field's mapping panel.

### Text Functions

- `lower(text)` — Convert to lowercase
- `upper(text)` — Convert to uppercase
- `trim(text)` — Remove whitespace
- `replace(text, search, replace)` — Find and replace
- `substring(text, start, end)` — Extract part of a string
- `split(text, delimiter)` — Split text into an array
- `length(text)` — Character count

### Date Functions

- `now` — Current date and time
- `addDays(date, days)` — Add days to a date
- `formatDate(date, format)` — Format a date string
- `parseDate(text, format)` — Parse text into a date

### Math Functions

- `round(number, decimals)` — Round a number
- `max(a, b)` — Return the larger value
- `min(a, b)` — Return the smaller value
- `ceil(number)` / `floor(number)` — Round up or down

### Array Functions

- `first(array)` — Get the first item
- `last(array)` — Get the last item
- `length(array)` — Count items
- `map(array, key)` — Extract a field from each item
- `join(array, separator)` — Combine array items into text

## Error Handling

Make provides robust error handling built into the platform.

### Error Handlers

Right-click any module and select "Add error handler" to define what happens when that module fails:

- **Resume** — Skip the failed item and continue
- **Rollback** — Undo all changes made during this execution
- **Commit** — Save changes made so far and stop
- **Break** — Stop execution and retry later
- **Ignore** — Ignore the error and continue (use carefully)

### Retry Logic

For transient failures (API timeouts, rate limits), configure automatic retries. In the scenario settings, enable "Sequential processing" and set the retry interval. Make will re-attempt failed executions at the specified interval.

### Incomplete Executions

When a scenario fails mid-execution, Make saves the state in "Incomplete executions." You can review what happened, fix the issue, and resume the execution from where it failed — without losing any data or reprocessing successful steps.

## Scheduling and Execution

### Schedule Settings

Make scenarios can run on different schedules:

- **Immediately** (webhooks, instant triggers): Runs the moment data arrives
- **At regular intervals**: Every 15 minutes, hourly, daily, etc.
- **Specified dates**: Run on specific days and times (e.g., every Monday at 9 AM)

The free plan allows minimum 15-minute intervals. Paid plans support more frequent scheduling.

### Execution History

Every scenario execution is logged. Click on a scenario and open the "History" tab to see:

- When each execution ran
- How long it took
- How many operations it consumed
- Whether it succeeded or failed
- The data that flowed through each module (click any execution to inspect)

This execution history is invaluable for debugging and monitoring your automations.

## Organizing Your Scenarios

As you build more automations, organization becomes critical.

### Folders

Create folders to group related scenarios: "Marketing," "Sales," "Operations," "Personal." Drag scenarios between folders to reorganize.

### Naming Conventions

Use descriptive names that explain what the scenario does:
- "New Lead → CRM + Slack Alert"
- "Daily Report → Email to Team"
- "Support Ticket → Categorize + Route"

### Scenario Notes

Add notes to your scenarios explaining the business logic, who requested it, and any special considerations. Future you will appreciate the documentation.

## Hands-On: Build Five Scenarios From Scratch

With the interface and your first scenario behind you, these five builds each introduce one core Make concept: mapping, routers, iterators and aggregators, functions and error handlers.

### Scenario 1: Gmail to Google Sheets Logger (Modules and Mapping)

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

### Scenario 2: Form Submission Router (Router)

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

### Scenario 3: Process Multiple Items (Iterator and Aggregator)

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

### Scenario 4: Text Parsing and Data Transformation (Functions)

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

### Scenario 5: Error Handling (Error Handlers)

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

## Make Pricing Overview

Make uses operations-based pricing. One operation equals one module execution. A three-module scenario uses three operations per run.

- **Free**: 1,000 operations/month, 2 active scenarios
- **Core**: 10,000 operations/month, unlimited scenarios
- **Pro**: More operations, priority execution, team features
- **Teams/Enterprise**: Advanced collaboration and support

Compared to Zapier's task-based pricing, Make often delivers more value per dollar — especially for multi-step scenarios. See our [Make vs Zapier comparison](/blog/make-vs-zapier) for a detailed cost analysis.

## Conclusion

Make's visual approach to automation makes complex workflows accessible. The drag-and-drop builder, combined with powerful features like routers, iterators, and error handling, gives you the flexibility to automate virtually any business process.

Start with the form-to-spreadsheet scenario above, then progressively tackle more complex workflows. Make's execution history and error handling make it forgiving to experiment — you can always see exactly what happened and fix issues without losing data.

For more automation guides, explore our [getting started section](/categories/getting-started) or compare Make with other platforms in our [tool comparisons](/categories/tool-comparisons).

## Frequently Asked Questions

### Is Make better than Zapier?

Make and Zapier serve different audiences. Make offers a visual drag-and-drop builder with routers, iterators, and error handling that gives more control over complex workflows at a lower price. Zapier is simpler to learn and has 7,000+ integrations versus Make's 2,000+. For straightforward automations, Zapier wins on ease. For multi-branch, data-heavy workflows, Make delivers more value. See our full [Make vs Zapier comparison](/blog/make-vs-zapier).

### How many free operations does Make offer?

Make's free plan includes 1,000 operations per month with up to 2 active scenarios. One operation equals one module execution, so a 3-module scenario uses 3 operations per run. This means roughly 333 scenario executions per month on the free plan. Paid plans start at $10.59 per month for 10,000 operations with unlimited active scenarios.

### Does Make require coding knowledge?

No. Make is designed for non-technical users. Its visual builder uses a drag-and-drop canvas where you connect modules (app actions) with lines showing data flow. You configure each module by mapping fields from previous steps — no code required. For advanced users, Make does offer a built-in JavaScript module and the ability to make custom HTTP requests, but these are optional power features.

### Is Make harder to learn than Zapier?

Slightly, but the visual model pays off quickly. Zapier's linear form-based interface is faster for a first single-step automation (10 minutes vs 20). Make's flowchart interface takes an extra hour to feel natural but makes multi-step workflows with branching and loops much easier to build and debug. If you plan to build anything beyond simple trigger-action pairs, Make's learning investment returns within the first week. Most users are comfortable with modules, routers, and iterators within 3-5 hours of practice.

### What is a Make scenario?

A scenario is Make's term for an automation workflow — the equivalent of a Zap in Zapier. It consists of modules (circles) connected by lines showing data flow. A scenario starts with a trigger module (watch for events or scheduled run), passes data through processing modules (filters, routers, transformations), and ends with action modules (create records, send messages). Scenarios can be run manually for testing, scheduled at intervals, or triggered instantly by webhooks.

### How many operations does a Make scenario use?

Each module execution counts as one operation. A scenario with 3 modules that runs once uses 3 operations. If a module processes 10 items (iterating), it uses 10 operations. The free plan includes 1,000 operations monthly; Core plan offers 10,000 for $10.59/month. Optimize by filtering early (reduce items before expensive modules), using Search Rows instead of Watch Rows when you only need specific records, and running scheduled scenarios less frequently when real-time processing is not required.
