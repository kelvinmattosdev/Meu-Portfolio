const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const randomChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%&*_+-<>?/{}[]░▒▓█";
const terminalKeywords = new Set([
    "const",
    "let",
    "var",
    "for",
    "if",
    "else",
    "return",
    "function",
    "class",
    "new",
    "while",
    "do",
    "switch",
    "case",
    "break",
    "continue",
    "try",
    "catch",
    "finally",
    "import",
    "from",
    "export",
    "async",
    "await",
    "true",
    "false",
    "null",
    "undefined"
]);

const snapSectionIds = [
    "home",
    "experiencias",
    "formacao",
    "cursos",
    "tecnologias",
    "contato",
    "footer"
];

function getRandomChar() {
    const index = Math.floor(Math.random() * randomChars.length);
    return randomChars[index];
}

async function typeText(element, text, speed = 70) {
    element.textContent = "";

    for (let index = 0; index < text.length; index++) {
        element.textContent += text[index];
        await sleep(speed);
    }
}

async function morphLoaderText(prefixElement, suffixElement, fromText, toText, speed = 70) {
    const steps = Math.max(fromText.length, toText.length);

    for (let step = 0; step <= steps; step++) {
        const progress = step / steps;
        const leftLength = Math.max(0, fromText.length - Math.ceil(fromText.length * progress));
        const rightLength = Math.min(toText.length, Math.ceil(toText.length * progress));

        prefixElement.textContent = fromText.slice(0, leftLength);
        suffixElement.textContent = toText.slice(toText.length - rightLength);

        await sleep(speed);
    }
}

async function glitchResolveText(element, finalText, speed = 42) {
    const lockFrames = Array.from(finalText, (char) => {
        if (char === " ") return 0;
        return 5 + Math.floor(Math.random() * 14);
    });
    const totalFrames = Math.max(...lockFrames);

    for (let frame = 0; frame <= totalFrames; frame++) {
        const output = Array.from(finalText, (char, index) => {
            if (char === " ") return " ";
            return frame >= lockFrames[index] ? char : getRandomChar();
        }).join("");

        element.textContent = output;
        await sleep(speed);
    }

    element.textContent = finalText;
}

async function glitchReveal(element, finalText, speed = 55) {
    let progress = 0;

    return new Promise((resolve) => {
        const interval = setInterval(() => {
            let output = "";

            for (let index = 0; index < finalText.length; index++) {
                const originalChar = finalText[index];

                if (originalChar === " ") {
                    output += " ";
                    continue;
                }

                if (index < progress) {
                    output += originalChar;
                } else {
                    output += getRandomChar();
                }
            }

            element.textContent = output;
            progress++;

            if (progress > finalText.length) {
                clearInterval(interval);
                element.textContent = finalText;
                resolve();
            }
        }, speed);
    });
}

async function startLoader() {
    const loader = document.querySelector("#loader");
    const loaderPrefix = document.querySelector("#loader-prefix");
    const loaderSuffix = document.querySelector("#loader-suffix");
    const loaderCursor = document.querySelector("#loader-cursor");

    if (!loader || !loaderPrefix || !loaderSuffix || !loaderCursor) return;

    await sleep(900);

    await typeText(loaderPrefix, "Loading...", 70);

    await sleep(350);

    await morphLoaderText(loaderPrefix, loaderSuffix, "Loading...", "Kelvin Mattos", 78);

    await sleep(180);

    await glitchResolveText(loaderSuffix, "Kelvin Mattos", 42);

    await sleep(650);

    loader.classList.add("loader-hidden");
    document.body.classList.add("loaded");

    await sleep(400);

    const heroName = document.querySelector("#glitch-name");
    if (heroName) {
        glitchReveal(heroName, "Kelvin Mattos", 55);
    }

    if (!location.hash || location.hash === "#home") {
        document.querySelector("#terminal-input")?.focus({ preventScroll: true });
    }
}

function startRoleRotator() {
    const roleText = document.querySelector("#role-text");

    if (!roleText) return;

    const roles = [
        "Programador",
        "Designer",
        "T.I.",
        "Infra",
        "DevOps",
        "Desenvolvedor"
    ];

    let currentIndex = 0;

    setInterval(async () => {
        currentIndex = (currentIndex + 1) % roles.length;
        await glitchReveal(roleText, roles[currentIndex], 35);
    }, 2400);
}

function escapeHtml(value) {
    return value
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}

function wrapToken(className, value) {
    return `<span class="${className}">${escapeHtml(value)}</span>`;
}

function highlightTerminalCode(text) {
    let html = "";
    let index = 0;

    while (index < text.length) {
        const char = text[index];

        if (char === '"' || char === "'" || char === "`") {
            const quote = char;
            let end = index + 1;
            let escaped = false;

            while (end < text.length) {
                const current = text[end];

                if (current === quote && !escaped) {
                    end++;
                    break;
                }

                escaped = current === "\\" && !escaped;

                if (current !== "\\") {
                    escaped = false;
                }

                end++;
            }

            html += wrapToken("token-string", text.slice(index, end));
            index = end;
            continue;
        }

        if (/[A-Za-z_$]/.test(char)) {
            const start = index;

            while (index < text.length && /[A-Za-z0-9_$]/.test(text[index])) {
                index++;
            }

            const word = text.slice(start, index);
            let lookAhead = index;

            while (lookAhead < text.length && /\s/.test(text[lookAhead])) {
                lookAhead++;
            }

            if (terminalKeywords.has(word)) {
                html += wrapToken("token-keyword", word);
            } else if (text[lookAhead] === ":") {
                html += wrapToken("token-property", word);
            } else {
                html += escapeHtml(word);
            }

            continue;
        }

        if (/\d/.test(char)) {
            const start = index;

            while (index < text.length && /[\d.]/.test(text[index])) {
                index++;
            }

            html += wrapToken("token-number", text.slice(start, index));
            continue;
        }

        if ("{}[]();,=:+-*/<>!".includes(char)) {
            html += wrapToken("token-operator", char);
            index++;
            continue;
        }

        html += escapeHtml(char);
        index++;
    }

    return html || "&nbsp;";
}

function setupTerminal() {
    const terminalWindow = document.querySelector("#terminal-window");
    const terminalInput = document.querySelector("#terminal-input");
    const terminalHighlight = document.querySelector("#terminal-highlight");

    if (!terminalWindow || !terminalInput || !terminalHighlight) return;

    const syncTerminal = () => {
        terminalHighlight.innerHTML = highlightTerminalCode(terminalInput.value);
        terminalHighlight.scrollTop = terminalInput.scrollTop;
        terminalHighlight.scrollLeft = terminalInput.scrollLeft;
    };

    terminalWindow.addEventListener("click", () => {
        terminalInput.focus();
    });

    terminalInput.addEventListener("input", syncTerminal);
    terminalInput.addEventListener("scroll", syncTerminal);
    terminalInput.addEventListener("keydown", (event) => {
        if (event.key !== "Tab") return;

        event.preventDefault();
        terminalInput.setRangeText("  ", terminalInput.selectionStart, terminalInput.selectionEnd, "end");
        syncTerminal();
    });

    syncTerminal();
}

function getBasePath() {
    return `${location.pathname}${location.search}`;
}

function getIndexFromHash() {
    const sectionId = location.hash.replace("#", "") || "home";
    const index = snapSectionIds.indexOf(sectionId);

    return index >= 0 ? index : 0;
}

function getClosestSectionIndex() {
    const scrollBottom = Math.ceil(window.scrollY + window.innerHeight);
    const pageHeight = document.documentElement.scrollHeight;

    if (scrollBottom >= pageHeight - 2) {
        return snapSectionIds.indexOf("footer");
    }

    let closestIndex = 0;
    let closestDistance = Number.POSITIVE_INFINITY;

    snapSectionIds.forEach((sectionId, index) => {
        const section = document.querySelector(`#${sectionId}`);

        if (!section) return;

        const distance = Math.abs(section.getBoundingClientRect().top);

        if (distance < closestDistance) {
            closestDistance = distance;
            closestIndex = index;
        }
    });

    return closestIndex;
}

function setUrlForSection(sectionId) {
    const nextUrl = sectionId === "home" ? getBasePath() : `${getBasePath()}#${sectionId}`;

    if (`${location.pathname}${location.search}${location.hash}` !== nextUrl) {
        history.pushState(null, "", nextUrl);
    }
}

function updateSectionMap(sectionId) {
    const currentSectionId = sectionId === "footer" ? "contato" : sectionId;

    document.querySelectorAll(".section-map a").forEach((link) => {
        link.classList.toggle("active", link.dataset.sectionTarget === currentSectionId);
    });

    document.querySelectorAll(".nav-link").forEach((link) => {
        const targetId = link.getAttribute("href")?.replace("#", "") || "home";
        link.classList.toggle("active", targetId === currentSectionId);
    });
}

function updateNavigationVisibility(sectionId) {
    const header = document.querySelector(".site-header");
    const shouldShow = sectionId !== "home" && Boolean(location.hash);

    header?.classList.toggle("nav-visible", shouldShow);
}

function updateChrome(sectionId) {
    updateSectionMap(sectionId);
    updateNavigationVisibility(sectionId);
}

function scrollToSection(index, options = {}) {
    const sectionId = snapSectionIds[index] || "home";
    const section = document.querySelector(`#${sectionId}`);

    if (!section) return;

    if (options.updateUrl !== false) {
        setUrlForSection(sectionId);
    }

    section.scrollIntoView({
        behavior: options.behavior || "smooth",
        block: "start"
    });

    updateChrome(sectionId);
}

function setupSectionNavigation() {
    if ("scrollRestoration" in history) {
        history.scrollRestoration = "manual";
    }

    let wheelLocked = false;

    document.querySelectorAll('a[href^="#"]').forEach((link) => {
        const targetId = link.getAttribute("href")?.replace("#", "") || "home";
        const targetIndex = snapSectionIds.indexOf(targetId);

        if (targetIndex < 0) return;

        link.addEventListener("click", (event) => {
            event.preventDefault();
            scrollToSection(targetIndex);

            const menu = document.querySelector("#mainMenu");

            if (menu && window.bootstrap) {
                window.bootstrap.Collapse.getOrCreateInstance(menu).hide();
            }
        });
    });

    window.addEventListener("wheel", (event) => {
        if (event.ctrlKey || Math.abs(event.deltaY) < 18) return;

        event.preventDefault();

        if (wheelLocked) return;

        const currentIndex = getClosestSectionIndex();
        const nextIndex = event.deltaY > 0
            ? Math.min(currentIndex + 1, snapSectionIds.length - 1)
            : Math.max(currentIndex - 1, 0);

        wheelLocked = true;
        scrollToSection(nextIndex);

        window.setTimeout(() => {
            wheelLocked = false;
        }, 860);
    }, { passive: false });

    window.addEventListener("popstate", () => {
        scrollToSection(getIndexFromHash(), {
            behavior: "smooth",
            updateUrl: false
        });
    });

    window.addEventListener("hashchange", () => {
        scrollToSection(getIndexFromHash(), {
            behavior: "smooth",
            updateUrl: false
        });
    });

    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) return;

            updateChrome(entry.target.id);
        });
    }, {
        threshold: 0.58
    });

    snapSectionIds.forEach((sectionId) => {
        const section = document.querySelector(`#${sectionId}`);

        if (section) {
            sectionObserver.observe(section);
        }
    });

    const footer = document.querySelector("#footer");

    if (footer) {
        const footerObserver = new IntersectionObserver((entries) => {
            const isFooterVisible = entries.some((entry) => entry.isIntersecting);

            document.body.classList.toggle("footer-visible", isFooterVisible);
        }, {
            threshold: 0.28
        });

        footerObserver.observe(footer);
    }

    if (location.hash === "#home") {
        history.replaceState(null, "", getBasePath());
    }

    requestAnimationFrame(() => {
        scrollToSection(getIndexFromHash(), {
            behavior: "auto",
            updateUrl: false
        });
    });
}

function setupCopyEmail() {
    const button = document.querySelector("#copy-email");
    const email = "kelvin03mattos@gmail.com";

    if (!button) return;

    let feedbackTimer;
    const showCopiedFeedback = () => {
        button.classList.add("copied");
        button.setAttribute("title", "Copiado!");

        window.clearTimeout(feedbackTimer);
        feedbackTimer = window.setTimeout(() => {
            button.classList.remove("copied");
            button.setAttribute("title", "Copiar e-mail");
        }, 1000);
    };

    button.addEventListener("click", async () => {
        try {
            await navigator.clipboard.writeText(email);
            showCopiedFeedback();
        } catch {
            location.href = `mailto:${email}`;
        }
    });
}

document.addEventListener("DOMContentLoaded", () => {
    setupTerminal();
    setupSectionNavigation();
    setupCopyEmail();
    startLoader();
    startRoleRotator();
});
