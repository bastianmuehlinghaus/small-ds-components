# Small DS — Components

React components on Radix primitives, driven entirely by `@small-ds/tokens`.

## Rules

**1. Never invent a token.** If a component seems to need a value the tokens
don't cover, *ask Bastian first* — in Figma or in code. The system is
deliberately small; a plausible-looking gap is usually intentional. Do not add a
CSS custom property, a magic number, or a "temporary" literal.

**2. No hardcoded values, ever.** Every visual decision resolves to a
`var(--sds-*)`. `npm run lint:css` fails the build otherwise.

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
| `--sds-border-radius-12` | `--sds-radius-surface` |

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

**5. Controls use `min-height`, never `height`.** Type is in `rem` and layout in
`px`, so a reader who raises their browser font size grows the label but not the
box. A fixed height clips it.

## Things that will waste your time if you don't know them

- **`@small-ds/tokens` is linked by `file:../small-ds-tokens`**, because
  `npm link` needs write access to the global node root. Both repos must sit
  side by side. **Switch this to `^0.1.0` when the tokens package is published.**
- **Changing a token means rebuilding the tokens package** — `npm run build`
  over there, since `dist/` is gitignored and this repo reads it through the
  symlink.
- **stylelint only scans `src/**/*.css`.** `.storybook/*.css` is page chrome, not
  library code, and is deliberately exempt.
- The Söhne `.woff2` files are gitignored for licensing reasons, not by
  accident. Storybook degrades to a system sans without them, with identical
  metrics.

## Commands

```sh
npm run storybook    # dev, with a light/dark toolbar toggle
npm run lint         # lint:css + lint:rules
npm run lint:rules   # tests the stylelint config itself against fixtures
npm run typecheck
```

`lint:rules` exists because the stylelint config is the only thing actually
holding rules 2 and 3 in place. If a regex there silently stops matching,
everything still looks green — the fixtures in `test/stylelint/` catch that.
