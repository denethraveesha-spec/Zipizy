const path = require("node:path");
function resolveAsset(root, address) {
  const url = new URL(address);
  if (url.protocol !== "zipizy:" || url.hostname !== "app")
    throw new Error("Unknown origin");
  const pathname = decodeURIComponent(url.pathname);
  if (pathname.includes("\\") || pathname.includes("\0"))
    throw new Error("Invalid path");
  const filename = path.resolve(root, "." + pathname);
  const relative = path.relative(root, filename);
  if (relative.startsWith("..") || path.isAbsolute(relative))
    throw new Error("Outside application");
  return filename;
}
module.exports = { resolveAsset };
