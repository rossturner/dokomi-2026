# Shopping-List Section Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a read-only per-artist shopping plan section to each invitee card, sourced from the pre-DoKomi shopping list. Drop three artists (`lvl`, `yen`, `wonni`).

**Architecture:** Markdown blob per invitee stored in `public/convention.json`, rendered with `react-markdown` + `remark-gfm` so GitHub-flavoured task-list syntax becomes visual disabled checkboxes. Section sits in the existing expanded card body between "Other links" and "Mark contacted".

**Tech Stack:** Vite + React + TypeScript, react-markdown, remark-gfm.

**Spec:** `docs/superpowers/specs/2026-05-24-shopping-list-section-design.md`

---

### Task 0: Schema widen, drop 3 artists, stub `shopping` everywhere

**Files:**
- Modify: `src/lib/types.ts`
- Modify: `tests/search.test.ts`
- Modify: `tests/grouping.test.ts`
- Modify: `public/convention.json`

- [ ] **Step 1: Widen the `Invitee` type**

Add `shopping: string` to the `Invitee` type. The full type becomes:

```ts
export type Invitee = {
  slug: string;
  goesBy: string;
  hall: string;
  booth: string;
  languages: string[];
  blurb: string;
  socials: Social;
  links: Link[];
  shopping: string;
};
```

- [ ] **Step 2: Update test stubs**

`tests/search.test.ts` line 5 stub becomes:

```ts
const stub = (goesBy: string): Invitee => ({
  slug: goesBy.toLowerCase(),
  goesBy,
  hall: 'Hall 3',
  booth: 'X',
  languages: ['English'],
  blurb: '',
  socials: {},
  links: [],
  shopping: '',
});
```

`tests/grouping.test.ts` line 5 stub becomes:

```ts
const stub = (slug: string, hall: string): Invitee => ({
  slug,
  goesBy: slug,
  hall,
  booth: 'X',
  languages: ['English'],
  blurb: '',
  socials: {},
  links: [],
  shopping: '',
});
```

- [ ] **Step 3: Run tests and tsc**

Run: `npm test && npx tsc -b`
Expected: PASS (15 tests) and zero TS errors.

- [ ] **Step 4: Drop three entries from `public/convention.json`**

Use a Node one-liner so the diff is precise and the JSON stays valid:

```bash
node -e "
const fs=require('fs');
const p='public/convention.json';
const d=JSON.parse(fs.readFileSync(p,'utf8'));
const dropped=new Set(['lvl','yen','wonni']);
const kept=d.filter(x=>!dropped.has(x.slug));
if (kept.length!==23) throw new Error('expected 23, got '+kept.length);
fs.writeFileSync(p, JSON.stringify(kept, null, 2)+'\n');
"
```

- [ ] **Step 5: Add empty `shopping` field to every remaining entry**

```bash
node -e "
const fs=require('fs');
const p='public/convention.json';
const d=JSON.parse(fs.readFileSync(p,'utf8'));
d.forEach(x=>{ if (typeof x.shopping!=='string') x.shopping=''; });
fs.writeFileSync(p, JSON.stringify(d, null, 2)+'\n');
"
```

- [ ] **Step 6: Verify the JSON**

Run:

```bash
node -e "
const d=require('./public/convention.json');
console.log('count:', d.length);
console.log('all have shopping:', d.every(x=>typeof x.shopping==='string'));
console.log('dropped still present:', d.some(x=>['lvl','yen','wonni'].includes(x.slug)));
console.log('keys:', Object.keys(d[0]).sort().join(','));
"
```

Expected output:
```
count: 23
all have shopping: true
dropped still present: false
keys: blurb,booth,goesBy,hall,languages,links,shopping,slug,socials
```

- [ ] **Step 7: Type-check and tests**

Run: `npm test && npx tsc -b`
Expected: PASS, zero TS errors.

- [ ] **Step 8: Commit**

```bash
git add src/lib/types.ts tests/search.test.ts tests/grouping.test.ts public/convention.json
git commit -m "feat: add shopping field to Invitee, drop 3 artists"
```

---

### Task 1: Author shopping markdown for each artist

**Files:**
- Modify: `public/convention.json` (populate `shopping` for all 23 entries)

**Authoring rule:** for each artist below, set `shopping` to the markdown block shown. Use a Node script that builds an object keyed by slug and merges it in, so the patch is mechanical and reviewable.

The source list omits the artist heading and booth line because the card already displays those. Every entry ends with a `Budget:` line. Bold (`**...**`), italic (`*...*`), em-dashes (`—`), and emoji pass through unchanged.

- [ ] **Step 1: Author the shopping map**

Create a temporary script `scripts/apply-shopping.mjs` with the literal map of slug → markdown:

```js
import { readFileSync, writeFileSync } from 'node:fs';

const map = {
  namii: `- [ ] Hololive fanbook — €40 *(priority pick, if available)*
- [ ] **If not:** Prints N4, N5, N6, N8 in A4 → **€30 total** *(buy 3 get 1 free)*

Budget: €30–€40`,
  bangsom: `- [ ] Catalogue TBC

Budget: €40–€50`,
  bura: `- [ ] Frieren lenticular Gameboy charm *(priority)*
- [ ] Aerith charm *(maybe)*
- [ ] Miku print A4
- [ ] Prices unknown

Budget: €40`,
  cauli: `- [ ] Catalogue pending — check closer to the day

Budget: €30`,
  'djamila-knopf': `- [ ] No DoKomi catalogue — check for artbooks at table

Budget: €30`,
  feihai: `- [ ] No catalogue, unlikely to have one — browse on the day

Budget: €30`,
  lucid: `- [ ] Nicole ZZZ standee *(priority)*
- [ ] Frieren acrylic block *(maybe)*
- [ ] Prints to fill remaining budget as appropriate
- [ ] Based on previous catalogue, not confirmed for DoKomi

Budget: €30`,
  pinlin: `- [ ] Sketch artbook — €30 *(priority, if available)*
- [ ] **If not:** 4× A4 prints — €45 *(buy 3 get 1 free)*

Budget: €30–€45`,
  sabs: `- [ ] No catalogue — browse on the day

Budget: €30`,
  kiwi: `- [ ] No catalogue — browse on the day

Budget: €30`,
  azumayuki: `- [ ] ZZZ artbook *(priority — 2 available, choose on the day)*
- [ ] **If not:** prints *(prices TBC from catalogue)*

Budget: €30`,
  appleseed: `- [ ] True Blue artbook — €25 *(first priority)*
- [ ] Sakamata Days artbook — €20 *(second priority, or buy both for €45)*
- [ ] **If neither:** 4× prints — €35

Budget: €20–€45`,
  beryl: `- [ ] Catalogue TBC

Budget: €30`,
  nana: `- [ ] No catalogue, unlikely to have one — browse on the day

Budget: €30`,
  'hanh-chu': `- [ ] 18+ artbook *(priority — if available at the table)*
- [ ] **If not:** AoD acrylic charm + ZZZ charms depending on bundle price
- [ ] Previous con catalogue exists but no prices & limited items of interest

Budget: €30`,
  jk: `- [ ] No catalogue expected — browse on the day

Budget: €30`,
  miyu: `- [ ] Gold foil A3 print — up to €30 *(priority)*
- [ ] **Or:** 2× A4 gold foil prints, or browse other A4 prints — €10 each

Budget: €30`,
  ruca: `- [ ] Catalogue coming soon — check before the day
- [ ] ⚠️ Likely won't be at table — plan for unattended browse

Budget: €30`,
  leyla: `- [ ] Prints only, prices TBC

Budget: €30`,
  yocci: `*Joint table with Momo*

- [ ] Nicole print P14 — €15
- [ ] Momo print P1 — €15
- [ ] Art zine — €40 *(priority)*
- [ ] **Or:** 18+ doujin — €40 *(if zine unavailable)*

Budget: €30 prints only · €70 with zine/doujin`,
  momo: `*Joint table with Yocci*

- [ ] Nicole print P14 — €15
- [ ] Momo print P1 — €15
- [ ] Art zine — €40 *(priority)*
- [ ] **Or:** 18+ doujin — €40 *(if zine unavailable)*

Budget: €30 prints only · €70 with zine/doujin`,
  nai: `- [ ] Illustration zine *(priority, price TBC)*
- [ ] **If not:** mix of prints

Budget: €30`,
  yenko: `- [ ] Artbook Prelude *(priority, price TBC)*
- [ ] **If not:** Prints 25, 7, 13 — buy 2 get 1 free
- [ ] ⭐ Mini stamp rally — completing here counts toward the rally!

Budget: €30`,
};

const path = 'public/convention.json';
const data = JSON.parse(readFileSync(path, 'utf8'));
const missing = data.filter(x => !(x.slug in map));
if (missing.length) throw new Error('no shopping for: ' + missing.map(x => x.slug).join(','));
const extra = Object.keys(map).filter(k => !data.some(x => x.slug === k));
if (extra.length) throw new Error('shopping for unknown slugs: ' + extra.join(','));
for (const entry of data) entry.shopping = map[entry.slug];
writeFileSync(path, JSON.stringify(data, null, 2) + '\n');
console.log('updated', data.length, 'entries');
```

- [ ] **Step 2: Run the script and delete it**

```bash
node scripts/apply-shopping.mjs
rm -rf scripts
```

Expected output: `updated 23 entries`.

- [ ] **Step 3: Sanity check**

Run:

```bash
node -e "
const d=require('./public/convention.json');
const empty=d.filter(x=>!x.shopping||!x.shopping.includes('Budget:'));
console.log('entries missing Budget line:', empty.length);
console.log('sample (yocci):');
console.log(d.find(x=>x.slug==='yocci').shopping);
"
```

Expected: `entries missing Budget line: 0` and the yocci sample renders the `Joint table with Momo` line and the joint budget.

- [ ] **Step 4: Commit**

```bash
git add public/convention.json
git commit -m "data: shopping plan per artist for DoKomi Saturday"
```

---

### Task 2: Install react-markdown and remark-gfm

**Files:**
- Modify: `package.json`, `package-lock.json`

- [ ] **Step 1: Install**

Run:

```bash
npm install react-markdown@^9 remark-gfm@^4
```

- [ ] **Step 2: Verify build still works**

Run: `npm run build`
Expected: success, no TS errors. Dependency footprint adds roughly 30kb gzip.

- [ ] **Step 3: Commit**

```bash
git add package.json package-lock.json
git commit -m "deps: add react-markdown and remark-gfm"
```

---

### Task 3: Render shopping section in InviteeCard

**Files:**
- Modify: `src/components/InviteeCard.tsx`
- Modify: `src/styles.css`

- [ ] **Step 1: Add the shopping section to `InviteeCard.tsx`**

At the top of the file, add the imports next to the existing imports:

```ts
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
```

Then add a new `card-section` block immediately after the existing `Other links` section (the `{invitee.links.length > 0 && ...}` block) and immediately before the `<button className="card-action" ...>` button:

```tsx
<div className="card-section card-shopping">
  <div className="card-section-label">Shopping plan</div>
  <ReactMarkdown remarkPlugins={[remarkGfm]}>{invitee.shopping}</ReactMarkdown>
</div>
```

- [ ] **Step 2: Add styles to `src/styles.css`**

Append at the end of the file:

```css
.card-shopping ul {
  list-style: none;
  padding-left: 0;
  margin: 0.25rem 0;
}
.card-shopping li {
  padding: 0.15rem 0;
  line-height: 1.4;
}
.card-shopping input[type="checkbox"] {
  margin-right: 0.5rem;
  vertical-align: middle;
  pointer-events: none;
}
.card-shopping em {
  color: rgba(255, 255, 255, 0.65);
  font-style: italic;
}
.card-shopping p {
  margin: 0.5rem 0 0 0;
  font-weight: 500;
}
```

The `pointer-events: none` makes it visually clear the checkboxes are not interactive without needing to set `disabled` on each input (remark-gfm already emits `disabled` but this belt-and-braces approach keeps tap targets clean on touch).

- [ ] **Step 3: Build and type-check**

Run: `npm run build`
Expected: success, zero TS errors.

- [ ] **Step 4: Smoke test in dev**

Run: `npm run dev` and open the served URL on http://localhost:5173/dokomi-2026/ (or whichever port Vite picks). Expand a card (e.g. Namii). Verify:

- A "Shopping plan" section appears between "Other links" and the Mark contacted button.
- Task-list items show as visible round/square checkboxes (browser default disabled inputs).
- Bold and italic render correctly. Em-dashes and emoji render.
- For Yocci or Momo, the `Joint table with ...` italic line appears.
- The `Budget:` line appears below the items.

Kill the dev server.

- [ ] **Step 5: Run all tests**

Run: `npm test`
Expected: PASS (15 tests).

- [ ] **Step 6: Commit**

```bash
git add src/components/InviteeCard.tsx src/styles.css
git commit -m "feat(card): render per-artist shopping plan section"
```

---

### Task 4: Build to `docs/` and deploy

**Files:**
- Modify: `docs/` (regenerated build output)

- [ ] **Step 1: Build**

```bash
npm run build
```

Expected: `docs/` regenerated, includes `index.html`, `assets/`, `manifest.webmanifest`, `sw.js`, `convention.json` with the shopping data baked into the precache.

- [ ] **Step 2: Commit and push**

```bash
git add docs
git commit -m "build: ship shopping-list section"
git push
```

- [ ] **Step 3: Verify live**

Wait ~30s, then open https://rossturner.github.io/dokomi-2026/ in a fresh tab (or hard-reload to bypass the service worker). Expand a card. Confirm the shopping section renders. Once the new service worker activates, the PWA on your phone will pick up the update on next launch while online.

---

## Acceptance summary

- 23 entries in `convention.json`, all with non-empty `shopping`
- `Invitee` type includes `shopping: string`
- All existing tests pass
- Expanded card shows "Shopping plan" between "Other links" and Mark contacted
- GFM task-list checkboxes render as visible non-interactive inputs
- Live URL serves the update
