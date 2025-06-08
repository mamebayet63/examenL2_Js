import { fetchData, softDelete , updateData } from '../utils/utils.js';
let classToDelete = null;
let classToUpdate = null;
  const profList = document.getElementById('profList');
  const totalProfs = document.getElementById('totalProfs');
  const actifProfs = document.getElementById('actifProfs');
  const totalMatieres = document.getElementById('totalMatieres');
  const searchInput = document.getElementById('searchInput');

  let professeurs = [];

  const fetchProfesseurs = async () => {
    const res = await fetch('http://localhost:3000/utilisateurs');
    const data = await res.json();
    professeurs = data.filter(user => user.role === 'prof' && user.etat === 'actif');
    updateStats();
    displayProfesseurs(professeurs);
  }

  const updateStats = () => {
    totalProfs.textContent = professeurs.length;
    actifProfs.textContent = professeurs.filter(p => p.statut === 'Actif').length;
    const matieres = [...new Set(professeurs.map(p => p.matiere))];
    totalMatieres.textContent = matieres.length;
  }

  const displayProfesseurs = (list) => {
    profList.innerHTML = '';
    list.forEach(prof => {
        profList.innerHTML += `
        <div class="group relative bg-gray-800 rounded-2xl p-4 border-2 border-gray-700/30 hover:border-[#b31822]/50 transition">
          <div class="flex items-start gap-2">
            <img src="${prof.photo}" class="w-12 h-12 rounded-xl border-2 border-[#b31822]/50">
            <div class="flex-1 min-w-0">
              <h3 class="text-sm font-bold truncate">${prof.prenom} ${prof.nom}</h3>
              <p class="text-xs font-semibold text-[#b31822] truncate">${prof.specialite}</p>
              <div class="flex items-center gap-2 mt-1 text-xs text-gray-400">
                <span><i class="ri-star-fill text-yellow-400"></i> ${prof.grade}</span>
                <span>•</span>
                <span>${prof.matricule}</span>
              </div>
            </div>
            <div class="flex items-center gap-2 ml-auto">
              <button onclick="editProf(${prof.id})" class="p-2 rounded-full hover:bg-gray-700 transition">
                <i class="ri-edit-2-line text-lg text-green-500"></i>
              </button>
              <button  class="p-2 rounded-full hover:bg-gray-700 transition delete-class-btn" data-id="${prof.id}">
                <i class="ri-delete-bin-6-line text-lg text-red-500"></i>
              </button>
            </div>
          </div>
          <div class="mt-3 pt-3 border-t border-gray-700/50 flex flex-wrap gap-2 text-sm">
            <a href="mailto:${prof.email}" class="flex items-center gap-1 text-gray-400 hover:text-white">
              <i class="ri-mail-line"></i><span class="truncate">${prof.email}</span>
            </a>
            <span class="flex items-center gap-1 text-gray-400">
              <i class="ri-map-pin-3-line"></i>${prof.adresse}
            </span>
          </div>
        </div>
      `;
      
    });
  }

  searchInput.addEventListener('input', e => {
    const query = e.target.value.toLowerCase();
    const filtered = professeurs.filter(prof =>
      prof.prenom.toLowerCase().includes(query) ||
      prof.matiere.toLowerCase().includes(query) ||
      prof.ville.toLowerCase().includes(query)
    );
    displayProfesseurs(filtered);
  });

   // Gestion des boutons de suppression
 profList.addEventListener('click', (e) => {
  if (e.target.closest('.delete-class-btn')) {
    const button = e.target.closest('.delete-class-btn');
    const id = button.getAttribute('data-id');
    confirmDelete(id);
  }
});

// Fonction pour afficher le modal de confirmation
function confirmDelete(id_classe) {
  classToDelete = id_classe;
  console.log(classToDelete);
  

  const modal = document.createElement('div');
  modal.id = 'confirmation-modal';
  modal.classList.add('fixed', 'inset-0', 'bg-black', 'bg-opacity-50', 'flex', 'justify-center', 'items-center');

  modal.innerHTML = `
    <div class="bg-gray-800 p-6 rounded-lg">
      <h2 class="text-xl font-bold text-red-600">Confirmer la suppression</h2>
      <p class-"text-red-600">Êtes-vous sûr de vouloir supprimer cette classe ?</p>
      <div class="flex justify-end gap-4 mt-4">
        <button id="cancelDelete" class="px-4 py-2 bg-gray-300 text-black rounded-lg">Annuler</button>
        <button id="confirmDelete" class="px-4 py-2 bg-red-500 text-white rounded-lg">Confirmer</button>
      </div>
    </div>
  `;

  document.body.appendChild(modal);

  document.getElementById('cancelDelete').addEventListener('click', () => {
    modal.remove();
  });

  document.getElementById('confirmDelete').addEventListener('click', async () => {
    if (classToDelete) {
      const classes = await fetchData('utilisateurs');
      const classe = classes.find(c => c.id === classToDelete);
      console.log(classe);
      
      if (classe) {
        
        classe.etat = "supprimée";
        console.log(classes);
        
        const success = await softDelete('utilisateurs', classToDelete, {etat : "supprimée"});
        if (success) {
          displayClasses();
        } else {
          alert("Erreur lors de la suppression. Veuillez réessayer.");
        }
      }
    }
    modal.remove();
  });
}
  fetchProfesseurs();
