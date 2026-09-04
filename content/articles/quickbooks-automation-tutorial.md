---
title: "QuickBooks Automation Tutorial: Invoices to Reconciliation"
description: "Automate QuickBooks Online: invoice creation from deals, payment sync, expense capture, recurring billing, and reporting with no-code tools."
date: "2026-09-03"
category: "how-to"
tags: ["QuickBooks", "accounting", "tutorial", "invoicing", "bookkeeping"]
keywords: ["QuickBooks automation", "QuickBooks Online automation", "automate QuickBooks invoices", "QuickBooks Zapier", "QuickBooks workflows"]
featured: false
---

## Bookkeeping Is 80% Data Entry. Automate the 80%.

Creating invoices from closed deals, matching payments, categorizing expenses, chasing overdue bills — most bookkeeping is moving data from one system into QuickBooks. Every one of those transfers can be automated. What remains is review and judgment, which is what a bookkeeper or owner should spend time on.

This tutorial builds seven QuickBooks Online workflows. QuickBooks Desktop has limited API access — these apply to QuickBooks Online (QBO).

## Connecting QuickBooks Online

[Make](/blog/getting-started-with-make), [Zapier](/blog/getting-started-with-zapier), and [n8n](/blog/getting-started-with-n8n) all support QBO via OAuth — click Connect, log in to Intuit, authorize.

**Available triggers:** New invoice, New payment, New customer, New expense/purchase, New bill, Updated invoice, New sales receipt

**Available actions:** Create/update customer, invoice, sales receipt, payment, expense, bill, estimate, credit memo, journal entry; Find by name/ID; Send invoice

**Sandbox:** Create a test company at developer.intuit.com to avoid polluting real books during setup.

## Workflow 1: CRM Deal Won to Invoice

**Steps (Make):**
1. **HubSpot / Pipedrive** → Watch Deals → stage = Won
2. **QuickBooks** → **Search Customers** by company name or email
3. **Router:**
   - Not found → **QuickBooks** → **Create Customer** (name, email, billing address from CRM)
   - Found → use existing ID
4. **QuickBooks** → **Create Invoice**:
   - Customer: from step 2/3
   - Line items: from deal products (Iterator if multiple) — Item name, quantity, rate
   - Due date: today + payment terms
   - Memo: deal name, PO number
5. **QuickBooks** → **Send Invoice** (emails via QBO)
6. **HubSpot** → Update Deal: Invoice Number, Invoice Link
7. **Slack** → #finance: "Invoice #{{number}} sent to {{customer}} for ${{total}}"

See our [invoice processing automation guide](/blog/automate-invoice-processing).

## Workflow 2: Stripe Payments to QuickBooks

**Steps (Make):**
1. **Stripe** → Watch Events → `charge.succeeded`
2. **Stripe** → Get Balance Transaction (net amount, fee)
3. **QuickBooks** → Search Customer by email → create if missing
4. **Router:**
   - Payment matches an open invoice (search by Stripe invoice metadata) → **QuickBooks** → **Create Payment** applied to that invoice
   - No invoice (direct sale) → **QuickBooks** → **Create Sales Receipt** with line item and deposit to "Stripe Clearing" account
5. **QuickBooks** → **Create Expense**: Stripe fee → vendor "Stripe", account "Merchant Fees"

**Note:** QBO has a native Stripe app via Intuit App Store that handles this. Use custom automation when you need specific categorization or multi-currency handling. See our [Stripe automation tutorial](/blog/stripe-automation-tutorial).

## Workflow 3: Receipt Capture to Expenses

**Steps (Make):**
1. **Gmail** → Watch Emails with attachment, label "Receipts" (or **Google Drive** watch folder, or **Slack** channel #receipts)
2. **HTTP** / **Google Drive** → download attachment
3. **OpenAI** (GPT-4o with vision) or **Mindee** / **Veryfi** → extract vendor, date, total, tax, category
4. **QuickBooks** → **Create Purchase** (Expense):
   - Payment account: company card
   - Vendor: search or create
   - Line: amount, category account (map from AI category)
   - Attach receipt (QBO supports attachments via API)
5. **Google Sheets** → log for review
6. **Slack** → weekly digest of auto-categorized expenses for bookkeeper review

See our [AI data extraction guide](/blog/ai-data-extraction-automation).

## Workflow 4: Overdue Invoice Reminders

QBO has basic automatic reminders (Settings → Sales → Reminders). For personalized, multi-channel dunning:

**Steps (Make):**
1. **Schedule** → daily 9 AM
2. **QuickBooks** → **Search Invoices** → Balance > 0 AND DueDate < today
3. **Iterator**
4. **Router by days overdue:**
   - 1-7 days → **Gmail** friendly reminder from account manager
   - 8-21 days → **Gmail** firmer + **Twilio** SMS if phone on file
   - 22+ days → **Slack** #collections + **HubSpot** create task "Call about invoice"
5. **Google Sheets** → log reminder sent (prevent duplicates same day)

## Workflow 5: Recurring Invoices With Variable Amounts

QBO's native recurring transactions handle fixed amounts. For usage-based billing:

**Steps (Make):**
1. **Schedule** → 1st of month
2. **Google Sheets / Airtable** → get usage per client (hours logged, units consumed)
3. **Iterator**
4. **QuickBooks** → Search Customer
5. **QuickBooks** → **Create Invoice**: line items from usage × rate
6. **QuickBooks** → Send Invoice
7. **Google Sheets** → reset usage counters

## Workflow 6: Bill Entry From Vendor Emails

**Steps (Make):**
1. **Gmail** → Watch Emails from known vendor domains with PDF attachments
2. **AI extraction** → vendor, invoice number, date, due date, line items, total
3. **QuickBooks** → Search Vendor → create if missing
4. **QuickBooks** → **Create Bill**: vendor, due date, lines with expense accounts
5. **Slack** → #approvals: "Bill from {{vendor}} for ${{total}} due {{date}}. Approve?" with button (via Slack workflow or Make webhook)
6. On approve → mark for payment; QBO Bill Pay or manual

## Workflow 7: Weekly Financial Snapshot

**Steps (Make):**
1. **Schedule** → Monday 7 AM
2. **QuickBooks** → **Get Report** (Profit and Loss, last week) — via API report endpoint or HTTP Request to `/v3/company/{id}/reports/ProfitAndLoss`
3. **QuickBooks** → Search Invoices (open) → sum = A/R
4. **QuickBooks** → Search Bills (open) → sum = A/P
5. **Set Variables** → revenue, expenses, net, A/R, A/P
6. **Google Sheets** → append row (dashboard source)
7. **Gmail / Slack** → summary to owner

See our [business dashboard guide](/blog/how-to-create-business-dashboard) and [report automation guide](/blog/automate-report-generation).

## QuickBooks Native Automations

Before building external workflows, check QBO's built-in features:
- **Bank rules** (Banking → Rules): auto-categorize transactions by payee/amount
- **Recurring transactions**: fixed invoices, bills, journal entries on schedule
- **Invoice reminders**: automatic overdue emails
- **QuickBooks Payments**: auto-record when customers pay online invoices
- **App integrations** (Intuit App Store): Shopify, Stripe, PayPal, Square, Bill.com connectors

Use external automation for cross-tool logic these do not cover.

## Data Integrity Tips

- **Always search before create** — duplicate customers and vendors are the #1 automation mess in QBO
- **Use a "Clearing" account** for payment processors, then reconcile deposits
- **Map categories explicitly** — do not let AI guess expense accounts without a review step
- **Test in sandbox** — undoing 500 wrong journal entries is painful
- **Log every automated transaction** to a Sheet with source and timestamp for audit

For broader patterns, see our [accounting automation guide](/blog/automation-for-accounting).

## Can QuickBooks be automated?

Yes, extensively. QuickBooks Online has a full API supported by [Make](/blog/getting-started-with-make), [Zapier](/blog/getting-started-with-zapier), and [n8n](/blog/getting-started-with-n8n). Common automations: create invoices from CRM deals, record payments from Stripe/PayPal, log expenses from receipt emails, send overdue reminders, generate usage-based recurring invoices, and pull weekly financial reports. QBO also includes native automation — bank rules, recurring transactions, and invoice reminders. QuickBooks Desktop has limited API access; migrate to Online for automation.

## How do I automatically create invoices in QuickBooks?

Connect your trigger source (CRM deal won, form submission, Stripe checkout, project milestone in Asana/ClickUp) to QuickBooks via an [automation platform](/blog/best-automation-tools-small-business). The workflow: search for the customer by email or name (create if not found), create the invoice with line items mapped from the source (product, quantity, rate), set the due date, then use the Send Invoice action to email it through QBO. Store the invoice number back in the source system for tracking. Setup takes 20-30 minutes and eliminates manual invoice creation permanently.

## Does QuickBooks integrate with Stripe?

Yes, in three ways. (1) QuickBooks Payments — Intuit's own processor, records payments automatically. (2) The Stripe app in the Intuit App Store — syncs Stripe charges, fees, and payouts to QBO with basic mapping. (3) Custom automation via [Make](/blog/getting-started-with-make) or Zapier — watch Stripe events, then create QBO sales receipts or apply payments to invoices with full control over accounts, fee handling, and customer matching. Option 3 is best when you need specific categorization, multi-currency, or want to link Stripe payments to CRM-generated invoices.
