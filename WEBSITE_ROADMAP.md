# Blokraai Woordeboek — Website Roadmap

Working document to extend the website step by step.  
Check off items as we complete them. Add notes under each section as decisions are made.

**Current site:** `website/index.html`, `website/privacy.html`  
**Domain (planned):** https://blokraaiwoordeboek.co.za  
**Support email:** info@blokraaiwoordeboek.co.za

---

## How we'll work

1. Pick **one bullet** from the sections below.
2. Discuss scope and any assets needed.
3. Implement that item only.
4. Review, then move to the next bullet.

---

## Decisions to capture (fill in as we go)

| Question | Answer |
|----------|--------|
| Primary goal (Play Store / support / marketing) | _TBD_ |
| Language priority (AF / EN / equal) | _TBD_ |
| Hosting (`.co.za` / GitHub Pages / Netlify) | _TBD_ |
| Contact: `mailto` only or contact form? | _TBD_ |
| Trial length & monthly price (for pricing page) | _TBD_ |
| Screenshots & app icon available? | _TBD_ |

---

## 1. Visual polish & trust

Makes the site feel more professional and app-store ready.

- [ ] **1.1 Real app icon & screenshots** — Replace placeholder phone mockup with Play Store assets  
  - _Effort: Low_  
  - _Needs: App icon PNG, 3–5 screenshots_

- [ ] **1.2 Screenshot carousel / gallery** — Show Clue, Answer, Groups, Anagram screens in action  
  - _Effort: Low–medium_  
  - _Needs: Same screenshots as 1.1_

- [ ] **1.3 Feature “how-to” section** — Short guides per feature (wildcards, `?` for unknown letters, etc.)  
  - _Effort: Medium_  
  - _Needs: Copy approval (AF/EN)_

- [ ] **1.4 Dark mode** — Match system preference for evening browsing  
  - _Effort: Low_

**Section notes:**

```
(add notes here)
```

---

## 2. Content pages

More pages that help users and support Google Play requirements.

- [ ] **2.1 FAQ** — e.g. offline use, cost, wildcards, trial  
  - _Effort: Low_

- [ ] **2.2 Changelog / What’s new** — Version history (app currently v1.5)  
  - _Effort: Low_

- [ ] **2.3 Terms of service** — Complements privacy policy; useful with subscriptions  
  - _Effort: Medium_

- [ ] **2.4 POPIA notice** — South African data protection add-on to privacy page  
  - _Effort: Low_

**Section notes:**

```
(add notes here)
```

---

## 3. Subscription & pricing

App has trial + Google Play subscription (`blokraai_monthly`).

- [ ] **3.1 Pricing section** — Trial length, monthly price, what’s included  
  - _Effort: Low_  
  - _Needs: Public trial rules & price from Play Console_

- [ ] **3.2 Free vs full comparison** — Table: trial vs subscriber features  
  - _Effort: Low–medium_

- [ ] **3.3 “Restore purchase” help** — Short help for users who reinstalled  
  - _Effort: Low_

**Section notes:**

```
(add notes here)
```

---

## 4. Support & contact

- [ ] **4.1 Contact form** — Name, email, message → info@blokraaiwoordeboek.co.za  
  - _Effort: Medium_  
  - _Needs: Formspree, Netlify Forms, or similar_

- [ ] **4.2 Support / troubleshooting page** — App won’t open, database update, tester access  
  - _Effort: Low–medium_

- [ ] **4.3 Play Store reviews link** — Social proof + “Rate us” CTA  
  - _Effort: Low_

**Section notes:**

```
(add notes here)
```

---

## 5. Discovery & SEO

Help people find the site via Google and improve link previews.

- [ ] **5.1 Sitemap & robots.txt**  
  - _Effort: Low_

- [ ] **5.2 Structured data** — SoftwareApplication schema for rich results  
  - _Effort: Low_

- [ ] **5.3 Open Graph image** — Preview image for WhatsApp / Facebook shares  
  - _Effort: Low_  
  - _Needs: 1200×630 image (can derive from feature graphic)_

- [ ] **5.4 Blog / tips** — e.g. “5 tips for Afrikaans crosswords” _(optional, long-term)_  
  - _Effort: High_

**Section notes:**

```
(add notes here)
```

---

## 6. Deployment & hosting

Static site — choose where it lives and how updates are published.

- [ ] **6.1 Choose host** — `.co.za` FTP/cPanel vs GitHub Pages vs Netlify/Vercel  
  - _Document choice in Decisions table above_

- [ ] **6.2 Point DNS** — `blokraaiwoordeboek.co.za` → hosting  
  - _Needs: Registrar / DNS access_

- [ ] **6.3 Deploy first version** — Upload or connect git auto-deploy  
  - _Effort: Low–medium_

- [ ] **6.4 Play Console URLs** — Privacy policy URL → `…/privacy.html`  
  - _Effort: Low_

- [ ] **6.5 Retire broken root file** — Replace/fix `privacy-policy.html` merge conflict at repo root  
  - _Effort: Low_

**Section notes:**

```
(add notes here)
```

---

## 7. Bigger ideas (higher effort)

Only if they align with long-term goals.

- [ ] **7.1 Limited web demo search** — Separate public API or DB subset (app DB is encrypted/offline)  
  - _Effort: High — separate project_

- [ ] **7.2 Newsletter / beta signup** — Email list for updates or closed testing  
  - _Effort: Medium_

- [ ] **7.3 Admin panel for changelog** — Usually overkill for a small static site  
  - _Effort: High_

**Section notes:**

```
(add notes here)
```

---

## Suggested phases (optional order)

### Phase A — Quick wins
- [ ] 1.1 Real app icon & screenshots
- [ ] 2.1 FAQ
- [ ] 3.1 Pricing section
- [ ] 6.5 Fix root `privacy-policy.html`
- [ ] 6.3 Deploy first version

### Phase B — Trust & compliance
- [ ] 2.3 Terms of service
- [ ] 2.4 POPIA notice
- [ ] 5.2 Structured data
- [ ] 5.3 Open Graph image

### Phase C — Support & growth
- [ ] 4.1 Contact form (if needed)
- [ ] 2.2 Changelog
- [ ] 4.2 Support page
- [ ] 4.3 Play Store reviews link

---

## Session log

| Date | Item | Status | Notes |
|------|------|--------|-------|
| 2025-06-08 | Initial site (`index.html`, `privacy.html`, styles) | Done | Landing + bilingual privacy |
| 2025-06-08 | Leidraad feature page (videos + screenshot carousel) | Done | `features/leidraad.html` |
| | **Duplicate template** for other 5 functions | Next | |

---

## Next step

**Start with bullet 1.1 — Real app icon & screenshots**

Before implementing, confirm:
1. Do you have PNG screenshots and the app icon ready (or should we export from the project)?
2. Afrikaans-first, English-first, or equal for any new copy on that section?
