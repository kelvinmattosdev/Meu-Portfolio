import type { Routes } from "../types/routesGlobal.types";

function getContentType(path: string) {
    if (path.endsWith(".css")) return "text/css; charset=utf-8";
    if (path.endsWith(".js")) return "application/javascript; charset=utf-8";
    if (path.endsWith(".json")) return "application/json; charset=utf-8";
    if (path.endsWith(".png")) return "image/png";
    if (path.endsWith(".jpg") || path.endsWith(".jpeg")) return "image/jpeg";
    if (path.endsWith(".svg")) return "image/svg+xml";
    if (path.endsWith(".ico")) return "image/x-icon";

    return "application/octet-stream";
}

export const assets: Routes = {
    "/assets/*": {
        async GET(req) {
            const url = new URL(req.url);

            const referer = req.headers.get("referer");

            if (!referer) {
                return new Response("Referer não informado", { status: 400 });
            }

            const refererUrl = new URL(referer);

            const portfolioName = refererUrl.pathname
                .replace(/^\/+/, "")
                .split("/")[0];

            if (!portfolioName) {
                return new Response("Portfolio não identificado", { status: 400 });
            }

            const assetPath = decodeURIComponent(url.pathname)
                .replace(/^\/assets\/?/, "");

            if (assetPath.includes("..") || portfolioName.includes("..")) {
                return new Response("Caminho inválido", { status: 400 });
            }

            const filePath = `./${portfolioName}/static/${assetPath}`;

            const file = Bun.file(filePath);

            if (!(await file.exists())) {
                return new Response(`Asset não encontrado: ${filePath}`, {
                    status: 404,
                });
            }

            return new Response(file, {
                headers: {
                    "Content-Type": getContentType(filePath),
                },
            });
        },
    },
};