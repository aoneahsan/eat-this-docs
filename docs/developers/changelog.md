---
title: Developer changelog
description: "What changed for scripts, assistants, webhooks and calendar feeds that use Eat This, newest first."
---

# Developer changelog

## 2026-11-21: the open platform

Eat This can now be used from outside the app, on every plan.

- **API v1** at `https://mbznqopsynqehmpddwbr.supabase.co/functions/v1/api/v1`: favourites, reminder times and food
  settings to read and change; plan, usage and Family to read; foods, nutrients and feelings for any key. OpenAPI at
  `/v1/openapi.json`. See [The API](./api.md).
- **Access keys** (`et_pat_…`) with ticks for what each may do, an end date, a 24-hour overlap when replaced, and the
  10-minute rule for showing one again. See [Access keys](./access-keys.md).
- **An MCP server** for Claude, ChatGPT, Claude Code and Cursor, where a removal waits for your yes. See
  [Assistants](./assistants.md).
- **Webhooks** for ten events, signed with Standard Webhooks. See [Webhooks](./webhooks.md).
- **A calendar feed** of your reminder times. See [Calendar feed](./calendar-feed.md).
- **Two-step sign-in**, optional for everyone and required for staff. See [Two-step sign-in](./two-step-sign-in.md).
