---
title: "n8n Tutorial: 5 Workflows From Zero to Production"
description: "Hands-on n8n tutorial building 5 real workflows. Covers nodes, expressions, IF logic, loops, HTTP requests, and error handling."
date: "2026-09-03"
category: "how-to"
tags: ["n8n", "tutorial", "workflows", "open source", "step by step"]
keywords: ["n8n tutorial", "how to use n8n", "n8n workflow tutorial", "n8n for beginners", "n8n step by step"]
featured: false
---

## n8n Gives You the Power of Code Without Requiring It

n8n sits between no-code tools and custom development. The visual editor is drag-and-drop, but every field accepts JavaScript expressions, every workflow can include a Code node, and the HTTP Request node connects to any API on the internet. This makes it the platform that grows with you — start visual, add code only where needed.

This tutorial builds five workflows. You need n8n running locally (Docker: `docker run -it --rm -p 5678:5678 n8nio/n8n`) or an n8n Cloud account. For setup details, see our [n8n getting started guide](/blog/getting-started-with-n8n) or [self-hosting guide](/blog/n8n-self-hosting-guide).

## Workflow 1: Scheduled Report Email (Nodes and Expressions)

**Concept:** Nodes are n8n's building blocks. Expressions (in `{{ }}`) inject dynamic data.

**What it does:** Every Monday at 8 AM, count rows in a Google Sheet and email the count.

**Steps:**

1. Click **Add workflow** → name it "Weekly Report"
2. Click **+** → search **Schedule Trigger**
   - Trigger Interval: Weeks
   - Weeks Between Triggers: 1
   - Trigger on Weekdays: Monday
   - Hour: 8
3. Click **+** after Schedule → search **Google Sheets** → **Get Many Rows**
   - Create credential (OAuth2 or Service Account)
   - Document: select your spreadsheet
   - Sheet: select tab
4. Click **Execute node** to fetch sample data
5. Click **+** → search **Gmail** → **Send Email**
   - To: your email
   - Subject: `Weekly Report - {{ $now.format('yyyy-MM-dd') }}`
   - Message: `Total rows: {{ $('Google Sheets').all().length }}`
6. Click **Execute workflow** (bottom) to test end-to-end
7. Toggle **Active** in the top right
8. Save

**What you learned:** `$now` gives current datetime. `$('NodeName')` references any previous node's output. `.all()` gets all items; `.length` counts them. Expressions can include full JavaScript.

## Workflow 2: Form to CRM with Conditional Logic (IF Node)

**Concept:** IF node creates true/false branches based on conditions.

**What it does:** When a form is submitted, create a CRM contact — but route enterprise leads (company size > 100) to a Slack alert as well.

**Steps:**

1. New workflow → **Webhook** trigger
   - HTTP Method: POST
   - Path: leave auto-generated
   - Copy the **Test URL**
2. Send a test payload (use curl, Postman, or connect a form tool):
   ```
   curl -X POST [test-url] -H "Content-Type: application/json" -d '{"name":"Jane","email":"jane@corp.com","company_size":250}'
   ```
3. Click **Listen for test event**, send the request, see data appear
4. **+** → **HubSpot** → **Create Contact** (or any CRM)
   - Map email, first name from `{{ $json.email }}`, `{{ $json.name }}`
5. **+** → **IF** node
   - Condition: Number → `{{ $json.company_size }}` → is greater than → 100
6. On the **true** branch: **+** → **Slack** → **Send Message**
   - Channel: #enterprise-leads
   - Text: `Enterprise lead: {{ $json.name }} from company of {{ $json.company_size }}`
7. On the **false** branch: leave empty (or add to a nurture list)
8. Execute workflow, test with company_size both above and below 100
9. Switch webhook to **Production URL** and activate

**What you learned:** `$json` is the current item's data. IF node outputs to true or false branches. Webhooks have separate test and production URLs.

## Workflow 3: Process Every Row (Loop Over Items)

**Concept:** n8n processes items in batches by default. The Loop Over Items node controls batch size when you need one-at-a-time processing.

**What it does:** Read rows from a Sheet, look up each contact in a CRM, update the row with the CRM status.

**Steps:**

1. **Manual Trigger** (for testing; replace with Schedule later)
2. **Google Sheets** → **Get Many Rows** (columns: Email, Name, CRM_Status)
3. **+** → **Loop Over Items**
   - Batch Size: 1
4. Inside the loop (the "loop" output): **+** → **HubSpot** → **Search Contacts** by email `{{ $json.Email }}`
5. **+** → **Google Sheets** → **Update Row**
   - Match on: Email
   - CRM_Status: `{{ $json.properties.lifecyclestage || 'Not found' }}`
6. Connect the Update Row output back to the Loop Over Items input (creates the loop)
7. On the "done" output of Loop: **+** → **Slack** → notify completion with `{{ $items().length }} rows processed`
8. Execute

**What you learned:** Loop Over Items with batch size 1 processes sequentially — useful for API rate limits. The "done" branch runs after all iterations. Connecting the last node back to the loop is what makes it iterate.

## Workflow 4: Call Any API (HTTP Request Node)

**Concept:** HTTP Request connects to any REST API, including services n8n has no native node for.

**What it does:** When a new company is added to a Sheet, look up its details from a public API and enrich the row.

**Steps:**

1. **Google Sheets Trigger** → **Row Added** (columns: Domain, Company_Name, Description)
2. **+** → **HTTP Request**
   - Method: GET
   - URL: `https://api.example.com/company?domain={{ $json.Domain }}` (substitute a real enrichment API — Clearbit, Apollo, or a free one like `https://api.github.com/orgs/{{ $json.Domain }}`)
   - Authentication: choose type if required (API Key, Bearer Token, OAuth2)
   - Headers: add as needed
3. Execute to see the JSON response
4. **+** → **Set** node (to clean up the response)
   - Add fields: Company_Name = `{{ $json.name }}`, Description = `{{ $json.description }}`
5. **+** → **Google Sheets** → **Update Row** matching on Domain
6. Activate

**What you learned:** HTTP Request handles GET, POST, PUT, DELETE. Response is automatically parsed as JSON. Set node reshapes data before writing. This pattern works for any API — read the API's documentation for endpoints and auth.

## Workflow 5: Error Handling and Retries (Error Trigger)

**Concept:** n8n has two error handling layers: node-level retry settings and workflow-level Error Trigger workflows.

**What it does:** Retry failed API calls automatically, and if they still fail, log to a Sheet and notify via Slack.

**Part A — Node-level retry:**

1. Open any workflow with an HTTP Request or API node
2. Click the node → **Settings** tab
3. **Retry On Fail:** ON
4. **Max Tries:** 3
5. **Wait Between Tries:** 2000 (ms)
6. **On Error:** Continue (using error output) — this creates an error output branch
7. Connect the error output to a **Google Sheets** → **Append Row** logging the error `{{ $json.error.message }}`

**Part B — Workflow-level error handler:**

1. Create a new workflow named "Error Handler"
2. Add **Error Trigger** node
3. **+** → **Slack** → Send Message
   - Text: `Workflow "{{ $json.workflow.name }}" failed: {{ $json.execution.error.message }}`
4. Save and activate
5. Go back to any production workflow → **Settings** (gear icon) → **Error Workflow:** select "Error Handler"

**What you learned:** Node retry handles transient failures (rate limits, timeouts). Error output branches handle expected failures gracefully. Error Trigger workflows catch everything else across all workflows.

## Adding Code When You Need It

The **Code** node runs JavaScript (or Python) with full access to input data:

```javascript
// Deduplicate items by email
const seen = new Set();
return $input.all().filter(item => {
  const email = item.json.email.toLowerCase();
  if (seen.has(email)) return false;
  seen.add(email);
  return true;
});
```

Use Code when expressions get unwieldy, when you need loops or complex logic, or when transforming data structures.

## Next Steps

- [n8n vs Make](/blog/n8n-vs-make) and [n8n vs Zapier](/blog/n8n-vs-zapier) for platform comparison
- [Connect Google Sheets to n8n](/blog/connect-google-sheets-n8n) for deeper spreadsheet workflows
- [Error handling in automation](/blog/error-handling-automation) for production patterns
- [Self-hosting n8n](/blog/n8n-self-hosting-guide) for production deployment

## Is n8n good for beginners?

n8n is approachable for beginners who are comfortable with basic technical concepts (what a webhook is, what JSON looks like). The visual editor is intuitive, and most workflows use only drag-and-drop nodes. The learning curve is steeper than Zapier because n8n exposes more options and expects you to understand data structure. Expect 2-3 hours to build your first meaningful workflow and 1-2 weeks to feel comfortable. The payoff is a platform with no execution limits (self-hosted) and unlimited flexibility as your needs grow.

## What programming language does n8n use?

n8n workflows use JavaScript expressions inside `{{ }}` for dynamic values, and the Code node supports full JavaScript or Python. You do not need to write code for most workflows — native nodes handle common apps with dropdown configuration. Expressions become useful for formatting dates, combining strings, or simple conditions. The Code node is for complex transformations. n8n itself is built in TypeScript and can be extended with custom nodes if you need integrations that do not exist.

## How do I debug an n8n workflow?

Execute nodes one at a time using the "Execute node" button to inspect output at each step — the right panel shows exactly what data each node produces. Use the Executions list (left sidebar) to review past runs, including failed ones with error details. Add a Set node between steps to inspect intermediate data. For webhooks, use the Test URL with "Listen for test event" to capture real payloads. Enable "Save execution data" in workflow settings so you can replay failed executions after fixing the issue.
