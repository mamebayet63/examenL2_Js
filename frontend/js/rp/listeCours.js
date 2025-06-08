// Importation de la fonction fetchData depuis utils.js
import { fetchData } from '../utils/utils.js'; // ajuste ce chemin si nécessaire

const container = document.getElementById('cours-container');
const paginationContainer = document.getElementById('pagination');
const filtreDateInput = document.getElementById('filtre-date'); // Assure-toi qu'il existe dans ton HTML
const itemsPerPage = 6;
let currentPage = 1;
let coursAvecModulesEtClasses = []; // Stocke tous les cours enrichis
let coursFiltres = []; // Pour stocker les cours filtrés

function calculerDuree(heure_debut, heure_fin) {
  const [heureDebut, minuteDebut] = heure_debut.split(':').map(Number);
  const [heureFin, minuteFin] = heure_fin.split(':').map(Number);
  const debut = new Date(2000, 0, 1, heureDebut, minuteDebut);
  const fin = new Date(2000, 0, 1, heureFin, minuteFin);
  const diff = (fin - debut) / (1000 * 60);
  const heures = Math.floor(diff / 60);
  const minutes = diff % 60;
  return `${heures}h ${minutes}m`;
}

function createCoursCard(cours) {
  const duree = calculerDuree(cours.heure_debut, cours.heure_fin);
  const classesAssociees = cours.classes && Array.isArray(cours.classes) && cours.classes.length > 0 
    ? cours.classes.map(cl => `
        <div class="flex items-center gap-2 hover:text-[#b31822] transition-colors cursor-pointer">
          <div class="w-2 h-2 bg-[#b31822] rounded-full"></div> ${cl.libelle || 'Classe inconnue'}
        </div>
      `).join('')
    : '<p class="text-sm text-gray-400 italic">Aucune classe</p>';

  return `
    <div class="neon-card rounded-2xl p-6 hover:transform hover:-translate-y-2 transition-all duration-300 group relative overflow-hidden">
      <div class="absolute inset-0 bg-[#b31822]/5 group-hover:opacity-30 transition-opacity"></div>
      <div class="relative">
        <div class="flex justify-between items-start">
          <div>
            <div class="flex items-center gap-3 mb-3">
              <div class="w-3 h-3 bg-[#b31822] rounded-full animate-pulse"></div>
              <h3 class="text-xl font-bold tracking-wide">🚀 ${cours.module?.libelle || 'Module inconnu'}</h3>
            </div>
            <div class="flex flex-wrap gap-4 items-center text-gray-300">
              <div class="flex items-center gap-2">
                <i class="ri-calendar-line"></i>
                <span>${cours.date}</span>
              </div>
              <div class="flex items-center gap-2">
                <i class="ri-time-line"></i>
                <span>${duree}</span>
              </div>
              <span class="px-3 py-1 bg-[#b31822]/20 rounded-full text-sm">${cours.semestre}</span>
            </div>
          </div>
          <div class="flex flex-col items-end gap-3">
            <span class="px-3 py-1 bg-[#b31822]/20 rounded-full text-sm">${cours.nb_classes} classes</span>
            <div class="flex gap-3">
              <button class="text-gray-300 hover:text-[#b31822] transition-colors"><i class="ri-arrow-down-s-line"></i></button>
              <button class="text-gray-300 hover:text-cyan-400 transition-colors"><i class="ri-edit-line"></i></button>
            </div>
          </div>
        </div>
        <div class="mt-6 pt-6 border-t border-[#b31822]/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div class="grid grid-cols-2 gap-4">
            <div>
              <h4 class="font-semibold mb-3 text-[#b31822]">📡 Classes Associées</h4>
              <div class="space-y-2">${classesAssociees}</div>
            </div>
            <div>
              <h4 class="font-semibold mb-3 text-cyan-400">👥 Étudiants</h4>
              <a href="#" class="inline-flex items-center gap-2 text-sm hover:text-cyan-400 transition-colors">
                Voir les étudiants <i class="ri-arrow-right-line"></i>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

function afficherPagination(totalItems) {
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  paginationContainer.innerHTML = '';

  for (let i = 1; i <= totalPages; i++) {
    const btn = document.createElement('button');
    btn.textContent = i;
    btn.className = `px-3 py-1 mx-1 rounded ${i === currentPage ? 'bg-[#b31822] text-white' : 'bg-gray-200 text-gray-700'}`;
    btn.addEventListener('click', () => {
      currentPage = i;
      afficherPage();
    });
    paginationContainer.appendChild(btn);
  }
}

function afficherPage() {
  const data = coursFiltres.length ? coursFiltres : coursAvecModulesEtClasses;
  const start = (currentPage - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  const pageData = data.slice(start, end);

  container.innerHTML = pageData.length > 0
    ? pageData.map(createCoursCard).join('')
    : '<p class="text-gray-400 italic">Aucun cours trouvé.</p>';

  afficherPagination(data.length);
}

function filtrerEtAfficherCoursParDate(date) {
  currentPage = 1;
  if (!date) {
    coursFiltres = [];
  } else {
    coursFiltres = coursAvecModulesEtClasses.filter(c => c.date === date);
  }
  afficherPage();
}

if (filtreDateInput) {
  filtreDateInput.addEventListener('change', (e) => {
    filtrerEtAfficherCoursParDate(e.target.value);
  });
}

async function afficherCours() {
  try {
    const [coursList, modulesList, coursClassesList, classesList] = await Promise.all([
      fetchData('cours'),
      fetchData('module'),
      fetchData('cours_classe'),
      fetchData('classe')
    ]);

    if (coursList && Array.isArray(coursList) && coursList.length > 0) {
      coursAvecModulesEtClasses = coursList.map(cours => {
        const module = modulesList.find(mod => mod.id == cours.id_module);
        const classesAssociees = coursClassesList
          .filter(cc => cc.id_cours == cours.id)
          .map(cc => {
            const classe = classesList.find(cl => cl.id == cc.id_classe);
            return { ...cc, libelle: classe ? classe.libelle : 'Classe inconnue' };
          });

        return {
          ...cours,
          module: module || { libelle: "Module inconnu" },
          classes: classesAssociees,
          nb_classes: classesAssociees.length
        };
      });

      afficherPage();
    } else {
      container.innerHTML = '<p class="text-red-500">Aucun cours trouvé.</p>';
    }
  } catch (error) {
    console.error('Erreur lors du chargement des cours :', error);
    container.innerHTML = '<p class="text-red-500">Erreur lors du chargement des cours.</p>';
  }
}

afficherCours();
