// On attend que le HTML soit entièrement chargé avant d'exécuter le script
document.addEventListener('DOMContentLoaded', () => {

    // --- VARIABLES GLOBALES ET SÉLECTEURS ---
    const username = 'Louis-Bouhours'; // Votre nom d'utilisateur GitHub
    const repoGrid = document.getElementById('repositories-grid');
    const repoSearch = document.getElementById('repo-search');
    const filterBtns = document.querySelectorAll('.filter-btn');

    let allRepos = []; // Pour stocker tous les dépôts récupérés une seule fois
    let currentFilter = 'all'; // Le filtre actif par défaut

    // Un objet pour associer les langages à des couleurs pour le design
    const languageColors = {
        'JavaScript': '#f1e05a',
        'TypeScript': '#3178c6',
        'Python': '#3572A5',
        'Java': '#b07219',
        'C#': '#239120',
        'HTML': '#e34c26',
        'CSS': '#1572B6',
        'Shell': '#89e051',
        // Ajoutez d'autres langages au besoin
    };

    // --- FONCTIONS PRINCIPALES ---

    /**
     * Charge les dépôts depuis l'API GitHub
     */
    async function loadGitHubRepos() {
        try {
            const response = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=100`);
            if (!response.ok) {
                throw new Error(`Erreur HTTP: ${response.status}`);
            }
            const repos = await response.json();
            allRepos = repos; // On sauvegarde les données
            renderRepositories(allRepos); // On affiche tous les dépôts au début
        } catch (error) {
            console.error('Impossible de charger les dépôts:', error);
            showError();
        }
    }

    /**
     * Affiche les dépôts dans la grille HTML
     * @param {Array} repos - Un tableau d'objets dépôt à afficher
     */
    function renderRepositories(repos) {
        repoGrid.innerHTML = ''; // On vide la grille

        if (repos.length === 0) {
            repoGrid.innerHTML = `
                <div class="col-span-full text-center py-12">
                    <p class="text-gray-400">Aucun dépôt ne correspond à votre recherche.</p>
                </div>
            `;
            return;
        }

        const repoCardsHTML = repos.map(repo => createRepoCard(repo)).join('');
        repoGrid.innerHTML = repoCardsHTML;
    }

    /**
     * Crée le code HTML pour une seule carte de dépôt
     * @param {object} repo - L'objet contenant les données d'un dépôt
     * @returns {string} - La chaîne de caractères HTML de la carte
     */
    function createRepoCard(repo) {
        const languageColor = languageColors[repo.language] || '#6b7280'; // Gris par défaut
        const updatedDate = new Date(repo.updated_at).toLocaleDateString('fr-FR');

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
                        ${repo.description || 'Aucune description disponible.'}
                    </p>
                </div>
                <div>
                    <div class="flex items-center justify-between text-gray-400 text-sm mb-4">
                        ${repo.language ? `
                            <div class="flex items-center gap-2">
                                <div class="w-3 h-3 rounded-full" style="background-color: ${languageColor}"></div>
                                <span>${repo.language}</span>
                            </div>
                        ` : '<div></div>'}
                        <div class="flex gap-4">
                            <span>⭐ ${repo.stargazers_count}</span>
                            <span> Gists ${repo.forks_count}</span>
                        </div>
                    </div>
                     <div class="flex items-center justify-between">
                         <span class="text-gray-500 text-xs">Màj le ${updatedDate}</span>
                         <div class="flex gap-2">
                            <a href="${repo.html_url}" target="_blank" class="px-3 py-1 bg-primary-500 text-white rounded text-sm hover:bg-primary-600 transition-colors">
                                Voir
                            </a>
                            <button onclick="copyToClipboard('${repo.clone_url}')" class="px-3 py-1 border border-primary-500 text-primary-500 rounded text-sm hover:bg-primary-500 hover:text-white transition-colors">
                                Cloner
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }


    // --- GESTION DES ÉVÉNEMENTS (FILTRES ET RECHERCHE) ---

    function handleFilterAndSearch() {
        const searchTerm = repoSearch.value.toLowerCase();

        // 1. On filtre par le terme de recherche
        let filteredBySearch = allRepos.filter(repo => {
            const nameMatch = repo.name.toLowerCase().includes(searchTerm);
            const descMatch = (repo.description || '').toLowerCase().includes(searchTerm);
            const langMatch = (repo.language || '').toLowerCase().includes(searchTerm);
            return nameMatch || descMatch || langMatch;
        });

        // 2. On applique le filtre actif (Tous, Récents, etc.) sur les résultats de la recherche
        let finalFilteredRepos;
        switch (currentFilter) {
            case 'starred':
                finalFilteredRepos = filteredBySearch
                    .filter(repo => repo.stargazers_count > 0)
                    .sort((a, b) => b.stargazers_count - a.stargazers_count); // Trie par popularité
                break;
            case 'archived':
                finalFilteredRepos = filteredBySearch.filter(repo => repo.archived);
                break;
            case 'recent':
                // L'API nous donne déjà les dépôts triés par date de mise à jour
                finalFilteredRepos = filteredBySearch.slice(0, 12); // On montre les 12 plus récents
                break;
            case 'all':
            default:
                finalFilteredRepos = filteredBySearch;
                break;
        }

        renderRepositories(finalFilteredRepos);
    }

    // Écouteur pour la barre de recherche
    repoSearch.addEventListener('input', handleFilterAndSearch);

    // Écouteurs pour les boutons de filtre
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Met à jour le style du bouton actif
            filterBtns.forEach(b => {
                b.classList.remove('bg-primary-500', 'text-white');
                b.classList.add('bg-dark-800', 'text-gray-300');
            });
            btn.classList.add('bg-primary-500', 'text-white');
            btn.classList.remove('bg-dark-800', 'text-gray-300');

            // Met à jour le filtre courant et relance le filtrage
            currentFilter = btn.dataset.filter;
            handleFilterAndSearch();
        });
    });


    // --- FONCTIONS UTILITAIRES ---

    /**
     * Affiche un message d'erreur dans la grille
     */
    function showError() {
        repoGrid.innerHTML = `
            <div class="col-span-full text-center py-12 text-red-400">
                <p>❌ Erreur lors du chargement des dépôts GitHub.</p>
                <p class="text-sm text-gray-400 mt-2">Veuillez vérifier votre connexion ou réessayer plus tard.</p>
            </div>
        `;
    }

    /**
     * Copie un texte dans le presse-papiers et affiche une notification
     * @param {string} text - Le texte à copier
     */
    window.copyToClipboard = function(text) {
        navigator.clipboard.writeText(text).then(() => {
            // Crée et affiche la notification (toast)
            const toast = document.createElement('div');
            toast.className = 'fixed top-24 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50 transition-all duration-300 transform translate-x-full animate-slide-in-out';
            toast.textContent = 'URL de clonage copiée !';
            document.body.appendChild(toast);

            // Supprime la notification après 3 secondes
            setTimeout(() => {
                toast.style.transform = 'translateX(100%)';
                setTimeout(() => toast.remove(), 300);
            }, 3000);
        }).catch(err => {
            console.error('Erreur lors de la copie:', err);
        });
    }

    // --- INITIALISATION ---
    loadGitHubRepos();
});