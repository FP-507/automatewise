---
title: "ActiveCampaign Automation Tutorial: Lead Scoring to Sales"
description: "Build ActiveCampaign automations for lead scoring, deal pipelines, behavioral triggers, and sales handoff. Step-by-step with real workflow examples."
date: "2026-09-03"
category: "how-to"
tags: ["ActiveCampaign", "marketing automation", "tutorial", "lead scoring", "CRM"]
keywords: ["ActiveCampaign automation", "ActiveCampaign tutorial", "ActiveCampaign lead scoring", "ActiveCampaign workflows", "ActiveCampaign automation examples"]
featured: false
---

## ActiveCampaign Is Marketing Automation and CRM in One Builder

Most email tools stop at sending sequences. ActiveCampaign adds lead scoring, deal pipelines, site tracking, and conditional logic that responds to what contacts actually do — pages visited, links clicked, deals moved, forms submitted. The automation builder is the most capable in its price range ($29+/month).

This tutorial builds five automations that together form a complete lead-to-customer system.

## Automation Builder Basics

**Access:** Automations → Create an automation → Start from scratch

**Triggers:** Subscribes to list, Tag added, Submits form, Opens/clicks email, Visits web page, Deal stage changes, Score changes, Date-based, Webhook, Event tracking

**Actions:** Send email, Wait, If/Else, Goal, Add/Remove tag, Update field, Adjust score, Create/Update deal, Move deal stage, Notify (internal email), Webhook, Start/End another automation

**Goals:** A unique feature — when a contact meets a goal condition anywhere in the automation, they jump to the goal step. Use for "purchased" or "booked a call" to exit nurture immediately.

## Automation 1: Lead Scoring Engine

**What it does:** Assigns points based on behavior; high scores trigger sales outreach.

**Setup lead scoring:** Contacts → Manage Scoring → Create Score "Lead Score"

**Rules (add points):**
- Opens email: +1
- Clicks email link: +3
- Visits pricing page: +10 (requires site tracking code installed)
- Visits any page 3+ times in a week: +5
- Submits demo form: +25
- Has tag "webinar-attended": +15
- Company size field > 50: +10

**Rules (subtract points):**
- No email open in 30 days: -10
- Unsubscribes: -50

**Automation trigger:** Score "Lead Score" is above 40

**Steps:**
1. Trigger: Score changes → Lead Score above 40
2. If/Else: Has tag "sales-contacted"?
   - Yes → End (already handled)
   - No → continue
3. Add tag "MQL" (Marketing Qualified Lead)
4. Create deal → Pipeline: Sales, Stage: New Lead, Owner: round-robin or by territory
5. Notify → email to sales owner: "{{contact.first_name}} hit score {{contact.score}}. Recent activity: {{tracking summary}}"
6. Add tag "sales-contacted"
7. End

## Automation 2: Behavioral Nurture With Goals

**What it does:** Nurture sequence that exits early when the contact converts.

1. Trigger: Tag added "lead-magnet-downloaded"
2. **Goal (placed at the end):** Has tag "customer" OR Deal stage = Won → jumps here from anywhere
3. Send email 1: deliver lead magnet
4. Wait 2 days
5. Send email 2: educational content
6. If/Else: Visited pricing page (site tracking)?
   - Yes → Adjust score +10 → Send email: "Questions about pricing?" → Wait 1 day
   - No → continue
7. Wait 3 days
8. Send email 3: case study
9. Wait 3 days
10. Send email 4: offer
11. Wait 5 days
12. Send email 5: last call
13. Add tag "nurture-completed"
14. **Goal:** "Converted" → Remove tag "in-nurture" → End

Contacts who become customers at any point skip straight to the goal — no more nurture emails after purchase.

## Automation 3: Deal Pipeline Automation

**What it does:** Deal stage changes trigger tasks, emails, and follow-ups.

**Pipeline stages:** New Lead → Contacted → Demo Scheduled → Proposal Sent → Negotiation → Won/Lost

**Automation A — Demo Scheduled:**
1. Trigger: Deal stage changes to "Demo Scheduled"
2. Send email to contact: demo prep + what to expect
3. Add task to deal owner: "Prepare demo for {{deal.title}}" due 1 day before demo date
4. Wait until 1 hour before demo (using deal custom date field)
5. Send email: reminder with link
6. Wait 2 hours after demo time
7. Add task: "Send demo follow-up" due today

**Automation B — Proposal Sent:**
1. Trigger: Deal stage changes to "Proposal Sent"
2. Wait 3 days
3. If/Else: Deal stage still "Proposal Sent"?
   - Yes → Send email: "Any questions on the proposal?" → Add task: "Follow up call"
4. Wait 4 days
5. If/Else: still "Proposal Sent"?
   - Yes → Notify owner: "Proposal for {{deal.title}} stalled 7 days" → Move to "At Risk" stage

**Automation C — Won:**
1. Trigger: Deal stage changes to "Won"
2. Add tag "customer", remove tag "MQL"
3. Start automation: "Customer Onboarding"
4. Webhook → your automation platform → create project, invoice, Slack celebration
5. End all other automations for this contact (Actions → End other automations)

See our [sales pipeline automation guide](/blog/build-automated-sales-pipeline).

## Automation 4: Site Tracking Triggers

**Setup:** Settings → Tracking → Site Tracking → add domain → install the script on your site.

**What it does:** Respond to specific page visits.

**Automation — Pricing Page Interest:**
1. Trigger: Visits web page → URL contains "/pricing"
2. If/Else: Visited pricing 2+ times in last 7 days?
   - No → Adjust score +5 → End
   - Yes → continue
3. If/Else: Has open deal?
   - Yes → Notify deal owner: "{{contact}} viewing pricing again"
   - No → Send email: "Comparing options? Here's a guide" → Adjust score +15

**Automation — Feature Page Interest:**
1. Trigger: Visits web page → URL contains "/features/integrations"
2. Add tag "interest-integrations"
3. Start automation: "Integrations Nurture" (separate 3-email sequence about that feature)

## Automation 5: Re-Engagement and Cleanup

1. Trigger: Date-based → 60 days since last engagement (custom field updated by engagement automations, or use "Contact has not opened any campaign in 60 days" condition)
2. Send email: "Still interested?"
3. Wait 4 days
4. If/Else: Opened or clicked?
   - Yes → Update field "last_engaged" = today → Adjust score +5 → End
   - No → Send email: "One-click to stay subscribed"
5. Wait 4 days
6. If/Else: Clicked stay link (tag "stay-subscribed" added via link action)?
   - No → Unsubscribe from list → Add tag "churned-unengaged"

## Integrating With External Tools

ActiveCampaign has 900+ native integrations plus webhooks in both directions.

**Inbound (external → AC):** Use [Make](/blog/getting-started-with-make) or [Zapier](/blog/getting-started-with-zapier) to create contacts, add tags, or update fields when events happen in your store, calendar, or forms. Tags are the universal trigger — add a tag externally, start an automation internally.

**Outbound (AC → external):** Webhook action in any automation sends contact + deal data to your automation platform. Common uses: create Slack alert, add row to Google Sheets, create project in Notion, generate invoice.

**Example:** Deal Won → Webhook → Make → [create onboarding tasks](/blog/automate-customer-onboarding), send to accounting, notify team.

## Does ActiveCampaign have a free plan?

No. ActiveCampaign offers a 14-day free trial but no permanent free tier. Plans start at $29/month (Starter, 1,000 contacts, basic automation), $49/month (Plus, adds CRM and lead scoring), and $79/month (Pro, adds site tracking, predictive sending, and split automations). For businesses needing sales CRM + marketing automation in one tool, the Plus plan is the entry point. If budget is the constraint, Mailchimp (free tier) or ConvertKit (free up to 10,000 subscribers) cover basic sequences without CRM features.

## What is lead scoring in ActiveCampaign?

Lead scoring assigns points to contacts based on behavior and attributes: email opens, link clicks, page visits, form submissions, custom field values, and tags. You define the rules (e.g., +10 for visiting pricing, +25 for demo request, -10 for 30 days inactivity). When a contact's score crosses a threshold, an automation triggers — typically creating a deal, tagging as MQL, and notifying sales. Scoring turns passive email lists into prioritized sales queues. Available on Plus plan and above.

## How does ActiveCampaign compare to HubSpot?

ActiveCampaign is stronger in automation depth and price for small businesses: its builder handles more complex branching, goals, and behavioral triggers at $29-79/month. [HubSpot](/blog/hubspot-automation-guide) offers a generous free CRM but its comparable automation features (workflows, lead scoring, sequences) require Marketing Hub Professional at $800+/month. Choose ActiveCampaign for automation-heavy marketing with lightweight CRM needs; choose HubSpot if you want a free CRM foundation and plan to grow into its full platform. See our [CRM comparison](/blog/best-crm-for-small-business).
