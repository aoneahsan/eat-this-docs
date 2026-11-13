---
title: Setting up a white-label copy
description: The steps from sending your domain and logo to a live, licensed copy of Eat This.
---

# Setup

1. **You send** your domain, your name, your logo and your colours. We ask by email after your order.
2. **We build** Eat This in your colours, with your name in the header and the app title.
3. **We deploy** it on our hosting and connect your domain.
4. **We add your licence file** at `/.well-known/eatthis-white-label-license.json`, with its certificate beside it.
   Anyone can then check your copy on the [verify page](https://eatthis.aoneahsan.com/verify-license).

Your copy checks its licence once each time it starts. If the licence is revoked, or the copy runs on a domain the
licence doesn't cover, it shows "This licence is not active" instead of the app. Nothing your users saved is deleted.
If the licensing service can't be reached, the copy carries on and checks again next time.
