import fs from "node:fs";
import path from "node:path";
const lock = JSON.parse(fs.readFileSync("package-lock.json", "utf8"));
let output =
  "# Third-party notices\n\nZipizy is MIT-licensed. The components below retain their own licenses. Electron also distributes LICENSE and LICENSES.chromium.html with the desktop runtime.\n";
for (const [folder, metadata] of Object.entries(lock.packages)) {
  if (
    !folder ||
    metadata.dev ||
    !fs.existsSync(path.join(folder, "package.json"))
  )
    continue;
  const pkg = JSON.parse(
    fs.readFileSync(path.join(folder, "package.json"), "utf8"),
  );
  output +=
    "\n## " +
    pkg.name +
    " " +
    pkg.version +
    "\n\nLicense: " +
    (typeof pkg.license === "string" ? pkg.license : "See package license") +
    "\n";
  for (const file of fs
    .readdirSync(folder)
    .filter((name) => /^(licen[sc]e|copying|notice)(\.|$)/i.test(name))) {
    const location = path.join(folder, file);
    if (!fs.statSync(location).isFile()) continue;
    output +=
      "\n### " +
      file +
      "\n\n```text\n" +
      fs.readFileSync(location, "utf8") +
      "\n```\n";
  }
}
fs.writeFileSync("THIRD_PARTY_NOTICES.md", output);
console.log("Third-party notices generated.");
