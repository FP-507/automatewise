---
title: "Make Advanced Scenarios: Routers, Iterators, and Error Handling"
description: "Master Make's advanced features. Build scenarios with routers, iterators, aggregators, error handlers, and data transformation modules."
date: "2026-09-01"
category: "advanced"
tags: ["Make", "Integromat", "advanced", "routers", "error handling"]
keywords: ["make advanced scenarios", "make routers", "make iterators", "integromat advanced", "make error handling"]
featured: false
---

## Beyond Simple Scenarios

Most Make tutorials stop at trigger → action. But Make's real power lives in its advanced modules: routers that split workflows into parallel paths, iterators that process collections item by item, aggregators that combine results, and error handlers that recover from failures gracefully.

These features are what separate Make from simpler platforms like [IFTTT](/blog/getting-started-with-ifttt). If you can build basic Make scenarios already, this guide takes you to the next level. If you are new to Make, start with our [getting started guide](/blog/getting-started-with-make) first.

## Routers: Parallel Conditional Paths

A router splits your scenario into multiple paths that execute based on conditions. Think of it as a visual if/else statement.

### How Routers Work

Place a router after any module. Each path (called a "route") gets its own filter condition. When the scenario runs, each route's filter is evaluated independently. Routes where the filter passes execute; routes where it fails are skipped.

**Key behavior:** Routes are evaluated in order (top to bottom), but multiple routes can execute for the same input. Unlike a traditional if/else, a router can send one input down two, three, or all routes simultaneously if their conditions all pass.

### Practical Router Examples

**Customer segmentation:**
- Trigger: New customer signup
- Router splits into three routes:
  - Route 1 (Enterprise, >100 employees): Notify sales team in Slack, create Salesforce opportunity
  - Route 2 (Small business, 10-100 employees): Send welcome email sequence, add to onboarding CRM pipeline
  - Route 3 (Individual/Free): Add to email list, send self-service onboarding guide

Each customer flows through exactly one route based on company size.

**Multi-platform content distribution:**
- Trigger: New blog post via RSS
- Router routes based on content type:
  - Route 1 (Tutorial posts): Share to Twitter + LinkedIn + Dev.to
  - Route 2 (Comparison posts): Share to Twitter + Reddit + LinkedIn
  - Route 3 (All posts): Log to content calendar spreadsheet

### Router Best Practices

**Use a fallback route.** Always add a final route without a filter (processes everything that did not match earlier routes). Without it, unmatched inputs are silently dropped. A fallback route can log unexpected data for debugging.

**Order matters.** Put the most specific conditions first. A customer with 150 employees matches both "more than 100" and "more than 10" -- if the broader filter is first, the specific route never fires.

**Keep route count manageable.** More than 5-6 routes makes scenarios hard to read. If you need that many branches, consider splitting into multiple scenarios connected via webhooks.

## Iterators: Processing Collections Item by Item

An iterator takes an array (a list of items) and processes each item individually through subsequent modules.

### When You Need Iterators

Any time an API returns a list and you need to act on each item:
- A CRM returns 50 contacts → update each in a spreadsheet
- An email has 3 attachments → save each to Google Drive
- A database query returns 20 orders → send a follow-up email for each

Without an iterator, Make processes the entire array as one bundle. With an iterator, Make processes each item as a separate bundle, sending it through the remaining modules individually.

### Iterator Configuration

Place the Iterator module after the module that returns an array. Select which array field to iterate over. Every module after the iterator receives one item at a time.

**Example: Process Shopify orders**
1. Trigger: Scheduled (every hour)
2. Shopify: List orders (returns an array of orders)
3. Iterator: Split orders array into individual orders
4. Filter: Only process orders with status "fulfilled"
5. Gmail: Send shipping notification email for each order
6. Google Sheets: Log each order to tracking spreadsheet

### Performance Considerations

Each iteration counts as one operation against your Make plan. 50 items through an iterator = 50 operations. For high-volume processing, be aware of your plan's operation limits. See our [Make vs Zapier comparison](/blog/make-vs-zapier) for pricing details.

**Batch where possible.** If the destination supports batch operations (adding multiple rows to a sheet at once), use an aggregator after the iterator to collect results and insert them in one batch operation instead of 50 individual inserts.

## Aggregators: Combining Results

Aggregators are the reverse of iterators. They collect multiple bundles and combine them into one.

### Types of Aggregators

**Array Aggregator:** Collects items into a JSON array. Use when the next module expects a list input.

**Table Aggregator:** Combines items into an HTML or CSV table. Use for email reports -- iterate through orders, aggregate into a formatted table, send one email with the complete table instead of 50 individual emails.

**Text Aggregator:** Concatenates text from multiple items with a separator. Use for building comma-separated lists, multi-line text blocks, or custom formatted output.

**Numeric Aggregator:** Calculates SUM, AVG, COUNT, MIN, or MAX across items. Use for totals without needing a spreadsheet.

### Practical Aggregator Example

**Weekly sales report via email:**
1. Shopify: Get orders from last 7 days (returns array)
2. Iterator: Process each order individually
3. Math: Calculate each order's total with tax and shipping
4. Table Aggregator: Combine all orders into an HTML table with columns for order number, customer, total, and date
5. Numeric Aggregator: Calculate total revenue sum
6. Gmail: Send one email with the order table and total revenue figure

Result: One clean weekly email instead of exporting data, building a spreadsheet, and formatting it manually.

## Error Handling: Building Resilient Scenarios

Real-world automation encounters errors. APIs go down, rate limits are hit, data formats change, authentication expires. Make's error handling system lets you define what happens when things go wrong.

### Error Handler Module

Attach an error handler to any module. When that module fails, execution transfers to the error handler instead of stopping the entire scenario.

**Error handler options:**

**Resume:** Continue the scenario from the next module as if the error did not happen. Use for non-critical modules where failure is acceptable (e.g., logging to a spreadsheet fails, but the main workflow should continue).

**Commit:** Save all partial results processed so far and stop. Use when partial execution is valid -- you processed 40 of 50 items and do not want to lose the first 40.

**Rollback:** Discard all results and stop. Use for all-or-nothing workflows (financial transactions, database migrations) where partial execution would create inconsistencies. For more patterns, see our [error handling in automation guide](/blog/error-handling-automation).

**Break:** Save results up to the failing module, mark the execution as incomplete, and store the unprocessed bundles for later retry. This is the most useful option -- you can fix the issue and re-run only the failed items.

**Ignore:** Skip the failed bundle and continue processing remaining items. Use when iterating through a list and some items are expected to fail (e.g., some email addresses are invalid).

### Retry Patterns

For transient errors (API timeouts, rate limits), implement retry logic:

1. Add an error handler with "Break" directive
2. Set the error handler to retry after a delay (30 seconds, 1 minute)
3. Set maximum retry count (3-5 attempts)

This handles the majority of intermittent failures without manual intervention.

### Error Notification

Always add a notification module to your error handlers:

**Error → Send Slack message** with scenario name, module name, error message, and timestamp. You learn about failures immediately instead of discovering them hours or days later when you check Make's execution logs.

## Data Transformation Modules

### Set Variable

Store intermediate values for use later in the scenario. Use when a calculation result or API response is needed multiple modules downstream.

### Switch Module

Like a router but for mapping input values to output values. Map status codes to human-readable names, country codes to full names, or error codes to messages. Cleaner than nested if/else in subsequent modules.

### JSON / CSV Parsing

**Parse JSON:** Convert a text string containing JSON into a structured object that Make can access field by field. Essential when working with [webhook payloads](/blog/webhook-automation-guide) or API responses that return raw JSON.

**Create JSON:** Build a JSON string from Make data. Use when an API expects a JSON body that is more complex than Make's standard module inputs allow.

**Parse CSV:** Convert CSV text into individual rows for iteration. Useful for processing uploaded files, email attachments, or exported data.

## Real-World Advanced Scenario: Lead Processing Pipeline

This scenario demonstrates routers, iterators, and error handling working together:

1. **Webhook trigger:** Receives form submission data
2. **HTTP module:** Enrich lead data by calling a company data API (Clearbit, Apollo)
3. **Error handler on HTTP:** If enrichment fails, set default values and continue (Resume)
4. **Router:**
   - **Route 1 (Enterprise leads):** Company size > 100 employees
     - Create Salesforce contact
     - Send to sales team Slack channel
     - Schedule follow-up task in CRM
   - **Route 2 (SMB leads):** Company size 10-100
     - Add to [HubSpot](/blog/hubspot-automation-guide) marketing sequence
     - Send welcome email
   - **Route 3 (Individual):**
     - Add to email list
     - Send self-service guide
   - **Fallback route:** Log unclassifiable lead for manual review
5. **Google Sheets:** Log all leads regardless of route (after router rejoins)

Total modules: ~15. Operations per lead: ~5-8. Fully automatic from form submission to CRM entry with zero manual data entry.

## Make vs Other Platforms for Advanced Workflows

**Make vs [Zapier](/blog/make-vs-zapier):** Make's visual router, iterator, and error handling are more intuitive than Zapier's equivalent features (Paths, Looping, Error handling). Make is generally the better choice for complex scenarios.

**Make vs [n8n](/blog/n8n-vs-make):** n8n offers similar capabilities plus custom code nodes and self-hosting. Choose n8n for even more flexibility and lower cost at scale; choose Make for the cleaner visual interface.

**Make vs [Power Automate](/blog/make-vs-power-automate):** Power Automate handles similar complexity but is optimized for Microsoft ecosystem. Choose based on your tech stack.

For a full comparison of all platforms' advanced capabilities, see our [best automation tools guide](/blog/best-automation-tools-2025).
