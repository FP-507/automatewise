---
title: "Stripe Automation Tutorial: Payments to Workflows"
description: "Automate everything after a Stripe payment: receipts, CRM updates, fulfillment, accounting, failed payment recovery, and subscription management."
date: "2026-09-03"
category: "how-to"
tags: ["Stripe", "payments", "tutorial", "subscription automation", "billing"]
keywords: ["Stripe automation", "Stripe webhooks", "Stripe Zapier", "automate Stripe payments", "Stripe workflow"]
featured: false
---

## A Payment Is an Event. Events Trigger Workflows.

Every Stripe payment, subscription change, refund, or failed charge is an event that can start an automated workflow. Most businesses only use Stripe's default receipt email and handle everything else manually — updating the CRM, notifying the team, triggering fulfillment, recording in accounting, chasing failed payments.

This tutorial connects Stripe events to your business processes. You need a Stripe account (test mode is fine) and an automation platform account.

## Stripe Events You Can Automate

Stripe emits webhooks for every account activity. The most useful for automation:

| Event | When It Fires | Common Automation |
|-------|---------------|-------------------|
| `checkout.session.completed` | Customer completes checkout | Fulfillment, CRM update, welcome email |
| `payment_intent.succeeded` | Any successful payment | Accounting entry, receipt, notification |
| `payment_intent.payment_failed` | Payment fails | Retry sequence, customer notification |
| `customer.subscription.created` | New subscription | Onboarding sequence, access provisioning |
| `customer.subscription.updated` | Plan change, renewal | Update CRM, adjust access |
| `customer.subscription.deleted` | Cancellation | Offboarding, win-back sequence |
| `invoice.payment_failed` | Subscription renewal fails | Dunning sequence |
| `charge.refunded` | Refund issued | Accounting adjustment, CRM note |
| `customer.created` | New customer record | CRM sync |

## Connecting Stripe to Automation Platforms

**Option A: Native integrations**

[Zapier](/blog/getting-started-with-zapier), [Make](/blog/getting-started-with-make), and [n8n](/blog/getting-started-with-n8n) all have Stripe triggers that poll for new events. Easiest setup: connect your Stripe account with an API key (Stripe Dashboard → Developers → API keys → Restricted key with read access).

**Option B: Webhooks (real-time)**

For instant response, set up a webhook:
1. In your automation platform, create a Webhook trigger and copy the URL
2. Stripe Dashboard → Developers → Webhooks → Add endpoint
3. Paste the URL, select events to listen for
4. Stripe sends a POST request the instant the event occurs

Webhooks are faster and do not consume polling operations. Use them for anything time-sensitive.

## Workflow 1: Payment to CRM and Team Notification

**What it does:** When a payment succeeds, update the customer in your CRM and alert the team.

**Steps (Make):**

1. **Stripe** → **Watch Events** → Event: `payment_intent.succeeded`
2. **Stripe** → **Get a Customer** using the customer ID from the event (to get email, name, metadata)
3. **HubSpot** → **Search Contacts** by email
4. **Router:**
   - Found → **Update Contact**: Lifecycle Stage = Customer, Last Purchase Date = now, Total Revenue += amount
   - Not found → **Create Contact** with the same fields
5. **Slack** → Message to #sales: "Payment received: ${amount} from {name} ({email})"

**Result:** Every payment reflected in CRM within minutes, team celebrates wins in real time.

## Workflow 2: Checkout to Fulfillment

**What it does:** When checkout completes, create a fulfillment task with the order details.

**Steps (Make):**

1. **Stripe** → Watch Events → `checkout.session.completed`
2. **Stripe** → **List Line Items** for the session (gets products purchased)
3. **Iterator** over line items
4. **Notion** (or Trello, Asana) → **Create Database Item**:
   - Title: "Order {session ID} — {product name}"
   - Customer: {customer email}
   - Quantity: {quantity}
   - Status: "To Fulfill"
   - Shipping: {shipping address from session}
5. **Aggregator** → back to single bundle
6. **Gmail** → Send order confirmation to customer with all items listed

**Result:** Orders appear in your fulfillment board instantly. See our [e-commerce operations guide](/blog/ecommerce-operations-guide) for the full picture.

## Workflow 3: Failed Payment Recovery (Dunning)

**What it does:** When a subscription payment fails, run a recovery sequence.

Stripe has built-in Smart Retries and dunning emails (Settings → Billing → Subscriptions and emails). Enable those first. Then supplement with automation for CRM updates and personalized outreach:

**Steps (Make):**

1. **Stripe** → Watch Events → `invoice.payment_failed`
2. **Stripe** → Get Customer (for name, email)
3. **HubSpot** → Update Contact → Payment Status = "Failed", Failed Date = now
4. **Slack** → Message to #billing: "Payment failed for {name}: {amount}. Attempt {attempt_count}"
5. **Filter:** attempt_count equals 1 (first failure only, to avoid duplicate emails)
6. **Gmail** → Personal email from account manager: "Hi {name}, we noticed a payment issue. Update your card here: {billing portal link}"
7. **Delay** → 3 days
8. **Stripe** → Get Invoice → check if status is still "open"
9. **Filter:** still unpaid
10. **Gmail** → Second email with urgency + offer to help
11. **HubSpot** → Create Task for account manager: "Call {name} about failed payment"

**Stripe Customer Portal link:** Generate via Stripe API or use the no-code portal link from Settings → Customer portal.

## Workflow 4: New Subscription Onboarding

**What it does:** When a new subscription is created, provision access and start onboarding.

**Steps (Make):**

1. **Stripe** → Watch Events → `customer.subscription.created`
2. **Stripe** → Get Customer
3. **Stripe** → Get Subscription (for plan name, amount, interval)
4. **Router by plan:**
   - Starter plan → add to "Starter Onboarding" email sequence in ConvertKit/ActiveCampaign
   - Pro plan → add to "Pro Onboarding" sequence + Slack alert to customer success
   - Enterprise → create Notion page for account, assign CSM, schedule kickoff
5. **All paths:** HubSpot → Create Deal (Won) with plan and MRR value
6. **All paths:** Google Sheets → Append Row to MRR tracking sheet

See our [customer onboarding automation guide](/blog/automate-customer-onboarding) for sequence content.

## Workflow 5: Cancellation and Win-Back

**What it does:** When a subscription is cancelled, log the reason and trigger a win-back sequence.

**Steps (Make):**

1. **Stripe** → Watch Events → `customer.subscription.deleted`
2. **Stripe** → Get Customer + Get Subscription (for plan, lifetime value, cancellation details in metadata if collected)
3. **HubSpot** → Update Contact → Status = "Churned", Churn Date = now, Churn Plan = {plan}
4. **Google Sheets** → Append to churn log (email, plan, MRR lost, date, tenure in months)
5. **Slack** → #churn-alerts: "{name} cancelled {plan}. Tenure: {months}. MRR lost: ${amount}"
6. **Delay** → 1 day
7. **Gmail** → "We're sorry to see you go" email with a 1-question survey link (Google Form)
8. **Delay** → 30 days
9. **Gmail** → Win-back offer (discount or new feature announcement)

## Workflow 6: Revenue to Accounting

**What it does:** Sync every payment, refund, and fee to your accounting system.

**Steps (Make):**

1. **Stripe** → Watch Events → `charge.succeeded` OR `charge.refunded`
2. **Stripe** → Get Balance Transaction (for net amount after Stripe fees)
3. **Router:**
   - Charge succeeded → **QuickBooks** → Create Sales Receipt: Customer, Amount (gross), Fee (as expense line), Net
   - Refund → **QuickBooks** → Create Refund Receipt
4. **Google Sheets** → Append to reconciliation log

**Alternative:** Stripe has native QuickBooks and Xero integrations (via Stripe App Marketplace) that handle this without custom automation. Use custom workflows when you need specific categorization or multi-entity accounting. See our [accounting automation guide](/blog/automation-for-accounting).

## Testing Safely

**Use Stripe Test Mode.** Toggle in the dashboard. Test mode has separate API keys and webhook endpoints. Automation platforms need a test-mode API key for testing.

**Trigger test events.** Stripe Dashboard → Developers → Webhooks → your endpoint → Send test webhook. Or use the Stripe CLI: `stripe trigger payment_intent.succeeded`.

**Test cards.** 4242 4242 4242 4242 succeeds. 4000 0000 0000 0341 fails on attachment. Full list in Stripe docs.

**Check webhook logs.** Stripe shows every webhook attempt, response code, and retries under Developers → Webhooks → endpoint → Events.

## Security Notes

- Use **restricted API keys** with only the permissions your automation needs (read events, read customers). Never use the secret key in automation platforms.
- **Verify webhook signatures** if building custom endpoints. Automation platforms handle this for you with native Stripe triggers.
- Do not log full card numbers anywhere. Stripe never sends them, but be careful with metadata.

See our [automation security best practices](/blog/automation-security-best-practices).

## How do I automate Stripe payments?

Connect Stripe to an [automation platform](/blog/best-automation-tools-small-business) via native trigger (polling) or webhook (real-time). Choose the events to watch — `payment_intent.succeeded` for payments, `customer.subscription.created` for new subscriptions, `invoice.payment_failed` for dunning. Each event carries customer, amount, and product data that flows into actions: update CRM, notify team, create fulfillment task, sync to accounting, or start an email sequence. Start with payment-to-CRM sync and failed payment recovery — these two have the highest impact on revenue.

## What is a Stripe webhook?

A webhook is a message Stripe sends to a URL you specify the instant an event happens in your account — a payment succeeds, a subscription renews, a refund is issued. Instead of your automation checking Stripe every few minutes (polling), Stripe pushes the event to you in real time. Set up webhooks in Stripe Dashboard → Developers → Webhooks by adding your automation platform's webhook URL and selecting which events to send. Webhooks are faster than polling and do not consume operations when nothing is happening.

## Can I automate failed payment recovery in Stripe?

Yes, in two layers. Stripe's built-in Smart Retries automatically retries failed subscription payments at optimized times over 1-4 weeks, and Stripe can send dunning emails (enable in Settings → Billing). Supplement with custom automation: when `invoice.payment_failed` fires, update your CRM, alert your team, and send a personalized email from a real person with a direct link to update payment details. Businesses that add personal outreach to Stripe's automatic retries recover 20-40% more failed payments than retries alone.
