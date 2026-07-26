import { spawnSync } from "node:child_process";
import { createServer } from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const websiteRoot = path.join(__dirname, "..");
const socialDir = path.join(websiteRoot, "assets", "social");

function ensurePuppeteer() {
  try {
    import.meta.resolve("puppeteer");
    return "puppeteer";
  } catch {
    return null;
  }
}

async function main() {
  fs.mkdirSync(socialDir, { recursive: true });

  let puppeteerModule = ensurePuppeteer();
  if (!puppeteerModule) {
    console.log("Installing puppeteer (one-time)...");
    const install = spawnSync("npm", ["install", "puppeteer@24"], {
      cwd: __dirname,
      stdio: "inherit",
      shell: true,
    });
    if (install.status !== 0) {
      throw new Error("Failed to install puppeteer");
    }
  }

  const puppeteer = (await import("puppeteer")).default;
  const server = createServer((req, res) => {
    const urlPath = decodeURIComponent(req.url.split("?")[0]);
    const relative = urlPath === "/" ? "/export/mockup.html" : urlPath;
    const filePath = path.join(websiteRoot, relative.replace(/^\//, ""));

    if (!filePath.startsWith(websiteRoot) || !fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
      res.writeHead(404);
      res.end("Not found");
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const types = {
      ".html": "text/html; charset=utf-8",
      ".css": "text/css; charset=utf-8",
      ".png": "image/png",
      ".jpg": "image/jpeg",
      ".jpeg": "image/jpeg",
      ".svg": "image/svg+xml",
      ".js": "text/javascript; charset=utf-8",
    };

    res.writeHead(200, { "Content-Type": types[ext] || "application/octet-stream" });
    fs.createReadStream(filePath).pipe(res);
  });

  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  const { port } = server.address();

  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto(`http://127.0.0.1:${port}/export/mockup.html`, { waitUntil: "networkidle0" });
  await page.evaluateHandle("document.fonts.ready");
  await new Promise((resolve) => setTimeout(resolve, 500));

  const exports = [
    { id: "artboard-square", file: "instagram-mockup-square.png" },
    { id: "artboard-story", file: "instagram-mockup-story.png" },
  ];

  for (const item of exports) {
    const element = await page.$(`#${item.id}`);
    if (!element) {
      throw new Error(`Missing #${item.id}`);
    }
    await element.screenshot({
      path: path.join(socialDir, item.file),
      omitBackground: false,
    });
    console.log(`Wrote ${item.file}`);
  }

  await browser.close();
  server.close();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
