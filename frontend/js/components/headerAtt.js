document.addEventListener("DOMContentLoaded", () => {
  const user = JSON.parse(localStorage.getItem("user"));

    // Si l'utilisateur n'est pas connecté
    if (!user) {
        window.location.href = "../../public/index.html";
        return;
    }

      // Si l'utilisateur n'a pas le rôle "attache"
      if (user.role !== "attache") {
        alert("Accès refusé : vous n'avez pas les autorisations nécessaires.");
        window.location.href = "../../public/index.html";
        return;
    }

    const navBar = `
      <nav class="fixed w-full bg-gray-800/50 backdrop-blur-lg border-b border-gray-700/30 shadow-2xl shadow-indigo-500/10 z-50">
        <div class="max-w-7xl mx-auto px-6 py-3">
          <div class="flex justify-between items-center">
            <h1 class="text-2xl font-bold bg-gradient-to-r from-indigo-400 via-blue-300 to-purple-400 bg-clip-text text-transparent 
                       animate-gradient hover:scale-105 transition-transform">
              ECOLE 221
            </h1>
            <div class="flex items-center space-x-8">
              <a href="./dashboardatt.html" class="group relative px-3 py-2 rounded-lg transition-all duration-300
                 bg-gray-700/20 hover:bg-indigo-500/10 border border-transparent hover:border-indigo-500/30">
                <div class="flex items-center gap-2">
                  <i class="ri-building-4-line text-indigo-400/90 group-hover:text-indigo-300 transition-colors"></i>
                  <span class="text-gray-300 group-hover:text-indigo-200">Classes</span>
                </div>
                <div class="absolute inset-x-0 -bottom-px h-px bg-gradient-to-r from-transparent via-indigo-400 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </a>
              <a href="./inscription.html" class="group relative px-3 py-2 rounded-lg transition-all duration-300
                 bg-gray-700/20 hover:bg-indigo-500/10 border border-transparent hover:border-indigo-500/30">
                <div class="flex items-center gap-2">
                  <i class="ri-building-4-line text-indigo-400/90 group-hover:text-indigo-300 transition-colors"></i>
                  <span class="text-gray-300 group-hover:text-indigo-200">Inscription</span>
                </div>
                <div class="absolute inset-x-0 -bottom-px h-px bg-gradient-to-r from-transparent via-indigo-400 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </a>
              <!-- Autres liens si nécessaire -->
              <a href="./justif.html" class="group relative px-3 py-2 rounded-lg transition-all duration-300
                 bg-gray-700/20 hover:bg-indigo-500/10 border border-transparent hover:border-indigo-500/30">
                <div class="flex items-center gap-2">
                  <i class="ri-building-4-line text-indigo-400/90 group-hover:text-indigo-300 transition-colors"></i>
                  <span class="text-gray-300 group-hover:text-indigo-200">Justification</span>
                </div>
                <div class="absolute inset-x-0 -bottom-px h-px bg-gradient-to-r from-transparent via-indigo-400 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </a>
            </div>
          </div>
        </div>
      </nav>
    `;
  
    document.getElementById("navBar").innerHTML = navBar;
  });
  