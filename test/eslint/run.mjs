/**
 * Tests the ESLint config itself, for the same reason test/stylelint/ does: the
 * rule is the only thing stopping a dimension literal in TSX, and a selector
 * that silently stops matching would leave everything green.
 */
import { ESLint } from "eslint";

const eslint = new ESLint();
const run = async (file) => (await eslint.lintFiles(`test/eslint/${file}`))[0]?.messages ?? [];

const valid = await run("valid.tsx");
const invalid = await run("invalid.tsx");
const EXPECTED = 6;

let failures = 0;
const check = (label, ok, detail = "") => {
  console.log(`${ok ? "  ok  " : " FAIL "} ${label}${detail ? " — " + detail : ""}`);
  if (!ok) failures++;
};

check("valid.tsx passes clean", valid.length === 0,
  valid.map((m) => `${m.line}:${m.column} ${m.message}`).join("; "));
check(`invalid.tsx is rejected (${EXPECTED} violations)`, invalid.length === EXPECTED,
  `got ${invalid.length}`);
check("every violation comes from no-restricted-syntax",
  invalid.every((m) => m.ruleId === "no-restricted-syntax"),
  invalid.filter((m) => m.ruleId !== "no-restricted-syntax").map((m) => m.message).join("; "));

console.log(failures === 0 ? "\nESLint rules behave as specified.\n" : `\n${failures} check(s) failed.\n`);
process.exit(failures === 0 ? 0 : 1);
