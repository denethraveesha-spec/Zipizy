import test from "node:test";
import assert from "node:assert/strict";
import { canonicalJson } from "../src/lib/jsonCompare.ts";
test("nested object ordering does not create changes", () =>
  assert.equal(
    canonicalJson({ b: { y: 2, x: 1 }, a: 0 }),
    canonicalJson({ a: 0, b: { x: 1, y: 2 } }),
  ));
test("array order and value differences remain meaningful", () => {
  assert.notEqual(canonicalJson([1, 2]), canonicalJson([2, 1]));
  assert.notEqual(canonicalJson({ a: 1 }), canonicalJson({ a: "1" }));
});
test("special property names stay intact", () =>
  assert.match(
    canonicalJson(JSON.parse('{"__proto__":{"x":1}}')),
    /__proto__/,
  ));
