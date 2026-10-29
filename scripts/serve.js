import { join, normalize, extname } from "node:path";
import { existsSync, statSync } from "node:fs";

const root = join(import.meta.dir, "..");
const dist = join(root, "dist");
const port = Number(process.env.PORT ?? 4173);

const types = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".svg": "image/svg+xml",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".woff2": "font/woff2"
};

const server = Bun.serve({
  port,
  hostname: "127.0.0.1",
  fetch(request) {
    const url = new URL(request.url);
    let pathname = decodeURIComponent(url.pathname);

    if (pathname.endsWith("/")) pathname += "index.html";

    const filePath = normalize(join(dist, pathname));

    if (!filePath.startsWith(dist)) {
      return new Response("Forbidden", { status: 403 });
    }

    if (!existsSync(filePath) || !statSync(filePath).isFile()) {
      return new Response("Not found", { status: 404 });
    }

    return new Response(Bun.file(filePath), {
      headers: {
        "content-type": types[extname(filePath)] ?? "application/octet-stream",
        "cache-control": "no-store"
      }
    });
  }
});

console.log(`Serving ${dist} at http://127.0.0.1:${server.port}`);
