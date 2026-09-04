---
title: "Zapier Tutorial: Build Your First 5 Zaps (Step by Step)"
description: "Hands-on Zapier tutorial with 5 complete Zaps you can build today. Covers triggers, actions, filters, paths, and multi-step workflows."
date: "2026-09-03"
category: "how-to"
tags: ["Zapier", "tutorial", "step by step", "automation basics", "Zaps"]
keywords: ["Zapier tutorial", "how to use Zapier", "Zapier step by step", "build a Zap", "Zapier for beginners"]
featured: false
---

## Learn Zapier by Building, Not Reading

The fastest way to understand Zapier is to build five working Zaps in your first hour. Each one in this tutorial introduces a new concept — triggers, actions, filters, formatters, and paths — and produces something you will actually use.

You need a free Zapier account (zapier.com) and access to Gmail and Google Sheets. Everything else is optional.

If you want the conceptual overview first, see our [Zapier getting started guide](/blog/getting-started-with-zapier). This tutorial is pure hands-on.

## Zap 1: Email Attachments to Google Drive (Trigger + Action)

**Concept:** Every Zap has one trigger (the event that starts it) and one or more actions (what happens next).

**What it does:** When an email with an attachment arrives in Gmail, save the attachment to a Google Drive folder.

**Steps:**

1. Click **Create Zap** in your Zapier dashboard
2. **Trigger:** Search for Gmail → choose **New Attachment**
3. Connect your Gmail account (OAuth popup)
4. Configure: choose the label or leave as Inbox. Click **Test trigger** — Zapier pulls a recent email with an attachment as sample data
5. **Action:** Search for Google Drive → choose **Upload File**
6. Connect your Google Drive account
7. Configure:
   - **Drive:** My Drive
   - **Folder:** Create or select "Email Attachments"
   - **File:** Click the field and select **Attachment** from the Gmail trigger data
   - **File Name:** Select **Attachment Filename** from trigger data
8. Click **Test action** — check your Drive folder for the file
9. Click **Publish**

**What you learned:** Trigger data flows into action fields. The mapping interface (clicking a field and selecting trigger data) is the core of every Zap.

## Zap 2: Form Submissions to Spreadsheet + Email Alert (Multi-Step)

**Concept:** Zaps can have multiple actions in sequence.

**What it does:** When a Google Form is submitted, add a row to a Sheet AND send yourself an email.

**Prerequisites:** Create a Google Form with fields Name, Email, Message. Link it to a response Sheet (Responses tab → Sheets icon).

**Steps:**

1. **Trigger:** Google Sheets → **New Spreadsheet Row**
2. Connect account, select the form's response spreadsheet and worksheet
3. Test trigger — submit a test form response first so there is sample data
4. **Action 1:** Google Sheets → **Create Spreadsheet Row**
   - Select a different spreadsheet (your "Leads" tracker)
   - Map Name, Email, Message from trigger data
   - Add a static value for Source: "Website Form"
5. Click **+** to add another action
6. **Action 2:** Gmail → **Send Email**
   - To: your email address
   - Subject: "New lead: " + Name (click the field, type text, then insert trigger data)
   - Body: Compose using Name, Email, Message fields
7. Test both actions
8. Publish

**What you learned:** Multi-step Zaps run actions in order. Each action can use data from the trigger AND from previous actions.

**Note:** Multi-step Zaps require a paid Zapier plan. On the free plan, build this as two separate Zaps.

## Zap 3: Filter High-Value Deals to Slack (Filters)

**Concept:** Filters stop a Zap from continuing unless conditions are met.

**What it does:** When a new row is added to a deals spreadsheet, post to Slack — but only if the deal value exceeds $5,000.

**Steps:**

1. **Trigger:** Google Sheets → **New Spreadsheet Row** (a sheet with columns: Client, Deal Value, Stage)
2. Click **+** → choose **Filter** (under built-in tools)
3. Configure: **Deal Value** (from trigger) → **(Number) Greater than** → **5000**
4. **Action:** Slack → **Send Channel Message**
   - Channel: #sales-wins
   - Message: "New high-value deal: {Client} — ${Deal Value}"
5. Test with a row where value > 5000 (should pass) and one where value < 5000 (should stop)
6. Publish

**What you learned:** Filters use AND/OR logic. You can add multiple conditions. When a filter stops a Zap, it does not consume a task on your plan.

## Zap 4: Format Dates and Names (Formatter)

**Concept:** Formatter transforms data between trigger and action — reformatting dates, changing text case, extracting parts, doing math.

**What it does:** When a new contact is added to a spreadsheet with a full name and a raw date, split the name into first/last and reformat the date before adding to your CRM.

**Steps:**

1. **Trigger:** Google Sheets → New Spreadsheet Row (columns: Full Name, Signup Date, Email)
2. **Action 1:** Formatter by Zapier → **Text** → **Split Text**
   - Input: Full Name
   - Separator: (space)
   - Segment Index: First
   - Result: First Name
3. **Action 2:** Formatter → Text → Split Text
   - Same input, Segment Index: Last
   - Result: Last Name
4. **Action 3:** Formatter → **Date/Time** → **Format**
   - Input: Signup Date
   - To Format: MM/DD/YYYY (or whatever your CRM expects)
   - From Format: leave blank for auto-detect
5. **Action 4:** HubSpot (or your CRM) → **Create Contact**
   - First Name: from Action 1
   - Last Name: from Action 2
   - Email: from trigger
   - Custom field for signup date: from Action 3
6. Test each step
7. Publish

**What you learned:** Formatter has 5 categories: Text, Numbers, Date/Time, Utilities (lookup tables, line items), and Data (JSON parsing). Most data cleanup happens here.

## Zap 5: Route by Category (Paths)

**Concept:** Paths create branches — different actions depending on conditions. Like Filter, but instead of stopping, it routes.

**What it does:** When a support form is submitted, route to different Slack channels based on the issue category.

**Steps:**

1. **Trigger:** Typeform / Google Forms / Tally → New Submission (fields: Name, Email, Category, Description)
2. Click **+** → **Paths by Zapier**
3. **Path A: Billing**
   - Rule: Category (Text) Exactly matches "Billing"
   - Action: Slack → Send Channel Message to #support-billing
4. **Path B: Technical**
   - Rule: Category Exactly matches "Technical"
   - Action: Slack → Send Channel Message to #support-tech
5. **Path C: Other** (fallback)
   - Rule: Category Does not exactly match "Billing" AND Does not exactly match "Technical"
   - Action: Slack → Send Channel Message to #support-general
6. Test each path with different category values
7. Publish

**What you learned:** Paths let a single Zap handle multiple scenarios. Each path can have its own multi-step actions. Paths require Professional plan or higher.

## Testing and Debugging

**Zap History:** Every run is logged under Zap History. Click a run to see exactly what data passed through each step. This is where you diagnose failures.

**Common errors:**
- **"Required field is missing"** — a mapped field was empty in the trigger data. Add a Filter to skip runs where it is empty, or use Formatter's default value.
- **"Authentication failed"** — reconnect the app under My Apps. OAuth tokens expire.
- **"Rate limit exceeded"** — the app you are connecting has limits. Add a Delay step or reduce frequency.

**Replay:** If a run fails, fix the issue and click Replay to re-run with the same data.

## Next Steps

Once these five patterns are comfortable, you can build almost any automation. Explore:

- [Best Zapier templates](/blog/zapier-templates-best) for ready-made Zaps
- [Zapier AI Actions](/blog/zapier-ai-actions) for AI-powered workflows
- [Make vs Zapier](/blog/make-vs-zapier) if you hit plan limits or need more complex logic

## How long does it take to learn Zapier?

Most people build their first working Zap in 15-20 minutes and become comfortable with triggers, actions, and filters within 1-2 hours. Multi-step Zaps, Formatter, and Paths take another 2-3 hours of practice. Within a week of regular use, you can build any workflow Zapier supports. The interface is designed for non-technical users — the main learning is understanding how data flows from trigger to action, which the mapping interface makes visual.

## What is the difference between a Zap trigger and action?

A trigger is the event that starts a Zap — "when a new email arrives," "when a form is submitted," "every day at 9 AM." Every Zap has exactly one trigger. An action is what Zapier does in response — "create a spreadsheet row," "send a Slack message," "add a CRM contact." A Zap can have one action (single-step, available on free plan) or many actions in sequence (multi-step, requires paid plan). Data from the trigger flows into every action that follows.

## Can I build Zaps for free?

Yes. Zapier's free plan includes 100 tasks per month and unlimited single-step Zaps (one trigger, one action). Each time a Zap runs successfully, it consumes one task. Multi-step Zaps, Filters, Formatter, and Paths require a paid plan starting at $19.99/month. If you need multi-step workflows at no cost, [Make](/blog/getting-started-with-make) offers 1,000 free operations per month with no step limits, and [n8n](/blog/getting-started-with-n8n) is completely free when self-hosted.
