---
title: "Typeform Automation Tutorial: Forms That Trigger Workflows"
description: "Turn Typeform submissions into automated workflows. Lead routing, conditional follow-ups, CRM sync, scoring, and multi-tool integrations."
date: "2026-09-03"
category: "how-to"
tags: ["Typeform", "forms", "tutorial", "lead capture", "form automation"]
keywords: ["Typeform automation", "Typeform integrations", "Typeform Zapier", "automate Typeform responses", "Typeform workflows"]
featured: false
---

## A Form Submission Is a Trigger, Not an Endpoint

Most teams collect Typeform responses in a spreadsheet and process them manually. The submission is where automation should begin: route to the right person, create the CRM record, score the lead, start the follow-up sequence, notify the team — all within seconds of the respondent clicking Submit.

This tutorial builds six automation workflows around Typeform. You need a Typeform account (free plan supports 10 responses/month; Basic at $29/month for 100) and an automation platform.

## Typeform Native Integrations

Typeform's Connect panel (form → Connect) offers direct integrations with Google Sheets, Slack, HubSpot, Mailchimp, Notion, Airtable, and 100+ apps. These are one-to-one: form → app. For multi-step logic, use external automation.

**Native webhook:** Connect → Webhooks → Add webhook → paste your automation platform's URL. Fires on every submission with the full response payload.

## Workflow 1: Lead Routing by Answer

**Form:** Contact Us with fields: Name, Email, Company, Interest (dropdown: Sales, Support, Partnership), Message

**Steps ([Make](/blog/getting-started-with-make)):**
1. **Typeform** → **Watch Responses** (or Webhook)
2. **Router:**
   - Interest = Sales → **HubSpot** Create Contact + Create Deal → **Slack** #sales
   - Interest = Support → **Zendesk/Freshdesk** Create Ticket → **Slack** #support
   - Interest = Partnership → **Notion** Add to Partnerships DB → **Gmail** to partnerships lead
3. All paths: **Gmail** → auto-reply confirming receipt with expected response time

## Workflow 2: Lead Scoring on Submission

**Form:** Demo Request with: Email, Company Size (dropdown), Role (dropdown), Timeline (dropdown), Budget (dropdown)

**Steps (Make):**
1. Typeform → Watch Responses
2. **Set Variable** "score" = 0
3. **Set Variable** additions (using Make's math functions):
   - Company Size 51-200: +20; 200+: +30
   - Role contains "Director" or "VP" or "C": +15
   - Timeline "This month": +25; "This quarter": +15
   - Budget over 10k: +20
4. **Router:**
   - score ≥ 60 → HubSpot Create Contact (Lead Status: Hot) + Slack DM to senior rep + Calendly booking email
   - score 30-59 → HubSpot Create Contact (Warm) + ActiveCampaign nurture sequence
   - score < 30 → HubSpot Create Contact (Cold) + newsletter list only

Typeform also has native "Score" via Logic → Calculator variable, which can be passed in the payload — simpler if scoring rules are static.

## Workflow 3: Conditional Follow-Up Email

**What it does:** Different email based on answers, sent from a real inbox.

**Steps (Make):**
1. Typeform → Watch Responses
2. **Router by "What's your biggest challenge?" answer:**
   - "Too much manual work" → Gmail send template A with automation case study
   - "Disconnected tools" → Gmail send template B with integration guide
   - "Reporting" → Gmail send template C with dashboard guide
3. Each: **Delay** 2 days → Gmail follow-up "Did the resource help?"
4. **HubSpot** → Add note with challenge answer for sales context

See our [follow-up email automation guide](/blog/automate-follow-up-emails).

## Workflow 4: Survey Results to Dashboard

**Form:** Customer Satisfaction (NPS 0-10, What could we improve?, Would you recommend?)

**Steps (Make):**
1. Typeform → Watch Responses
2. **Google Sheets** → Add Row: date, email, NPS, feedback, recommend
3. **Router:**
   - NPS ≤ 6 (Detractor) → Slack #customer-alerts "Detractor: {{email}} — {{feedback}}" + HubSpot Create Task for CSM
   - NPS 9-10 (Promoter) → Gmail "Thanks! Would you leave a review?" with G2/Google review link + HubSpot tag "promoter"
4. **Google Sheets** dashboard tab: NPS formula = (% promoters - % detractors)

See our [customer feedback automation guide](/blog/automate-customer-feedback).

## Workflow 5: Event Registration With Capacity

**Form:** Webinar Registration (Name, Email, Company, Session choice)

**Steps (Make):**
1. Typeform → Watch Responses
2. **Google Sheets** → Search Rows: count registrations for chosen session
3. **Router:**
   - Count < 100 → Google Sheets Add Row + Zoom/Calendar add attendee + Gmail confirmation with calendar invite
   - Count ≥ 100 → Google Sheets Add to Waitlist tab + Gmail "Session full, you're on the waitlist"
4. **Delay** until 1 day before → Gmail reminder to all confirmed

See our [event registration automation guide](/blog/automate-event-registration).

## Workflow 6: Application Review Pipeline

**Form:** Job Application (Name, Email, Resume upload, Portfolio URL, Years experience, Why us?)

**Steps (Make):**
1. Typeform → Watch Responses
2. **HTTP** → Download resume file (Typeform provides a file URL)
3. **Google Drive** → Upload to "Applications/{{role}}" folder
4. **OpenAI** → Summarize resume and rate fit 1-10 against job description
5. **Airtable/Notion** → Create record: applicant details, resume link, AI score, status = New
6. **Router:**
   - AI score ≥ 7 → Slack #hiring "Strong candidate: {{name}}" + Gmail "Thanks, we'll be in touch within 3 days"
   - Otherwise → Gmail "Thanks for applying" (polite hold)

See our [HR onboarding automation guide](/blog/automation-for-hr-onboarding).

## Typeform Logic and Hidden Fields

**Logic Jumps:** Show different questions based on answers. Set up in Typeform → Logic. Reduces form length and improves completion.

**Hidden Fields:** Pass data via URL parameters (`typeform.com/to/abc123#source=linkedin&campaign=q4`). These appear in the response payload — use them for attribution routing in automation.

**Calculator:** Assign scores to answers within Typeform. The total is available as a variable in the payload — simpler than computing in Make for static scoring.

## Response Payload Reference

Typeform webhook payload structure:
```
form_response.answers[] → each has field.id, field.ref, type, and value (text/email/number/choice.label/file_url)
form_response.hidden → hidden field values
form_response.calculated.score → calculator result
form_response.submitted_at
```

In Make/Zapier, answers are flattened to their question titles for easy mapping.

## Typeform vs Alternatives

| Typeform | Tally | Google Forms |
|---|---|---|
| Best UX, conversational | Free unlimited, Notion-like | Free, basic |
| $29+/mo for 100 responses | Free; $29/mo Pro | Free |
| 100+ native integrations | Webhooks + Zapier/Make | Sheets only + Apps Script |

For budget-conscious teams, Tally offers most Typeform features free. See our [Google Forms automation guide](/blog/google-forms-automation) for the free alternative.

## How do I connect Typeform to other apps?

Three options: (1) Native Connect panel (form → Connect) for direct one-to-one integrations with Google Sheets, Slack, HubSpot, Mailchimp, Notion, and 100+ apps — fastest for simple use. (2) Webhooks (Connect → Webhooks) to push every response to [Make](/blog/getting-started-with-make), [Zapier](/blog/getting-started-with-zapier), or [n8n](/blog/getting-started-with-n8n) for multi-step logic. (3) Polling triggers in those platforms (Typeform → Watch Responses) if you prefer not to set up webhooks. Webhooks are instant; polling checks every 15 minutes.

## Can Typeform score responses automatically?

Yes, two ways. Typeform's built-in Calculator (Logic → Add calculation) assigns points to answers and totals them — the score is included in the response payload and can drive Logic Jumps within the form (show different ending based on score). For dynamic scoring that references external data (CRM history, company enrichment), compute the score in your automation platform after submission. Use the score to route: high scores to sales immediately, medium to nurture, low to newsletter. See our [lead generation automation guide](/blog/automate-lead-generation).

## Is Typeform free?

Typeform's free plan allows 10 responses per month with unlimited forms — enough for testing, not production. Basic ($29/month) allows 100 responses, Plus ($59) allows 1,000, Business ($99) allows 10,000. All paid plans include integrations and webhooks. For higher volume at lower cost, Tally (free unlimited responses) or Google Forms (free) with an [automation platform](/blog/best-automation-tools-small-business) handle the same workflows, though with less polished respondent experience.
