import { assets } from "./routes/assets.routes";
import { portfoliosRoutes } from "./routes/portfolios.routes";

Bun.serve(
    {
        port: 3000,
        hostname: "0.0.0.0",
        routes: {
            ...portfoliosRoutes,
            ...assets
        }
    }
)

console.log("Rodando em http://localhost:3000");
console.log('Portfólios disponíveis:');
console.log('http://localhost:3000/28-05-2026');