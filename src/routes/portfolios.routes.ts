import { redirect } from "../functions/redirect";
import { latestPortfolio } from "../server";
import type { Routes } from "../types/routesGlobal.types";

export const portfoliosRoutes: Routes = {
    "/portfolio": {
        async GET(req) {
            if (!latestPortfolio) {
                return new Response("Nenhum portfólio disponível", { status: 404 });
            }

            const filePath = `./${latestPortfolio}/template/index.html`;
            const file = Bun.file(filePath);

            if (!(await file.exists())) {
                return new Response("Portfolio não encontrado", { status: 404 });
            }

            return new Response(file, {
                headers: {
                    "Content-Type": "text/html; charset=utf-8",
                },
            });
        }
    },
    "/*": {
        async GET(req) {
            const url = new URL(req.url);

            let pathname = decodeURIComponent(url.pathname)
                .replace(/^\/+/, "")
                .replace(/\/+$/, "");

            if (!pathname) {
                return new Response("Portfolio não informado", { status: 404 });
            }

            if (pathname.includes("..")) {
                return new Response("Caminho inválido", { status: 400 });
            }

            // Ignora requests automáticas do navegador
            if (
                pathname === "favicon.ico" ||
                pathname.startsWith(".well-known/")
            ) {
                return new Response("Not found", { status: 404 });
            }

            const filePath = `./${pathname}/template/index.html`;
            const file = Bun.file(filePath);

            if (!(await file.exists())) {
                return new Response("Portfolio não encontrado", { status: 404 });
            }

            console.log("PORTFOLIO:", pathname);

            return new Response(file, {
                headers: {
                    "Content-Type": "text/html; charset=utf-8",
                },
            });
        },
    },
};