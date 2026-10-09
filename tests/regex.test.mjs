import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";
import { stripTypeScriptTypes } from "node:module";
const source = stripTypeScriptTypes(
  fs.readFileSync("src/workers/regex.worker.ts", "utf8"),
);
function match(pattern, text, flags = "g") {
  let output;
  const context = vm.createContext({
    self: { postMessage: (v) => (output = v) },
  });
  vm.runInContext(source, context);
  context.input = { pattern, text, flags };
  vm.runInContext("self.onmessage({data:input})", context, { timeout: 500 });
  return output;
}
test("global flag controls match count", () => {
  assert.equal(match("a", "aba", "").matches.length, 1);
  assert.equal(match("a", "aba").matches.length, 2);
});
test("named capture groups and positions survive", () => {
  const result = match("(?<word>cat)", "a cat");
  assert.equal(result.matches[0].index, 2);
  assert.equal(result.matches[0].groups.word, "cat");
});
test("empty unicode matches advance without looping", () =>
  assert.equal(match("(?:)", "😀", "gu").matches.length, 2));
test("match cap prevents excessive output", () => {
  const result = match("a", "a".repeat(1001));
  assert.equal(result.matches.length, 1000);
  assert.equal(result.truncated, true);
});
test("invalid patterns return a useful error", () =>
  assert.match(match("[", "a").error, /Invalid pattern/));
