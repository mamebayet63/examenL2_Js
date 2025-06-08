// Récupérer les classes, les inscriptions et les cours_classe
fetch('http://localhost:3000/classe')
  .then(res => res.json())
  .then(classes => {
    // Récupérer les inscriptions et les cours_classe en parallèle
    Promise.all([
      fetch('http://localhost:3000/inscription').then(res => res.json()),
      fetch('http://localhost:3000/cours_classe').then(res => res.json())
    ])
    .then(([inscriptions, cours_classe]) => {
      const container = document.getElementById('classContainer');

      // Calculer le nombre d'étudiants inscrits et le nombre de cours pour chaque classe
      classes.forEach(classe => {
        const etudiantsCount = inscriptions.filter(inscription => inscription.id_classe === classe.id).length;
        const coursCount = cours_classe.filter(cours => cours.id_classe == classe.id).length;

        // Générer le HTML pour chaque classe avec les informations nécessaires
        container.innerHTML += `
          <article class="group relative rounded-2xl p-6 bg-gradient-to-br from-gray-800/50 to-gray-900/50 
              border border-gray-700/30 hover:border-indigo-500/50 transition-all duration-300 shadow-xl 
              hover:shadow-indigo-500/20 overflow-hidden">
            <div class="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 opacity-0 
              group-hover:opacity-100 transition-opacity duration-500"></div>
            <div class="absolute -top-20 -right-20 w-48 h-48 bg-radial-gradient(from 60% at 50% 50%, rgba(99, 102, 241, 0.15) 0%, transparent 80%) 
              group-hover:opacity-50 opacity-0 transition-opacity duration-300"></div>
            <div class="relative z-10">
              <div class="flex justify-between items-start mb-4">
                <div>
                  <h3 class="text-xl font-bold text-gray-100 mb-2 tracking-tight">${classe.libelle}</h3>
                  <span class="inline-block px-3 py-1 bg-indigo-500/10 text-indigo-300 rounded-full 
                        text-sm font-medium border border-indigo-500/20">
                    ${classe.niveau}
                  </span>
                </div>
                <i class="ri-star-s-line text-2xl text-indigo-400/80 hover:text-indigo-300 cursor-pointer"></i>
              </div>

              <div class="relative mb-6">
                <div class="h-2 bg-gray-800/50 rounded-full overflow-hidden">
                  <div class="h-full bg-gradient-to-r from-indigo-400 to-purple-400 w-${classe.progression} relative">
                    <div class="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent w-1/3 animate-shimmer"></div>
                  </div>
                </div>
                <div class="absolute right-0 -top-8 text-indigo-300 text-sm font-medium">${classe.progression}</div>
              </div>

              <div class="grid grid-cols-2 gap-4 mb-6">
                <div class="p-4 bg-gray-800/30 rounded-xl border border-gray-700/30 backdrop-blur-sm">
                  <div class="text-sm text-indigo-300/80 mb-1">Étudiants</div>
                  <div class="text-2xl font-bold text-indigo-200">${etudiantsCount}</div>
                </div>
                <div class="p-4 bg-gray-800/30 rounded-xl border border-gray-700/30 backdrop-blur-sm">
                  <div class="text-sm text-purple-300/80 mb-1">Cours</div>
                  <div class="text-2xl font-bold text-purple-200">${coursCount}</div>
                </div>
              </div>

              <div class="flex justify-between items-center border-t border-gray-800 pt-4">
                <button class="flex items-center text-indigo-300 hover:text-indigo-200 gap-2 
                        transition-all hover:gap-3">
                  <span>Voir détails</span>
                  <i class="ri-arrow-right-up-line text-lg"></i>
                </button>
                <div class="flex gap-2">
                  <button class="p-2 hover:bg-indigo-500/10 rounded-lg text-gray-400 hover:text-indigo-300 
                          transition-colors duration-200">
                    <i class="ri-pencil-line text-lg"></i>
                  </button>
                  <button class="p-2 hover:bg-purple-500/10 rounded-lg text-gray-400 hover:text-purple-300 
                          transition-colors duration-200">
                    <i class="ri-delete-bin-line text-lg"></i>
                  </button>
                </div>
              </div>
            </div>
          </article>`;
      });
    })
    .catch(err => {
      console.error('Erreur lors du chargement des inscriptions ou des cours :', err);
    });
  })
  .catch(err => {
    console.error('Erreur lors du chargement des classes :', err);
  });
