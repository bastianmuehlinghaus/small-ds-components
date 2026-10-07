# Small DS — Components

React components on Radix primitives, driven entirely by `@small-ds/tokens`.
Currently Button, Checkbox, RadioGroup, Input, TextField, Chip, Select, SelectField, Accordion and DropdownMenu.

**Figma:** [Small DS: Components](https://www.figma.com/design/VBd0r5d1gcGPQSKrR8LzCp/Small-DS--Components)
(`VBd0r5d1gcGPQSKrR8LzCp`) has one page per component, and each page shows the
component the way Storybook does. From the top:

1. A `Header` at (64, 64): the name in Heading/Large and a one-line description
   in Body/Small.
2. The building-block set: the variant matrix.
3. Any composite component that mirrors a code root. For example, the Radio
   group page has `Radio Group` as well as `Radio`, because the code is
   `RadioGroup.Root` + `.Item`.
4. An `Examples` heading (Heading/Small), then one `Example / <Story>` group per
   Storybook story, captioned with the story name (Label/Small). Stories that
   would look identical to the set, such as Controlled, Playground and
   Checkbox States, are left out. So are behaviour tests: stories tagged
   `test` (and `!autodocs`) that exist for their `play` function.

Everything is built from the token library. Examples keep the components'
placeholder copy ("Label", "Menu item"). Bastian chose not to retype the story
text.

| Page | Components | Variants | Code | Examples (= stories) |
|---|---|---|---|---|
| Button | `Button` set | 30: Variant × Size × State | `Button` | Variants, Sizes, Disabled, WithIcon |
| Checkbox | `Checkbox` set | 15: Checked (False, True, Indeterminate) × State | `Checkbox` | Default, SelectAll, WithoutLabel |
| Accordion | `Accordion Item` set; `Accordion` (3 exposed items) | 6: Variant (Closed, Open) × State | `Accordion.Item`; `Accordion.Root` | Single, Multiple, AllClosed |
| Radio group | `Radio` set; `Radio Group` set (items are exposed Radios) | 10: Checked × State; 6: Orientation × State | `RadioGroup.Item`; `RadioGroup.Root` | Default, Horizontal, DisabledItem, DisabledGroup, Invalid |
| Text field | `Input` set; `Text Field` set (label, exposed Input, message) | 20: Size (Small, Medium) × State × Value (Placeholder, Filled); 6: Size × State (Default, Disabled, Invalid) | `Input`; `TextField` | Input / Default, Input / Sizes, TextField / Default, WithDescription, Invalid, Disabled, Small |
| Dropdown menu | `Menu Item` set; `Menu Group Label`; `Menu Separator`; `Dropdown Menu` surface | 14: Type × State (Checkbox and Radio have no Selected) | `.Item` and friends; `.Label`; `.Separator`; `.Content` | Basic, OpenByDefault, WithSelection, SelectAll, WithSubmenu |
| Chip | `Chip` set | 7: Removable × State (Default, Hover, Pressed, Focus, Disabled; a chip without a remove button has only Default and Disabled) | `Chip` | Default, Removable, Disabled, LongLabel |
| Select | `Select` set; `Select Field` set (label, Select instance, message) | 30: Size × State × Value (Placeholder, Filled, Chips); 6: Size × State (Default, Disabled, Invalid) | `Select`; `SelectField` | Select: Single, SingleWithValue, Multiple, MultipleEmpty, MultipleWrapping, Small, Invalid, Disabled, DisabledMultiple. SelectField: Default, WithDescription, Invalid, Disabled, Small, Multiple |
| Listbox | `Option` set; `Listbox` set (a surface of Option instances) | 12: Type (Single, Multiple) × State (Default, Highlighted, Disabled) × Checked; 2: Selection (Single, Multiple) | none of its own: the list inside `Select` | none. `Select`'s `SingleOpen` and `MultipleOpen` use it |
| Icons | six `Icon / <name>` components | n/a | `ChevronRightIcon`, `ChevronDownIcon`, `ChevronUpIcon`, `CheckmarkIcon`, `DashIcon`, `CloseIcon` | Sizes (16 / 20 / 24, bound to `size/icon/*`) |
| Focus ring | `Focus Ring` set | 2: borderWidth | none. CSS uses `outline`. Used by the Button Focus variants | n/a |

### Why there is a Listbox page, and not just the Dropdown Menu

The Listbox looks like the Dropdown Menu's surface with checkbox or radio rows,
and it is built from them. It exists anyway, because it is a different pattern,
and Figma is where that difference has to be visible before anyone codes:

- **A menu runs actions, a listbox chooses a value.** The Dropdown Menu is
  `role="menu"` with `menuitem`s: commands and view settings. The Listbox is
  what a `Select` opens: `role="listbox"` with `option`s that are `aria-selected`,
  the value of a form field. Screen readers, type-ahead and form behaviour all
  follow from that role, so a designer who draws a select with a Menu has
  specified the wrong thing, however similar the pixels are. A separate,
  differently named component (`Option`, not `Menu Item`; `Listbox`, not
  `Dropdown Menu`) puts the choice in the layer panel.
- **It is narrower on purpose.** An Option is only ever a radio (single) or a
  checkbox (multiple) row. There are no plain actions, submenus, group labels or
  separators in it, which the menu has. If one is needed, that is a decision to
  take with Bastian, not a variant to add.
- **Its states have a different vocabulary.** An Option is *Highlighted* (by
  pointer or keyboard), *Disabled*, and *Checked*. The Menu Item's `Hover` and
  `Selected` do not map one to one, and a checked row has no selected fill in
  either, because the box already says it.
- **Its behaviour differs.** A single Select closes on choice, where the menu's
  radio rows stay open. Its surface is at least as wide as the field and opens
  below it, with a 4px offset.
- **One source for the rows.** `Option` wraps a `Menu Item` instance, so a change
  to the menu's row reaches the Listbox with no second copy to keep in step, as
  `Select`'s CSS does by composing the menu's `.item`. Before this page the open
  Select was drawn as a detached copy of the menu, and a detached copy is the
  one that drifts.

In code there is no standalone `Listbox`: the list is internal to `Select`
(`defaultOpen` renders it, for the `SingleOpen` and `MultipleOpen` stories). The
Figma page is its specification. Extracting a public component, for a future
Combobox or a standalone list, is an open decision; it needs a use case first.

The Chip and Select pages were built with Inter placeholder text, since Söhne
is unavailable to the MCP (see below), so their text styles are applied by hand:
Header title Heading/Large, Header description Body/Small, `Examples` Heading/Small,
example captions and the Chip label Label/Small, the Select value and
placeholder Body/XSmall, and the Select Field label and message Label/Medium.
Apply a style to the main components' text and instances follow. The Listbox
page is the exception: its rows are Menu Item instances with Söhne text already,
so only its Header needs styles, in the same way. The Select set
is drawn closed, as the stories are; its open list is the `Dropdown Menu`
surface with checkbox or radio items, which is what the code reuses.

The `Dropdown Menu` surface mirrors `.content` exactly: `background/raised`, a
1px `border/default` (inside, counted in layout, as CSS `border-box` does),
`radius/surface`, `inset-xs` padding and the `shadow/overlay` effect style.
Examples whose rows differ from it are detached frames with the same bindings.
Their trigger Buttons are `State=Pressed`, because a Button holds the pressed
overlay while `aria-expanded` is true.

A `Menu Group Label` (`.Label` in code, Radix's name) divides groups on its
own: its `inset-md` top padding is the gap. A separator directly before one
is not drawn. CSS hides it, so a consumer can't double up the divider.

A new component gets its own page in the same shape, with an example for each
of its stories.

Tokens live in [Small DS: Design Tokens](https://www.figma.com/design/DABmspHvLwmzYjMrFBjVQW/Small-DS--Design-Tokens)
(`DABmspHvLwmzYjMrFBjVQW`).

Radix owns behaviour — focus management, keyboard navigation, ARIA, collision
-aware positioning (Select is the exception: Base UI, see below). This package owns appearance, and every value in it comes
from a token.

The one behaviour change: DropdownMenu checkbox and radio rows keep the menu
open when chosen, because they are settings rather than actions. Plain items
still close it, as do Escape, an outside press and the trigger.

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
per size, which is why its `composes` sits on `.sm` / `.md` rather than
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
| Input | Tier 3 `--sds-input-*`, plus Tier 2 border widths | Figma defines a full Tier 3 surface for it |
| Select | Tier 3 `--sds-input-*` and `--sds-select-*`, plus Tier 2 for the list | the box is Input's; Figma defines two `select/*` tokens (placeholder, indicator) |
| Chip | Tier 3 `--sds-chip-size-height`, plus Tier 2 | Figma defines one `chip/*` token, its height; `space/inline/xxs` (2) is Tier 2 |
| TextField | Input for the box, Tier 2 for the label and message | no `text-field/*` tokens |
| Checkbox, RadioGroup | Tier 3 `--sds-selection-control-*` for the box, Tier 2 for the footprint and focus ring | Tier 3 models the box only |
| DropdownMenu | Tier 2 semantics | Figma has no `menu/*` tokens |

Input is a native `<input>`: Radix has no text-input primitive, and the
browser already owns the behaviour. TextField adds `@radix-ui/react-label`, an
`aria-describedby` message, and `error`, which implies `invalid`. Focus wins
over Invalid, as in Figma. The 2px focus border is a real border at
`border-width-focus`, with `padding-inline` reduced by the extra width so the
text doesn't shift. Don't go back to the earlier approach, a 1px border plus an
outline drawn inside it: those are two curves, and their corners visibly
disagree. `box-shadow: inset` would also work, but the strict-value lint
rejects the `inset` keyword. Hover is a flat
`linear-gradient` of the overlay token, because an `<input>` can't carry
`::after`.

Select is the one component on **Base UI** rather than Radix, deliberately.
A select field is a listbox by convention: the trigger is a combobox, the rows
are options, `multiple` adds `aria-multiselectable`. Radix has no multiple
Select, and building one from DropdownMenu would announce as a button that
opens a menu of settings, which is wrong for a form field. Everything else
stays on Radix; do not mix the two inside one component. The rows reuse the
DropdownMenu's (`composes` of its `.item`, which keys on `data-highlighted` and
`data-disabled`, as Base UI does too) and the Checkbox/Radio box, so a Select
and a menu with selection rows look the same. Single shows radio rows and
closes on choice; `multiple` shows checkbox rows, stays open, and puts a Chip
per choice in the field. The list is positioned below the field
(`alignItemWithTrigger={false}`); Base UI's default overlays the trigger.
`defaultOpen` renders it open, for the `SingleOpen` and `MultipleOpen` stories,
which are `!autodocs`: an open Select is modal, so a Docs page can show only one
and it would lock the page.

Single: the trigger button is the box and holds the value. Multiple: a button
cannot hold the chips' buttons, so the trigger is an absolutely positioned layer
under the content, and the chips sit above it with `pointer-events: none`,
except each chip's remove button. The trigger still holds the chosen labels as
text, hidden by colour, so a screen reader reads the value from the combobox.
Removing a chip moves focus to the trigger, since the chip unmounts with it. The
trigger's states repeat Input's, because an `<input>` and a `<button>` cannot
share a rule set; change them together. SelectField shares TextField's
stylesheet for the label and message.

**Inside a Radix Dialog** (tested, and kept as the `InsideRadixDialog` story, a
regression test confirmed to fail without either fix) a Select needs two things
from the Dialog's side. First, `portalContainer`: pass the Dialog content
element. A Radix modal sets `pointer-events: none` on `<body>`, and the list
portals there, so by default its options cannot be clicked. Second, the Dialog
must veto its own Escape while the Select is open, or one Escape closes both:
`onEscapeKeyDown={(e) => { if (e.target.closest('[role="listbox"],
[role="combobox"][aria-expanded="true"]')) e.preventDefault(); }}`. Base UI keeps
the focus on the trigger while the list is open, so the target is the trigger,
not the list. A future Dialog component should do both itself, with a context
for the container.

Chip is static. Its only interactive part is the optional remove button, named
"Remove" + the label. Its height is `chip/size/height` (20, aliasing
`size/icon/md`), added with Bastian's approval so that a Select's field is as
tall as an Input: a row of 20px chips plus the field's padding fits inside the
32px (`sm`) and 40px (`md`) minimums, so the height changes only when chips wrap
onto a second row. This follows Atlassian, whose multi-value tag is 20px for the
same reason. A 24px chip made `sm` grow to 34. The `SameHeightAsInput` story
holds it.

The remove button is the × itself: 16 square (`size-icon-sm`) with
`radius-control-sm`, so its hover and pressed fill is a small rounded square
inset from the chip's edges, not a strip. It sits 2 from the top, bottom and end
(`space-inline-xxs`, added for this, with Bastian's approval), 4 from the label,
and the label starts 4 from the start. A chip without a button pads 4 at both
ends, so both kinds share the same start inset. The button is a 16px target;
WCAG 2.2's 24px minimum (2.5.8) is met only through its spacing exception, which
the Select's field-wide trigger underneath arguably defeats. Worth a look before
anyone relies on a claim of AA conformance.

Checkbox, RadioGroup and the DropdownMenu checkbox/radio rows share
`SelectionControl.module.css`, which is internal. The control is sized like an
icon, following Atlassian: a `size-icon-lg` (24) footprint with the box inset
by `space-inset-xs`, so the box is 16px with no box-size token.
`selection-control/size/sm|md` are deliberately unused. The menu draws the box
only, never a second Radix control, because the row is already the
`menuitemcheckbox`. Checkbox supports Radix's `"indeterminate"`, styled as
checked with `DashIcon` for the mark. The Indicator renders both glyphs and
its `data-state` picks one in CSS, so it works uncontrolled too. DropdownMenu
CheckboxItem does the same with Radix's ItemIndicator. In Figma, the Menu
Item's nested Checkbox instance exposes `Checked`, so Indeterminate needs no
Menu Item variants of its own.

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
  side by side. **Switch this to `^0.1.0` when the tokens package is published,**
  and drop the tokens checkout and build from `.github/workflows/ci.yml`.
- **Changing a token means rebuilding the tokens package** — `npm run build`
  over there, since `dist/` is gitignored and this repo reads it through the
  symlink. Storybook will not pick up a token change until you do.
- **Editor files are gitignored, and `git add .` will still catch you out.** Vim
  swap files are dotfiles, so `git status --short` hides them while `git add .`
  stages them anyway — one reached `main` this way. Check
  `git diff --cached --name-only` before committing, or stage by path.
- **Storybook can launch `vi` on a story file.** Its open-in-editor feature
  runs `$EDITOR` from the dev server, and with no terminal attached the editor
  hangs and leaves a `.swp` beside the story. `*.swp` is gitignored, but the
  orphaned processes outlive Storybook. Check `ps` for `vi` children of the
  `storybook dev` process if this happens.
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
| move to another page (`page.appendChild`) | **fails** |
| `textAutoResize`, `characters`, `setTextStyleIdAsync` | **fails** |

So the build order is forced: **create the structure first, style last.** Once
text is styled it can never be moved, which is why the Figma Button is a single
frame rather than a component wrapping an inner surface — and therefore why its
focus ring is an outside stroke that replaces Secondary's border, where CSS uses
`outline` + `border` together.

That last row covers whole component sets: anything with styled labels can
only change page by hand (right-click → *Move to page*, which keeps instances
linked). Sets without text, such as the icons and Focus Ring, move fine via the
MCP.

**Composing with Söhne instances.** The same restriction blocks putting an
instance with a Söhne label into any frame, but this route works, and it's how
every composite and example in the file was built:

1. Create the instances loose on the page. Variant and boolean properties can be
   set; TEXT properties cannot.
2. `figma.group(instances, page)`, then `figma.createComponentFromNode(group)`.
3. Set `layoutMode`, padding, fills and strokes on the new component, and bind
   the tokens. `combineAsVariants` works on these components too.
4. For a plain frame instead of a component, use
   `comp.createInstance().detachInstance()`, then `comp.remove()`.

Effect styles (`shadow/*`) come from the token library like variables. They
could only be imported once they had been published there.

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
npm test             # every story as a test in headless Chromium, with axe
```

CI (`.github/workflows/ci.yml`) runs `typecheck`, `lint`, `build`, `verify` and
`test` on every pull request and every push to `main`, one step each. It checks
out and builds `small-ds-tokens` from its `main` beside this repo first, so a
pull request that needs an unmerged token change fails until that change lands
in tokens.

`npm test` runs `@storybook/addon-vitest`: each story must render, pass its
`play` function if it has one, and show no axe violations. Behaviour that was
once checked by hand gets a `test`-tagged story whose `play` function asserts
it, and each was confirmed to fail when its fix is undone. The one exemption,
contrast inside `[data-disabled]` (WCAG 1.4.3 inactive controls), and why it
exists, is in `.storybook/preview.tsx`. The first run on a new machine needs
`npx playwright install chromium`.

`npm run verify` checks `dist/`, not `src/` — `composes` pulls the tokens
package's typography classes into the bundle and CSS Modules rewrites the class
names on the way, so the shipped artefact needs its own assertion that nothing
reaches past the semantic layer. It also confirms React and Radix stay external.
