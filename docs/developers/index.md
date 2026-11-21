---
title: Eat This for developers
description: "Use your Eat This favourites, reminder times and food settings from a script, Claude or ChatGPT, your own server or your calendar, on every plan, and what an outside app can never reach."
---

# Eat This for developers

**Your saved foods, reminder times and food settings can be used from outside Eat This.** A script can save a week's
shopping list as favourites, Claude can move your lunch reminder to 1:30, your server can hear the moment you save a
food, and your calendar can show your reminder times. All of it lives under
[Settings → Other apps](https://eatthis.aoneahsan.com/settings/other-apps), on every plan, Free included.

## Four ways in

| Way | What it's for | Read |
|---|---|---|
| Access key and the API | Your own script or app reads and changes your data, the way you would | [Access keys](./access-keys.md), [The API](./api.md) |
| An assistant | Ask Claude, ChatGPT, Claude Code or Cursor to "save paneer to my favourites" | [Assistants](./assistants.md) |
| Webhooks | Eat This tells your server when something changes | [Webhooks](./webhooks.md) |
| Calendar feed | Your reminder times as daily events in Google or Apple Calendar | [Calendar feed](./calendar-feed.md) |

## What an outside app can reach

| | What | Why |
|---|---|---|
| **Read and change** | Your favourites, reminder times and food settings | They're yours; an app does what you could do in Eat This |
| **Read only** | Your plan and today's usage, and your Family | Other people are in a Family, so only Eat This itself changes it |
| **Anyone** | Foods, nutrients and feelings | They're public. Every key and assistant can read them |
| **Never** | Your plan or payment, your email, two-step sign-in, anyone else's account | There is nothing to tick for them |

Removing is off unless you tick it, and only your own saved foods and reminder times can be removed from outside. When
an assistant asks to remove one, nothing goes until you press **Remove** in Eat This
([how that works](./assistants.md#removing-things-waits-for-you)).

The API hands out named fields only. A field Eat This adds later stays private until someone decides otherwise, so an
outside app never sees a Family member's email, your invite code, what you paid, or the words of your questions.

## Limits on each plan

| | Free | Plus | Family |
|---|---|---|---|
| Access keys | 5 | 25 | 50 |
| Requests a day | 5,000 | 50,000 | 100,000 |
| Webhook addresses | 3 | 20 | 40 |
| Assistant connections | 3 | 10 | 25 |
| Calendar feeds | 2 | 10 | 20 |

Family numbers are for each person in it. Requests a day count every key and assistant you have, together, and start
again at midnight UTC. Each key is also held to 120 requests a minute, so a script stuck in a loop stops itself. See
how many you've used under **Settings → Other apps → Use against your plan**.

## For machines

- OpenAPI: [`/v1/openapi.json`](https://mbznqopsynqehmpddwbr.supabase.co/functions/v1/api/v1/openapi.json), and the
  same as Markdown at [`/v1/openapi.md`](https://mbznqopsynqehmpddwbr.supabase.co/functions/v1/api/v1/openapi.md).
- MCP server: `https://mbznqopsynqehmpddwbr.supabase.co/functions/v1/mcp`, with its sign-in details at
  [`/.well-known/oauth-protected-resource`](https://mbznqopsynqehmpddwbr.supabase.co/functions/v1/mcp/.well-known/oauth-protected-resource).

Anything here that answers about feelings or foods is a suggestion, not a diagnosis, as it is in the app.
