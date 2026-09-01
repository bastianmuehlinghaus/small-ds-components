# Small DS — Components

React components on Radix primitives, driven entirely by `@small-ds/tokens`.
Currently Button, Accordion and DropdownMenu.

**Figma:** [Small DS: Components](https://www.figma.com/design/VBd0r5d1gcGPQSKrR8LzCp/Small-DS--Components)
(`VBd0r5d1gcGPQSKrR8LzCp`, page `Components`) — the same three components as
Figma component sets, built from the token library. Button 45 variants
(Variant × Size × State), Menu Item 16 (Type × State), Accordion Item 6
(State × Interaction), plus four icon components.
Tokens live in [Small DS: Design Tokens](https://www.figma.com/design/DABmspHvLwmzYjMrFBjVQW/Small-DS--Design-Tokens)
(`DABmspHvLwmzYjMrFBjVQW`).

Radix owns behaviour — focus management, keyboard navigation, ARIA, collision
-aware positioning. This package owns appearance, and every value in it comes
from a token.

## Rules

**1. Never invent a token.** If a component seems to need a value the tokens
don't cover, *ask Bastian first* — in Figma or in code. The system is
deliberately small; a plausible-looking gap is usually intentional. Do not add a
CSS custom property, a magic number, or a "temporary" literal.

**2. No hardcoded values.** Every visual decision resolves to a `var(--sds-*)`.
`npm run lint` fails the build otherwise. See *What lint does and does not
cover* below for the honest limits of that.

**3. No component reaches past the semantic layer.** Use Tier 2
(`--sds-color-background-raised`, `--sds-space-inset-lg`) and Tier 3
(`--sds-button-*`). Never Tier 1 — `--sds-color-neutral-*`,
`--sds-color-utility-*`, `--sds-spacing-*`, `--sds-typography-*`,
`--sds-border-radius-*`, and the numeric `--sds-size-control-40` /
`--sds-border-width-1` families.

Watch the near-collisions. These pairs differ by one layer:

| Tier 1 (banned) | Tier 2 (use this) |
|---|---|
| `--sds-spacing-16` | `--sds-space-inset-lg` |
| `--sds-size-control-40` | `--sds-size-control-md` |
| `--sds-border-width-1` | `--sds-border-width-default` |
| `--sds-border-radius-8` | `--sds-radius-surface` |

**The one exception is `--sds-motion-*`**, which has no Tier 2 layer by design:
durations don't change between modes and the easings are already named by intent
(`entrance`, `exit`, `emphasized`), so an alias tier would be 1:1 and carry no
meaning. The lint config permits it explicitly.

**4. Typography comes from classes, not properties.** Compose the Figma text
styles rather than setting `font-size` yourself — that is how components get
type without touching Tier 1:

```css
.trigger {
  composes: sds-type-label-large from "@small-ds/tokens/typography.css";
}
```

`composes` must be the **first declaration** in a rule and works only on a
simple class selector, so it cannot be conditional. Button needs different type
per size, which is why its `composes` sits on `.sm` / `.md` / `.lg` rather than
on `.base`. Copy that shape if another component needs per-variant type.

**5. Controls use `min-height`, never `height`.** Type is in `rem` and layout in
`px`, so a reader who raises their browser font size grows the label but not the
box. A fixed height clips it. Verified behaviour: a `md` Button holds at 40px
through a 24px base font and grows to 52px at 32px, never clipping.

## Which tier each component reads

This is deliberate and **not** an inconsistency to tidy up:

| Component | Reads | Why |
|---|---|---|
| Button | Tier 3 `--sds-button-*` | Figma defines a full Tier 3 surface for it |
| Accordion | Tier 2 semantics | Figma has no `accordion/*` tokens |
| DropdownMenu | Tier 2 semantics | Figma has no `menu/*` tokens |

If a component needs a Tier 3 token that doesn't exist, that is a conversation
with Bastian, not a token to add. See rule 1.

## What lint does and does not cover

`npm run lint` is the only thing actually holding rules 2 and 3 in place, so be
precise about its reach.

**It covers** `src/**/*.css`: hardcoded values, Tier 1 references, bare
durations and easings inside `transition` / `animation` shorthands (which
strict-value can't check, because a property name inside a shorthand legitimately
isn't a variable), and raw colours or dimensions assigned to local custom
properties — that last one exists because `stylelint-declaration-strict-value`
does not inspect `--*` declarations at all, so `--overlay-hover: #00000014`
would otherwise pass while the same value on `background-color` was rejected.

**It does not cover:**

- **`.tsx` files.** A dimension passed as a React prop is invisible to stylelint.
  `sideOffset = 4` in DropdownMenu is a real instance — right value, not sourced
  from a token. Tracked in #13. The honest phrasing of rule 2 is "no hardcoded
  values *in CSS*"; in TSX it is currently honour-based.
- **`.storybook/*.css`**, which is page chrome rather than library code and is
  deliberately exempt.

`npm run lint:rules` tests the config itself against fixtures in
`test/stylelint/`. It exists because if a regex there silently stops matching,
every other check still looks green.

## Things that will waste your time if you don't know them

- **`@small-ds/tokens` is linked by `file:../small-ds-tokens`**, because
  `npm link` needs write access to the global node root. Both repos must sit
  side by side. **Switch this to `^0.1.0` when the tokens package is published.**
- **Changing a token means rebuilding the tokens package** — `npm run build`
  over there, since `dist/` is gitignored and this repo reads it through the
  symlink. Storybook will not pick up a token change until you do.
- **Editor files are gitignored, and `git add .` will still catch you out.** Vim
  swap files are dotfiles, so `git status --short` hides them while `git add .`
  stages them anyway — one reached `main` this way. Check
  `git diff --cached --name-only` before committing, or stage by path.
- The Söhne `.woff2` files are gitignored for licensing reasons, not by
  accident. Storybook degrades to a system sans without them, with identical
  metrics.

## Known and accepted

- **1px alignment drift.** The DropdownMenu surface has a 1px border; `primary`
  and `default` Buttons do not. A borderless trigger's label therefore sits 1px
  left of the menu's item labels. Not corrected: `alignOffset={-1}` would be a
  magic number of exactly the kind rule 2 exists to prevent, and wrong the moment
  the menu's border changes. `secondary` triggers align exactly.

## Working in the Figma components file

**Söhne is not available to the Figma MCP environment.** The font is installed
locally, but the MCP runs against Figma's cloud font set —
`listAvailableFontsAsync` returns ~1,900 families and none of them is Söhne, and
`loadFontAsync` fails with *"The font family Söhne does not exist"*. Enabling
Figma's third-party agent integration does not change this; it points at the
same cloud endpoint.

Everything downstream follows from that. **Text styles have to be applied by
hand in the desktop app**, and a text node whose font cannot be loaded is
severely restricted:

| Operation on a styled text node | |
|---|---|
| `clone()`, reposition, rename | works |
| bind a fill to a colour variable | works |
| `appendChild` — into *any* frame, auto-layout or not | **fails** |
| `textAutoResize`, `characters`, `setTextStyleIdAsync` | **fails** |

So the build order is forced: **create the structure first, style last.** Once
text is styled it can never be moved, which is why the Figma Button is a single
frame rather than a component wrapping an inner surface — and therefore why its
focus ring is an outside stroke that replaces Secondary's border, where CSS uses
`outline` + `border` together.

Two more consequences worth knowing before you debug them:

- **Auto-layout cannot hug unmeasurable text.** The Open accordion variants
  reported 48px while visibly overflowing, because the frame could not measure
  its own content. They carry an explicit height instead.
- **`setBoundVariableForPaint` keeps the paint's original colour as a fallback,
  and Figma does not always resolve it.** Half the Button variants rendered
  black with invisible labels while their bindings were correct. Always resolve
  the variable through its alias chain and write that colour *as well as* the
  binding.

Tier 1 is not published to the library, so only Tier 2 and Tier 3 collections
are importable there. The semantic-layer rule is enforced by the library
boundary in Figma exactly as stylelint enforces it here.

## Commands

```sh
npm run storybook    # dev, with a light/dark toolbar toggle
npm run lint         # lint:css + lint:rules
npm run lint:rules   # tests the stylelint config itself against fixtures
npm run typecheck
npm run build        # vite lib build + declarations
npm run verify       # asserts the built artefact obeys the same rules
```

`npm run verify` checks `dist/`, not `src/` — `composes` pulls the tokens
package's typography classes into the bundle and CSS Modules rewrites the class
names on the way, so the shipped artefact needs its own assertion that nothing
reaches past the semantic layer. It also confirms React and Radix stay external.
