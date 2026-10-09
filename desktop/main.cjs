const {
  app,
  BrowserWindow,
  protocol,
  net,
  shell,
  session,
  Menu,
} = require("electron");
const path = require("node:path");
const fs = require("node:fs/promises");
const { pathToFileURL } = require("node:url");
const { resolveAsset } = require("./paths.cjs");
protocol.registerSchemesAsPrivileged([
  {
    scheme: "zipizy",
    privileges: {
      standard: true,
      secure: true,
      supportFetchAPI: true,
      corsEnabled: true,
    },
  },
]);
const smoke = process.argv.includes("--smoke-test");
let mainWindow;
async function openExternal(address) {
  try {
    const url = new URL(address);
    if (url.protocol === "https:" || url.protocol === "mailto:")
      await shell.openExternal(url.href);
  } catch {}
}
app.whenReady().then(async () => {
  const root = app.isPackaged
    ? path.join(process.resourcesPath, "site")
    : path.join(__dirname, "../dist");
  protocol.handle("zipizy", async (request) => {
    try {
      let filename = resolveAsset(root, request.url);
      const stat = await fs.stat(filename);
      if (stat.isDirectory()) filename = path.join(filename, "index.html");
      return await net.fetch(pathToFileURL(filename).href);
    } catch {
      return new Response("Page not found", { status: 404 });
    }
  });
  session.defaultSession.setPermissionRequestHandler(
    (_contents, _permission, callback) => callback(false),
  );
  session.defaultSession.setPermissionCheckHandler(() => false);
  mainWindow = new BrowserWindow({
    width: 1180,
    height: 820,
    minWidth: 380,
    minHeight: 500,
    show: !smoke,
    backgroundColor: "#0f1117",
    title: "Zipizy",
    icon: path.join(__dirname, "icon.png"),
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
      webSecurity: true,
    },
  });
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    void openExternal(url);
    return { action: "deny" };
  });
  mainWindow.webContents.on("will-navigate", (event, url) => {
    if (!url.startsWith("zipizy://app/")) {
      event.preventDefault();
      void openExternal(url);
    }
  });
  Menu.setApplicationMenu(
    Menu.buildFromTemplate([
      {
        label: "Zipizy",
        submenu: [
          {
            label: "All tools",
            click: () => mainWindow.loadURL("zipizy://app/"),
          },
          { type: "separator" },
          { role: "quit" },
        ],
      },
      { role: "editMenu" },
      { role: "viewMenu" },
      {
        label: "Help",
        submenu: [
          {
            label: "Report a problem",
            click: () =>
              openExternal(
                "https://github.com/denethraveesha-spec/Zipizy/issues",
              ),
          },
          {
            label: "Releases",
            click: () =>
              openExternal(
                "https://github.com/denethraveesha-spec/Zipizy/releases",
              ),
          },
        ],
      },
    ]),
  );
  if (smoke) {
    const timer = setTimeout(() => {
      console.error("Desktop load timed out");
      app.exit(1);
    }, 20000);
    mainWindow.webContents.once("did-finish-load", () => {
      clearTimeout(timer);
      console.log(
        "Desktop smoke test passed: " + mainWindow.webContents.getTitle(),
      );
      app.exit(0);
    });
    mainWindow.webContents.once(
      "did-fail-load",
      (_event, code, description) => {
        console.error(code, description);
        app.exit(1);
      },
    );
  }
  await mainWindow.loadURL("zipizy://app/");
});
app.on("window-all-closed", () => app.quit());
