/**
 * Asserts the shipped CSS obeys the rules the source is linted for.
 *
 * stylelint checks the source, but `composes` pulls the tokens package's
 * typography classes into the bundle and CSS Modules rewrites class names on
 * the way. This checks the artefact consumers actually receive.
 */
import fs from "node:fs";

const css = fs.readFileSync("dist/styles.css", "utf8");

const TIER_1 =
  /--sds-(?:color-(?:neutral|utility|alpha)|typography|layout|opacity|spacing|border-radius)-|--sds-(?:border-width|size-control|size-icon)-\d/;

/* The composed typography classes legitimately reference Tier 1 — they come
   from the tokens package, which is the one place allowed to. CSS Modules
   hashes them to `._sds-type-<name>_<hash>`, so match on the suffix. */
const isTypographyClass = (block) => /^\s*[._]*sds-type-|^\s*\._?sds-type-/.test(block);

const blocks = css.split("}").map((b) => b + "}");
const referencing = blocks.filter((b) => TIER_1.test(b));
const offenders = referencing.filter((b) => !isTypographyClass(b));

let failures = 0;
const check = (label, ok, detail = "") => {
  console.log(`${ok ? "  ok  " : " FAIL "} ${label}${detail ? " — " + detail : ""}`);
  if (!ok) failures++;
};

check("no component rule reaches past the semantic layer", offenders.length === 0,
  offenders.slice(0, 2).map((o) => o.trim().slice(0, 120)).join(" | "));
check(`Tier 1 appears only in the ${referencing.length} composed typography classes`,
  referencing.length > 0 && offenders.length === 0);

const js = fs.readFileSync("dist/index.js", "utf8");
check("react is externalised, not bundled", !/function\s+useState\s*\(/.test(js));
check("radix is externalised, not bundled", /@radix-ui\//.test(js));

const dts = fs.readFileSync("dist/index.d.ts", "utf8");
for (const name of ["Button", "Accordion", "DropdownMenu"]) {
  check(`${name} is exported with types`, js.includes(name) && dts.includes(name));
}

console.log(failures === 0 ? "\nBuild output is clean.\n" : `\n${failures} check(s) failed.\n`);
process.exit(failures === 0 ? 0 : 1);
