import { readdir } from "node:fs/promises";
import { join } from "node:path";
import { assets } from "./routes/assets.routes";
import { portfoliosRoutes } from "./routes/portfolios.routes";
import chalk from "chalk";
import { redirect } from "./functions/redirect";

function portfolioToTimestamp(portfolio: string) {
    const match = portfolio.match(/^(\d{2})-(\d{2})-(\d{4})$/);

    if (!match) {
        return 0;
    }

    const day = Number(match[1]);
    const month = Number(match[2]);
    const year = Number(match[3]);

    return new Date(year, month - 1, day).getTime();
}

async function listarDiretorios(diretorio: string) {
    const itens = await readdir(join(diretorio), { withFileTypes: true });

    return itens
        .filter((item) => item.isDirectory())
        .map((item) => item.name);
}

async function getLatestPortfolio() {
    const pastas = await listarDiretorios(".");

    const portfolios: string[] = [];

    for (const filePath of pastas) {
        if (/^\d{2}-\d{2}-\d{4}$/.test(filePath)) {
            portfolios.push(filePath);
        }
    }

    portfolios.sort((a, b) => {
        return portfolioToTimestamp(b) - portfolioToTimestamp(a);
    });

    return portfolios[0] ?? null;
}

export const latestPortfolio = await getLatestPortfolio();
console.log(chalk.green("Último portfólio encontrado:"), chalk.underline.bgBlue(latestPortfolio));

Bun.serve(
    {
        port: 3000,
        hostname: "0.0.0.0",
        routes: {
            ...portfoliosRoutes,
            ...assets
        },
        fetch(req, server) {
            return new Response("Not found", { status: 404 });
        },
    }
)

console.log(chalk.cyan("\nRodando em"), chalk.underline("http://localhost:3000"));
console.log(chalk.italic.bgBlueBright("Acesse ") + chalk.bgMagentaBright("http://localhost:3000/portfolio") + chalk.italic.bgBlueBright(" para ver o portfólio mais recente."));
console.log(chalk.yellow('Portfólios disponíveis:'));
console.log(chalk.underline.cyan('http://localhost:3000/28-05-2026'));