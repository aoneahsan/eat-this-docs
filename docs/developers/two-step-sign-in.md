---
title: Two-step sign-in
description: "Turn on two-step sign-in for Eat This with an authenticator app, keep ten recovery codes, remember your own browser for 7 days, get back in after losing your phone, and what support can and cannot do."
---

# Two-step sign-in

With two-step sign-in on, signing in to Eat This asks for Google and then a six-digit code from an app on your phone, so
someone with your Google password still can't get in. It's optional, on every plan, and takes about two minutes to set
up under [Settings → Security](https://eatthis.aoneahsan.com/settings/security).

## Setting it up

1. Press **Set up two-step sign-in**.
2. Scan the QR code with an authenticator app: Google Authenticator, Microsoft Authenticator, 2FAS or any app that
   shows six-digit codes. Can't scan it? Type the setup key instead.
3. Type the six digits the app shows.
4. Keep the ten recovery codes: **Copy all ten** or **Download as a file**, tick **I have saved these codes somewhere
   safe**, and press **Finish**. This is the only time they show.

From then on, keys, webhook secrets and calendar addresses ask for a code as well as a recent sign-in before they
show again ([the 10-minute rule](./access-keys.md#showing-a-key-again)).

Five wrong codes in a row pause codes for ten minutes. If codes keep failing, check the time on your phone is set
automatically.

## Recovery codes

Each code works once, in place of the six digits. Settings → Security shows how many of the ten are left and warns
when three or fewer remain. **Make new recovery codes** asks for a code from your app, then replaces the whole set:
the old ones stop working at once. Keep them somewhere other than your phone. We email you whenever one is used.

## Remembering a browser

After a code, tick **Remember this browser for 7 days** and that browser signs in with Google alone until the date
shown. Only tick it on your own phone or computer. The 7 days run from that sign-in and aren't extended by visits.
Showing a key or secret, changing two-step sign-in, and admin screens still ask for a code.

Settings → Security lists every remembered browser, marks the one you're on, and lets you **Forget** one or **Forget
every browser**. Signing out forgets the browser you sign out of. Turning two-step sign-in off forgets them all.

## A new phone, or a lost one

- **You still have the old phone:** Settings → Security → **Set up a new phone**, type a code from the old one, then
  scan the new code on the new phone. Your recovery codes stay the same.
- **The phone is lost or reset:** sign in with Google, choose **Use a recovery code instead** and type one of your ten.
  You're in, and two-step sign-in stays on. Press **Set up the new phone** straight away; you have ten minutes to scan
  the new code before you'd need another recovery code.

## Turning it off

Settings → Security → **Turn off two-step sign-in**, then type a code from your app. Signing in then needs Google only.
Staff accounts that run Eat This's admin screens can't turn it off: those screens stay closed without it.

## Lost both the phone and the codes

Write to [aoneahsan@gmail.com](mailto:aoneahsan@gmail.com) from the email address your Eat This account uses. Before
anything changes, support checks it's you with at least two of these:

- you wrote from the account's own email address;
- you named your plan and the month it started;
- you named two foods you've saved.

Support then turns two-step sign-in off for your account, which also clears your recovery codes and remembered
browsers, and we email you to say so. Sign in with Google and set it up again.

What support **can't** do: see your recovery codes (we keep only a scrambled copy of each), see a key, secret or
calendar address in full (support sees names and the first characters), or skip the checks above. Every reset is
recorded against the support request it came from.

## Recent sign-ins

Settings → Security also shows the last ten times your account signed in, and how: Google, Google and a code, a
remembered browser, or a recovery code. One you don't recognise? Press **Sign out everywhere else**, then turn on
two-step sign-in.
