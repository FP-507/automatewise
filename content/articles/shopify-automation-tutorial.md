---
title: "Shopify Automation Tutorial: Flow + External Workflows"
description: "Automate your Shopify store with Shopify Flow and external tools. Order tagging, inventory alerts, customer segmentation, fulfillment, and marketing."
date: "2026-09-03"
category: "how-to"
tags: ["Shopify", "e-commerce", "tutorial", "Shopify Flow", "store automation"]
keywords: ["Shopify automation", "Shopify Flow tutorial", "automate Shopify store", "Shopify Zapier", "Shopify workflows"]
featured: false
---

## Shopify Flow Handles the Store. External Automation Handles Everything Else.

Shopify has two automation layers. Shopify Flow (free on all plans since 2023) automates actions inside Shopify — tagging orders, hiding out-of-stock products, flagging risky orders. External platforms like [Make](/blog/getting-started-with-make), [Zapier](/blog/getting-started-with-zapier), and [n8n](/blog/getting-started-with-n8n) connect Shopify to your CRM, accounting, support desk, and marketing tools.

This tutorial covers both. Start with Flow for internal logic, add external automation for cross-tool workflows.

## Shopify Flow Basics

**Access:** Shopify Admin → Apps → Shopify Flow (install if not present, it is free)

**Structure:** Trigger → Condition (optional) → Action. Flow uses a visual builder with Shopify-specific triggers and actions.

**Common triggers:** Order created, Order paid, Order fulfilled, Customer created, Product updated, Inventory quantity changed, Refund created

**Common actions:** Add tags, Remove tags, Send email, Send Slack message (via connector), Hide product, Create draft order, Cancel order, Add customer note

## Flow Workflow 1: Tag High-Value Orders

**What it does:** Tag orders over $200 for special handling.

1. Flow → Create workflow
2. Trigger: **Order created**
3. Condition: **Order total price** → greater than → 200
4. Action: **Add order tags** → "high-value"
5. Action: **Send internal email** to fulfillment team: "High-value order {{order.name}} needs priority packing"
6. Turn on

## Flow Workflow 2: Flag First-Time Customers

**What it does:** Tag first orders so you can send a special welcome.

1. Trigger: **Order created**
2. Condition: **Customer orders count** → equals → 1
3. Action: **Add customer tags** → "first-order"
4. Action: **Add order tags** → "first-order"

Then in Shopify Email or Klaviyo, create a segment based on the "first-order" tag for a welcome sequence.

## Flow Workflow 3: Hide Out-of-Stock Products

**What it does:** Automatically unpublish products when inventory hits zero, republish when restocked.

**Workflow A — Hide:**
1. Trigger: **Inventory quantity changed**
2. Condition: **Product variant inventory quantity** → less than or equal → 0
3. Condition: **Product status** → equals → active
4. Action: **Hide product** (or Add product tag "out-of-stock" if you prefer to keep visible with a badge)

**Workflow B — Show:**
1. Trigger: **Inventory quantity changed**
2. Condition: quantity → greater than → 0
3. Condition: product has tag "out-of-stock"
4. Action: **Remove product tag** "out-of-stock" + **Publish product**

## Flow Workflow 4: Low Stock Alert

1. Trigger: **Inventory quantity changed**
2. Condition: quantity → less than → 10 (your reorder point)
3. Action: **Send internal email** → "Low stock: {{product.title}} — {{inventoryLevel.available}} remaining"

For automated purchase orders and multi-channel inventory sync, see our [inventory management automation guide](/blog/automate-inventory-management).

## Flow Workflow 5: Fraud Risk Handling

1. Trigger: **Order created**
2. Condition: **Order risk level** → equals → High
3. Action: **Add order tags** → "review-required"
4. Action: **Send internal email** to owner
5. Optional action: **Hold fulfillment** (prevents accidental shipping)

## External Automation: Connecting Shopify to Your Stack

Shopify's API is extensive. Automation platforms offer triggers for orders, customers, products, fulfillments, and refunds, plus actions to create and update all of these.

**Setup:** Connect Shopify to your automation platform via OAuth (Make, Zapier) or Admin API access token (n8n, custom). Shopify Admin → Settings → Apps and sales channels → Develop apps → Create app → configure Admin API scopes → Install.

## External Workflow 1: Order to Google Sheets + Slack

**What it does:** Log every order to a spreadsheet for analysis and post to Slack.

**Steps (Make):**

1. **Shopify** → **Watch Orders** → Status: any
2. **Google Sheets** → **Add a Row**: Order #, Date, Customer email, Total, Items (join line item titles), Shipping country, Discount code
3. **Slack** → Message to #orders: "New order {{name}} — ${{total_price}} from {{customer.first_name}} ({{shipping_address.country}})"

## External Workflow 2: Customer to CRM and Email Platform

**What it does:** Sync new customers to HubSpot and Klaviyo with purchase data.

**Steps (Make):**

1. **Shopify** → **Watch Customers** (new)
2. **HubSpot** → Search Contacts by email → Create or Update with Shopify customer ID, total spent, orders count
3. **Klaviyo** → Add to List "Customers" with properties: first order date, first product purchased
4. Optional: **Iterator** over customer tags → apply as HubSpot properties for segmentation

## External Workflow 3: Abandoned Checkout Recovery

Shopify has native abandoned checkout emails, but custom automation adds SMS, multi-channel, and CRM logging.

**Steps (Make):**

1. **Shopify** → **Watch Abandoned Checkouts** (checks every 15 min)
2. **Filter:** created more than 1 hour ago AND no completed order from this email in last 2 hours
3. **Klaviyo** → Track Event "Abandoned Checkout" with cart contents (Klaviyo runs the email sequence)
4. **Optional SMS:** Twilio → Send SMS with recovery link (only if customer opted in)
5. **HubSpot** → Add note to contact: "Abandoned cart: {{items}} worth ${{total}}"

## External Workflow 4: Fulfillment to Customer Notification

**What it does:** When you fulfill an order in Shopify (or your 3PL does), send tracking info via your preferred channel.

**Steps (Make):**

1. **Shopify** → **Watch Fulfillments** (created)
2. **Shopify** → Get Order (for customer details)
3. **Router:**
   - Customer has phone + SMS opt-in → **Twilio** → SMS with tracking link
   - Otherwise → **Gmail** → Branded shipping email
4. **HubSpot** → Update contact: Last Shipped Date

Shopify sends default shipping notifications; use this for custom branding, SMS, or additional channels.

## External Workflow 5: Refund to Accounting and Support

**Steps (Make):**

1. **Shopify** → **Watch Refunds**
2. **QuickBooks** → Create Refund Receipt (customer, amount, reason)
3. **Google Sheets** → Append to refund log (order, amount, reason, date)
4. **Gorgias/Zendesk** → Add note to customer's ticket if one exists
5. **Slack** → #refunds: "Refund ${{amount}} on order {{order.name}}. Reason: {{note}}"

## External Workflow 6: Product Launch Distribution

**Steps (Make):**

1. **Shopify** → **Watch Products** (created or status changed to active)
2. **Filter:** product has tag "launch"
3. **Instagram/Facebook** (via Buffer or native) → Post with product image and description
4. **Klaviyo** → Create campaign draft with product details
5. **Pinterest** → Create Pin
6. **Slack** → Notify marketing: "Product {{title}} launched. Social posts scheduled."

See our [social media automation guide](/blog/automate-social-media-posting) for platform specifics.

## When to Use Flow vs External

| Use Shopify Flow | Use External Platform |
|---|---|
| Tagging, hiding, holding — actions within Shopify | Syncing to CRM, accounting, support desk |
| Free, no operation limits | Cross-platform workflows |
| Real-time triggers on Shopify events | SMS, custom email, Slack rich messages |
| Simple conditions on order/customer/product data | Complex logic, loops, data transformation |

For the broader e-commerce operations picture, see our [e-commerce automation guide](/blog/automation-for-ecommerce) and [e-commerce operations guide](/blog/ecommerce-operations-guide).

## Is Shopify Flow free?

Yes. Shopify Flow became free on all plans (Basic, Shopify, Advanced, Plus) in 2023. Previously it was Plus-only. Install it from the Shopify App Store at no cost. There are no workflow or execution limits on standard plans, though Plus offers additional triggers and actions (like scheduled triggers and more connectors). For most merchants, the free version handles all internal store automation — tagging, inventory management, order routing, and fraud flagging.

## What can I automate in Shopify?

Inside Shopify with Flow: order tagging by value or risk, customer segmentation by purchase behavior, product visibility based on inventory, low-stock alerts, fulfillment holds, and internal emails. With external platforms like [Make](/blog/getting-started-with-make) or [Zapier](/blog/getting-started-with-zapier): CRM syncing, accounting entries, SMS notifications, multi-channel marketing, abandoned cart recovery across channels, support ticket integration, and custom reporting. Most stores use Flow for internal logic and external automation for connecting Shopify to the rest of their business.

## How do I connect Shopify to Zapier or Make?

In [Make](/blog/getting-started-with-make) or [Zapier](/blog/getting-started-with-zapier), add a Shopify module and click "Create connection." You will be redirected to Shopify to authorize — log in to your store admin and approve the requested permissions. Some platforms ask for your store URL (yourstore.myshopify.com). Once connected, you can use triggers (Watch Orders, Watch Customers, Watch Products, Watch Fulfillments) and actions (Create/Update Order, Customer, Product, Fulfillment). For [n8n](/blog/getting-started-with-n8n), create a custom app in Shopify Admin to get an Admin API access token.
