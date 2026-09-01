# Fonts

Small DS is set in **Söhne** (Klim Type Foundry) — `Buch` (400) and
`Halbfett` (600).

The `.woff2` files are **gitignored on purpose**. Bastian holds a licence to
*use* Söhne, which is not a licence to redistribute the files; committing them
to a public repo, or shipping them inside a public npm package, would be
redistribution.

To see Storybook in the real typeface, drop your own licensed copies here:

```
soehne-buch.woff2       # 400
soehne-halbfett.woff2   # 600
```

Without them, `@font-face` fails silently and the stack in
`--sds-typography-font-family-sans` falls through to the system sans. Everything
still renders and every metric is still correct — only the letterforms differ.
