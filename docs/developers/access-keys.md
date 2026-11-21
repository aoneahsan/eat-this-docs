---
title: Access keys
description: "Make an et_pat_ key for your own script, tick what it may do and when it runs out, show it again within 10 minutes of signing in, replace it with a day's overlap, or remove it."
---

# Access keys

An access key lets your own script or app use your Eat This data the way you would, and it does only what you ticked
when you made it. Keys start with `et_pat_` and are made under
[Settings → Other apps → Access keys](https://eatthis.aoneahsan.com/settings/other-apps).

## Making a key

1. Press **Make a key**.
2. Under **What is it for?**, name it after where it will live: "Kitchen tablet", "Shopping script".
3. Under **What it may do**, tick what it may read and change (the table below).
4. Under **Runs out after**, pick 30, 90 or 365 days, or **Never** for a key that only reads.
5. Press **Make the key** and copy it. We email you to say a key was made.

If you didn't sign in during the last 10 minutes, Eat This asks you to sign in again first. With
[two-step sign-in](./two-step-sign-in.md) on, it asks for a code too.

A key looks like `et_pat_` followed by 43 letters, digits, `-` or `_`, then `_` and an 8-character check. A key with a
typo in it is refused before anything else happens.

## What a key may do

| You tick | Scope | It lets the key |
|---|---|---|
| Favourites: read | `favourites:read` | list the foods you saved |
| Favourites: change | `favourites:write` | save a food |
| Remove a saved food | `favourites:delete` | remove a saved food |
| Reminder times: read | `reminders:read` | list your reminder times, and read them as daily events |
| Reminder times: change | `reminders:write` | add or move a time, or turn one on or off |
| Remove a time | `reminders:delete` | remove a reminder time |
| Food settings: read | `preferences:read` | read your diet, foods you leave out, units, region and quiet hours |
| Food settings: change | `preferences:write` | change them |
| Plan and usage: read | `account:read` | read your plan, past plans and questions asked each day |
| Family: read | `household:read` | read your Family plan and who is in it, by the name each one shows |
| (nothing to tick) | `catalogue:read` | read foods, nutrients and feelings. Every key has it |

The two **Remove** ticks are off unless you tick them. Your Family has only a read tick: other people are in it.

## When a key runs out

A key that changes anything runs out after 30, 90 or 365 days, so a key you forgot about stops by itself. Only a key
that just reads may be set to **Never**. Each key in the list shows when it runs out and when it was last used.

## Showing a key again

The key shows by itself once, when you make it. After that, **Show the key** works only within 10 minutes of a sign-in,
and with two-step sign-in on, that sign-in must have included the code (a remembered browser doesn't count). Outside
those 10 minutes the button reads **Sign in again to show it**. It's how Eat This knows the person at the screen is
still you. Webhook signing secrets and calendar addresses follow the same rule.

## Replacing a key

Press **Replace** when a key may have been seen by someone else, or to swap it on a schedule. You get a new key with the
same name and ticks. The old one keeps working for 24 hours, then stops, so you have a day to swap it in. If the old
key had an end date, the new one runs 90 days; a **Never** key stays **Never**. Replacing follows the 10-minute rule,
like making one.

## Removing a key

Press **Remove**, then press again. Anything using the key stops working at once.

## Checking a key

`GET /v1/token` tells you what the key you sent is and what it may do:

```bash
curl -s https://mbznqopsynqehmpddwbr.supabase.co/functions/v1/api/v1/token \
  -H "Authorization: Bearer $EATTHIS_KEY"
```

```json
{
  "data": {
    "kind": "pat",
    "user_id": "your account id",
    "client_id": null,
    "scopes": ["catalogue:read", "favourites:read", "favourites:write"]
  }
}
```

## Keeping it safe

A key acts as you. Keep it on your own server or computer, in an environment variable rather than in code you share.
Eat This's API doesn't answer web pages on other sites, so a key never needs to sit in a browser.
