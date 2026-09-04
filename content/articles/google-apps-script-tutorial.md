---
title: "Google Apps Script Tutorial for Automation (Beginners)"
description: "Learn Google Apps Script from scratch with 5 practical scripts. Automate Gmail, Sheets, Calendar, and Drive without external tools."
date: "2026-09-03"
category: "how-to"
tags: ["Google Apps Script", "tutorial", "Google Workspace", "JavaScript", "automation"]
keywords: ["Google Apps Script tutorial", "Apps Script for beginners", "automate Google Sheets script", "Google Apps Script examples", "Apps Script automation"]
featured: false
---

## Free, Built In, and Already Connected to Everything Google

Google Apps Script is JavaScript that runs on Google's servers with direct access to Gmail, Sheets, Calendar, Drive, Docs, and Forms. No API keys to manage, no external platform subscription, no server to host. If your automation lives within Google Workspace, Apps Script is often the simplest and cheapest option.

This tutorial assumes zero programming experience. Each script is complete and ready to paste. You will learn by modifying working examples.

For the broader picture of Workspace automation, see our [Google Workspace automation guide](/blog/automate-google-workspace).

## Getting Started

1. Open any Google Sheet (or create a new one)
2. Click **Extensions** → **Apps Script**
3. A code editor opens with an empty `myFunction()`
4. Delete the default code and paste any script below
5. Click **Save** (disk icon), then **Run** (play button)
6. First run: Google asks for permission — click **Review permissions** → choose your account → **Allow**

The script editor has a **Logs** panel (View → Logs or Ctrl+Enter) where `Logger.log()` output appears.

## Script 1: Send Email From Spreadsheet Data

**What it does:** Reads rows from a sheet and sends a personalized email to each.

**Setup:** Sheet with columns A: Name, B: Email, C: Status. Add a few test rows with your own email.

```javascript
function sendEmails() {
  const sheet = SpreadsheetApp.getActiveSheet();
  const data = sheet.getDataRange().getValues();
  
  // Skip header row (index 0)
  for (let i = 1; i < data.length; i++) {
    const name = data[i][0];
    const email = data[i][1];
    const status = data[i][2];
    
    // Only send to rows marked "Pending"
    if (status === "Pending") {
      const subject = `Hello ${name}, your update is ready`;
      const body = `Hi ${name},\n\nThis is an automated message from our system.\n\nBest regards`;
      
      GmailApp.sendEmail(email, subject, body);
      
      // Mark as sent
      sheet.getRange(i + 1, 3).setValue("Sent");
      Logger.log(`Sent to ${email}`);
    }
  }
}
```

**How it works:**
- `getDataRange().getValues()` reads the whole sheet as a 2D array
- The loop starts at 1 to skip headers
- `GmailApp.sendEmail()` sends via your Gmail account
- `getRange(row, column).setValue()` writes back to the sheet (rows and columns are 1-indexed)

**Modify it:** Change the subject and body. Add more columns and reference them as `data[i][3]`, `data[i][4]`, etc.

## Script 2: Daily Calendar Digest to Email

**What it does:** Every morning, emails you a summary of today's calendar events.

```javascript
function dailyDigest() {
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  
  const events = CalendarApp.getDefaultCalendar().getEvents(today, tomorrow);
  
  if (events.length === 0) {
    GmailApp.sendEmail(Session.getActiveUser().getEmail(), 
      "Today's Schedule", "No events today.");
    return;
  }
  
  let body = "Today's events:\n\n";
  events.forEach(event => {
    const start = event.getStartTime();
    const time = Utilities.formatDate(start, Session.getScriptTimeZone(), "h:mm a");
    body += `${time} — ${event.getTitle()}\n`;
    if (event.getLocation()) body += `   Location: ${event.getLocation()}\n`;
  });
  
  GmailApp.sendEmail(Session.getActiveUser().getEmail(), 
    `Today's Schedule (${events.length} events)`, body);
}
```

**To run automatically:** Click the **clock icon** (Triggers) in the left sidebar → **Add Trigger** → Function: `dailyDigest` → Event source: Time-driven → Day timer → 6am to 7am → Save.

**What you learned:** `CalendarApp` accesses calendar. `Utilities.formatDate()` formats dates. Triggers run scripts on schedules without you clicking anything.

## Script 3: Auto-Organize Gmail With Labels

**What it does:** Scans unread emails, labels them based on sender domain, and archives newsletters.

```javascript
function organizeInbox() {
  const threads = GmailApp.search("is:unread in:inbox", 0, 50);
  
  const rules = [
    { match: "@client.com", label: "Clients" },
    { match: "@vendor.com", label: "Vendors" },
    { match: "newsletter", label: "Newsletters", archive: true },
    { match: "invoice", label: "Finance" }
  ];
  
  threads.forEach(thread => {
    const message = thread.getMessages()[0];
    const from = message.getFrom().toLowerCase();
    const subject = message.getSubject().toLowerCase();
    
    rules.forEach(rule => {
      if (from.includes(rule.match) || subject.includes(rule.match)) {
        const label = GmailApp.getUserLabelByName(rule.label) 
          || GmailApp.createLabel(rule.label);
        thread.addLabel(label);
        if (rule.archive) thread.moveToArchive();
      }
    });
  });
}
```

**Set a trigger:** Every 15 minutes (Time-driven → Minutes timer → Every 15 minutes).

**What you learned:** `GmailApp.search()` uses the same syntax as Gmail's search bar. Rules in an array make it easy to add more. `getUserLabelByName() || createLabel()` creates the label only if it does not exist.

## Script 4: Form Response Notification With Conditions

**What it does:** When a Google Form is submitted, sends a Slack-style notification (via email) only for high-priority responses.

**Setup:** Create a Google Form with fields Name, Email, Priority (dropdown: Low/Medium/High), Message. Link it to a Sheet. Open Apps Script from that Sheet.

```javascript
function onFormSubmit(e) {
  const responses = e.namedValues;
  const name = responses["Name"][0];
  const email = responses["Email"][0];
  const priority = responses["Priority"][0];
  const message = responses["Message"][0];
  
  if (priority === "High") {
    const body = `HIGH PRIORITY REQUEST\n\nFrom: ${name} (${email})\n\n${message}\n\nRespond within 1 hour.`;
    GmailApp.sendEmail("team@yourcompany.com", `[URGENT] ${name}`, body);
  }
  
  // Log everything regardless of priority
  Logger.log(`Form submitted by ${name}, priority ${priority}`);
}
```

**Set the trigger:** Triggers → Add Trigger → Function: `onFormSubmit` → Event source: From spreadsheet → Event type: On form submit.

**What you learned:** Event-driven triggers pass an event object `e`. `e.namedValues` contains form responses keyed by question title. This runs instantly on submission, no polling.

## Script 5: Weekly Report Generated as Google Doc

**What it does:** Every Monday, creates a Google Doc summarizing spreadsheet data from the past week.

**Setup:** Sheet with columns A: Date, B: Client, C: Amount, D: Status.

```javascript
function weeklyReport() {
  const sheet = SpreadsheetApp.getActiveSheet();
  const data = sheet.getDataRange().getValues();
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
  
  let total = 0;
  let count = 0;
  const rows = [];
  
  for (let i = 1; i < data.length; i++) {
    const date = new Date(data[i][0]);
    if (date >= oneWeekAgo) {
      total += Number(data[i][2]);
      count++;
      rows.push(`${data[i][1]}: $${data[i][2]} (${data[i][3]})`);
    }
  }
  
  const doc = DocumentApp.create(`Weekly Report - ${Utilities.formatDate(new Date(), Session.getScriptTimeZone(), "yyyy-MM-dd")}`);
  const body = doc.getBody();
  
  body.appendParagraph("Weekly Summary").setHeading(DocumentApp.ParagraphHeading.HEADING1);
  body.appendParagraph(`Transactions: ${count}`);
  body.appendParagraph(`Total: $${total.toFixed(2)}`);
  body.appendParagraph("Details:").setHeading(DocumentApp.ParagraphHeading.HEADING2);
  rows.forEach(row => body.appendListItem(row));
  
  GmailApp.sendEmail(Session.getActiveUser().getEmail(), 
    "Weekly report ready", `View it here: ${doc.getUrl()}`);
}
```

**Trigger:** Time-driven → Week timer → Every Monday → 8am to 9am.

**What you learned:** `DocumentApp.create()` generates documents. Apps Script can chain multiple Google services in one script — Sheets to Docs to Gmail.

## Apps Script vs External Automation Platforms

| Use Apps Script when | Use Make/Zapier/n8n when |
|---|---|
| Everything is within Google Workspace | You need to connect non-Google tools |
| You want zero cost | You want visual, no-code building |
| You need custom logic beyond dropdown options | You prefer pre-built app connectors |
| You are comfortable with basic JavaScript | You want the team to maintain it without code |

Many teams use both: Apps Script for Google-internal automation, an [automation platform](/blog/best-automation-tools-small-business) for cross-tool workflows. See our [Google Sheets automation with Make](/blog/make-google-sheets-automation) for the no-code side.

## Common Mistakes

**Forgetting `SpreadsheetApp.getActiveSheet()` context.** Time-triggered scripts do not have an "active" sheet. Use `SpreadsheetApp.openById("SHEET_ID").getSheetByName("Sheet1")` instead.

**Exceeding quotas.** Free accounts get 100 emails/day via GmailApp, 6 minutes execution per run. Check quotas at Apps Script dashboard.

**Not handling empty values.** `data[i][1]` might be empty. Add `if (!email) continue;` to skip.

**Running in the wrong timezone.** Script timezone is set in Project Settings. Match it to your users.

## Is Google Apps Script free?

Yes, completely free with any Google account. Quotas apply: free Gmail accounts can send 100 emails/day via script, Workspace accounts get 1,500/day. Scripts can run for up to 6 minutes per execution and have daily limits on trigger runs and API calls that most small-business automations never hit. There is no subscription, no per-execution charge, and no server cost — scripts run on Google's infrastructure. This makes Apps Script the most cost-effective option for automation that stays within Google Workspace.

## Do I need to know JavaScript for Google Apps Script?

Basic familiarity helps but is not required to start. Apps Script uses JavaScript syntax, but most automation scripts follow simple patterns: read data, loop through it, do something for each row, write results back. If you can modify the examples in this tutorial (changing column numbers, email text, conditions), you can build useful automations. Copy working scripts, modify them for your needs, and learn the syntax gradually. The Apps Script documentation and community forums cover almost every common task with example code.

## How do I run a Google Apps Script automatically?

Set up a trigger: in the Apps Script editor, click the clock icon (Triggers) in the left sidebar, then Add Trigger. Choose your function, select the event source (time-driven for schedules; from spreadsheet for edit/form-submit events; from calendar for calendar changes), and configure the timing. Time-driven triggers run every minute, hour, day, week, or month. Event triggers run instantly when the event occurs. Once set, the script runs automatically without you opening the editor or the spreadsheet.
