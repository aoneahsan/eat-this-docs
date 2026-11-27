---
title: Reminder times in your calendar
description: "A private calendar address that shows each Eat This reminder time as a daily event in Google Calendar or Apple Calendar, at your region's time, and reaches nothing else in your account."
---

# Reminder times in your calendar

Eat This can give you a private calendar address that your calendar app checks by itself. Each reminder time that is on
shows as a daily event, at your region's time. The address reaches your reminder times and nothing else in your
account.

## Making the address

1. Open [Settings → Other apps → Reminder times in your calendar](https://eatthis.aoneahsan.com/settings/other-apps).
2. Press **Make a calendar address** and copy it. We email you to say an address was made.
3. Paste it into your calendar app:
   - **Google Calendar:** Other calendars, then **From URL**.
   - **Apple Calendar:** File, then **New Calendar Subscription**.

Making an address, and showing it again later, follow the [10-minute rule](./access-keys.md#showing-a-key-again). Free
holds 2 addresses, Plus 10 and Family 20.

The address looks like this, with your own feed id and an `et_cal_` key in place of the capitals:

```text
https://mbznqopsynqehmpddwbr.supabase.co/functions/v1/api/v1/calendar/FEED_ID.ics?k=et_cal_KEY
```

## What it shows

- One event a day for each reminder time that is on, from a week back to eight weeks ahead.
- Each event starts at the reminder time, lasts 15 minutes and is named after its part of the day, such as
  "Breakfast · Eat This" or "Lunch · Eat This".
- Times follow the time zone of the region in your food settings.

Move, add or turn off a reminder time in Eat This and the calendar follows the next time your app checks. Calendar apps
choose how often that is, and some wait hours between checks. The reminders themselves still come as
notifications on your phone ([how reminders work](../reminders.md)); the calendar is another place to see them.

## Keeping it private

Anyone with the address sees your reminder times, so keep it to yourself. If it gets out, press **Remove**: calendars
using it stop updating, and you can make a new one.
