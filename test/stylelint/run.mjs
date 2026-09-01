/**
 * Tests the stylelint config itself.
 *
 * The config is the only thing actually holding the "tokens only, never past
 * the semantic layer" rule in place, so it needs a test of its own — otherwise
 * a regex tweak could silently stop catching anything and everything would
 * still look green.
 */
import stylelint from "stylelint";

const run = async (file) => {
  const { results } = await stylelint.lint({ files: `test/stylelint/${file}` });
  return results[0]?.warnings ?? [];
};

const valid = await run("valid.css");
const invalid = await run("invalid.css");
const EXPECTED = 11;

let failures = 0;
const check = (label, ok, detail = "") => {
  console.log(`${ok ? "  ok  " : " FAIL "} ${label}${detail ? " — " + detail : ""}`);
  if (!ok) failures++;
};

check("valid.css passes clean", valid.length === 0,
  valid.map((w) => `${w.line}:${w.column} ${w.text}`).join("; "));
check(`invalid.css is rejected (${EXPECTED} violations)`, invalid.length === EXPECTED,
  `got ${invalid.length}`);

const byRule = invalid.reduce((a, w) => ((a[w.rule] = (a[w.rule] || 0) + 1), a), {});
check("3 hardcoded values caught by strict-value", byRule["scale-unlimited/declaration-strict-value"] === 3,
  `got ${byRule["scale-unlimited/declaration-strict-value"] ?? 0}`);
check("8 blocked by the disallowed list (6 Tier 1 + bare timing + laundered literal)",
  byRule["declaration-property-value-disallowed-list"] === 8,
  `got ${byRule["declaration-property-value-disallowed-list"] ?? 0}`);

console.log(failures === 0 ? "\nLint rules behave as specified.\n" : `\n${failures} check(s) failed.\n`);
process.exit(failures === 0 ? 0 : 1);
