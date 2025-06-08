import { allClasses, inscriptions, coursClasse, loadData } from './dataLoader.js';

const container = document.getElementById('classContainer');
const pagination = document.getElementById('paginationControls');
const niveauSelect = document.querySelector('select'); // Assure-toi qu'il y a un seul <select>
const itemsPerPage = 6;
let currentPage = 1;
let filteredClasses = []; // Tableau des classes filtrées

function getUniqueNiveaux() {
  const niveaux = allClasses.map(c => c.niveau);
  return [...new Set(niveaux)];
}

function populateNiveauOptions() {
  const niveaux = getUniqueNiveaux();
  niveauSelect.innerHTML = `<option value="">Tous les niveaux</option>`; // Option par défaut
  niveaux.forEach(niveau => {
    niveauSelect.innerHTML += `<option value="${niveau}">${niveau}</option>`;
  });
}

function filterClasses() {
  const selectedNiveau = niveauSelect.value;
  filteredClasses = selectedNiveau
    ? allClasses.filter(c => c.niveau === selectedNiveau)
    : [...allClasses];
}

function renderClasses() {
  container.innerHTML = '';
  const start = (currentPage - 1) * itemsPerPage;
  const paginated = filteredClasses.slice(start, start + itemsPerPage);

  paginated.forEach(classe => {
    const etudiants = inscriptions.filter(ins => ins.id_classe === classe.id);
    const coursCount = coursClasse.filter(cours => cours.id_classe == classe.id).length;

    container.innerHTML += `
      <article class="group relative rounded-2xl p-6 bg-gradient-to-br from-gray-800/50 to-gray-900/50 border border-gray-700/30 hover:border-indigo-500/50 transition-all duration-300 shadow-xl hover:shadow-indigo-500/20 overflow-hidden">
        <div class="relative z-10">
          <div class="flex justify-between items-start mb-4">
            <div>
              <h3 class="text-xl font-bold text-gray-100 mb-2 tracking-tight">${classe.libelle}</h3>
              <span class="inline-block px-3 py-1 bg-indigo-500/10 text-indigo-300 rounded-full text-sm font-medium border border-indigo-500/20">${classe.niveau}</span>
            </div>
            <i class="ri-star-s-line text-2xl text-indigo-400/80 hover:text-indigo-300 cursor-pointer"></i>
          </div>
          <div class="grid grid-cols-2 gap-4 mb-6">
            <div class="p-4 bg-gray-800/30 rounded-xl border border-gray-700/30">
              <div class="text-sm text-indigo-300/80 mb-1">Étudiants</div>
              <div class="text-2xl font-bold text-indigo-200">${etudiants.length}</div>
            </div>
            <div class="p-4 bg-gray-800/30 rounded-xl border border-gray-700/30">
              <div class="text-sm text-purple-300/80 mb-1">Cours</div>
              <div class="text-2xl font-bold text-purple-200">${coursCount}</div>
            </div>
          </div>
          <div class="flex justify-between items-center border-t border-gray-800 pt-4">
            <button class="voir-details text-indigo-300 hover:text-indigo-200 flex items-center gap-2" data-id="${classe.id}">
              <span>Voir détails</span><i class="ri-arrow-right-up-line text-lg"></i>
            </button>
            <div class="flex gap-2">
              <button class="p-2 hover:bg-indigo-500/10 rounded-lg text-gray-400 hover:text-indigo-300"><i class="ri-pencil-line text-lg"></i></button>
              <button class="p-2 hover:bg-purple-500/10 rounded-lg text-gray-400 hover:text-purple-300"><i class="ri-delete-bin-line text-lg"></i></button>
            </div>
          </div>
        </div>
      </article>`;
  });

  bindDetailButtons();
}

function renderPagination() {
  pagination.innerHTML = '';
  const totalPages = Math.ceil(filteredClasses.length / itemsPerPage);

  for (let i = 1; i <= totalPages; i++) {
    pagination.innerHTML += `<button class="px-3 py-1 rounded-md text-sm ${i === currentPage ? 'bg-indigo-500 text-white' : 'bg-gray-700 text-gray-200'} hover:bg-indigo-600" data-page="${i}">${i}</button>`;
  }

  document.querySelectorAll('#paginationControls button').forEach(btn => {
    btn.addEventListener('click', () => {
      currentPage = parseInt(btn.dataset.page);
      renderClasses();
      renderPagination();
    });
  });
}

async function bindDetailButtons() {
  document.querySelectorAll('.voir-details').forEach(btn => {
    btn.addEventListener('click', async () => {
      const idClasse = parseInt(btn.dataset.id);
      const studentList = document.getElementById('studentList');

      try {
        const insRes = await fetch(`http://localhost:3000/inscription?id_classe=${idClasse}`);
        const inscriptions = await insRes.json();

        if (!inscriptions.length) {
          studentList.innerHTML = '<li>Aucun étudiant inscrit.</li>';
          document.getElementById('popupOverlay').classList.remove('hidden');
          return;
        }

        const studentPromises = inscriptions.map(ins =>
          fetch(`http://localhost:3000/utilisateurs?id=${ins.id_etudiant}&role=student`).then(res => res.json())
        );

        const studentArrays = await Promise.all(studentPromises);
        const students = studentArrays.flat();

        studentList.innerHTML = students.length
          ? students.map(s => `<li>• ${s.nom} ${s.prenom}</li>`).join('')
          : '<li>Aucun étudiant trouvé.</li>';

        document.getElementById('popupOverlay').classList.remove('hidden');

      } catch (error) {
        console.error(error);
        studentList.innerHTML = '<li>Erreur lors du chargement.</li>';
        document.getElementById('popupOverlay').classList.remove('hidden');
      }
    });
  });
}

document.getElementById('closePopup').addEventListener('click', () => {
  document.getElementById('popupOverlay').classList.add('hidden');
});

function init() {
  loadData(() => {
    populateNiveauOptions();
    filterClasses();
    renderClasses();
    renderPagination();
  });
}

niveauSelect.addEventListener('change', () => {
  currentPage = 1;
  filterClasses();
  renderClasses();
  renderPagination();
});

init();

