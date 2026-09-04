---
title: "Mailchimp Automation Tutorial: Journeys & Integrations"
description: "Build Mailchimp Customer Journeys and connect Mailchimp to your CRM, store, and forms. Welcome series, abandoned cart, re-engagement, and tag-based flows."
date: "2026-09-03"
category: "how-to"
tags: ["Mailchimp", "email marketing", "tutorial", "customer journeys", "email automation"]
keywords: ["Mailchimp automation", "Mailchimp customer journey", "Mailchimp tutorial", "Mailchimp Zapier", "automate Mailchimp"]
featured: false
---

## Mailchimp's Automation Is Better Than Its Reputation

Mailchimp is often dismissed as "just a newsletter tool," but Customer Journeys — its automation builder — handles branching, tag-based triggers, conditional waits, and e-commerce events. Combined with external platforms for data flow in and out, Mailchimp runs a complete lifecycle marketing system for businesses under 50,000 contacts.

This tutorial builds four journeys and three integrations. Free plan supports basic single-email automations; Standard plan ($20/mo) unlocks multi-step journeys with branching.

## Customer Journeys Basics

**Access:** Mailchimp → Automations → Customer Journeys → Create Journey

**Structure:** Starting point (trigger) → Journey points (emails, waits, conditions, actions) → End

**Starting points:** Signs up via form, Tag added, Joins audience, Purchases product, Abandons cart, Date-based (birthday, anniversary), API call

**Journey points:** Send email, Wait (time or until condition), If/Else (branch on data), Add/Remove tag, Update contact field, Unsubscribe

## Journey 1: Welcome Series With Engagement Branch

**What it does:** New subscribers get 4 emails; engaged ones get a special offer, unengaged get a re-hook.

1. **Starting point:** Signs up via form → select your signup form
2. **Send email:** Welcome + deliver lead magnet (immediate)
3. **Wait:** 2 days
4. **Send email:** Your best content piece
5. **Wait:** 3 days
6. **Send email:** Customer story or case study
7. **Wait:** 2 days
8. **If/Else:** Contact opened email 3? (Engagement → Opened → specific campaign)
   - **Yes branch:** Send email "Special offer for engaged readers" → Add tag "engaged-subscriber"
   - **No branch:** Send email "Did we miss the mark?" with different content angle → Wait 4 days → If still no open → Add tag "low-engagement"
9. **End**

Free plan alternative: single welcome email only. See our [email sequences guide](/blog/how-to-build-email-sequences) for content templates.

## Journey 2: Tag-Based Product Interest Sequence

**What it does:** When a contact is tagged with a product interest (from a form, a CRM sync, or a click), they receive a targeted 3-email series.

1. **Starting point:** Tag added → "interest-automation" (create tags for each product line)
2. **Send email:** Deep dive on that product/topic
3. **Wait:** 3 days
4. **Send email:** Comparison or FAQ
5. **Wait:** 4 days
6. **If/Else:** Has tag "customer"? (already bought)
   - Yes → Remove tag "interest-automation" → End
   - No → Send email: limited offer → Wait 3 days → Remove tag → End

Build one journey per interest tag. Tags come from: form checkboxes, link clicks (Mailchimp can auto-tag on click), or external automation.

## Journey 3: E-commerce Abandoned Cart

Requires a connected store (Shopify, WooCommerce, BigCommerce native integration, or API).

1. **Starting point:** Abandons cart
2. **Wait:** 1 hour
3. **Send email:** "You left something behind" with cart contents (Mailchimp merges cart data automatically)
4. **Wait:** 23 hours
5. **If/Else:** Made a purchase?
   - Yes → End
   - No → Send email: "Still thinking?" with social proof
6. **Wait:** 2 days
7. **If/Else:** Purchased?
   - No → Send email: 10% discount code → End

## Journey 4: Re-Engagement and List Cleaning

1. **Starting point:** Date-based → Last engaged date is 90 days ago (uses Mailchimp's contact rating or custom "last_engaged" field)
2. **Send email:** "We miss you — here's what's new"
3. **Wait:** 5 days
4. **If/Else:** Opened?
   - Yes → Add tag "re-engaged" → End
   - No → Send email: "Should we stop emailing you?" with explicit stay/leave links
5. **Wait:** 5 days
6. **If/Else:** Clicked "stay"?
   - No → Unsubscribe (or Add tag "inactive" for manual review)

Regularly removing inactive contacts improves deliverability for everyone else.

## Integration 1: CRM to Mailchimp Sync

**What it does:** HubSpot/Pipedrive contacts sync to Mailchimp with lifecycle-stage tags.

**Steps (Make):**

1. **HubSpot** → **Watch Contacts** (updated)
2. **Mailchimp** → **Search Member** by email in your audience
3. **Router:**
   - Not found → **Mailchimp** → **Add/Update Subscriber** with email, name, and tag = {{lifecycle stage}}
   - Found → **Mailchimp** → **Add Tag** = current lifecycle stage → **Remove Tag** = previous stage
4. Result: Mailchimp segments always mirror CRM stages. Journeys trigger on tag changes.

## Integration 2: Form to Mailchimp With Custom Fields

For forms outside Mailchimp (Typeform, Tally, website forms):

**Steps (Zapier):**

1. **Trigger:** Typeform → New Entry
2. **Mailchimp** → **Add/Update Subscriber**:
   - Email, First Name, Last Name from form
   - Tags: map form answers to tags (e.g., "Industry: SaaS" → tag "industry-saas")
   - Custom merge fields: company, role, etc.
   - Status: subscribed (only if they explicitly opted in — otherwise use "pending" for double opt-in)

Create merge fields first: Audience → Settings → Audience fields and merge tags.

## Integration 3: Mailchimp Events to Slack and CRM

**What it does:** When a subscriber clicks a key link or a campaign performs poorly, notify the team.

Mailchimp has webhooks: Audience → Settings → Webhooks. Events: subscribe, unsubscribe, profile update, email change, campaign sent.

**Steps (Make):**

1. **Webhook** → receives Mailchimp unsubscribe event
2. **HubSpot** → Update Contact → Email Status: Unsubscribed
3. **Slack** → #marketing: "{{email}} unsubscribed. Reason: {{reason}}"

For click tracking → CRM: use Mailchimp's native HubSpot integration or poll Reports → Click Details via API.

## Segmentation for Targeted Journeys

Mailchimp segments combine conditions:
- **Engagement:** opened/clicked in last X campaigns
- **Tags:** has/does not have
- **Merge fields:** company size, location, signup source
- **E-commerce:** purchased product X, total spend, last order date
- **Journey status:** in/completed journey Y

Use segments as journey starting points (Standard plan) or as send filters for campaigns. Journeys + segments = personalized flows without manual list management.

## Mailchimp vs Dedicated Automation Platforms

| Mailchimp is enough when | Consider ActiveCampaign/ConvertKit when |
|---|---|
| Under 20 automation journeys | Complex multi-condition branching |
| Marketing email only | Sales CRM + email in one tool |
| E-commerce store connected | Lead scoring and deal pipelines |
| Simple tag-based logic | Visual automation with 50+ steps |

For deeper marketing automation, see our [email marketing automation guide](/blog/automate-email-marketing).

## Does Mailchimp have automation on the free plan?

Limited. The free plan (up to 500 contacts, 1,000 sends/month) includes single-step automations: welcome email on signup, birthday email, and basic abandoned cart (with connected store). Multi-step Customer Journeys with waits, branching, and conditions require the Standard plan ($20/month for 500 contacts). If you need multi-step sequences at no cost, ConvertKit's free tier (up to 10,000 subscribers as of 2024) offers visual automations, or use an [automation platform](/blog/best-automation-tools-small-business) to orchestrate Mailchimp sends with timing logic.

## How do I trigger a Mailchimp journey from another app?

Two methods: (1) Tag-based trigger — set the journey starting point to "Tag added," then use [Make](/blog/getting-started-with-make), [Zapier](/blog/getting-started-with-zapier), or n8n to add that tag when an event happens in your CRM, store, or form tool. (2) API trigger — Mailchimp's "Customer Journeys API" starting point accepts a POST request with the subscriber email; call it from any automation platform's HTTP module. Tag-based is simpler and works on Standard plan; API triggers offer more control. Both let external events start Mailchimp sequences.

## Can Mailchimp sync with my CRM automatically?

Yes. Mailchimp has native integrations with HubSpot, Salesforce, Pipedrive, and Zoho that sync contacts bidirectionally. For other CRMs or custom field mapping, use [Zapier](/blog/getting-started-with-zapier) or [Make](/blog/getting-started-with-make): watch for CRM contact changes, search Mailchimp by email, then add/update the subscriber with tags matching CRM lifecycle stages. This keeps Mailchimp segments aligned with sales pipeline stages so marketing sequences match where each contact is in the buying process. See our [CRM automation guide](/blog/automate-crm-workflows).
