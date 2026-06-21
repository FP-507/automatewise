---
title: "Getting Started with Make (Integromat): Build Visual Automations from Scratch"
description: "A complete beginner's guide to Make.com. Learn how to build your first scenario, connect apps, and automate workflows with Make's visual builder."
date: "2026-06-15"
category: "getting-started"
tags: ["Make", "Integromat", "beginner guide", "visual automation", "no-code"]
keywords: ["getting started with make", "make.com tutorial", "integromat beginner guide", "make automation tutorial", "make.com guide"]
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

## Five Scenarios to Build Next

1. **CRM lead enrichment** — When a new contact is created, look up their company information using an enrichment API and update the CRM record automatically. Learn more in our [CRM automation guide](/blog/automate-crm-workflows).

2. **Social media scheduler** — Pull approved content from a spreadsheet and post it to multiple platforms at scheduled times. See our [social media automation guide](/blog/automate-social-media-posting).

3. **Invoice processor** — When invoices arrive via email, extract key data, log it to your accounting spreadsheet, and file the PDF in Google Drive. Check our [invoice automation guide](/blog/automate-invoice-processing).

4. **Daily standup digest** — Collect updates from your project management tool every morning and send a formatted summary to Slack. Related: [automating report generation](/blog/automate-report-generation).

5. **Lead scoring workflow** — Score new leads based on their form responses, company size, and engagement, then route high-score leads for immediate follow-up. See [automating lead generation](/blog/automate-lead-generation).

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
