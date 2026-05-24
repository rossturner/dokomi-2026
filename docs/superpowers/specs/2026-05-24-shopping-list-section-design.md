# Shopping-List Section Design

**Date:** 2026-05-24
**Status:** Approved

## Goal

Add a read-only per-artist shopping plan to each invitee card in the DoKomi 2026 convention app, sourced from the user's pre-con shopping list. Also drop three artists who are no longer being visited.

## Scope

Single feature, single app (`dokomi-2026`). Changes touch one JSON data file, one type, one component, one stylesheet, and `package.json`. No persistence, no search integration, no app-level totals.

## Source content

The shopping list is the user-provided "DoKomi 2026 Saturday 30 May Artist Alley Shopping List". Twenty-two list entries (Yocci & Momo is one joint entry) cover twenty-three convention.json invitees (Yocci and Momo are separate slugs sharing booth 5N03; both receive the joint markdown).

### Dropped artists

Remove these slugs from `public/convention.json`:

- `lvl` (booth 3K49)
- `yen` (booth 3C50)
- `wonni` (booth 5J52)

After removal, `convention.json` contains 23 entries.

### Slug mapping (shopping list label → convention.json slug)

- Namii / Namiorii → `namii`
- BANGSOM → `bangsom`
- Burasto → `bura`
- Cauli → `cauli`
- Djamila Knopf → `djamila-knopf`
- Feihai → `feihai`
- Lucidsky → `lucid`
- Pinlin → `pinlin`
- Sabs → `sabs`
- Kiwi → `kiwi`
- Yuki Azuma → `azumayuki`
- Appleseed → `appleseed`
- Beryl → `beryl`
- Nana → `nana`
- Hanh Chu → `hanh-chu`
- J.K. → `jk`
- Miyu → `miyu`
- Ruca → `ruca`
- Leyla → `leyla`
- Yocci & Momo (joint) → both `yocci` and `momo`. Both slugs receive the same shopping markdown, prefixed with a single italic line `*Joint table with Momo*` (on the `yocci` card) or `*Joint table with Yocci*` (on the `momo` card).
- Nai → `nai`
- Yenko → `yenko`

## Data model

### Schema change

Add one field to `Invitee`:

```ts
shopping: string;
```

Required, not optional. Every kept invitee gets a value. Newline-delimited GitHub-flavoured markdown, identical to the wording in the source list for that artist, including the budget line and any warnings. The artist name and booth heading from the source list are omitted because the card already shows that information.

### Example value (for slug `namii`)

```markdown
- [ ] Hololive fanbook — €40 *(priority pick, if available)*
- [ ] **If not:** Prints N4, N5, N6, N8 in A4 → **€30 total** *(buy 3 get 1 free)*

Budget: €30–€40
```

The closing `Budget:` line is appended for every artist, derived from the source list's per-artist budget range. For artists where the source gives a single budget (e.g. €30), the line reads `Budget: €30`.

## Rendering

### Placement in `InviteeCard.tsx`

A new `card-section` titled "Shopping plan" sits after the existing "Other links" section and before the "Mark contacted" button. Renders the `invitee.shopping` markdown via `react-markdown` configured with `remark-gfm`.

`remark-gfm` is required so the `- [ ]` syntax becomes a visible disabled checkbox `<input type="checkbox" disabled>` rather than a literal bracket bullet. Bold (`**...**`), italic (`*...*`), and emoji pass through natively.

### Component changes

- New section in the existing expanded body. No new sub-component is required for the markdown render, but if `InviteeCard.tsx` grows uncomfortable, the shopping block may be split into `ShoppingList.tsx` as part of this change.

### CSS additions in `styles.css`

- `.card-shopping ul` with `padding-left` tightened to give the checkbox column visual alignment.
- `.card-shopping input[type=checkbox]` styled as disabled (no hover affordance) so users do not try to tap them.
- `.card-shopping p` and `.card-shopping li` line spacing comfortable for thumb-distance reading.
- `.card-shopping strong` weight unchanged from default browser bold but `.card-shopping em` may be coloured slightly muted to read as an aside.

## Dependencies

Add to `package.json` dependencies:

- `react-markdown` ^9
- `remark-gfm` ^4

Estimated bundle cost: roughly 30kb gzip combined. Acceptable for a tool used standalone on the user's own phone.

## What is intentionally not built

- No checkbox state. Items are visual only.
- No localStorage entry for purchased items.
- No app-wide running total or budget summary.
- Search does not index shopping content. The existing `goesBy` substring filter is unchanged.
- No UI for hiding or showing dropped artists. They are deleted from the data.
- Shopping content is not editable in-app. Updates are made by editing `convention.json` and redeploying.

## Acceptance criteria

1. `public/convention.json` contains exactly 23 entries.
2. Every entry has a non-empty `shopping` field containing markdown matching the source list's content for that artist.
3. The `Invitee` TypeScript type carries `shopping: string` and the project type-checks.
4. Expanding any card renders a "Shopping plan" section below "Other links" and above the Mark contacted button.
5. The `- [ ]` markdown checkboxes render as visible disabled inputs.
6. Bold and italic styles render. Emoji render.
7. All existing tests pass. The two test files that construct `Invitee` literals (`tests/search.test.ts` and `tests/grouping.test.ts`) are updated to add a `shopping` field to each stub. Test logic is otherwise unchanged.
8. `npm run build` succeeds with no TypeScript errors.

## Files affected

- `public/convention.json` — drop 3 entries, add `shopping` to 23
- `src/lib/types.ts` — widen `Invitee`
- `src/components/InviteeCard.tsx` — add shopping section
- `src/styles.css` — add `.card-shopping*` rules
- `package.json` and `package-lock.json` — add `react-markdown` and `remark-gfm`
- Tests in `tests/` — fixture updates if any test instantiates a full `Invitee` literal
