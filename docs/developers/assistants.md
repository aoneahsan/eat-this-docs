---
title: Connect Claude, ChatGPT, Claude Code or Cursor
description: "Add Eat This's MCP server to Claude, ChatGPT, Claude Code or Cursor, choose what the assistant may do, confirm any removal it asks for at /developers/confirm, and disconnect it at once."
---

# Connect Claude, ChatGPT, Claude Code or Cursor

Add one address to your assistant, sign in to Eat This when it asks, and tick what it may do. Then you can ask it things
like "save paneer to my favourites" or "move my lunch reminder to 1:30", and it does it in your Eat This. The address:

```text
https://mbznqopsynqehmpddwbr.supabase.co/functions/v1/mcp
```

It is the same for everyone; signing in is what ties it to your account. The steps are also under
[Settings → Other apps → Connect an assistant](https://eatthis.aoneahsan.com/settings/other-apps).

## Claude

1. In Claude, open **Settings**, then **Connectors**, and choose **Add custom connector**.
2. Call it Eat This and paste the address above.
3. Press **Connect**. Eat This opens; tick what Claude may do and press **Approve**.

## ChatGPT

1. In ChatGPT, open **Settings**, then **Apps & Connectors**, then **Advanced**, and turn on **Developer mode**.
2. Choose **Create**, call it Eat This, paste the address and pick **OAuth**.
3. Press **Create**. Sign in to Eat This when it asks, tick what ChatGPT may do and approve.

## Claude Code

1. In a terminal, run:

   ```bash
   claude mcp add --transport http eat-this https://mbznqopsynqehmpddwbr.supabase.co/functions/v1/mcp
   ```

2. Start Claude Code, type `/mcp`, pick **eat-this** and choose **Authenticate**.
3. Your browser opens Eat This. Tick what it may do and approve.

## Cursor

1. Open **Cursor Settings**, then **MCP**, and choose **Add new MCP server**.
2. Add `eat-this` under `mcpServers`:

   ```json
   {
     "mcpServers": {
       "eat-this": { "url": "https://mbznqopsynqehmpddwbr.supabase.co/functions/v1/mcp" }
     }
   }
   ```

3. Cursor shows **Needs login** next to eat-this. Press it and approve in Eat This.

## What you approve

Eat This's own page shows which app is asking and where it will send you back. Reading is ticked for you; changing and
removing are up to you, from the same list as [access keys](./access-keys.md#what-a-key-may-do). Your Family stays read
only. Your plan, payment, email and two-step sign-in are never reachable. You can give the connection your own name
under **Call this connection**, and the page shows how many connections your plan has left (3 on Free, 10 on Plus, 25
on Family). We email you when an app connects.

The assistant sees only the tools your ticks allow, plus the public food catalogue. Each record type has `list_` and
`get_` tools, such as `list_favourites` or `get_reminders`; where you allowed changes there are `create_favourites`,
`create_reminders`, `update_reminders` and `update_preferences`; where you allowed removing there are
`prepare_delete_favourites` and `prepare_delete_reminders`. A list returns up to 50 items with a cursor for more.

## Removing things waits for you

An assistant never removes anything by itself. When it asks to remove a saved food or a reminder time, Eat This makes a
link, `eatthis.aoneahsan.com/developers/confirm/…`, which the assistant hands to you. The request also shows under
**Settings → Other apps → Connected apps → Waiting for you**.

The page shows what would go: one saved food (its page stays, and you can save it again), or one reminder time (your
phone stops reminding you at that time; the others stay). Nothing happens unless you press **Remove**. **Keep it**
leaves everything as it is, and the request runs out by itself 10 minutes after the assistant asked. A request that ran
out removes nothing.

The same holds for any app you connected through Eat This's sign-in page and that uses the API: its removal answers
`202` with a `confirm_url` and an `expires_at` instead of removing.

## Disconnecting

Open **Settings → Other apps → Connected apps** and press **Remove** next to the assistant. It can't reach your Eat This
from that moment, even with a token it already holds. **Rename** changes the name you see there.

Assistant requests count towards your plan's [requests a day](./index.md#limits-on-each-plan), with your access keys.
