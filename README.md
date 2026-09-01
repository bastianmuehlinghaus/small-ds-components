# @small-ds/components

React components for **Small DS**, built on [Radix](https://www.radix-ui.com/)
primitives and driven entirely by [`@small-ds/tokens`](https://github.com/bastianmuehlinghaus/small-ds-tokens).

Radix supplies behaviour — focus management, keyboard navigation, ARIA,
collision-aware positioning. This package supplies the appearance, and every
value in it comes from a token.

## Install

```sh
npm install @small-ds/components @small-ds/tokens
```

```js
import "@small-ds/tokens/css";
import "@small-ds/tokens/typography.css";
import "@small-ds/components/styles.css";

import { Button, Accordion, DropdownMenu } from "@small-ds/components";
```

## Theming

Both modes come from the tokens package. Set `data-theme` on the root, or leave
it off to follow the OS setting.

## The constraint

Components consume tokens only — no hardcoded values, and nothing reaches past
the semantic layer into Tier 1 primitives. This isn't a style guide; it's
enforced by `npm run lint`, which fails on both. See `CLAUDE.md` for the detail,
including the one sanctioned exception (`--sds-motion-*`).

## Development

Both repos must sit side by side — `@small-ds/tokens` is linked by relative path
until it is published.

```sh
npm install
npm run storybook
```
