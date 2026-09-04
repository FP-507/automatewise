---
title: "Pipedrive Automation Tutorial: Sales Workflows on Autopilot"
description: "Build Pipedrive automations for lead routing, deal stage actions, follow-up sequences, and activity scheduling. Native workflow builder plus external integrations."
date: "2026-09-03"
category: "how-to"
tags: ["Pipedrive", "CRM", "sales automation", "tutorial", "deal pipeline"]
keywords: ["Pipedrive automation", "Pipedrive workflow automation", "Pipedrive tutorial", "automate Pipedrive", "Pipedrive Zapier"]
featured: false
---

## Pipedrive Is Built Around One Question: What Is the Next Action?

Pipedrive's philosophy is activity-based selling — every deal should always have a scheduled next activity. Its native Workflow Automation enforces that: when a deal moves stages, activities get created, emails get sent, and fields get updated without the rep lifting a finger.

This tutorial builds seven native workflows and three external integrations. Workflow Automation is available on Advanced plan ($34/user/month) and above.

## Workflow Automation Basics

**Access:** Settings (gear) → Tools and apps → Automations → Add automation

**Structure:** Trigger → Conditions → Actions (sequential)

**Triggers:** Deal created/updated/deleted, Person created/updated, Organization created/updated, Activity created/updated/completed, Lead created/updated, Deal stage changed, Deal won/lost

**Conditions:** Any field equals/contains/greater than, Stage, Pipeline, Owner, Custom fields

**Actions:** Create activity, Create deal, Update deal/person/org, Send email (template), Add note, Change owner, Add to sequence (Campaigns add-on), Webhook, Delay (wait X time)

## Workflow 1: New Lead Qualification Activity

- Trigger: Deal created
- Conditions: Pipeline = Sales, Stage = Lead In
- Actions:
  1. Create activity: Call, due in 1 business day, assigned to deal owner, subject "Qualify {{deal.title}}"
  2. Send email template "Thanks for your interest" to person
  3. Add note: "Auto-qualification activity created"

## Workflow 2: Stage Progression Actions

**Stages:** Lead In → Contacted → Demo Scheduled → Proposal Sent → Negotiation → Won

- Trigger: Deal stage changed to **Contacted** → Action: Create activity "Schedule demo" due in 3 days
- Trigger: Stage changed to **Demo Scheduled** → Actions: Create activity "Demo" on custom field "Demo Date", Send email "Demo confirmation" template, Create activity "Send demo follow-up" due day after demo
- Trigger: Stage changed to **Proposal Sent** → Actions: Update field "Proposal Sent Date" = today, Create activity "Follow up on proposal" due in 3 days
- Trigger: Stage changed to **Negotiation** → Action: Change owner to sales manager (if deal value > 50,000), Create activity "Prepare contract"

## Workflow 3: Stalled Deal Alerts

Pipedrive has native "rotting" indicators (deal turns red after X days in stage). Add automation:

- Trigger: Deal updated
- Condition: Days in current stage > 14 AND Status = Open
- Actions:
  1. Add note "Stalled — 14+ days in {{stage}}"
  2. Create activity "Re-engage or close" due today
  3. Send email to owner (internal): "Deal {{title}} stalled"

## Workflow 4: Won Deal Handoff

- Trigger: Deal won
- Actions:
  1. Update person: Custom field "Customer Since" = today, Label = Customer
  2. Create activity "Onboarding kickoff" assigned to customer success, due in 2 days
  3. Send email template "Welcome aboard" to person
  4. Webhook → external platform (invoice, project creation, Slack)
  5. Add note with won reason if captured

## Workflow 5: Lost Deal Nurture

- Trigger: Deal lost
- Conditions: Lost reason = "Timing" OR "Budget"
- Actions:
  1. Update person: Label = "Nurture"
  2. Delay: 90 days
  3. Create deal: same title + " (Re-engage)", Stage = Lead In, Owner = original owner
  4. Create activity "Re-engagement call" due in 2 days

Deals lost for "Not a fit" or "Competitor" skip this — different nurture path or none.

## Workflow 6: Activity Completion Chain

- Trigger: Activity completed
- Condition: Activity type = Call, Subject contains "Qualify"
- Actions:
  1. Update deal: Stage = Contacted (if outcome positive — use a custom field or note keyword)
  2. Create activity "Send follow-up email" due today

Chaining activities ensures the "next action" is always scheduled.

## Workflow 7: Round-Robin Lead Assignment

Native round-robin is not built in, but approximate with:

- Trigger: Lead created (Leads Inbox)
- Condition: Source = "Website"
- Actions: Change owner based on a rotating custom field, or use Pipedrive's Lead assignment rules (Settings → Leads → Assignment) which support round-robin on Professional plan

For true round-robin with load balancing, route through external automation (below).

## External Integration 1: Website Form to Pipedrive With Enrichment

**Steps ([Make](/blog/getting-started-with-make)):**
1. Trigger: Typeform / Tally / Webflow form submission
2. **Pipedrive** → **Search Persons** by email
3. Router:
   - Not found → Create Person (name, email, phone, custom fields from form)
   - Found → Update Person
4. **HTTP** → Enrichment API (Clearbit, Apollo) → company size, industry
5. **Pipedrive** → Create Organization (if not exists) with enriched data
6. **Pipedrive** → Create Deal: title "{{company}} — {{product interest}}", Value from form, Stage Lead In, Person and Org linked
7. **Slack** → #new-leads notification

Native Pipedrive workflows take over from here (Workflow 1).

## External Integration 2: Calendar Booking to Deal Stage

**Steps (Make):**
1. Trigger: Calendly Invitee Created (event type = Demo)
2. **Pipedrive** → Search Deals by person email, status open
3. **Pipedrive** → Update Deal: Stage = Demo Scheduled, Custom field "Demo Date" = booking time
4. Native workflow 2 fires (confirmation email, follow-up activity)

See our [Calendly automation tutorial](/blog/calendly-automation-tutorial).

## External Integration 3: Won Deal to Invoicing and Project

**Steps (Make, triggered by Pipedrive webhook from Workflow 4):**
1. Webhook receives deal data
2. **Pipedrive** → Get Deal (full details, products, person, org)
3. **QuickBooks / Stripe** → Create Invoice with deal products and value
4. **Notion / Asana** → Create project from template, name = deal title, client = org
5. **Google Drive** → Create folder "{{org}} — {{deal}}"
6. **Slack** → #wins: "Deal won: {{title}} — {{value}} by {{owner}}"

See our [customer onboarding automation guide](/blog/automate-customer-onboarding).

## Pipedrive Campaigns (Email Sequences)

The Campaigns add-on ($16/user/month) adds email marketing and sequences inside Pipedrive:
- Trigger sequences from workflow automation ("Add to sequence" action)
- Track opens/clicks on deal timeline
- Stop sequence automatically when person replies

For deeper email automation, sync Pipedrive to [ActiveCampaign](/blog/activecampaign-automation-tutorial) or [Mailchimp](/blog/mailchimp-automation-tutorial) via native integrations.

## Email Sync and Smart Contact Data

Beyond workflows, enable:
- **Email sync** (Settings → Email sync): logs all email to deal timelines, enables email templates and tracking
- **Smart Contact Data** (Professional+): auto-enriches persons with LinkedIn, company data
- **Scheduler**: built-in booking links that create activities on booking

For comparison with other CRMs, see our [CRM comparison](/blog/best-crm-for-small-business) and [CRM workflow automation guide](/blog/automate-crm-workflows).

## Does Pipedrive have workflow automation?

Yes, on the Advanced plan ($34/user/month) and above. Pipedrive Workflow Automation lets you build trigger-condition-action sequences: when a deal changes stage, create activities, send email templates, update fields, change owners, add notes, wait for delays, and send webhooks. Essential plan ($14/user) does not include automation. The Advanced plan includes 30 active automations per user; Professional ($49/user) allows 60; Enterprise offers 180. For teams needing automation on a tighter budget, [HubSpot's free CRM](/blog/hubspot-automation-guide) with external tools is an alternative.

## How do I automate follow-ups in Pipedrive?

Use Workflow Automation triggered by deal stage changes or activity completion: "When deal enters Proposal Sent, create activity 'Follow up' due in 3 days" and "When that activity is completed, create the next follow-up activity due in 5 days." For email follow-ups, use the Send Email action with templates, or the Campaigns add-on for multi-step sequences that stop when the prospect replies. Pair with "rotting" alerts (deals turning red after X inactive days) and stalled-deal automations to catch anything that slips. See our [follow-up automation guide](/blog/automate-follow-up-emails).

## Can Pipedrive integrate with Zapier and Make?

Yes. [Zapier](/blog/getting-started-with-zapier) and [Make](/blog/getting-started-with-make) have comprehensive Pipedrive modules: triggers (new deal, deal stage updated, deal won/lost, new person, activity completed) and actions (create/update/search deals, persons, organizations, activities, notes). Connect via API token (Pipedrive → Settings → Personal preferences → API). Pipedrive also has a native Marketplace with 400+ app integrations and supports outbound webhooks (Settings → Tools → Webhooks) that fire instantly on deal, person, or activity events — useful for triggering [n8n](/blog/getting-started-with-n8n) or Make workflows without polling.
