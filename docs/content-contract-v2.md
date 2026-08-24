# Robywire — content contract v2

**Status:** proposed, awaiting content-team sign-off
**Supersedes:** the original blog content collection brief
**Date:** 24 August 2026

This revises the original contract. The schema is nearly unchanged and the automation
still commits MDX files to git — but the route, the category vocabulary and the body
template change, because the product is a **daily robotics news site**, not an
evergreen SEO explainer library.

Nothing here requires the automation to be rebuilt. It requires four decisions to be
agreed before it is written.

---

## 1. What changed, and why

The original brief specified a body template built for search: a direct-answer opener,
key takeaways, question-shaped section headings, and a Frequently Asked Questions
block. That is a sound structure for evergreen how-to content. It is the wrong
structure for news, and one of its pillars no longer pays.

**Google fully deprecated FAQ rich results on 7 May 2026.** They had already been
narrowed to government and health sites in August 2023; the May change removed them
entirely, along with the Rich Results Test support and Search Console reporting.
FAQPage schema is harmless to keep, but it earns no visible search enhancement.

Since the FAQ block is the most labour-intensive part of the template and its stated
payoff is gone, it moves from mandatory to optional-on-explainers-only. The genuinely
useful parts of the original template — the tight opening and the takeaways — stay.

Sources:
- https://www.searchenginejournal.com/google-drops-faq-rich-results-from-search/574429/
- https://www.schemaapp.com/schema-app-news/changes-to-faq-and-how-to-rich-results-on-google/

---

## 2. Decisions locked

| Decision | Value |
|---|---|
| Product | Daily robotics news site |
| Cadence | One post per day, 600–850 words |
| Stack | Astro (content collections + MDX) |
| Content path | `src/content/news/<slug>.mdx` |
| Public route | `/news/<slug>` |
| Beats live at launch | Seven (§4) |
| Delivery | Automation commits MDX to git; CI builds and deploys |

**The path and route changed** from `src/content/blog/` and `/blog/<slug>`. This is
the only breaking change, and it is free right now because the automation has not been
built. It gets expensive after the first hundred posts are indexed.

---

## 3. Frontmatter schema

Three optional fields are added. All are optional, so a post written to the original
schema still validates.

```yaml
---
title: "Figure ships BMW pilot to a second plant"
description: "One sentence under 155 characters — card blurb and meta description."
publishedAt: 2026-08-24
updatedAt: 2026-08-25              # NEW, optional
categories: [humanoids, funding]   # 1–3, from the fixed vocabulary in §4
format: news                       # NEW, optional — defaults to "news"
featured: false
author:
  name: "Arjun Joshi"
  avatar: "/img/authors/arjun.png" # optional
image:                             # whole block optional
  light: "https://images.unsplash.com/photo-..."
  dark: "https://images.unsplash.com/photo-..."
  aspectRatio: "16/9"
  credit: "Figure"                 # NEW, optional
  creditUrl: "https://figure.ai/press"   # NEW, optional
---
```

### Field rules

| Field | Type | Required | Notes |
|---|---|---|---|
| `title` | string | yes | No H1 in the body; the page title comes from here |
| `description` | string | yes | ≤155 characters. Meta description and card blurb |
| `publishedAt` | `YYYY-MM-DD` | yes | |
| `updatedAt` | `YYYY-MM-DD` | no | Set when a post is materially corrected or updated |
| `categories` | array | yes | 1–3 kebab-case slugs, **from §4 only** |
| `format` | string | no | `news` \| `explainer` \| `launch` \| `field-notes`. Default `news` |
| `featured` | boolean | no | Default `false`. Automation never sets `true` |
| `author.name` | string | yes | |
| `author.avatar` | string | no | Omit-safe |
| `image` | object | no | Whole block omit-safe |
| `image.light` / `.dark` | URL string | no | Remote URLs only, never repo files |
| `image.aspectRatio` | string | no | Default `16/9` |
| `image.credit` / `.creditUrl` | string | no | See §6 |

### Why each new field exists

**`updatedAt`** — the site publishes corrections on the piece itself, with the date.
Search engines read this for freshness, and `NewsArticle` structured data expects it.
Without it, a corrected post looks stale.

**`format`** — keeps the *kind* of writing out of `categories`. Without it, values like
`launch` leak into the beat vocabulary and pollute the beat pages. Default `news` means
the automation can omit it entirely until we need it.

**`image.credit` / `image.creditUrl`** — required once images come from company press
kits rather than Unsplash (§6). Attribution is both an editorial and a licensing
obligation.

---

## 4. Category vocabulary (beats)

`categories` is a **closed vocabulary**. A slug not on this list is a build error, not a
new category. Adding a beat is an editorial decision, not an automation one.

| Slug | Covers | Does not cover |
|---|---|---|
| `humanoids` | General-purpose bipeds and androids, commercial and research | Home-specific humanoids → `home-consumer` |
| `home-consumer` | Robots for domestic and personal use, including home humanoids | Buy-advice reviews of vacuums, mowers, pool bots |
| `industrial-warehouse` | Arms, cobots, AMRs, fulfilment, manufacturing cells | |
| `field-mobility` | Agriculture, construction, inspection, drones, outdoor autonomy | Passenger self-driving cars |
| `software-autonomy` | VLA models, sim-to-real, control stacks, teleoperation, perception | |
| `components-supply-chain` | Actuators, harmonic drives, sensors, batteries, chips, supply | |
| `policy-standards` | Regulation, safety standards (ISO, CE, OSHA), certification, labour | |

### The `funding` tag

Money stories do **not** get their own beat. A funding round files under its subject
beat with `funding` as a second category:

```yaml
categories: [humanoids, funding]
categories: [industrial-warehouse, funding]
```

This keeps the engineering voice primary, and means a reader browsing `humanoids` sees
the money news *about humanoids* rather than a generic deal feed.

`funding` covers rounds, M&A, IPOs, shutdowns. It is the only cross-cutting tag; do not
invent others without an editorial decision.

### A note on `home-consumer`

This beat exists because home humanoids are where the gap between demo and shipped
reality is widest — several ship with human teleoperators in the loop, disclosed to
varying degrees. That is the site's core subject.

It is **not** a product-review beat. We are not buying vacuums and mowers to test.
Coverage is announcements, teardowns, spec analysis and claim-checking.

---

## 5. Body template

MDX, GFM. No H1 in the body. `{`, `}` and `<` break MDX in prose — put code, config,
JSON and angle brackets in fenced code blocks.

### `format: news` — the default, ~600–850 words

1. **Opening paragraph, 40–60 words.** What happened, who did it, why a reader who
   follows this field should care. No throat-clearing, no "in today's fast-moving
   world of robotics".
2. `## Key takeaways` — 3–5 bullets.
3. **Declarative `##` sections.** "What shipped", "How it compares", "What this means
   for integrators". *Not* question-shaped headings — those read like a help doc on a
   news story.
4. `## What we couldn't verify` — **mandatory** on any story built on a company claim,
   a demo, or a press release. See §5.1.
5. Optional image credit line at the foot.

### `format: launch`

Follows the existing house launch template: what it is → the numbers, as a table with
a source column → what is unverified → how it compares → what to watch.

### `format: explainer` — evergreen, occasional

Question-shaped `##` headings are fine here. `## Frequently asked questions` with `###`
question headings is **optional** and no longer earns rich results — include it only
where it genuinely helps a reader.

### `format: field-notes`

Looser. First-person observation from an event, a factory floor or a demo. No required
structure beyond the opening paragraph.

### 5.1 The "What we couldn't verify" rule

This section is the site's differentiator and the reason a reader picks Robywire over
a press-release reprint. It states plainly:

- which figures come from a datasheet, which from a briefing, which we measured
- whether a capability was **demonstrated** or **deployed** — never conflate them
- what we asked for and did not receive
- what we could not check at all

Two or three sentences is enough. It costs less to write than an FAQ block and it is
the one part of the piece nobody else publishes.

---

## 6. Image policy

**Change from v1.** The original brief specified Unsplash hero images, with the same
URL used for both `image.light` and `image.dark`.

Stock photography of generic sci-fi robots undercuts a publication whose thesis is
"do not trust the demo". Unsplash's robotics library is largely renders and toys.

Preference order:

1. **The company's own press-kit image**, with `image.credit` and `image.creditUrl`
   set. Check the press kit's terms — most permit editorial use with attribution.
2. **No image.** The `image` block is omit-safe and the card layout handles it. A
   headline with no picture beats a headline with a misleading one.
3. **Unsplash**, only where genuinely apt, with the italic credit line at the foot.

If `image.light` and `image.dark` would be the same URL, set only `image.light`. Two
fields pointing at one file achieves nothing; the dark variant exists for images that
actually need a different treatment on a dark ground.

Remote hosts must be allow-listed in the Astro image config. Never download hotlinked
images into the repo.

---

## 7. Slugs

Kebab-case, lowercase, letters/digits/hyphens, no dates — unchanged from v1.

**New rule for recurring stories.** A daily news site will want the same slug twice:
`figure-raises-series-c` can plausibly recur. On collision, append the year, then the
month:

```
figure-raises-series-c
figure-raises-series-c-2027
figure-raises-series-c-2027-03
```

The automation must check for an existing file before committing and disambiguate
rather than overwrite.

---

## 8. What the site provides

Derived automatically from frontmatter. The automation does not produce these, but they
are only correct if the frontmatter is:

- `/news` — index, newest first by `publishedAt`, paginated
- `/topics/<beat>` — a landing page per beat in §4. **Corrected from `/news/<beat>`**,
  which collided with `/news/<slug>`: a post slugged `humanoids` would have been
  ambiguous with the humanoids beat page. `/topics/` removes the class of bug.
- `/rss.xml` — full feed
- `NewsArticle` JSON-LD per post, using `title`, `description`, `publishedAt`,
  `updatedAt`, `author.name` and `image.light`
- `sitemap.xml`
- Author pages, if we run more than two bylines

Note that RSS and beat pages were both excluded by the v1 brief. For a daily news
publication they are not optional: RSS feeds aggregators and the newsletter, and beat
pages are how both readers and search engines understand what we cover.

---

## 9. Sign-off checklist for the content team

- [ ] Route change `/blog/` → `/news/` accepted, automation re-pointed
- [ ] Three optional fields added to the frontmatter assembler: `updatedAt`, `format`,
      `image.credit` / `image.creditUrl`
- [ ] Closed category vocabulary (§4) loaded into the assembler, with validation
- [ ] `funding` handled as a second category, not a beat
- [ ] FAQ block removed from the default template; retained for `explainer` only
- [ ] "What we couldn't verify" added as a required section for claim-based stories
- [ ] Image sourcing moved to press kits, with credit fields populated
- [ ] Slug collision rule implemented

## 10. Open questions

1. **Bylines.** How many writers, and do we want author pages? Real bylines matter more
   for news credibility than for evergreen content.
2. **Explainers.** Is `format: explainer` in scope at all, or is Robywire news-only for
   now? It changes whether we keep the FAQ machinery.
3. **Corrections.** Where does correction text live — appended to the body, or a
   dedicated frontmatter field? `updatedAt` records *that* it changed, not *what*.
