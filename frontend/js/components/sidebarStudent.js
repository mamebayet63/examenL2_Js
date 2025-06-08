document.addEventListener("DOMContentLoaded", () => {
    // Récupérer les données de l'utilisateur depuis le localStorage
    const user = JSON.parse(localStorage.getItem("user"));

    // Si l'utilisateur n'est pas connecté
    if (!user) {
        window.location.href = "../../public/index.html";
        return;
    }

    // Si l'utilisateur n'a pas le rôle "rp"
    if (user.role !== "student") {
        alert("Accès refusé : vous n'avez pas les autorisations nécessaires.");
        window.location.href = "../../public/index.html";
        return;
    }

    // Si tout est OK, afficher le sidebar
    const sidebar = `
     <aside class="w-64 h-full bg-slate-800/90 backdrop-blur-lg border-r border-slate-700/50 p-4 hidden lg:flex flex-col justify-between">
    <div>
        <div class="mb-8">
            <div class="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-purple-600 bg-clip-text text-transparent">
                École 221
            </div>
        </div>
        <nav class="space-y-2">
            <a href="./dasboard.html" class="flex items-center space-x-3 p-3 rounded-xl bg-indigo-400/10 text-indigo-400">
                <i class="fas fa-chart-line w-5"></i>
                <span>Dashboard</span>
            </a>
            <a href="./mesCours.html" class="flex items-center space-x-3 p-3 rounded-xl hover:bg-slate-700/30 text-slate-300 transition-colors">
                <i class="fas fa-book-open w-5"></i>
                <span>Mes Cours</span>
            </a>
            <a href="./mesAbsences.html" class="flex items-center space-x-3 p-3 rounded-xl hover:bg-slate-700/30 text-slate-300 transition-colors">
                <i class="fas fa-calendar-times w-5"></i>
                <span>Absences</span>
            </a>
            
        </nav>
    </div>

    <!-- Bouton de déconnexion -->
    <div class="mt-6">
        <a href="#" id="logout" class="flex items-center p-3 rounded-xl bg-red-500/20 hover:bg-red-500/30 text-red-400 hover:text-red-300 transition-all mt-2">
            <i class="ri-logout-box-r-line text-xl mr-3"></i>
            <span class="font-medium">Déconnexion</span>
        </a>
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
