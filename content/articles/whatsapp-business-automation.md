---
title: "WhatsApp Business Automation: Setup & Workflows"
description: "Automate WhatsApp Business messaging: auto-replies, order notifications, appointment reminders, and chatbot flows using the API and no-code tools."
date: "2026-09-03"
category: "how-to"
tags: ["WhatsApp", "messaging", "tutorial", "customer communication", "chatbot"]
keywords: ["WhatsApp Business automation", "WhatsApp API automation", "automate WhatsApp messages", "WhatsApp chatbot", "WhatsApp Business API tutorial"]
featured: false
---

## WhatsApp Has 98% Open Rates. Email Has 20%.

If your customers are on WhatsApp — and in most of the world, they are — automated WhatsApp messaging outperforms every other channel for notifications, reminders, and support. But WhatsApp is strict: you cannot spam, you need approved templates for outbound messages, and there are two very different products (the free app vs the API).

This tutorial covers what you can automate with each, how to set up the API, and six workflows.

## WhatsApp Business App vs API

| | Business App (Free) | Business Platform / API |
|---|---|---|
| Users | 1 phone, up to 5 devices | Unlimited agents, programmatic |
| Automation | Greeting, away message, quick replies | Full: webhooks, templates, chatbots |
| Outbound | Manual only | Template messages to opted-in users |
| Integration | None | Any tool via API or BSP |
| Cost | Free | Per-conversation pricing (~$0.005-0.10) |

**App is enough when:** solo business, manual replies, basic auto-greetings.
**API is required when:** automated notifications, CRM integration, chatbots, multiple agents.

## App-Level Automation (Free)

WhatsApp Business App → Business Tools:

- **Greeting message:** Sent when a customer messages for the first time (or after 14 days of silence)
- **Away message:** Sent outside business hours you define
- **Quick replies:** Type `/` + shortcut to insert saved responses (e.g., `/hours` → your hours)
- **Labels:** Tag chats (New Customer, Pending Payment, Order Complete) for manual organization
- **Catalog:** Product list customers can browse in-chat

That is the ceiling. For anything triggered by external events, you need the API.

## Setting Up the WhatsApp Business API

**Option A: Meta Cloud API (direct)**
1. Create a Meta Business account at business.facebook.com
2. Go to developers.facebook.com → Create App → Business type → add WhatsApp product
3. Add a phone number (must not be registered on the WhatsApp app — use a new number or migrate)
4. Verify the business (required for production; test mode allows 5 numbers)
5. Get the Access Token and Phone Number ID

**Option B: Business Solution Provider (BSP)**
Twilio, 360dialog, MessageBird, Wati, Respond.io — they handle Meta approval, hosting, and provide friendlier dashboards. Costs slightly more per message. Recommended for non-developers.

**Option C: Automation platform native**
[Make](/blog/getting-started-with-make) and [n8n](/blog/getting-started-with-n8n) have WhatsApp Business Cloud modules that connect directly to Meta's API with your token — no BSP needed.

## The 24-Hour Window and Templates

**Rule:** You can send free-form messages only within 24 hours of the customer's last message. Outside that window, you must use pre-approved **Message Templates**.

**Create templates:** Meta Business Manager → WhatsApp Manager → Message Templates → Create
- Category: Utility (order updates, reminders), Marketing (promotions), Authentication (OTP)
- Variables: `{{1}}`, `{{2}}` for dynamic content
- Approval: usually within minutes to 24 hours

**Example template (Utility):**
"Hi {{1}}, your order #{{2}} has shipped and will arrive by {{3}}. Track it here: {{4}}"

## Workflow 1: Order Confirmation and Shipping Updates

**Steps ([Make](/blog/getting-started-with-make)):**
1. **Shopify** → Watch Orders (paid)
2. **Filter:** customer phone exists AND WhatsApp opt-in = true (custom field or checkout checkbox)
3. **WhatsApp Business Cloud** → **Send a Template Message**
   - Template: order_confirmation
   - To: {{customer.phone}} (E.164 format: +1234567890)
   - Variables: name, order number, total, estimated delivery
4. **Shopify** → Watch Fulfillments → same pattern with shipping_update template

See our [Shopify automation tutorial](/blog/shopify-automation-tutorial).

## Workflow 2: Appointment Reminders

**Steps (Make):**
1. **Schedule** → every hour
2. **Google Calendar / Calendly** → Search events in next 24-25 hours
3. **Iterator**
4. **Filter:** attendee phone exists AND reminder not yet sent (check a Sheet log)
5. **WhatsApp** → Send Template: appointment_reminder ("Hi {{1}}, reminder: {{2}} tomorrow at {{3}}. Reply YES to confirm or call us to reschedule.")
6. **Google Sheets** → Log sent reminder
7. **Webhook** (inbound from WhatsApp) → if reply = "YES" → Calendar update status confirmed

See our [appointment scheduling automation guide](/blog/automate-appointment-scheduling).

## Workflow 3: Inbound Message Routing

**Setup:** Configure webhook in Meta App → WhatsApp → Configuration → Webhook URL = your Make/n8n webhook, subscribe to "messages"

**Steps (n8n):**
1. **Webhook** → receives message (from, text, timestamp, message type)
2. **Switch** on message text (lowercase):
   - Contains "order" or "track" → **Shopify** lookup by phone → **WhatsApp** reply with order status
   - Contains "hours" or "open" → **WhatsApp** reply with hours (free-form, within 24h window)
   - Contains "human" or "agent" → **Slack** notify support + **WhatsApp** "Connecting you to a team member"
   - Default → **WhatsApp** menu: "Reply 1 for orders, 2 for hours, 3 for support"
3. **Google Sheets** → log every inbound for analytics

## Workflow 4: Lead Capture From Click-to-WhatsApp Ads

**Setup:** Meta ads with WhatsApp CTA → user messages you → webhook fires

**Steps (Make):**
1. Webhook → new inbound from unknown number
2. **HubSpot** → Search contact by phone
3. **Not found** → Create Contact (source: WhatsApp Ad, phone) + Create Deal
4. **WhatsApp** → Free-form welcome: "Thanks for reaching out! What are you looking for?" + quick reply buttons (Interactive message type)
5. **Slack** → #whatsapp-leads notification

## Workflow 5: Payment Reminders

**Steps (Make):**
1. **Stripe / QuickBooks** → Watch overdue invoices (daily)
2. **Filter:** customer has WhatsApp opt-in
3. **WhatsApp** → Send Template: payment_reminder ("Hi {{1}}, invoice {{2}} for {{3}} was due {{4}}. Pay here: {{5}}")
4. **Delay** 3 days → check paid → if not, second template with urgency
5. **HubSpot** → log reminder sent

See our [invoice processing automation guide](/blog/automate-invoice-processing).

## Workflow 6: Simple Chatbot With Buttons

WhatsApp supports Interactive Messages: buttons (up to 3) and lists (up to 10 options).

**Steps (n8n):**
1. Webhook → inbound "hi" or first message
2. **WhatsApp** → Send Interactive Message:
   - Body: "How can we help?"
   - Buttons: "Track Order", "Book Appointment", "Talk to Human"
3. Webhook → button reply (payload contains button ID)
4. **Switch** on button:
   - Track Order → ask for order number → lookup → reply
   - Book Appointment → send Calendly link
   - Talk to Human → Slack + acknowledge
5. Store conversation state in a Data Store (Make) or Sheet (n8n) for multi-turn flows

For more advanced chatbots, see our [chatbot customer support guide](/blog/automate-chatbot-customer-support).

## Compliance Rules

- **Opt-in required** for all business-initiated messages. Collect via checkout checkbox, form field, or in-chat consent. Store proof.
- **No cold outreach.** Marketing templates to non-opted-in numbers get your account banned.
- **Respect opt-out.** "STOP" must unsubscribe. Automate it: inbound "stop" → update CRM → never send again.
- **Quality rating.** Meta monitors block/report rates. Low quality = reduced sending limits.

See our [automation security best practices](/blog/automation-security-best-practices).

## Cost Reference (Meta Cloud API)

Conversation-based pricing, per 24-hour session, varies by country:
- Utility: $0.004-0.05
- Marketing: $0.01-0.12
- Service (user-initiated): free for first 1,000/month, then $0.003-0.03

A store sending 2,000 order updates monthly pays roughly $10-40.

## Can I automate WhatsApp messages for free?

Only basic auto-replies (greeting, away message) via the free WhatsApp Business App. Anything event-triggered (order updates, reminders, CRM-linked responses) requires the WhatsApp Business Platform API, which charges per conversation (roughly $0.005-0.10 depending on country and message category). The first 1,000 user-initiated service conversations per month are free. Combined with [Make](/blog/getting-started-with-make) (free tier) or self-hosted [n8n](/blog/getting-started-with-n8n), a small business can run WhatsApp automation for $5-30/month.

## How do I get WhatsApp Business API access?

Two paths: (1) Direct via Meta — create a Meta Business account, register an app at developers.facebook.com, add the WhatsApp product, verify your business, and add a phone number not currently on WhatsApp. Takes 1-3 days including verification. (2) Through a Business Solution Provider (Twilio, 360dialog, Wati) — they handle Meta setup and give you a dashboard; faster for non-technical teams but slightly higher per-message cost. [Make](/blog/getting-started-with-make) and [n8n](/blog/getting-started-with-n8n) connect to either path.

## What is a WhatsApp message template?

A template is a pre-approved message format required for business-initiated messages sent outside the 24-hour customer service window. You create templates in Meta Business Manager with placeholders ({{1}}, {{2}}) for dynamic values like name and order number, assign a category (Utility, Marketing, Authentication), and submit for approval — typically minutes to 24 hours. Once approved, your automation sends the template with variable values filled in. Free-form messages are only allowed within 24 hours of the customer's last message to you.
