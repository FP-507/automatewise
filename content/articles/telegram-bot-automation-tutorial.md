---
title: "Telegram Bot Automation Tutorial (No Code)"
description: "Build Telegram bots without code: alerts, command responses, group management, and personal automation assistants using BotFather and no-code platforms."
date: "2026-09-03"
category: "how-to"
tags: ["Telegram", "bots", "tutorial", "messaging", "personal automation"]
keywords: ["Telegram bot automation", "Telegram bot no code", "create Telegram bot", "Telegram automation tutorial", "Telegram bot Make n8n"]
featured: false
---

## Telegram Is the Easiest Platform to Build a Bot On

Creating a Telegram bot takes 30 seconds: message @BotFather, pick a name, get a token. No app review, no business verification, no template approval. The Bot API is free, unlimited, and works instantly with [n8n](/blog/getting-started-with-n8n), [Make](/blog/getting-started-with-make), and [Zapier](/blog/getting-started-with-zapier).

This makes Telegram ideal for personal automation assistants, team alerts, and lightweight customer-facing bots. This tutorial builds six.

## Create Your Bot

1. Open Telegram, search **@BotFather**, start a chat
2. Send `/newbot`
3. Choose a display name (e.g., "My Ops Assistant")
4. Choose a username ending in "bot" (e.g., `myops_assistant_bot`)
5. BotFather replies with your **API token** — copy it
6. Optional: `/setdescription`, `/setuserpic`, `/setcommands` to define a command menu

**Get your Chat ID:** Message your bot anything, then open `https://api.telegram.org/bot{TOKEN}/getUpdates` in a browser — find `"chat":{"id":123456789}`. You need this to send messages to yourself.

## Automation 1: Personal Alert Channel

**What it does:** Any event you care about pings your phone via Telegram.

**Steps (Make):**
1. Trigger: anything — Gmail from VIP sender, Stripe payment, Google Calendar event in 15 min, RSS keyword match, website uptime failure
2. **Telegram Bot** → **Send a Text Message**
   - Connection: paste bot token
   - Chat ID: your ID
   - Text: formatted with Markdown (`*bold*`, `_italic_`, `[link](url)`)
   - Parse mode: Markdown

Telegram notifications arrive faster and more reliably than email, with no cost.

## Automation 2: Command-Response Bot

**What it does:** Send `/status`, `/sales`, `/tasks` and get live data back.

**Steps (n8n):**
1. **Telegram Trigger** → On Message (set webhook automatically)
2. **Switch** on `{{ $json.message.text }}`:
   - `/sales` → **Google Sheets** read today's revenue → **Telegram** send "Today: $X, MTD: $Y"
   - `/tasks` → **Notion** query tasks due today → format list → send
   - `/status` → **HTTP** check server health → send "All systems operational" or errors
   - `/help` → send command list
   - Default → "Unknown command. Try /help"

Register commands in BotFather with `/setcommands` so they appear as a menu:
```
sales - Today's revenue
tasks - Tasks due today
status - System health
help - Show commands
```

## Automation 3: Quick Capture to Notion/Sheets

**What it does:** Text your bot a thought, expense, or task — it files it automatically.

**Steps (n8n):**
1. **Telegram Trigger** → On Message
2. **Filter:** message does not start with "/"
3. **Switch** on prefix:
   - Starts with "$" → parse amount and description → **Google Sheets** expenses
   - Starts with "todo " → **Notion** create task
   - Starts with "note " → **Notion** append to daily journal
   - Contains a URL → **Notion** save to reading list with title fetched via HTTP
   - Default → **Notion** inbox
4. **Telegram** → reply "Saved to {{destination}}" with a ✓

**Bonus:** Voice messages — Telegram Trigger receives file ID → **Telegram** Get File → **OpenAI** Whisper transcribe → same routing.

## Automation 4: Group Moderation and Welcome

**Setup:** Add bot to a group, make it admin (for delete/restrict permissions). BotFather → `/setprivacy` → Disable so the bot sees all messages.

**Steps (n8n):**
1. **Telegram Trigger** → On Message, Chat type = group
2. **Switch:**
   - `new_chat_members` present → **Telegram** send "Welcome {{name}}! Rules: ..." → optional: restrict until they press a "I agree" button (inline keyboard)
   - Message contains blacklisted words or links from new members → **Telegram** Delete Message + warn
   - `left_chat_member` → log to Sheet
3. **Scheduled:** daily → **Telegram** send summary "X new members, Y messages today" to admin

## Automation 5: Interactive Buttons (Inline Keyboards)

**What it does:** Approval flows and choices via buttons instead of typing.

**Steps (Make):**
1. Trigger: New expense report submitted (form)
2. **Telegram** → Send Message to manager:
   - Text: "Expense: $500 — Conference ticket — @employee"
   - Reply Markup (inline keyboard JSON):
   ```json
   {"inline_keyboard":[[{"text":"✅ Approve","callback_data":"approve_123"},{"text":"❌ Reject","callback_data":"reject_123"}]]}
   ```
3. **Telegram Trigger** → Callback Query
4. **Router** on callback_data:
   - approve_* → Google Sheets update status → Telegram edit message "Approved ✅" → notify employee
   - reject_* → same with Rejected

## Automation 6: Content Broadcast Channel

**What it does:** Publish to a Telegram Channel (one-to-many broadcast) automatically.

**Setup:** Create a Channel, add bot as admin.

**Steps (Make):**
1. **RSS** → new blog post / **WordPress** → post published / **YouTube** → new video
2. **Telegram Bot** → Send Photo (or Send Message) to channel `@yourchannel`
   - Caption: title + summary + link
   - Photo: featured image URL
3. Optional: **Delay** and repost to group with discussion prompt

For content distribution patterns, see our [social media automation guide](/blog/automate-social-media-posting).

## Telegram Bot API Quick Reference

Base: `https://api.telegram.org/bot{TOKEN}/`

| Method | Purpose |
|--------|---------|
| `sendMessage` | Text with Markdown/HTML, chat_id required |
| `sendPhoto` / `sendDocument` | Media with caption |
| `editMessageText` | Update a sent message (for status changes) |
| `answerCallbackQuery` | Acknowledge button press |
| `getUpdates` | Poll for messages (or use webhook) |
| `setWebhook` | Push updates to your URL |
| `restrictChatMember` | Mute in groups |
| `deleteMessage` | Remove message |

Automation platforms wrap these into modules; HTTP Request works for anything not covered.

## Webhook vs Polling

- **n8n Telegram Trigger** sets a webhook automatically — instant, efficient
- **Make Telegram "Watch Updates"** polls — 1-15 minute delay, uses operations
- **Zapier** polls

For interactive bots (commands, buttons), use n8n or a webhook-based setup. For send-only alerts, polling is irrelevant.

## Telegram vs WhatsApp for Automation

| Telegram | WhatsApp |
|---|---|
| Free, instant bot creation | Business API, verification, per-message cost |
| No template approval | Templates required for outbound |
| Channels for broadcast | Broadcast lists limited |
| Best for: personal, teams, tech communities | Best for: customer-facing in WhatsApp-dominant markets |

See our [WhatsApp Business automation guide](/blog/whatsapp-business-automation) for the customer-facing side.

## Is the Telegram Bot API free?

Yes, completely. There are no fees, no message limits for normal use (rate limits exist: ~30 messages/second overall, 20/minute to the same group), and no approval process. Create a bot via @BotFather in seconds and start sending. This makes Telegram the cheapest messaging channel for automation — pair it with self-hosted [n8n](/blog/getting-started-with-n8n) and the total cost is zero. The only constraint is that recipients must have Telegram and must start a conversation with your bot first (bots cannot message users who have not messaged them).

## How do I get my Telegram chat ID?

Message your bot (or add it to a group and send a message there), then open `https://api.telegram.org/bot<YOUR_TOKEN>/getUpdates` in a browser. The JSON response includes `"chat":{"id":123456789,...}` — that number is the chat ID. Group IDs are negative (e.g., -100123456789). Alternatively, message @userinfobot or @getidsbot on Telegram to get your personal ID. In [n8n](/blog/getting-started-with-n8n), the Telegram Trigger node shows the chat ID in its output, so you can grab it from the first test message.

## Can a Telegram bot read messages in a group?

By default, bots in groups only see commands (messages starting with /) and messages that mention them, due to Privacy Mode. To see all messages, either make the bot a group admin or disable Privacy Mode via @BotFather → /setprivacy → Disable (then remove and re-add the bot to the group). Once it sees all messages, use [n8n](/blog/getting-started-with-n8n)'s Telegram Trigger to react to keywords, links, new members, or any content for moderation, logging, or auto-responses.
