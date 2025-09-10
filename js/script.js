/* ===================================================================
 * Louis Bouhours Portfolio - Dynamic GitHub + Terminal Animation
 * -------------------------------------------------------------------
 * - Récupération des dépôts GitHub (API publique)
 * - Filtrage, recherche et rendu des cartes
 * - Animation terminal style (about section) avec données dynamiques
 * - Réutilisation de la logique dactylographique + ajout contenu dynamique
 * ------------------------------------------------------------------- */

document.addEventListener('DOMContentLoaded', () => {

    /* ===============================
     * CONFIG
     * =============================== */
    const GITHUB_USER = 'Louis-Bouhours';
    const REPO_GRID = document.getElementById('repositories-grid');
    const REPO_SEARCH = document.getElementById('repo-search');
    const FILTER_BTNS = document.querySelectorAll('.filter-btn');

    let allRepos = [];
    let currentFilter = 'all';

    const languageColors = {
        'JavaScript': '#f1e05a',
        'TypeScript': '#3178c6',
        'Python': '#3572A5',
        'Java': '#b07219',
        'C#': '#239120',
        'HTML': '#e34c26',
        'CSS': '#1572B6',
        'Shell': '#89e051',
        'PHP': '#4F5D95',
        'Go': '#00ADD8',
        'C': '#555555',
        'C++': '#f34b7d'
    };

    /* ===============================
     * UTILITAIRES
     * =============================== */
    function formatDateFR(iso) {
        try {
            return new Date(iso).toLocaleDateString('fr-FR', {
                year: 'numeric',
                month: 'short',
                day: '2-digit'
            });
        } catch {
            return '—';
        }
    }

    function calcFakeSize(repo) {
        // Simule une taille fichier (kB) pour l'affichage "ls"
        const base = (repo.stargazers_count || 1) * 42 + (repo.forks_count || 0) * 31;
        return Math.max(4, Math.min(base, 2048));
    }

    function truncate(text, max = 120) {
        if (!text) return '';
        return text.length > max ? text.slice(0, max) + '…' : text;
    }

    /* ===============================
     * RÉCUPÉRATION DES DONNÉES GITHUB
     * =============================== */
    async function fetchRepos() {
        const url = `https://api.github.com/users/${GITHUB_USER}/repos?sort=updated&per_page=100`;
        const res = await fetch(url, {
            headers: {
                'Accept': 'application/vnd.github+json'
            }
        });
        if (!res.ok) throw new Error(`GitHub API error: ${res.status}`);
        return res.json();
    }

    async function fetchUser() {
        const url = `https://api.github.com/users/${GITHUB_USER}`;
        const res = await fetch(url);
        if (!res.ok) throw new Error(`GitHub User error: ${res.status}`);
        return res.json();
    }

    /* ===============================
     * AFFICHAGE DES DÉPÔTS (GRILLE)
     * =============================== */
    function renderReposGrid(repos) {
        if (!REPO_GRID) return;
        REPO_GRID.innerHTML = '';

        if (!repos.length) {
            REPO_GRID.innerHTML = `
                <div class="col-span-full text-center py-12">
                    <p class="text-gray-400">Aucun dépôt ne correspond à votre recherche.</p>
                </div>
            `;
            return;
        }

        REPO_GRID.innerHTML = repos.map(repo => createRepoCard(repo)).join('');
    }

    function createRepoCard(repo) {
        const color = languageColors[repo.language] || '#6b7280';
        const updated = formatDateFR(repo.updated_at);

        return `
            <div class="repo-card bg-dark-800 rounded-xl p-6 border border-gray-700 hover-glow flex flex-col justify-between transition-transform duration-300 hover:-translate-y-2">
                <div>
                    <div class="flex items-start justify-between mb-2">
                        <h3 class="text-xl font-bold text-white mb-2 break-all">
                            <a href="${repo.html_url}" target="_blank" class="hover:text-primary-500 transition-colors">
                                ${repo.name}
                            </a>
                        </h3>
                        ${repo.archived ? '<span class="flex-shrink-0 ml-2 px-2 py-1 bg-red-500/20 text-red-400 rounded text-xs font-semibold">ARCHIVÉ</span>' : ''}
                    </div>
                    <p class="text-gray-300 mb-4 text-sm leading-relaxed h-16 overflow-hidden">
                        ${repo.description ? truncate(repo.description, 150) : 'Aucune description disponible.'}
                    </p>
                </div>
                <div>
                    <div class="flex items-center justify-between text-gray-400 text-sm mb-4">
                        ${repo.language ? `
                            <div class="flex items-center gap-2">
                                <div class="w-3 h-3 rounded-full" style="background-color:${color}"></div>
                                <span>${repo.language}</span>
                            </div>` : '<div></div>'}
                        <div class="flex gap-4">
                            <span title="Stars">⭐ ${repo.stargazers_count}</span>
                            <span title="Forks">🍴 ${repo.forks_count}</span>
                        </div>
                    </div>
                    <div class="flex items-center justify-between">
                        <span class="text-gray-500 text-xs">Màj le ${updated}</span>
                        <div class="flex gap-2">
                            <a href="${repo.html_url}" target="_blank" class="px-3 py-1 bg-primary-500 text-white rounded text-sm hover:bg-primary-600 transition-colors">
                                Voir
                            </a>
                            <button type="button" data-clone="${repo.clone_url}" class="copy-clone px-3 py-1 border border-primary-500 text-primary-500 rounded text-sm hover:bg-primary-500 hover:text-white transition-colors">
                                Cloner
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    /* ===============================
     * FILTRAGE + RECHERCHE
     * =============================== */
    function applyFilters() {
        const term = (REPO_SEARCH?.value || '').toLowerCase();

        let filtered = allRepos.filter(r => {
            return (
                r.name.toLowerCase().includes(term) ||
                (r.description || '').toLowerCase().includes(term) ||
                (r.language || '').toLowerCase().includes(term)
            );
        });

        switch (currentFilter) {
            case 'starred':
                filtered = filtered
                    .filter(r => r.stargazers_count > 0)
                    .sort((a, b) => b.stargazers_count - a.stargazers_count);
                break;
            case 'archived':
                filtered = filtered.filter(r => r.archived);
                break;
            case 'recent':
                filtered = filtered.slice(0, 12);
                break;
            case 'all':
            default:
                break;
        }

        renderReposGrid(filtered);
    }

    function initFilters() {
        if (REPO_SEARCH) {
            REPO_SEARCH.addEventListener('input', applyFilters);
        }
        FILTER_BTNS.forEach(btn => {
            btn.addEventListener('click', () => {
                FILTER_BTNS.forEach(b => b.classList.remove('active', 'bg-primary-500', 'text-white'));
                btn.classList.add('active', 'bg-primary-500', 'text-white');
                currentFilter = btn.dataset.filter || 'all';
                applyFilters();
            });
        });
    }

    /* ===============================
     * TERMINAL DYNAMIQUE (SECTION ABOUT)
     * =============================== */
    function buildTerminalRepoListing(repos) {
        // Simule un "ls -la" format
        const lines = [];
        lines.push(`total ${repos.length}`);
        const now = new Date();
        repos.slice(0, 8).forEach(repo => {
            const size = calcFakeSize(repo);
            const date = new Date(repo.updated_at);
            const day = String(date.getDate()).padStart(2, '0');
            const month = date.toLocaleString('fr-FR', { month: 'short' });
            const hour = String(date.getHours()).padStart(2, '0') + ':' +
                String(date.getMinutes()).padStart(2, '0');
            lines.push(
                `-rw-r--r--  1 louis devs ${String(size).padStart(4, ' ')} ${month.padEnd(4, ' ')} ${day} ${hour}  ${repo.name}`
            );
        });
        return lines.join('\n');
    }

    function computeLanguageStats(repos) {
        const counts = {};
        repos.forEach(r => {
            if (!r.language) return;
            counts[r.language] = (counts[r.language] || 0) + 1;
        });
        const entries = Object.entries(counts).sort((a,b) => b[1]-a[1]).slice(0,5);
        if (!entries.length) return 'Aucun langage détecté.';
        return entries.map(([lang, count]) => `${lang}: ${count}`).join(' | ');
    }

    function updateTerminalDynamic(userData, repos) {
        const terminal = document.getElementById('terminal-body');
        if (!terminal) return;

        // Cherche ou crée les zones dynamiques
        let repoLsOutput = document.getElementById('terminal-ls-output');
        if (!repoLsOutput) {
            repoLsOutput = document.createElement('div');
            repoLsOutput.id = 'terminal-ls-output';
            repoLsOutput.className = 'output-line';
            // Insérer après la commande "ls -la ~/projects" si présente
            const lsCmd = Array.from(terminal.querySelectorAll('.command-line'))
                .find(cl => cl.textContent.includes('ls -la ~/projects'));
            if (lsCmd && lsCmd.nextElementSibling) {
                terminal.insertBefore(repoLsOutput, lsCmd.nextElementSibling.nextElementSibling);
            } else {
                terminal.appendChild(repoLsOutput);
            }
        }

        let statsOutput = document.getElementById('terminal-stats-output');
        if (!statsOutput) {
            statsOutput = document.createElement('div');
            statsOutput.id = 'terminal-stats-output';
            statsOutput.className = 'output-line output-info';
            terminal.appendChild(statsOutput);
        }

        repoLsOutput.textContent = buildTerminalRepoListing(repos);
        statsOutput.textContent =
            `Public repos: ${userData.public_repos} | Followers: ${userData.followers} | Langages: ${computeLanguageStats(repos)}`;
    }

    /* ===============================
     * ANIMATION DACTYLO (Terminal)
     * =============================== */
    function initTerminalTypingSequence() {
        const sequenceIds = ['typing-text-1', 'typing-text-2', 'typing-text-3'];
        const currentCommandEl = document.getElementById('current-command');
        const cursorEl = document.querySelector('.cursor');

        if (!currentCommandEl) return;

        let idx = 0;

        function typeParagraph(el, cb) {
            if (!el) return cb && cb();
            const raw = el.getAttribute('data-original') || el.textContent.trim();
            el.setAttribute('data-original', raw);
            el.textContent = '';
            let i = 0;
            const speed = 24;

            function step() {
                if (i < raw.length) {
                    el.textContent += raw.charAt(i);
                    i++;
                    setTimeout(step, speed);
                } else {
                    cb && cb();
                }
            }
            step();
        }

        function typeSequence() {
            if (idx >= sequenceIds.length) {
                setTimeout(startLoopCommands, 600);
                return;
            }
            const el = document.getElementById(sequenceIds[idx]);
            typeParagraph(el, () => {
                idx++;
                setTimeout(typeSequence, 400);
            });
        }

        const loopCommands = [
            'git status',
            'docker ps',
            'kubectl get pods',
            'npm run build',
            'ssh root@server.dev',
            'gh repo list',
            'top -b -n1 | head -5'
        ];
        let cmdIndex = 0;

        function startLoopCommands() {
            function typeCmd() {
                const cmd = loopCommands[cmdIndex];
                currentCommandEl.textContent = '';
                let c = 0;
                function write() {
                    if (c < cmd.length) {
                        currentCommandEl.textContent += cmd[c];
                        c++;
                        setTimeout(write, 50);
                    } else {
                        setTimeout(() => {
                            cmdIndex = (cmdIndex + 1) % loopCommands.length;
                            typeCmd();
                        }, 2000);
                    }
                }
                write();
            }
            typeCmd();
        }

        // Blink fallback for cursor if CSS missing
        if (cursorEl) {
            cursorEl.style.animation = 'cursor-blink 1s infinite';
        }

        // Lancer la séquence
        setTimeout(typeSequence, 800);
    }

    /* ===============================
     * COPY CLONE BUTTONS (delegation)
     * =============================== */
    function initCopyCloneDelegation() {
        document.body.addEventListener('click', e => {
            const btn = e.target.closest('.copy-clone');
            if (!btn) return;
            const url = btn.getAttribute('data-clone');
            if (!url) return;

            navigator.clipboard.writeText(url).then(() => {
                const toast = document.createElement('div');
                toast.className = 'fixed top-24 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50 transition-all duration-300 transform translate-x-full';
                toast.textContent = 'URL de clonage copiée !';
                document.body.appendChild(toast);

                // Enter animation
                requestAnimationFrame(() => {
                    toast.style.transform = 'translateX(0)';
                });

                setTimeout(() => {
                    toast.style.transform = 'translateX(110%)';
                    setTimeout(() => toast.remove(), 400);
                }, 3000);
            }).catch(err => console.error('Erreur copie presse-papiers:', err));
        });
    }

    /* ===============================
     * INITIALISATION GLOBALE (DYNAMIQUE)
     * =============================== */
    async function initDynamic() {
        try {
            if (REPO_GRID) {
                REPO_GRID.innerHTML = `
                    <div class="col-span-full flex flex-col items-center justify-center py-16">
                        <div class="github-loader relative w-16 h-16">
                            <div class="github-loader-circle absolute inset-0 rounded-full border-4 border-gray-700 border-t-primary-600 animate-spin"></div>
                        </div>
                        <p class="text-gray-400 mt-4 font-medium">Chargement des dépôts...</p>
                    </div>`;
            }

            const [repos, user] = await Promise.all([
                fetchRepos(),
                fetchUser()
            ]);

            allRepos = repos.sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));
            renderReposGrid(allRepos);
            initFilters();
            updateTerminalDynamic(user, allRepos);
            initTerminalTypingSequence();
        } catch (err) {
            console.error(err);
            if (REPO_GRID) {
                REPO_GRID.innerHTML = `
                    <div class="col-span-full text-center py-12 text-red-400">
                        <p>❌ Erreur lors du chargement des dépôts GitHub.</p>
                        <p class="text-sm text-gray-400 mt-2">Veuillez réessayer plus tard.</p>
                    </div>`;
            }
        }
    }

    // Lancer
    initDynamic();
    initCopyCloneDelegation();
});