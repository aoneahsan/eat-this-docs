---
title: The Eat This API
description: "The Eat This REST API: base URL, the Authorization header, the data envelope, errors, cursor pagination, rate limits, and a curl example for favourites, reminder times, food settings, plan, Family and the food catalogue."
---

# The Eat This API

The API answers at one base URL, takes an [access key](./access-keys.md) in the `Authorization` header and answers in
JSON. The full machine description is the
[OpenAPI document](https://mbznqopsynqehmpddwbr.supabase.co/functions/v1/api/v1/openapi.json); this page is the same
thing for people.

```bash
BASE=https://mbznqopsynqehmpddwbr.supabase.co/functions/v1/api/v1
EATTHIS_KEY=et_pat_your_key_here
```

Every example below uses those two. The OpenAPI document needs no key:

```bash
curl -s "$BASE/openapi.json"
```

## Signing requests

Send the key as a bearer token:

```bash
curl -s "$BASE/favourites" -H "Authorization: Bearer $EATTHIS_KEY"
```

An app you connected through Eat This's own sign-in page sends its OAuth token the same way. The API is for servers and
scripts: it doesn't answer web pages on other sites.

## What comes back

One record is wrapped in `data`. A list adds `meta`:

```json
{
  "data": [
    { "id": "…", "food_slug": "almonds", "food_name": "Almonds", "created_at": "2026-11-21T08:02:11.401Z" }
  ],
  "meta": { "next_cursor": null, "limit": 20 }
}
```

A removal with an access key answers `204` with no body. Bodies you send are JSON objects with
`Content-Type: application/json`, 64 KB at most.

## Errors

Every error has the same shape, and `correlation_id` lets us find the request in our logs if you write to us:

```json
{
  "error": {
    "code": "invalid_token",
    "message": "The credential is missing, invalid, expired or revoked.",
    "correlation_id": "req_091c4318fbce525c"
  }
}
```

That one is real: it's what `curl -s "$BASE/foods"` answers without a key.

| Code | Status | What happened |
|---|---|---|
| `invalid_request` | 400 | A field, filter, sort, limit or cursor isn't valid. `details.issues` names the fields |
| `invalid_token` | 401 | No key, or it's mistyped, expired, replaced past its 24 hours, or removed |
| `scope_required` | 403 | The key wasn't given this. `details.scope` names the tick it needs |
| `not_found` | 404 | Nothing at this address for this key. Someone else's record answers the same |
| `method_not_allowed` | 405 | This address doesn't do that, such as writing to your Family |
| `conflict` | 409 | A rule of your plan, such as "That's all 3 reminder times on Free." |
| `payload_too_large` | 413 | The body is over 64 KB |
| `rate_limited` | 429 | Over 120 a minute for this key, or your plan's requests a day |
| `internal` | 500 | Our side. Try again; quote the `correlation_id` if it keeps happening |

## Pages of results

A list returns 20 records unless you ask for between 1 and 50 with `limit`. When there are more, `meta.next_cursor`
holds a cursor; send it back as `cursor`, with the same `sort` and filters, for the next page. `null` means the last
page. A cursor that doesn't match its query, or has run out, answers `400`: start again without it.

```bash
curl -s "$BASE/favourites?limit=50&sort=created_at" -H "Authorization: Bearer $EATTHIS_KEY"
curl -s "$BASE/favourites?limit=50&sort=created_at&cursor=CURSOR_FROM_META" -H "Authorization: Bearer $EATTHIS_KEY"
```

## Rate limits

Every answer carries `RateLimit-Limit`, `RateLimit-Remaining` and `RateLimit-Reset` (seconds until the window
resets) for whichever limit is closest. A `429` adds `Retry-After`. Each key may make 120 requests a minute; each
person may make 5,000 a day on Free, 50,000 on Plus and 100,000 on Family, across every key and assistant, reset at
midnight UTC.

## Favourites

The foods you saved, newest first. A favourite's `id` is its food's id. Save a food by the name in its Eat This
address (`eatthis.aoneahsan.com/food/almonds` → `almonds`); saving one already saved gives the same favourite back.
There is nothing to change on a favourite, so there is no update.

| Field | |
|---|---|
| `id` | the food's id |
| `food_slug` | the food's name in its address; the only field you send |
| `food_name` | the food's name |
| `created_at` | when you saved it |

```bash
# list: favourites:read
curl -s "$BASE/favourites" -H "Authorization: Bearer $EATTHIS_KEY"

# one: favourites:read
curl -s "$BASE/favourites/FOOD_ID" -H "Authorization: Bearer $EATTHIS_KEY"

# save: favourites:write, answers 201
curl -s -X POST "$BASE/favourites" -H "Authorization: Bearer $EATTHIS_KEY" \
  -H "Content-Type: application/json" -d '{"food_slug":"almonds"}'

# remove: favourites:delete, answers 204
curl -s -X DELETE "$BASE/favourites/FOOD_ID" -H "Authorization: Bearer $EATTHIS_KEY"
```

## Reminder times

When Eat This reminds you to eat. You send the time on your own clock, `HH:MM` in 24 hours; times come back as
`HH:MM:SS`. Eat This works out the part of the day it falls in, and the reminder itself still arrives as a
notification on your phone.

| Field | |
|---|---|
| `id` | the reminder time |
| `at_local` | the time of day, such as `13:30` |
| `slot` | worked out from the time: `early-morning` 04:00–06:59, `breakfast` 07:00–09:59, `mid-morning` 10:00–11:59, `lunch` 12:00–14:59, `afternoon` 15:00–17:59, `evening` 18:00–20:59, `late-night` the rest |
| `is_on` | `false` keeps the time but sends no reminder; new times are on unless you send `false` |
| `created_at`, `updated_at` | when it was added and last changed |

Free holds 3 reminder times and Plus and Family 8. A new time past that answers `409`.

```bash
# list, earliest first: reminders:read
curl -s "$BASE/reminders" -H "Authorization: Bearer $EATTHIS_KEY"

# one: reminders:read
curl -s "$BASE/reminders/REMINDER_ID" -H "Authorization: Bearer $EATTHIS_KEY"

# add: reminders:write, answers 201
curl -s -X POST "$BASE/reminders" -H "Authorization: Bearer $EATTHIS_KEY" \
  -H "Content-Type: application/json" -d '{"at_local":"13:30"}'

# move, or turn off: reminders:write
curl -s -X PATCH "$BASE/reminders/REMINDER_ID" -H "Authorization: Bearer $EATTHIS_KEY" \
  -H "Content-Type: application/json" -d '{"at_local":"14:00","is_on":false}'

# remove: reminders:delete, answers 204
curl -s -X DELETE "$BASE/reminders/REMINDER_ID" -H "Authorization: Bearer $EATTHIS_KEY"
```

## Food settings

One record: the settings every list in Eat This follows. Change any of them with `PATCH`.

| Field | Values |
|---|---|
| `diet` | `everything`, `pescatarian`, `eggetarian`, `vegetarian`, `vegan` |
| `exclude_allergens` | foods you leave out, any of `dairy`, `eggs`, `fish`, `gluten`, `peanuts`, `sesame`, `shellfish`, `soy`, `tree-nuts` |
| `region_code` | where you buy food, such as `PK` |
| `units` | `metric` or `us` |
| `quiet_from`, `quiet_to` | quiet hours, `HH:MM` |
| `id`, `updated_at` | read only |

```bash
# read: preferences:read (a list of one)
curl -s "$BASE/preferences" -H "Authorization: Bearer $EATTHIS_KEY"

# one, by its id from the list: preferences:read
curl -s "$BASE/preferences/PREFERENCES_ID" -H "Authorization: Bearer $EATTHIS_KEY"

# change: preferences:write
curl -s -X PATCH "$BASE/preferences/PREFERENCES_ID" -H "Authorization: Bearer $EATTHIS_KEY" \
  -H "Content-Type: application/json" -d '{"diet":"vegetarian","exclude_allergens":["peanuts","sesame"]}'
```

## Plan and usage

All three need `account:read` and are read only.

- **`account`**, one record: `plan`, `plan_name`, `plan_source` (`polar`, `admin` or `referral`), `plan_ends_at`,
  `renews`, `limits` (what your plan allows), `ai_questions_today`, `ai_questions_per_day`, and your invites:
  `invites_confirmed`, `invites_pending`, `invites_needed`.
- **`plans`**, every plan you've had, newest first: `plan`, `source`, `starts_at`, `ends_at`, `renews`, `created_at`.
- **`ai_usage`**, questions asked each day, newest first: `day`, `questions`. Filter with `day.gte` and `day.lt`.

```bash
curl -s "$BASE/account" -H "Authorization: Bearer $EATTHIS_KEY"
curl -s "$BASE/account/ACCOUNT_ID" -H "Authorization: Bearer $EATTHIS_KEY"
curl -s "$BASE/plans" -H "Authorization: Bearer $EATTHIS_KEY"
curl -s "$BASE/plans/PLAN_ID" -H "Authorization: Bearer $EATTHIS_KEY"
curl -s "$BASE/ai_usage?day.gte=2026-11-01&day.lt=2026-12-01" -H "Authorization: Bearer $EATTHIS_KEY"
curl -s "$BASE/ai_usage/USAGE_ID" -H "Authorization: Bearer $EATTHIS_KEY"
```

## Family

Read only, with `household:read`, because other people are in it: no key or assistant can invite, join or leave. A
write answers `405`.

- **`household`**: `seats`, `members`, `my_role` (`owner` or `member`), `created_at`.
- **`household_members`**: everyone in it, by the name each one shows: `household_id`, `display_name`, `role`,
  `joined_at`. Never an email.

```bash
curl -s "$BASE/household" -H "Authorization: Bearer $EATTHIS_KEY"
curl -s "$BASE/household/HOUSEHOLD_ID" -H "Authorization: Bearer $EATTHIS_KEY"
curl -s "$BASE/household_members" -H "Authorization: Bearer $EATTHIS_KEY"
curl -s "$BASE/household_members/MEMBER_ID" -H "Authorization: Bearer $EATTHIS_KEY"
```

## Reminder days

Your reminder times that are on, as one event a day from a week back to eight weeks ahead, at your region's time:
`reminder_id`, `title` (such as "Breakfast · Eat This"), `starts_at`, `ends_at` (15 minutes later), `updated_at`. It
needs `reminders:read`. The [calendar feed](./calendar-feed.md) serves the same events.

```bash
curl -s "$BASE/reminder_days?limit=50" -H "Authorization: Bearer $EATTHIS_KEY"
curl -s "$BASE/reminder_days/REMINDER_DAY_ID" -H "Authorization: Bearer $EATTHIS_KEY"
```

## The food catalogue

Foods, nutrients and feelings are public, and every key and assistant can read them without a tick. Published foods
only, as the site shows them.

- **`foods`**: `slug`, `name`, `food_group`, `diet` (`plant`, `dairy`, `egg`, `fish`, `shellfish`, `meat`),
  `allergens`, `prep` (`ready`, `cook`, `soak`, `grind`), `serving_grams`, `serving_label`. Filter with `slug.eq`.
- **`nutrients`**: the ten nutrients Eat This measures, each with its `id` (such as `magnesium`), `name`, `unit` and
  `daily_value`.
- **`food_nutrients`**: how much of a nutrient a food holds per 100 g (`per_100g`), with the public record it comes from
  (`source_ref`, `source_checked_on`). Empty means not measured. Filter with `food_id.eq` and `nutrient_key.eq`.
- **`feelings`**: `slug`, `name`, `nutrients_of_interest`, and `red_flags`: signs that call for a doctor or emergency
  care, not food, most serious first.
- **`feeling_foods`**: the foods suggested for a feeling, with `evidence` (`strong`, `some` or `traditional`), `basis`
  and `citation_refs`. Filter with `feeling_id.eq`.

```bash
curl -s "$BASE/foods?slug.eq=almonds" -H "Authorization: Bearer $EATTHIS_KEY"
curl -s "$BASE/foods/FOOD_ID" -H "Authorization: Bearer $EATTHIS_KEY"
curl -s "$BASE/nutrients" -H "Authorization: Bearer $EATTHIS_KEY"
curl -s "$BASE/nutrients/magnesium" -H "Authorization: Bearer $EATTHIS_KEY"
curl -s "$BASE/food_nutrients?food_id.eq=FOOD_ID&nutrient_key.eq=magnesium" -H "Authorization: Bearer $EATTHIS_KEY"
curl -s "$BASE/food_nutrients/FOOD_ID:magnesium" -H "Authorization: Bearer $EATTHIS_KEY"
curl -s "$BASE/feelings" -H "Authorization: Bearer $EATTHIS_KEY"
curl -s "$BASE/feelings/FEELING_ID" -H "Authorization: Bearer $EATTHIS_KEY"
curl -s "$BASE/feeling_foods?feeling_id.eq=FEELING_ID" -H "Authorization: Bearer $EATTHIS_KEY"
curl -s "$BASE/feeling_foods/FEELING_FOOD_ID" -H "Authorization: Bearer $EATTHIS_KEY"
```

```json
{
  "data": [
    {
      "id": "…",
      "slug": "almonds",
      "name": "Almonds",
      "food_group": "nuts",
      "diet": "plant",
      "allergens": ["tree-nuts"],
      "prep": "ready",
      "serving_grams": 28.35,
      "serving_label": "1 oz (23 almonds)"
    }
  ],
  "meta": { "next_cursor": null, "limit": 20 }
}
```

What the catalogue says about a feeling is a suggestion, not a diagnosis. Show its `red_flags` before its foods, as Eat
This does.
