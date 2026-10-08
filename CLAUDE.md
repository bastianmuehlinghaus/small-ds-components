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
| Button | `Button` set | 15: Variant × State | `Button` | Variants, Disabled, WithIcon |
| Checkbox | `Checkbox` set | 15: Checked (False, True, Indeterminate) × State | `Checkbox` | Default, SelectAll, WithoutLabel |
| Accordion | `Accordion Item` set (`Content` slot when Open); `Accordion` (`Items` slot, 3 items by default) | 6: Variant (Closed, Open) × State | `Accordion.Item`; `Accordion.Root` | Single, Multiple, AllClosed |
| Radio group | `Radio` set; `Radio Group` set (`Items` slot of Radios) | 10: Checked × State; 6: Orientation × State | `RadioGroup.Item`; `RadioGroup.Root` | Default, Horizontal, DisabledItem, DisabledGroup, Invalid |
| Text field | `Input` set; `Text Field` set (label, Input, message) | 10: State × Value (Placeholder, Filled), on both sets | `Input`; `TextField` | Input / Default, TextField / Default, WithDescription, Invalid, Disabled |
| Dropdown menu | `Menu Item` set; `Menu Group Label`; `Menu Separator`; `Dropdown Menu` surface (`Items` slot) | 12: Type (Item, Submenu, Checkbox, Radio) × State (Default, Hover, Disabled) | `.Item` and friends; `.Label`; `.Separator`; `.Content` | Basic, OpenByDefault, WithSelection, SelectAll, WithSubmenu |
| Chip | `Chip` set | 7: Removable × State (Default, Hover, Pressed, Focus, Disabled; a chip without a remove button has only Default and Disabled) | `Chip` | Default, Removable, Disabled, LongLabel |
| Select | `Select` set; `Select Field` set (label, Select, message) | 15: State × Value (Placeholder, Filled, Chips), on both sets | `Select`; `SelectField` | Select: Single, SingleWithValue, Multiple, MultipleEmpty, MultipleWrapping, Invalid, Disabled, DisabledMultiple. SelectField: Default, WithDescription, Invalid, Disabled, Multiple |
| Listbox | `Listbox Item` set; `Listbox` (`Items` slot of Listbox Items) | 12: Type (Single, Multiple) × State (Default, Highlighted, Disabled) × Checked; the Listbox has none | none of its own: the list inside `Select` | none. `Select`'s `SingleOpen` and `MultipleOpen` use it |
| Icons | six `Icon / <name>` components | n/a | `ChevronRightIcon`, `ChevronDownIcon`, `ChevronUpIcon`, `CheckmarkIcon`, `DashIcon`, `CloseIcon` | Sizes (16 / 20 / 24, bound to `size/icon/*`) |
| Focus ring | `Focus Ring` set | 2: borderWidth | none. CSS uses `outline`. Used by the Button Focus variants, with the colour overridden to `button/color/border/focus` | n/a |

**Always update the component descriptions.** Every component and component set
in the file carries a `description` (Dev Mode shows it), and it must match the
table above. Whenever you add, remove or rename a variant, a state, a property
or a size, or change what a component is, update the description in the same
piece of work, and the table with it. Do this for every component you touch and
for any new one; none may be left empty. A description names the component, then
its variant axes and values in the order of the panel, then its optional parts,
in short sentences with no token names or sizes that Figma already shows. There
is one control size (rule 6), so say "One size, 32px" and never "Small or
Medium". Set it with `figma_execute` (`node.description = "…"`) or
`figma_set_description`, and read all of them back afterwards
(`componentPropertyDefinitions` gives the real axes). A stale description is
worse than none: on 2026-10-08 Button, Input and Text Field still said "Small or
Medium", Menu Item said "Item or Submenu" with four types, Icon / close said
"Dash", and five sets had none.

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
  differently named component (`Listbox Item`, not `Menu Item`; `Listbox`, not
  `Dropdown Menu`) puts the choice in the layer panel.
- **It is narrower on purpose.** A Listbox Item is only ever a radio (single) or a
  checkbox (multiple) row. There are no plain actions, submenus, group labels or
  separators in it, which the menu has. If one is needed, that is a decision to
  take with Bastian, not a variant to add.
- **Its states have a different vocabulary.** A Listbox Item is *Highlighted* (by
  pointer or keyboard), *Disabled*, and *Checked*. The Menu Item calls its
  highlight `Hover`, though the keyboard moves it too, and a checked row has no
  selected fill in either, because the box already says it.
- **Its behaviour differs.** A single Select closes on choice, where the menu's
  radio rows stay open. Its surface is at least as wide as the field and opens
  below it, with a 4px offset.
- **One source for the rows.** `Listbox Item` wraps a `Menu Item` instance, so a change
  to the menu's row reaches the Listbox with no second copy to keep in step, as
  `Select`'s CSS does by composing the menu's `.item`. Before this page the open
  Select was drawn as a detached copy of the menu, and a detached copy is the
  one that drifts.

In code there is no standalone `Listbox`: the list is internal to `Select`
(`defaultOpen` renders it, for the `SingleOpen` and `MultipleOpen` stories). The
Figma page is its specification. Extracting a public component, for a future
Combobox or a standalone list, is an open decision; it needs a use case first.

The Chip and Select pages were built with Inter placeholder text, back when
Söhne was unavailable to the official Figma MCP (see below). All of it now
carries its text style (checked 2026-10-07: no Inter or unstyled text left on
either page): Header title Heading/Large, Header description Body/Small,
`Examples` Heading/Small, example captions and the Chip label Label/Small, the
Select value and placeholder Body/XSmall, and the Select Field label and
message Label/Medium. The one detached frame, the `SelectField / Default`
example, needs the style applied to its own Label; it does not follow the main
component.
Apply a style to the main components' text and instances follow. The Listbox
page is the exception: its rows are Menu Item instances with Söhne text already,
so only its Header needs styles, in the same way. The Select set
is drawn closed, as the stories are; its open list is the `Dropdown Menu`
surface with checkbox or radio items, which is what the code reuses.

The `Dropdown Menu` surface mirrors `.content` exactly: `background/raised`, a
1px `border/default` (inside, counted in layout, as CSS `border-box` does),
`radius/surface`, `inset-xs` padding and the `shadow/overlay` effect style.
Its rows sit in an `Items` slot, so every example is a `Dropdown Menu` instance
with its own rows, the WithSubmenu submenu included (SubContent has the same
surface).
Their trigger Buttons are `State=Pressed`, because a Button holds the pressed
overlay while `aria-expanded` is true.

**Width: grows with its widest row, 240 to 480, then truncates.** In code the
menu, its submenus and the Select list have `min-width` `size-overlay-min-width`
and `max-width` `size-overlay-max-width` (added for this, with Bastian's
approval), capped further by the space the positioning library measures beside
the trigger. A row never wraps: its text sits in its own span (`.itemLabel`,
which the Select's `ItemText` composes) with `nowrap` and an ellipsis, because a
flex row cannot put an ellipsis on a bare text node. `Item` with `asChild` is
left unwrapped, since the consumer's element owns its children then. The
`LongLabelTruncates` and `LongOptionTruncates` stories hold it. A Select field
wider than 480 still gets a list as wide as itself: `min-width` wins.

Figma mirrors the growth, not the ellipsis, because one text layer cannot do
both: an ellipsis needs a width imposed from outside, and growth needs the text
to set the width. So the `Dropdown Menu` and `Listbox` surfaces hug, with
`minWidth` and `maxWidth` bound to the two tokens; Menu Item and Listbox Item
rows hug their label (91 for a plain row, 115 for a submenu, 119 with a box) and
fill the surface inside it; and the label has truncation (ending, one line) set
but hugs. When a label reaches the maximum, set **that instance's label to
Fill**: it then ends in an ellipsis at 446 in a 470 row, exactly as Storybook
draws it, and the surface stays at 480. Three things found building it:

- A Fill *text* layer gives its parent no width, so a hugging surface ignores
  it, while a Fill auto-layout *frame* passes up its content's width. That is
  why the label hugs and the rows fill.
- Through the Plugin API, a changed label does not always re-lay out the
  surface until a sizing property on the row is touched (Hug, then Fill again).
  Whether typing on the canvas needs the same nudge is not yet checked; if a
  menu looks too narrow for its widest row, that is the cause.
- Making a component's width hug resets its instances' Fill. After changing a
  row's sizing, set the rows in every `Items` slot back to Fill.

The submenu chevron sits in a `Chevron container` with an 8px start padding
(`space/inline/sm`, the row gap), and the row spaces its children apart: a
hugging space-between row would otherwise put the chevron against the label,
where CSS keeps the gap plus `margin-inline-start: auto`.

A Menu Item has no Focus and no Selected state. Radix moves one highlight with
the pointer and the keyboard, so keyboard focus on a row is the `Hover` variant
(`color/state/hover`), with no ring. A submenu trigger whose submenu is open
keeps that same highlight, as `.subTrigger[data-state="open"]` does. The set
used to have `Item` and `Submenu` `Selected` variants in `color/state/selected`;
no state in the code reached them and nothing in the file used them, so they
were removed (issue #85).

A `Menu Group Label` (`.Label` in code, Radix's name) divides groups on its
own: its `inset-md` top padding is the gap. A separator directly before one
is not drawn. CSS hides it, so a consumer can't double up the divider.

A new component gets its own page in the same shape, with an example for each
of its stories.

### Slots and text properties

Containers whose children vary take a native Figma **slot**, named after what
it holds and mirroring the children the code accepts:

| Component | Slot | Preferred instances | Code |
|---|---|---|---|
| `Dropdown Menu` | `Items` | Menu Item, Menu Group Label, Menu Separator | `DropdownMenu.Content` children |
| `Accordion` | `Items` | Accordion Item | `Accordion.Root` children |
| `Accordion Item` | `Content` (Open variants only) | none: any content | `Accordion.Content` children |
| `Listbox` | `Items` | Listbox Item | the `options` array inside `Select` |
| `Radio Group` | `Items` | Radio | `RadioGroup.Root` children |

Each slot holds the component's old fixed children as default content (three
items, as Nathan Curtis recommends for lists), so nothing changed on the canvas
when they were added (2026-10-08, every example checked before and after).
Preferred instances are what the slot's "+" offers; a slot cannot refuse other
content, so they guide rather than enforce. Slot content survives a variant
switch, so an Accordion Item's panel content survives Closed and back to Open.
The **Listbox** is one component, not a set: it had a `Selection` variant
(Single, Multiple) that only changed the default options, and once the options
were a slot either variant could hold either kind, so the variant promised
something it could not enforce. Single or multiple is now read from the Listbox
Items inside, as the code reads it from `multiple` on `Select`; its default content
is the single list, and `MultipleOpen` fills the slot with checkbox Listbox
Items (2026-10-08). The set was called `Option` until the same day; it was
renamed so the row is named after its list, as `Menu Item` is, and the slot
went from `Options` to `Items` with it.

The flip side of state variants on a slotted container is the **Radio
Group**: its `State` styles only the default
items. Once the items are edited, set Disabled or Invalid on each Radio, as the
`DisabledItem` example already does for one.

Not slotted, on purpose: small components with states. The Button keeps its
icon booleans and instance swaps, labels stay text properties, and Input has no
before/after slot because the code has none.

Text properties: `Button`, `Chip` and `Menu Item` have `Label text`;
`Accordion Item` has `Title text`. `Listbox Item` has none. Its label is inside its
nested Menu Item, and a property cannot reach an instance sublayer; exposing
the instance would list Menu Item's `Type` and `State` beside its own, the
panel that was rejected for the fields above. Edit a Listbox Item's label on the
canvas.

Building slots through the Plugin API (`component.createSlot()`):

- A slot only lays out with auto layout. Give it the container's direction and
  gap (with the gap's variable binding, as Radio Group's `space/stack/xs` and
  `space/inline/lg` are), no padding and no fill, and set it and its children to
  fill the width.
- **`createSlot()` on variants of an existing set makes one property per
  variant.** Point every variant's slot at one key
  (`slot.componentPropertyReferences = { slotContentId: key }`) and delete the
  others. Variants combined with `combineAsVariants` *after* their slots exist
  share one property automatically.
- Moving an instance into a slot keeps its overrides and clears
  `isExposedInstance`: slot content is selected directly, so exposure has no
  use there.
- Set preferred instances with `editComponentProperty(key, { preferredValues })`
  using component or component set **keys**, not ids.
- After moving instances into a slot, a `figma.root.findAll` may hit a stale
  sublayer id and throw; search page by page instead.

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
`npm run lint` fails the build otherwise, in CSS and for the positioning props
in TSX. See *What lint does and does not cover* below for the honest limits.

**3. No component reaches past the semantic layer.** Use Tier 2
(`--sds-color-background-raised`, `--sds-space-inset-lg`) and Tier 3
(`--sds-button-*`). Never Tier 1 — `--sds-color-neutral-*`,
`--sds-color-utility-*`, `--sds-spacing-*`, `--sds-typography-*`,
`--sds-border-radius-*`, and the numeric `--sds-size-control-32` /
`--sds-border-width-1` families.

Watch the near-collisions. These pairs differ by one layer:

| Tier 1 (banned) | Tier 2 (use this) |
|---|---|
| `--sds-spacing-16` | `--sds-space-inset-lg` |
| `--sds-size-control-32` | `--sds-size-control-default` |
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
simple class selector, so it cannot be conditional. A component that needs
different type per variant puts `composes` on each variant's class rather than
on its base class. Button did that while it had two sizes.

**5. Controls use `min-height`, never `height`.** Type is in `rem` and layout in
`px`, so a reader who raises their browser font size grows the label but not the
box. A fixed height clips it. Verified behaviour: a Button holds at 32px
through a 24px base font and grows to 42px at 32px, never clipping.

Figma mirrors this. Button, Input, Menu Item, Select and Chip hug vertically,
with the size token bound to `minHeight`, not `height`: `button/size/height`,
`input/size/height` (Input and Select), `size/control/default` and
`chip/size/height`. Figma has no rem, so on the canvas a fixed 32 and hug-min-32
look the same; the point is that the component grows the way the code does.
The Select's `Chips` row wraps, with its row gap bound to `space/inline/xs` as
`gap` is in CSS, so a narrow multiple Select grows to 54 (two rows of chips) in
both. Until 2026-10-07 Button, Input and Menu Item had fixed heights while
Select and Chip already hugged; do not go back to fixed.

This is the majority practice among large systems: Material, Spectrum,
Polaris and Carbon's buttons use a minimum height; Primer switches to one
when a label may wrap. Radix Themes and shadcn/ui use fixed heights, shadcn's
in rem, which scales with the font for the same reason.

**6. One control size, 32px.** Button, Input, Select and the menu rows all
read `size/control/default`, so a row of them aligns, and Button, Input and
the menu share 14px type (Label/Medium, Body/XSmall). There are no `size`
props. Larger sizes may come back later; that is a token decision for Bastian,
not a prop to add. The Accordion is not a control in this sense: its 48px
trigger comes from its padding and Label/Large, and each item is 49 with its
1px bottom rule below the trigger, as a CSS border has to be. In Figma the
item counts its stroke in layout for the same 49 (it used to draw the rule
over the trigger and stay 48). Its Focus variants keep that rule and add a
`Focus ring` layer outside auto layout, stretched to the item, with a 2px
inside stroke (`border/width/focus`, `color/border/focus`) that covers the
rule, as the CSS outline covers the border. Not an inner shadow, as on Input:
the item has no fill, and Figma draws an inner shadow only inside one. The
`ControlsShareOneHeight` story holds the alignment.

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
over Invalid, as in Figma. Focus keeps the border at `border-width-default`,
turns it the focus colour, and adds `box-shadow: inset 0 0 0
var(--sds-border-width-default)` in the same colour, so it reads as 2px and
nothing in the layout moves (issue #75). This is Atlassian's construction, and
GOV.UK's. In Figma it is the same: the stroke bound to `border/width/default` in
every state, and on Focus an inner shadow with its spread bound to
`border/width/default` and its colour to `input/color/border/focus`, so every
padding stays on a token. Two earlier approaches, not to go back to: a 2px
border with the padding reduced by a `calc()`, which left Figma with a raw 11
(and the Select's Chips variant moving 1px); and a 1px border with an outline
inside it, whose two curves never met at the corners. The inset ring sits on
the border's own inner curve, so it doesn't have that problem. Select's trigger
repeats the rule. Hover is a flat
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

In Figma, `Text Field` and `Select Field` carry their own `State` (Default,
Hover, Focus, Disabled, Invalid) and `Value`, the same matrix as `Input` and
`Select`. Each field draws its own box: a frame named `Input` or `Select`
between the label and the message, with the same token bindings as the building
block. It used to be a nested instance of that block. That could not carry
text properties: a field-level property cannot reach into a nested instance
("Cannot set component property references on instance sublayer"), and
exposing the instance lists all of its properties, so the panel showed `State`
and `Value` twice, once for the field and once for the instance, and Figma
cannot expose some and not others. The nested instance was detached on
2026-10-08, with every variant pixel-identical before and after. This is
Material's structure: one component, one `State`, and text properties on it.
The cost is that the box is drawn twice, in the building block and in each
field, so a change to the `Input` or `Select` box has to be made in the field
too, as Select's trigger repeats Input's states in CSS.

The field's properties: `Label` and `Message` (show/hide), `Label text`,
`Supporting text`, `Placeholder text` and `Value text`; `Text Field` also has
`Placeholder` (show/hide). `Placeholder text` is linked on the Placeholder
variants, `Value text` on the Filled variants, and the Chips variants of Select
Field have no text. A Select's placeholder is not optional: it has no
`Placeholder` toggle, on `Select` or `Select Field`, while `Input` and `Text
Field` keep theirs. Its `Placeholder text` defaults to "Select", not
"Placeholder". `Supporting text` (default "Supporting text") is linked in
**every** variant, Invalid included. Like Material, helper and error are one
slot. One text property has one default, so the Invalid variants no longer carry
"Error message" as their copy: an Invalid instance shows "Supporting text" until
it is overridden, and the Invalid examples set "Error message" that way. The red
comes from the layer's fill (`color/content/utility-error` in Invalid), not from
the text. The `Select` building block has `Placeholder text` and `Value text`, as `Input`
does. This is how Figma's Simple Design System and
Carbon build fields: one component whose own `State` sets the label, the box and
the message together (issue #87). In code nothing changes: hover and focus are
browser states, not `TextField` or `SelectField` props. On their pages the
building-block set comes first and the field set below it.

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
32px minimum, so the height changes only when chips wrap onto a second row.
This follows Atlassian, whose multi-value tag is 20px for the same reason. A
24px chip made the field grow to 34. The `ControlsShareOneHeight` story holds
it.

The remove button is two squares. The glyph is the design: the × itself, 16
square (`size-icon-sm`) with `radius-control-sm`, so its hover and pressed fill
is a small rounded square inset from the chip's edges, not a strip. The button
around it is the target: 24 square (`size-icon-lg`), invisible, with a negative
margin that cancels the extra size, so the chip's layout and its 20 high are as
if the button were 16. It sits 2 from the top, bottom and end
(`space-inline-xxs`, added for this, with Bastian's approval), 4 from the label,
and the label starts 4 from the start. A chip without a button pads 4 at both
ends, so both kinds share the same start inset.

Why 24 and not the 16 you see: WCAG 2.2's minimum target size (2.5.8) is 24 by
24, unless a 24px circle round the undersized target touches no other target.
A 16px button passed that on its own, and failed inside a Select, because the
field-wide trigger lies underneath and is another target. Material does the same
as this: its close icon is 18dp, but its chip's minimum touch target is 48dp,
extended without changing how it looks. (MUI's 22px, and 16px when small, delete
icon is the click target itself, and below the minimum.) The cost is that a
click just after the label, in the 4px before the glyph, removes the chip.
Axe's `target-size` rule is on in `.storybook/preview.tsx`, off by default in
axe, and the `RemoveButtonHitArea` story holds the two sizes.

Checkbox, RadioGroup and the DropdownMenu checkbox/radio rows share
`SelectionControl.module.css`, which is internal. The control is sized like an
icon, following Atlassian: a `size-icon-lg` (24) footprint with the box inset
by `space-inset-xs`, so the box is 16px with no box-size token. The menu draws the box
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
precise about its reach. It is two linters, because a design value can sit in
two kinds of file.

**stylelint covers** `src/**/*.css`: hardcoded values, Tier 1 references, bare
durations and easings inside `transition` / `animation` shorthands (which
strict-value can't check, because a property name inside a shorthand legitimately
isn't a variable), and raw colours or dimensions assigned to local custom
properties — that last one exists because `stylelint-declaration-strict-value`
does not inspect `--*` declarations at all, so `--overlay-hover: #00000014`
would otherwise pass while the same value on `background-color` was rejected.
The one keyword allowed on a single property is `inset` on `box-shadow`, for
the focus ring above; its width and colour are still checked.

**ESLint covers** `src/**/*.{ts,tsx}`, for one thing only: a numeric literal on
a positioning prop that takes a dimension — `sideOffset`, `alignOffset`,
`collisionPadding`, `arrowPadding` — whether as a JSX attribute, an object key
or a default value. Radix and Base UI position floating content from numbers
handed to JS before any CSS is laid out, so a CSS variable cannot reach them.
The value comes from `tokenPx("sds-space-inline-xs")` in `src/tokenPx.ts`
instead, which reads `@small-ds/tokens` and accepts only px or a bare `0`. A
literal `0` is allowed: no offset is the absence of a decision. The parser is
Babel, not typescript-eslint, which does not yet support this repo's TypeScript.

**Neither covers:**

- **Anything else in TSX.** ESLint checks that list of props, not every number.
  A new Radix or Base UI prop that takes a dimension has to be added to
  `DIMENSION_PROPS` in `eslint.config.js`; a pixel value in an inline `style`,
  or a literal passed under another name, is not seen. Rule 2 is enforced in
  CSS and for those props, and honour-based beyond them.
- **`.storybook/*.css`**, which is page chrome rather than library code and is
  deliberately exempt.

`npm run lint:rules` tests both configs against fixtures in `test/stylelint/`
and `test/eslint/`. It exists because if a regex or selector there silently
stops matching, every other check still looks green.

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

**Use Figma Console MCP (`figma-console`), not the official Figma MCP, for this
file.** Söhne is installed locally but the official MCP runs against Figma's
cloud font set, where `listAvailableFontsAsync` returns ~1,900 families and none
is Söhne. Figma Console MCP runs a plugin (Desktop Bridge) inside Figma Desktop,
so it sees the same fonts you do: `Söhne / Buch` and `Söhne / Halbfett` load,
text styles apply and stay linked, and styled text can be edited, resized,
cloned, moved into frames and moved between pages. Verified 2026-10-07.

Setup, once per machine: the server is registered as `figma-console` (user
scope, needs a personal access token), and the plugin is imported from
`~/.figma-console-mcp/plugin/manifest.json` via *Plugins → Development → Import
plugin from manifest…*. Per session, run *Plugins → Development → Figma Desktop
Bridge* **in the file you are working on**. Running it in a second file keeps
both connected, so pass `fileKey` to `figma_execute` rather than relying on the
active file. Check with `figma_get_status` (`probe: true`).

**Text styles live in the tokens library, not in this file**, which has none
local. Import one by key with `figma.importStyleByKeyAsync(key)`, then
`loadFontAsync(style.fontName)` and `node.setTextStyleIdAsync(style.id)`. Read
the keys from the Tokens file (`getLocalTextStylesAsync()`, `DABmspHvLwmzYjMrFBjVQW`).
Only published styles import.

The official MCP is still fine for what does not involve Söhne text. If it
is used, the old limits apply to any styled node: no `appendChild`, no page
move, no `characters`, `textAutoResize` or `setTextStyleIdAsync`.

**Legacy of the old restriction.** Several things in the file were built around
it and may no longer need to be that way. Do not assume they are wrong, but
check before copying the pattern:

- The Button is one frame, not a component wrapping an inner surface, because
  styled text could never be moved into a new parent. Its focus ring is not a
  stroke on that frame: each Focus variant holds a `Focus Ring` instance,
  absolutely positioned at -2 (the `outline-offset`, which Figma cannot bind)
  and stretched with the button, so its 2px outside stroke sits 2px out, as
  CSS's `outline` does. Secondary keeps its 1px border, as in CSS. The
  instances override the ring colour to `button/color/border/focus`, the token
  the CSS reads; the `Focus Ring` component itself stays on Tier 2
  `color/border/focus`.
- Composites and examples (Radio Group, Dropdown Menu, Accordion, every Example)
  were composed by grouping loose instances and calling
  `createComponentFromNode`, because `appendChild` of a Söhne instance failed.
  Plain `appendChild` into a frame should work now. The old route still works.
- Label text on composite instances could not be overridden, and was retyped by
  hand. Setting TEXT properties on instances works now (tested 2026-10-08 on a
  Button and on a Menu Item inside a Dropdown Menu's slot: Söhne stays, the
  Button resizes).

Effect styles (`shadow/*`) come from the token library like variables. They
could only be imported once they had been published there.

Three more things worth knowing before you debug them:

- **`clone()` drops a layer's links to component properties.** A cloned variant
  keeps its text, styles and variable bindings, but its `Label text`, `Label`
  and `Message` links are gone, silently: the property still shows in the
  panel and does nothing on that variant. Building the field matrices by
  cloning broke `Label text` on every new Text Field variant until it was
  re-linked. After cloning variants, compare each layer's
  `componentPropertyReferences` with the original's.

- **Auto-layout could not hug unmeasurable text** under the old restriction. The
  Open accordion variants reported 48px while visibly overflowing, so they
  carried an explicit height. They hug now (checked 2026-10-07: 113 with the
  rule, as in Storybook), so nothing in the file depends on this any more.
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
npm run lint         # lint:css + lint:tsx + lint:rules
npm run lint:rules   # tests the stylelint and ESLint configs against fixtures
npm run typecheck
npm run build        # vite lib build + declarations
npm run verify       # asserts the built artefact obeys the same rules
npm test             # every story as a test in headless Chromium, with axe (incl. target-size)
```

CI (`.github/workflows/ci.yml`) runs `typecheck`, `lint`, `build`, `verify` and
`test` on every pull request and every push to `main`, one step each. It checks
out and builds `small-ds-tokens` from its `main` beside this repo first, so a
pull request that needs an unmerged token change fails until that change lands
in tokens.

**`main` only takes commits that have passed CI.** The ruleset "main: CI must
pass" requires the `check` job, reported by GitHub Actions, with no bypass,
admins included. So every change, however small, goes through a branch and a
pull request; a direct push to `main` is rejected. Branches need not be up to
date with `main` to merge. Auto-merge is allowed in the repository settings, and
because `check` is required it waits for CI: turn it on for a PR (merge commit,
as the history uses) and GitHub merges once `check` is green. The ruleset is
under *Settings → Rules → Rulesets*.

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
reaches past the semantic layer. It also confirms React, Radix and
`@small-ds/tokens` stay external.
