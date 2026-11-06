---
title: "n8n Tutorial for Beginners: First Workflow to Production"
description: "Learn n8n step by step: cloud vs self-hosted, your first workflow, then five hands-on builds covering expressions, IF, loops, HTTP requests and error handling."
date: "2026-06-11"
updated: "2026-11-06"
category: "getting-started"
tags: ["n8n", "tutorial", "beginner guide", "workflow builder", "first automation"]
keywords: ["getting started with n8n", "n8n tutorial", "n8n beginner guide", "first n8n workflow", "how to use n8n", "n8n workflow tutorial", "n8n for beginners", "n8n step by step"]
featured: true
---

## What Is n8n and Why Choose It?

n8n (pronounced "nodemation") is an open-source workflow automation platform that lets you connect apps, services, and APIs to automate repetitive tasks. It uses a visual, node-based interface where you build workflows by dragging and dropping components onto a canvas and connecting them.

What sets n8n apart from other automation tools is its combination of visual simplicity and technical depth. You can build most workflows without writing any code, but when you need custom logic, you can add JavaScript or Python code nodes directly in your workflow. This hybrid approach makes n8n suitable for beginners and advanced users alike.

Here are the key reasons people choose n8n:

- **Open source and transparent** -- You can inspect the code, contribute to the project, and trust that there are no hidden behaviors.
- **Self-hosting option** -- Run n8n on your own server for complete data control and zero per-workflow costs.
- **400+ integrations** -- Connects to most popular business tools out of the box.
- **Generous free tier** -- The cloud version offers a free plan to get started without a credit card.
- **Active community** -- Thousands of shared workflow templates, an active forum, and regular updates.
- **Fair pricing** -- Even the paid plans are significantly cheaper than alternatives like Zapier for comparable usage. See our detailed [n8n vs Zapier comparison](/blog/n8n-vs-zapier) for the numbers.

If you are new to workflow automation in general, start with our guide on [what workflow automation is](/blog/what-is-workflow-automation) before diving into this tutorial.

## Cloud vs Self-Hosted: Which Should You Pick?

n8n offers two deployment options, and choosing the right one depends on your priorities.

### n8n Cloud

n8n Cloud is the managed, hosted version. You sign up, log in, and start building -- no server management required. This is the best option if:

- You want to start immediately without any technical setup
- You do not want to manage servers, updates, or backups
- You are comfortable with your workflow data being stored on n8n's infrastructure
- You prefer a predictable monthly cost

The cloud free tier includes enough executions for personal use and experimentation. Paid plans start at reasonable price points and scale based on the number of workflow executions you need.

### n8n Self-Hosted

Self-hosting means running n8n on your own server -- a VPS, a home server, or even a Raspberry Pi. This is the best option if:

- You need complete control over your data (compliance, privacy, or preference)
- You want unlimited workflow executions at no per-execution cost
- You are comfortable with basic server administration
- You plan to run automation at high volumes where cloud pricing would be expensive

Self-hosting requires installing n8n via Docker or npm, setting up a database (SQLite works for small setups, PostgreSQL for production), and configuring a reverse proxy for HTTPS access. Our [n8n self-hosting guide](/blog/n8n-self-hosting-guide) walks through the entire process.

**For this tutorial, we will use n8n Cloud** because it requires zero setup and lets you focus on learning the interface and building workflows.

## Signing Up for n8n Cloud

Getting started with n8n Cloud takes less than two minutes.

1. Go to **n8n.io** and click "Get started free."
2. Create an account using your email address or sign up with Google.
3. Choose a subdomain for your instance (e.g., yourname.app.n8n.cloud).
4. Complete the brief onboarding questionnaire about your use case.
5. You are in. The workflow editor opens automatically.

No credit card is required for the free plan. You can explore the full interface, build workflows, and run them within the free tier limits before deciding if you want to upgrade.

## Understanding the n8n Interface

Before building your first workflow, take a moment to understand the key parts of the n8n interface.

### The Canvas

The central area is the canvas -- your workspace for building workflows. This is where you place nodes and connect them. The canvas supports zooming in and out, panning, and dragging nodes to arrange your workflow visually. A clean, well-organized canvas makes complex workflows much easier to understand.

### The Node Panel

On the left side, you will find the node panel. Clicking the "+" button or the "Add node" option opens a searchable list of all available nodes. Nodes are organized by category (e.g., Communication, Data Transformation, Developer Tools) and you can search by name or function. Each node represents a connection to a specific service or a built-in operation.

### The Execution Panel

At the bottom of the screen, the execution panel shows the results of your workflow runs. Each execution is logged with its status (success or error), timing, and the data that flowed through each node. This is your primary debugging tool.

### The Top Bar

The top bar contains your workflow name (click to rename), the save button, the workflow activation toggle, and the execution buttons. The "Test workflow" button runs your workflow once with the current configuration, while the toggle switch activates it so it runs automatically based on its trigger.

### Node Configuration

When you click on a node, a configuration panel opens on the right side. Here you set up the node's parameters: which account to use, what action to perform, what data to pass, and any optional settings. Every node has different parameters depending on its function.

## Building Your First Workflow: RSS to Email

Now let us build something real. We will create a workflow that monitors an RSS feed and sends you an email whenever a new article is published. This is a practical automation that introduces you to triggers, actions, data mapping, and testing.

### Step 1: Create a New Workflow

Click "Add workflow" from the workflows page or the "New" button if you already have a workflow open. You will see an empty canvas with a single starting node (the trigger placeholder).

Name your workflow something descriptive like "RSS Feed Monitor" by clicking on the workflow name in the top bar.

### Step 2: Add the RSS Feed Trigger

Click the "+" button on the canvas or the trigger placeholder to add your first node. Search for "RSS" and select the **RSS Feed Read** node.

In the configuration panel, you need to set the feed URL. Use any RSS feed you want to monitor. For testing purposes, you can use a popular blog's RSS feed such as:

- `https://blog.n8n.io/rss/` (n8n's own blog)
- `https://feeds.arstechnica.com/arstechnica/technology-lab` (Ars Technica)

Paste the URL into the "Feed URL" field. Under "Options," you can set how many items to return per check (start with 5 for testing).

Since we want this to run on a schedule, we need to add a **Schedule Trigger** node as well. Click the "+" button again, search for "Schedule Trigger," and add it. Configure it to run every hour (or whatever frequency you prefer). Connect the Schedule Trigger to the RSS Feed Read node by dragging from the output of the Schedule Trigger to the input of the RSS node.

### Step 3: Add an Email Action

Now let us add the action that sends you an email when new items appear. Click the "+" button after the RSS node and search for "Send Email." You have several options:

- **Gmail** -- If you use Gmail, this is the easiest choice. You will need to authenticate with your Google account.
- **Send Email** -- Uses SMTP, which works with any email provider but requires SMTP configuration.
- **Microsoft Outlook** -- For Outlook/Office 365 users.

Select your preferred option. For this tutorial, let us use the **Gmail** node.

Click on the Gmail node and follow the prompts to connect your Google account. Once authenticated, configure the email:

- **To:** Your email address
- **Subject:** Use a dynamic value by clicking the expression editor (the small icon next to the field) and selecting the RSS item's title. It will look something like: `New article: {{ $json.title }}`
- **Message:** Build a message that includes the article title, description, and link. Use the expression editor to insert these dynamic values from the RSS node's output.

A good email body template would be:

```
Title: {{ $json.title }}

Summary: {{ $json.contentSnippet }}

Read more: {{ $json.link }}
```

### Step 4: Test Your Workflow

Before activating the workflow, test it to make sure everything works.

1. Click on the Schedule Trigger node and click "Test step" to generate a trigger event.
2. Click on the RSS Feed Read node and click "Test step." You should see the feed items appear in the output panel with titles, descriptions, links, and dates.
3. Click on the Gmail node and click "Test step." This will send an actual email using the data from the RSS node.
4. Check your inbox. You should have received an email with the article details.

If any step fails, the output panel will show an error message with details about what went wrong. Common issues include authentication problems (re-authenticate the Gmail connection) and incorrect data mapping (check your expression syntax).

### Step 5: Add a Filter (Optional but Recommended)

Right now, the workflow sends you an email for every item in the RSS feed each time it runs. In practice, you only want emails for new items. Add a **Filter** node between the RSS and Gmail nodes:

1. Click the connection line between RSS and Gmail, or add a new node and rewire.
2. Search for and add a "Filter" node.
3. Configure it to compare the item's publication date against the last execution time, or use n8n's built-in deduplication features.

Alternatively, you can use the "RSS Feed Trigger" node instead of the manual RSS Read + Schedule combination. The RSS Feed Trigger automatically tracks which items you have already seen and only processes new ones.

### Step 6: Activate Your Workflow

Once testing confirms everything works correctly:

1. Click the "Save" button in the top bar.
2. Toggle the "Active" switch to on.
3. Your workflow is now live and will run automatically on the schedule you defined.

You can monitor executions from the "Executions" tab, where you will see a log of every run with its status, timing, and data.

## Essential n8n Concepts for Your Next Workflows

Now that you have built your first workflow, here are the key concepts to master as you build more complex automations.

### Credentials

n8n uses a credentials system to securely store your API keys, OAuth tokens, and login details. When you authenticate a node for the first time (like we did with Gmail), n8n saves those credentials so you can reuse them across multiple workflows. Manage your credentials from the "Credentials" section in the left sidebar.

### Expressions

Expressions let you use dynamic data in your node configurations. The expression editor supports JavaScript syntax and provides a list of available data from previous nodes. As you build more workflows, you will use expressions extensively for data mapping, string formatting, and conditional logic.

### Error Handling

n8n provides several ways to handle errors. You can set up an "Error Trigger" node that fires when any workflow fails, enabling you to send yourself a notification or log the error. Individual nodes can also have error handling configured to retry, continue on failure, or use a fallback path.

### Sub-Workflows

As your automations grow complex, you can break them into smaller, reusable sub-workflows. A main workflow calls a sub-workflow using the "Execute Workflow" node, passing data in and receiving results back. This keeps your workflows organized and maintainable.

### Webhooks

Webhook nodes let your workflow respond to external events in real time. Instead of polling for changes on a schedule, other services can push data directly to your workflow's webhook URL. This is essential for building responsive automations that react instantly.

## Hands-On: Five Workflows From Zero to Production

Once your first workflow runs, these five builds take you through the n8n features you will use most: expressions, the IF node, looping over items, the HTTP Request node and error handling. Build them in order — each one adds a single new concept.

### Workflow 1: Scheduled Report Email (Nodes and Expressions)

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

### Workflow 2: Form to CRM with Conditional Logic (IF Node)

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

### Workflow 3: Process Every Row (Loop Over Items)

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

### Workflow 4: Call Any API (HTTP Request Node)

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

### Workflow 5: Error Handling and Retries (Error Trigger)

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

### Adding Code When You Need It

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

## Troubleshooting Common Beginner Issues

As you start building, you will likely encounter a few common issues.

**Authentication failures** are the most frequent problem. If a node cannot connect to a service, re-open the credentials, re-authenticate, and make sure you granted the necessary permissions (scopes). For Google services, ensure you allowed all requested permissions during the OAuth flow.

**Empty output data** usually means the trigger did not produce any results. For webhook triggers, make sure you sent a test request. For schedule triggers, manually execute the trigger node first. For API-based nodes, verify the filters and parameters are not too restrictive.

**Expression errors** typically come from referencing data that does not exist at that point in the workflow. Use the expression editor's autocomplete to ensure you are referencing valid data fields. Check that the node producing the data executed successfully before the node trying to use it.

**Workflow not running** when activated usually means the trigger is not configured correctly. Webhook triggers need the workflow to be active to register the webhook URL. Schedule triggers need the correct timezone and interval settings.

## Conclusion

You have just built your first n8n workflow, and you now understand the fundamental concepts of visual workflow automation: triggers, actions, data mapping, and testing. This foundation applies not just to n8n, but to any automation platform you might use.

The key to becoming proficient is practice. Start with simple, practical workflows that solve real problems in your daily work. As you grow comfortable with the basics, gradually explore more advanced features like error handling, sub-workflows, and custom code nodes.

n8n's community is one of its greatest strengths. The forum, workflow templates library, and documentation are all excellent resources as you continue learning. And because n8n is open source, the platform keeps improving with contributions from developers worldwide.

Ready to explore more? Our [no-code automation guide](/blog/no-code-automation-explained) covers the broader landscape of building without code, and the [automation glossary](/blog/automation-glossary) will help you navigate the terminology as you dive deeper.

If you decide n8n is not the right fit, see our comparison of the [best n8n alternatives](/blog/n8n-alternatives).

## Frequently Asked Questions

### Is n8n free to use?

n8n offers two free options: self-hosted (completely free, unlimited workflows and executions, you manage the server) and n8n Cloud free tier (limited to 5 active workflows). Self-hosting requires Docker and a server ($5-10/month VPS), but gives you full control with no execution limits. Cloud plans start at $24/month for teams wanting managed hosting. For beginners, start with Docker locally — it runs on any computer with no cost.

### How long does it take to learn n8n?

Most users build their first working automation within 1-2 hours. The visual workflow builder is intuitive — drag nodes, connect them, map data fields. Basic proficiency (triggers, conditions, loops, error handling) takes 1-2 weeks of regular use. Advanced features (custom code nodes, sub-workflows, API integrations) take 1-2 months. n8n's community forum and 900+ workflow templates accelerate learning significantly.

### Is n8n good for beginners?

n8n is approachable for beginners who are comfortable with basic technical concepts (what a webhook is, what JSON looks like). The visual editor is intuitive, and most workflows use only drag-and-drop nodes. The learning curve is steeper than Zapier because n8n exposes more options and expects you to understand data structure. Expect 2-3 hours to build your first meaningful workflow and 1-2 weeks to feel comfortable. The payoff is a platform with no execution limits (self-hosted) and unlimited flexibility as your needs grow.

### What programming language does n8n use?

n8n workflows use JavaScript expressions inside `{{ }}` for dynamic values, and the Code node supports full JavaScript or Python. You do not need to write code for most workflows — native nodes handle common apps with dropdown configuration. Expressions become useful for formatting dates, combining strings, or simple conditions. The Code node is for complex transformations. n8n itself is built in TypeScript and can be extended with custom nodes if you need integrations that do not exist.

### How do I debug an n8n workflow?

Execute nodes one at a time using the "Execute node" button to inspect output at each step — the right panel shows exactly what data each node produces. Use the Executions list (left sidebar) to review past runs, including failed ones with error details. Add a Set node between steps to inspect intermediate data. For webhooks, use the Test URL with "Listen for test event" to capture real payloads. Enable "Save execution data" in workflow settings so you can replay failed executions after fixing the issue.
