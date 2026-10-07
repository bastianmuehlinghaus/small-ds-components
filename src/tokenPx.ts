import tokens from "@small-ds/tokens";

export type TokenName = keyof typeof tokens;

/* A token as a number of pixels, for the props that take JS numbers.
   Radix and Base UI position floating content before any CSS is laid out, so a
   CSS variable cannot reach them. Everything else in the library reads tokens
   from CSS; this is the one door for the values that cannot.

   Only px and a bare 0 are accepted: a rem or a percentage would silently
   become the wrong number of pixels. eslint.config.js rejects literals on these
   props, so the value has to come through here. */
export function tokenPx(name: TokenName): number {
  const value = tokens[name];
  if (value === "0") return 0;
  if (!/^-?\d+(\.\d+)?px$/.test(value)) {
    throw new Error(`tokenPx("${name}"): "${value}" is not a px value`);
  }
  return Number.parseFloat(value);
}
