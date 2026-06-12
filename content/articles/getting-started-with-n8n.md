---
title: "Getting Started with n8n: Build Your First Automation in 15 Minutes"
description: "Learn how to set up n8n and build your first automated workflow in under 15 minutes. Step-by-step tutorial for complete beginners."
date: "2025-10-20"
category: "getting-started"
tags: ["n8n", "tutorial", "beginner guide", "workflow builder", "first automation"]
keywords: ["getting started with n8n", "n8n tutorial", "n8n beginner guide", "first n8n workflow"]
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

## Five Workflow Ideas for Your Next Project

Now that you know the basics, here are five practical workflows to build next, each teaching you new n8n features.

1. **New lead notification pipeline** -- When a form is submitted on your website, create a contact in your CRM and notify your team on Slack. This teaches you webhook triggers and multi-step workflows. See our guide on [automating lead generation](/blog/automate-lead-generation).

2. **Daily report automation** -- Pull data from Google Analytics, format it into a summary, and email it to your team every morning. This teaches you scheduled triggers and data transformation. Read more about [automating report generation](/blog/automate-report-generation).

3. **Social media cross-poster** -- When you publish a new blog post, automatically share it on Twitter, LinkedIn, and Facebook with platform-optimized messaging. This teaches you parallel execution and content transformation. Check our [social media automation guide](/blog/automate-social-media-posting).

4. **File organization system** -- When a file is uploaded to Google Drive, rename it based on conventions, move it to the correct folder based on file type, and log the action in a spreadsheet. Learn about [automating file organization](/blog/automate-file-organization).

5. **Customer support ticket router** -- When a support email arrives, analyze the subject and body to determine the category, assign it to the right team member, and send an acknowledgment email to the customer. This teaches you conditional logic and text analysis.

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
