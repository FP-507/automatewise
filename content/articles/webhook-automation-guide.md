---
title: "Webhooks Explained: How to Use Them in Your Automations"
description: "Learn what webhooks are, how they work, and how to use them to trigger automations in n8n, Make, and Zapier. Practical examples and troubleshooting tips."
date: "2026-06-06"
category: "how-to"
tags: ["webhooks", "API", "automation triggers", "real-time", "integration"]
keywords: ["webhook automation", "what are webhooks", "webhook tutorial", "webhook trigger", "how to use webhooks"]
featured: false
---

## What Are Webhooks?

A webhook is an HTTP callback — a way for one application to send real-time data to another application when a specific event occurs. Instead of your automation platform repeatedly asking "has anything changed?" (polling), the source application pushes the data to your automation the moment something happens.

Think of it this way: polling is like refreshing your email inbox every five minutes. A webhook is like getting a push notification the instant an email arrives.

This distinction matters for automation because:

- **Speed** — Webhooks deliver data in seconds, not minutes
- **Efficiency** — No wasted API calls checking for changes that have not happened
- **Reliability** — Events are captured the moment they occur, reducing the chance of missing data

If you are new to automation concepts, our [workflow automation guide](/blog/what-is-workflow-automation) and [automation glossary](/blog/automation-glossary) provide helpful context.

## How Webhooks Work

The webhook flow has three parts:

### 1. The Source Application

This is the app where the event happens — Stripe processes a payment, GitHub receives a push, Shopify gets a new order. The source application is configured to "call" a URL when specific events occur.

### 2. The Webhook URL

This is a unique URL provided by your automation platform (n8n, Make, Zapier) that listens for incoming data. When the source application sends data to this URL, your automation triggers.

### 3. The Payload

The data sent by the source application is called the payload. It is typically a JSON object containing all the relevant information about the event.

Example payload from a payment processor:

```json
{
  "event": "payment.completed",
  "data": {
    "customer_id": "cus_12345",
    "email": "customer@example.com",
    "amount": 9900,
    "currency": "usd",
    "product": "Pro Plan",
    "timestamp": "2026-06-06T14:30:00Z"
  }
}
```

### The Complete Flow

1. A customer completes a payment on your website
2. Stripe fires a webhook to your automation platform's URL
3. Your automation platform receives the payload and starts the workflow
4. The workflow processes the data: updates the CRM, sends a welcome email, notifies Slack

The entire chain from event to action takes seconds.

## Setting Up Webhooks in n8n

n8n provides a dedicated Webhook node that generates a unique URL and listens for incoming requests.

### Creating a Webhook Trigger

1. Add a **Webhook** node to your workflow
2. n8n generates two URLs:
   - **Test URL**: Used during development (only works when you click "Listen for test event")
   - **Production URL**: Works when the workflow is activated
3. Choose the HTTP method (POST is standard for webhooks)
4. Configure response settings (what to send back to the caller)

### Configuring the Webhook Node

**HTTP Method**: Most webhooks use POST, but some services use GET or PUT. Check your source application's documentation.

**Path**: Customize the webhook path for readability: `/new-order`, `/payment-received`, `/form-submission`

**Authentication**: Add security to prevent unauthorized calls:
- **Header Auth**: Require a specific header value
- **Basic Auth**: Require username and password
- **None**: Accept all requests (only for testing)

**Response**: Configure what n8n sends back:
- **Immediately**: Respond with 200 OK right away, process data asynchronously
- **When Last Node Finishes**: Wait for the workflow to complete, then respond with results
- **Using Respond to Webhook Node**: Full control over the response body and status code

### Example: Stripe Payment Webhook in n8n

1. **Webhook node** — Listens at `/stripe-payment`
2. **IF node** — Checks `event` equals "payment_intent.succeeded"
3. **Set node** — Extracts customer email, amount, and product from the nested payload
4. **Google Sheets** — Logs the payment details
5. **Gmail** — Sends a receipt/welcome email to the customer
6. **Slack** — Posts to #revenue channel: "New payment: $99 from customer@example.com"

For more n8n workflows, see our [getting started guide](/blog/getting-started-with-n8n).

## Setting Up Webhooks in Make

Make offers a Custom Webhook module that works similarly.

### Creating a Webhook in Make

1. Add a **Webhooks > Custom webhook** module as the first module in your scenario
2. Click "Add" to create a new webhook
3. Make generates a unique URL
4. Click "Run once" to put Make in listening mode
5. Send a test request to the URL (from your app or using a tool like Postman)
6. Make captures the data structure and makes fields available for mapping

### Make Webhook Configuration

- **IP Restrictions**: Limit which IP addresses can call your webhook
- **Data Structure**: Define the expected payload format for better field mapping
- **Queue**: Make queues incoming webhooks when the scenario is not running, processing them on the next scheduled run

For more on Make, see our [getting started with Make guide](/blog/getting-started-with-make).

## Setting Up Webhooks in Zapier

Zapier handles webhooks through its "Webhooks by Zapier" trigger.

### Catch Hook

1. Create a new Zap
2. Select "Webhooks by Zapier" as the trigger
3. Choose "Catch Hook"
4. Zapier generates a unique URL
5. Send a test request to the URL
6. Zapier captures the payload and makes fields mappable in action steps

### Catch Raw Hook

If you need the raw request body (unparsed), use "Catch Raw Hook" instead. This is useful for XML payloads, form-encoded data, or when you need to verify webhook signatures.

## Common Webhook Sources

### Payment Processors

**Stripe**: Sends webhooks for payment events (succeeded, failed, refunded), subscription changes, invoice events. Configure at Dashboard → Developers → Webhooks.

**PayPal**: IPN (Instant Payment Notification) for transaction events. Configure in your PayPal business account settings.

### E-commerce Platforms

**Shopify**: Webhooks for orders, products, customers, inventory changes. Configure at Settings → Notifications → Webhooks or via the API.

**WooCommerce**: Webhooks for order status changes, product updates, customer creation. Configure at WooCommerce → Settings → Advanced → Webhooks.

### Form Tools

**Typeform**: Sends webhook on form submission. Configure in the form's Connect panel.

**JotForm**: Webhook integration in form settings. Sends full submission data.

**Google Forms**: Does not support native webhooks, but you can use Google Apps Script to send webhook calls on form submission.

### Development Platforms

**GitHub**: Webhooks for push events, pull requests, issues, releases, and more. Configure at Repository → Settings → Webhooks.

**GitLab**: Similar webhook events for CI/CD pipelines, merge requests, and code pushes.

### CRM and Marketing Tools

**HubSpot**: Webhook subscriptions for contact, deal, and company events via workflow automations or the API.

**Mailchimp**: Webhooks for subscriber events (subscribe, unsubscribe, profile update, campaign sent).

## Webhook Security

### Verify Webhook Signatures

Most reputable services sign their webhook payloads with a secret key. The signature is included in the request headers. Your automation should verify this signature before processing the data to ensure the request is genuine.

**Stripe** includes a `Stripe-Signature` header. Verify it using the webhook signing secret from your Stripe dashboard.

**GitHub** includes an `X-Hub-Signature-256` header computed with your webhook secret.

**Shopify** includes an `X-Shopify-Hmac-SHA256` header.

In n8n, use a Function node after the Webhook node to verify the signature. In Make, use a custom function module. In Zapier, this is handled automatically for supported integrations.

### Use HTTPS

Always use HTTPS webhook URLs (which n8n Cloud, Make, and Zapier provide by default). This encrypts the data in transit, preventing eavesdropping.

### IP Allowlisting

If your source application publishes its webhook IP addresses, configure your automation platform to only accept requests from those IPs. Make supports this natively in webhook settings.

### Authenticate Incoming Requests

Add a secret token to your webhook URL as a query parameter or require it in a custom header. Your automation checks for this token and rejects requests without it.

## Handling Webhook Failures

### Retry Policies

Most webhook providers retry failed deliveries. Stripe retries up to 3 times with exponential backoff. Shopify retries for 48 hours. GitHub retries once.

Your webhook endpoint should:
- Return a 200 status code quickly to acknowledge receipt
- Process the data asynchronously (do the heavy work after responding)
- Be idempotent — handle duplicate deliveries gracefully

### Idempotency

Because webhooks can be delivered multiple times (retries, network issues), your workflow should handle duplicates. Use a unique identifier from the payload (event ID, order ID) and check if you have already processed it before taking action.

In n8n, use a Function node to check a database or spreadsheet for the event ID. If it exists, stop the workflow. If not, process and log the ID.

### Logging and Monitoring

Log every webhook received — timestamp, source, event type, and processing result. This log is essential for debugging when something goes wrong.

Set up alerts for webhook failures. If your automation stops receiving webhooks from a critical source, you want to know immediately, not when a customer complains.

## Testing Webhooks During Development

### Using Test Tools

- **Postman**: Send test POST requests to your webhook URL with custom payloads
- **cURL**: Quick command-line testing: `curl -X POST -H "Content-Type: application/json" -d '{"test": true}' https://your-webhook-url`
- **RequestBin**: Create a temporary URL that logs incoming requests so you can inspect payloads from source apps
- **ngrok**: Expose your local development server to receive webhooks during testing

### Using Platform Test Features

- **n8n**: Click "Listen for test event" on the Webhook node, then send your test request
- **Make**: Click "Run once" and send a test request within 5 minutes
- **Zapier**: Use "Test trigger" and send a test request

### Sending Sample Payloads

Most webhook providers include a "Send test webhook" button in their settings. Use this to verify your endpoint is reachable and your automation processes the data correctly.

## Webhooks vs Polling: When to Use Each

| Factor | Webhooks | Polling |
|--------|----------|---------|
| Speed | Instant (seconds) | Delayed (1-15 minutes) |
| API usage | Low (only on events) | High (continuous requests) |
| Setup complexity | Higher | Lower |
| Reliability | Depends on delivery | Consistent |
| Best for | Real-time events, high-volume | Low-frequency checks, simple integrations |

Use webhooks when timing matters (payments, alerts, user actions). Use polling when the source app does not support webhooks or when a slight delay is acceptable.

## Conclusion

Webhooks are the backbone of real-time automation. They enable instant responses to events across your entire tool stack — payments trigger welcome emails in seconds, form submissions create CRM records instantly, and code pushes kick off deployment pipelines without delay.

Start by identifying the events that matter most to your business and checking if those source applications support webhooks. Then build your automation workflow in [n8n](/blog/getting-started-with-n8n), [Make](/blog/getting-started-with-make), or [Zapier](/blog/getting-started-with-zapier) with a Webhook trigger.

For more on connecting tools, see our guides on [API integration without code](/blog/api-integration-without-code) and [automating with Google Sheets](/blog/connect-google-sheets-n8n).
