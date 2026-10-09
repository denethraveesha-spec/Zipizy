import test from "node:test";
import assert from "node:assert/strict";
import { createRequire } from "node:module";
const { PDFDocument } = createRequire(import.meta.url)("@cantoo/pdf-lib");

import { zipSync, unzipSync } from "fflate";
test("PDF copy preserves requested page order and dimensions", async () => {
  const source = await PDFDocument.create();
  source.addPage([200, 300]);
  source.addPage([400, 500]);
  const loaded = await PDFDocument.load(await source.save());
  const target = await PDFDocument.create();
  for (const page of await target.copyPages(loaded, [1, 0]))
    target.addPage(page);
  const result = await PDFDocument.load(await target.save());
  assert.equal(result.getPageCount(), 2);
  assert.equal(result.getPage(0).getWidth(), 400);
  assert.equal(result.getPage(1).getWidth(), 200);
});
test("PDF encryption writes AES-256 encryption metadata", async () => {
  const pdf = await PDFDocument.create();
  pdf.addPage();
  pdf.encrypt({
    algorithm: "AES-256",
    userPassword: "test-only-password",
    ownerPassword: "test-only-owner",
  });
  const bytes = await pdf.save();
  const text = Buffer.from(bytes).toString("latin1");
  assert.match(text, /\/Encrypt/);
  assert.match(text, /\/AESV3/);
  await assert.rejects(() => PDFDocument.load(bytes));
});
test("split archive preserves every PDF entry", async () => {
  const pdf = await PDFDocument.create();
  pdf.addPage();
  const bytes = await pdf.save();
  const result = unzipSync(
    zipSync({ "page-1.pdf": bytes, "page-2.pdf": bytes }),
  );
  assert.equal(Object.keys(result).length, 2);
  assert.equal(
    (await PDFDocument.load(result["page-2.pdf"])).getPageCount(),
    1,
  );
});
