---
title: 'robots.txt, rate limits, and the three signals that actually get you blocked'
description: 'What really triggers anti-bot systems, and how to crawl politely enough to stay online for months.'
publishedAt: 2026-01-14
locale: en
tags: ['anti-bot', 'engineering']
author: 'ScrapeVerse engineering'
---

Most scrapers get blocked for the same three reasons, and none of them are
"we picked a clever user-agent string". Here is what is actually happening on
the other side of the connection.

## 1. Request rate, honestly measured

Rate limits are not a single number. They are a _distribution_. A crawler that
sends 10 requests a second for an hour and then stops for six hours looks
nothing like one that sends 1.2 requests a second continuously, even though
both average the same volume.

The practical fix is jitter, not a hard cap:

```python
import random

def delay_for(nth_request: int) -> float:
    base = 1.4
    # Occasionally pause long enough to look like a browsing session
    if nth_request % 400 == 0:
        return random.uniform(45, 90)
    return base * random.uniform(0.7, 1.6)
```

That `random.uniform(0.7, 1.6)` spread is doing most of the work. A fixed
1.5 second delay is more identifiable than almost any variable one.

## 2. Header consistency

Requests that claim to be Chrome but send `Accept-Encoding` that Chrome never
sends, or omit `sec-ch-ua` while pretending to be headless Chrome, are trivially
flagged. The cheap win is to derive your headers from one real browser session
rather than assembling them by hand.

The expensive win is TLS and HTTP/2 fingerprinting. `curl`, `requests` and
`httpx` each produce a distinct TLS ClientHello. If a site bothers to check,
you need a browser-grade stack such as `curl_cffi` or a real browser.

## 3. Crawl directives

`robots.txt` is a request, not a wall, and the law has not settled what it
means legally. Treat it as a _strong signal about intent_ anyway.

Two rules we follow without exception:

- If a directive disallows a path, we do not fetch it.
- If a site has no `robots.txt` at all, we assume the most restrictive reading
  and ask the client in writing before proceeding.

## What to do when you are blocked anyway

Work up this list in order, because the earlier items are cheaper and less
fragile:

1. Slow down by 3x and retry after 30 minutes.
2. Check whether the block is on your IP range or on your session fingerprint.
   Rotate residential proxies, not datacenter ones.
3. Look at whether the page needs JavaScript rendering at all. A surprising
   number of "blocked" pages are just empty client-side shells.
4. Only then consider it a solved problem. There is a maintenance cost to
   every workaround above, and that cost belongs in the quotation.
