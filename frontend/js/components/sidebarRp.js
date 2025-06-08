document.addEventListener("DOMContentLoaded", () => {
    // Récupérer les données de l'utilisateur depuis le localStorage
    const user = JSON.parse(localStorage.getItem("user"));

    // Si l'utilisateur n'est pas connecté
    if (!user) {
        window.location.href = "../../public/index.html";
        return;
    }

    // Si l'utilisateur n'a pas le rôle "rp"
    if (user.role !== "rp") {
        alert("Accès refusé : vous n'avez pas les autorisations nécessaires.");
        window.location.href = "../../public/index.html";
        return;
    }

    // Si tout est OK, afficher le sidebar
    const sidebar = `
    <aside class="glass-effect backdrop-blur-lg bg-gray-900/80 w-72 min-h-screen p-6 space-y-8 fixed h-full border-r border-gray-700/30 z-50">
        <div class="flex items-center gap-3 pb-6 border-b border-gray-700/30">
            <div class="p-2 bg-gradient-to-br from-[#b31822] to-orange-600 rounded-xl">
                <i class="ri-school-line text-2xl text-white"></i>
            </div>
            <h2 class="text-xl font-bold bg-gradient-to-r from-[#b31822] to-orange-600 bg-clip-text text-transparent">
                ECOLE 221
            </h2>
        </div>
        <nav class="space-y-1">
            <a href="./dashboard.html" class="flex items-center p-3 rounded-xl hover:bg-gray-800/50 transition-all group relative">
                <i class="ri-dashboard-line text-xl mr-3 text-gray-400 group-hover:text-[#b31822] transition-all"></i>
                <span class="font-medium">Tableau de bord</span>
            </a>
            <a href="./listeClasse.html" class="flex items-center p-3 rounded-xl hover:bg-gray-800/50 transition-all group relative">
                <i class="ri-team-line text-xl mr-3 text-gray-400 group-hover:text-[#b31822] transition-all"></i>
                <span class="font-medium">Classes</span>
            </a>
            <a href="./listeProf.html" class="flex items-center p-3 rounded-xl hover:bg-gray-800/50 transition-all group relative">
                <i class="ri-user-star-line text-xl mr-3 text-gray-400 group-hover:text-[#b31822] transition-all"></i>
                <span class="font-medium">Professeurs</span>
            </a>
            <a href="./listeCours.html" class="flex items-center p-3 rounded-xl hover:bg-gray-800/50 transition-all group relative">
                <i class="ri-book-open-line text-xl mr-3 text-gray-400 group-hover:text-[#b31822] transition-all"></i>
                <span class="font-medium">Cours</span>
            </a>
        </nav>
        <div class="absolute bottom-6 left-0 right-0 px-6">
            <div class="pt-4 border-t border-gray-700/30">
                <div class="flex items-center gap-3 group cursor-pointer p-3 rounded-xl hover:bg-gray-800/50 transition-all">
                    <img src="${user.avatar}" class="rounded-full w-10 h-10 border-2 border-[#b31822]/50 hover:border-[#b31822] transition-colors">
                    <div class="flex-1 min-w-0">
                        <p class="text-sm font-medium truncate">${user.prenom} ${user.nom}</p>
                        <p class="text-xs text-gray-400 truncate">${user.role === 'rp' ? 'Responsable Pédagogique' : 'Utilisateur'}</p>
                    </div>
                </div>
                <a href="#" id="logout" class="flex items-center p-3 rounded-xl bg-red-500/20 hover:bg-red-500/30 text-red-400 hover:text-red-300 transition-all mt-2">
                    <i class="ri-logout-box-r-line text-xl mr-3"></i>
                    <span class="font-medium">Déconnexion</span>
                </a>
            </div>
        </div>
    </aside>
    `;

    // Injecter le sidebar dans la page
    document.getElementById("sidebar").innerHTML = sidebar;

    // Gestion de la déconnexion
    document.getElementById("logout").addEventListener("click", () => {
        localStorage.removeItem("user");
        window.location.href = "../../public/index.html";
    });
});
