---
title: Webhooks
description: "Have Eat This tell your server when a food is saved, a reminder time moves or a plan starts: every event, its payload, Standard Webhooks signature checks in Node and Python, retries, and turning an address off."
---

# Webhooks

Eat This sends your server a signed `POST` the moment something changes: a food saved, a reminder moved, a plan
started. Add your server's address under
[Settings → Other apps → Webhooks](https://eatthis.aoneahsan.com/settings/other-apps), tick the events to send, and
check each signature with the secret Eat This gives you.

## Adding an address

1. Press **Add an address** and paste your server's address.
2. Under **Send me these**, tick the events you want.
3. Press **Add the address** and copy the **signing secret** into your server. It starts with `whsec_`. We email you
   to say an address was added.

The address must be `https://` on port 443 or 8443, with no name or password in it, and it must be public: an address on
your own network, a private address, or Eat This itself is refused. Adding an address, and showing its secret again
later, follow the [10-minute rule](./access-keys.md#showing-a-key-again). Free holds 3 addresses, Plus 20 and Family 40.

## What we send

Every delivery has the same body:

```json
{
  "type": "favourite.added",
  "timestamp": "2026-11-21T08:02:11.401Z",
  "data": {
    "id": "…",
    "food_slug": "almonds",
    "food_name": "Almonds",
    "created_at": "2026-11-21T08:02:11.401Z"
  }
}
```

`data` carries the same fields the [API](./api.md) gives for that record, no more. Events from the app and from the API
are the same: a food saved on your phone sends `favourite.added` just as one saved by a script does.

| Event | When | `data` |
|---|---|---|
| `favourite.added` | A food is saved | `id` (the food's), `food_slug`, `food_name`, `created_at` |
| `favourite.removed` | A saved food is removed | the same |
| `reminder.created` | A time is added | `id`, `slot`, `at_local`, `is_on`, `created_at`, `updated_at` |
| `reminder.updated` | A time is moved, or turned on or off | the same |
| `reminder.deleted` | A time is removed | the same |
| `preferences.updated` | Diet, foods left out, units, region or quiet hours change | `id` only |
| `plan.started` | Plus or Family starts | `id`, `plan`, `source`, `starts_at`, `ends_at`, `renews`, `created_at` |
| `plan.ended` | A plan ends, including early | the same |
| `household.member_joined` | Someone joins your Family | `id` (the person's), `household_id`, `display_name`, `role`, `joined_at` |
| `household.member_left` | Someone leaves your Family | the same |
| `webhook.test` | You press **Send a test event** | `{ "message": "Test event" }` |

`preferences.updated` carries only the `id`: the foods you leave out are allergy information, so your server reads them
with its own key (`GET /v1/preferences`) rather than finding them in every delivery log. A Family join or leave goes to
everyone in that Family, and to the person who joined or left.

## Checking the signature

Each delivery carries three headers, per [Standard Webhooks](https://www.standardwebhooks.com/):

| Header | Holds |
|---|---|
| `webhook-id` | the event's id, `msg_…`, the same on every retry |
| `webhook-timestamp` | when this try was sent, in Unix seconds |
| `webhook-signature` | `v1,` and a base64 HMAC-SHA256; two of them, space-separated, while a secret is being replaced |

The signature is the HMAC-SHA256 of `webhook-id`, `.`, `webhook-timestamp`, `.` and the raw body, keyed with the secret
after `whsec_`, base64-decoded. Check it against the body exactly as it arrived, before any JSON parsing, and refuse a
timestamp more than five minutes off.

### Node

```js
import { createHmac, timingSafeEqual } from 'node:crypto';

/** True when the request really came from Eat This. `rawBody` is the body exactly as received. */
export function verifyEatThis(secret, headers, rawBody) {
  const id = headers['webhook-id'];
  const timestamp = headers['webhook-timestamp'];
  const signatures = headers['webhook-signature'];
  if (!id || !timestamp || !signatures) return false;
  if (Math.abs(Date.now() / 1000 - Number(timestamp)) > 300) return false;

  const key = Buffer.from(secret.replace(/^whsec_/, ''), 'base64');
  const expected = createHmac('sha256', key).update(`${id}.${timestamp}.${rawBody}`).digest();

  return signatures.split(' ').some((part) => {
    const [version, value] = part.split(',');
    if (version !== 'v1' || !value) return false;
    const given = Buffer.from(value, 'base64');
    return given.length === expected.length && timingSafeEqual(given, expected);
  });
}
```

With Express, take the body raw so it isn't re-serialised:

```js
app.post('/eat-this', express.raw({ type: 'application/json' }), (req, res) => {
  if (!verifyEatThis(process.env.EATTHIS_WEBHOOK_SECRET, req.headers, req.body.toString('utf8'))) {
    return res.status(401).end();
  }
  const event = JSON.parse(req.body.toString('utf8'));
  res.status(204).end();
  console.log(event.type, event.data);
});
```

### Python

```python
import base64
import hashlib
import hmac
import time


def verify_eat_this(secret: str, headers, raw_body: bytes) -> bool:
    """True when the request really came from Eat This. raw_body is the body exactly as received."""
    msg_id = headers.get("webhook-id")
    timestamp = headers.get("webhook-timestamp")
    signatures = headers.get("webhook-signature")
    if not (msg_id and timestamp and signatures and timestamp.isdigit()):
        return False
    if abs(time.time() - int(timestamp)) > 300:
        return False

    key = base64.b64decode(secret.removeprefix("whsec_"))
    signed = f"{msg_id}.{timestamp}.".encode() + raw_body
    expected = base64.b64encode(hmac.new(key, signed, hashlib.sha256).digest()).decode()

    for part in signatures.split(" "):
        version, _, value = part.partition(",")
        if version == "v1" and hmac.compare_digest(value, expected):
            return True
    return False
```

In Flask, pass `request.headers` and `request.get_data()`. Both samples were checked against signatures made the way
Eat This makes them, including the two-secret case. The official Standard Webhooks libraries work too.

## Answering

Answer with any `2xx` within 10 seconds, then do the work. Eat This doesn't follow redirects and reads only the start
of your answer. Keep the `webhook-id`s you've handled: a retry, or **Send again**, repeats the same id, so your server
can tell it's a repeat.

## Retries and turning off

A try fails when your server answers anything but `2xx`, or nothing within 10 seconds. Each event gets eight tries:
straight away, then 5 seconds, 5 minutes, 30 minutes, 2 hours, 5 hours, 10 hours and 10 hours after the one before,
about 27 hours in all. After the eighth, that event stops, and you can send it again from **What we sent**.

Eat This turns the address off, and emails you, when your server answers `410 Gone`, or when deliveries have failed
without a break for 5 days. Fix the server, then press **Turn back on**; new events go out from then, and nothing is
lost from **What we sent**, which keeps 30 days.

## Managing an address

- **Send a test event** sends `webhook.test` to that address only. Its answer shows under **What we sent**.
- **What we sent** lists each event, your server's answer, how long it took and which try it was. **Send again**
  repeats one.
- **Pause** holds events; they wait and go when you press **Resume**.
- **Replace the secret** makes a new one. For 24 hours both the old and the new secret sign every event, so you can
  swap it without missing one.
- **Remove** stops everything to that address.
