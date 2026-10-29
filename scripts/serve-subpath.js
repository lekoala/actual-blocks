import { join, normalize, extname } from "node:path";
import { existsSync, statSync } from "node:fs";

const root = join(import.meta.dir, "..");
const dist = join(root, "dist");
const prefix = "/actual-blocks";
const port = Number(process.env.SUBPATH_PORT ?? 4174);

const types = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".svg": "image/svg+xml",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png"
};

const server = Bun.serve({
  port,
  hostname: "127.0.0.1",
  fetch(request) {
    const url = new URL(request.url);
    let pathname = decodeURIComponent(url.pathname);

    if (!pathname.startsWith(`${prefix}/`) && pathname !== prefix) {
      return new Response("Not found", { status: 404 });
    }

    pathname = pathname.slice(prefix.length) || "/";
    if (pathname.endsWith("/")) pathname += "index.html";

    const filePath = normalize(join(dist, pathname));

    if (!filePath.startsWith(dist) || !existsSync(filePath) || !statSync(filePath).isFile()) {
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

console.log(`Serving ${dist} at http://127.0.0.1:${server.port}${prefix}/`);
