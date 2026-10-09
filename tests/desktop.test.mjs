import test from "node:test";
import assert from "node:assert/strict";
import path from "node:path";
import { createRequire } from "node:module";
const { resolveAsset } = createRequire(import.meta.url)("../desktop/paths.cjs");
const root = path.resolve("dist");
test("desktop resolves app routes and assets", () => {
  assert.equal(
    resolveAsset(root, "zipizy://app/tools/base64/"),
    path.join(root, "tools/base64"),
  );
  assert.equal(
    resolveAsset(root, "zipizy://app/_astro/app.js"),
    path.join(root, "_astro/app.js"),
  );
});
test("desktop rejects untrusted origins and encoded traversal", () => {
  for (const url of [
    "https://app/",
    "zipizy://evil/",
    "zipizy://app/..%2f..%2fsecret",
    "zipizy://app/%5csecret",
    "zipizy://app/%00",
  ])
    assert.throws(() => resolveAsset(root, url));
});
