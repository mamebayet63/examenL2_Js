import { fetchData, softDelete , updateData } from '../utils/utils.js';

let currentPage = 1;
const itemsPerPage = 6;
let classToDelete = null;

// Fonction pour récupérer et afficher les classes avec pagination
async function displayClasses() {
  const classGrid = document.getElementById("class-grid");
  const paginationControls = document.getElementById("pagination-controls");

  classGrid.innerHTML = "";

  const classes = (await fetchData('classe'))?.filter(c => c.etat !== "suprimée");
  const filieres = await fetchData('filiere');
  const inscriptions = await fetchData('inscription');
  

  if (!classes || !filieres || !inscriptions) return;

  const totalPages = Math.ceil(classes.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedClasses = classes.slice(startIndex, endIndex);

  paginatedClasses.forEach((classe) => {
    const filiere = filieres.find(f => f.id == classe.id_filiere);
    const studentsCount = inscriptions.filter(ins => ins.id_classe == classe.id && ins.annee === "2025").length;

    const classCard = `
      <div class="group relative bg-gray-800 border-2 border-gray-700/30 rounded-2xl p-6 hover:border-[#b31822]/50 transition-all duration-300 cursor-pointer">
        <div class="flex justify-between items-start">
          <div class="space-y-3">
            <h3 class="text-xl font-bold text-white">${classe.libelle}</h3>
            <div class="flex flex-wrap gap-2">
              <span class="px-3 py-1 bg-[#b31822]/20 text-[#b31822] text-sm rounded-full">
                ${filiere ? filiere.libelle : 'Aucune filière'}
              </span>
              <span class="px-3 py-1 bg-blue-500/20 text-blue-400 text-sm rounded-full">
                ${classe.niveau}
              </span>
            </div>
          </div>
          <button class="text-gray-400 hover:text-white p-1 -mt-1 -mr-2">
            <i class="ri-more-2-fill text-xl"></i>
          </button>
        </div>

        <div class="mt-6 pt-4 border-t border-gray-700/50">
          <div class="flex justify-between items-center text-gray-400 text-sm">
            <div class="flex items-center gap-2">
              <i class="ri-user-line"></i>
              <span>${studentsCount} Étudiant${studentsCount > 1 ? 's' : ''}</span>
            </div>
            <div class="flex items-center gap-2">
              <i class="ri-calendar-line"></i>
              <span>2025</span>
            </div>
          </div>
        </div>

        <div class="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
          <div class="flex gap-2">
            <button class="p-2 bg-gray-700 hover:bg-[#b31822] rounded-lg text-white edit-class-btn" data-id="${classe.id}">
              <i class="ri-pencil-line"></i>
            </button>

            <button class="p-2 bg-gray-700 hover:bg-red-500 rounded-lg text-white delete-class-btn" data-id="${classe.id}">
              <i class="ri-delete-bin-line"></i>
            </button>
          </div>
        </div>
      </div>
    `;
    classGrid.innerHTML += classCard;
  });

  paginationControls.innerHTML = `
    <button id="prevPage" ${currentPage === 1 ? 'disabled' : ''} class="px-4 py-2 mx-1 bg-gray-700 text-white rounded hover:bg-gray-600 disabled:opacity-50">Précédent</button>
    <span class="text-white">Page ${currentPage} sur ${totalPages}</span>
    <button id="nextPage" ${currentPage === totalPages ? 'disabled' : ''} class="px-4 py-2 mx-1 bg-gray-700 text-white rounded hover:bg-gray-600 disabled:opacity-50">Suivant</button>
  `;

  // Gestion des boutons de pagination
  document.getElementById("prevPage").addEventListener("click", () => {
    if (currentPage > 1) {
      currentPage--;
      displayClasses();
    }
  });

  document.getElementById("nextPage").addEventListener("click", () => {
    if (currentPage < totalPages) {
      currentPage++;
      displayClasses();
    }
  });

  // Gestion des boutons de suppression
  document.querySelectorAll('.delete-class-btn').forEach(button => {
    button.addEventListener('click', (e) => {
      const id = e.currentTarget.getAttribute('data-id');
      console.log(id);
      confirmDelete(id);
    });
  });
  // Gestion des boutons de modification
document.querySelectorAll('.edit-class-btn').forEach(button => {
  button.addEventListener('click', async (e) => {
    const id = e.currentTarget.getAttribute('data-id');
    const classes = await fetchData('classe');
    const filieres = await fetchData('filiere');
    const classe = classes.find(c => c.id === id);
    
    if (classe) {
      showEditModal(classe, filieres);
    }
  });
});

}

// Fonction pour afficher le modal de confirmation
function confirmDelete(id_classe) {
  classToDelete = id_classe;
  console.log(classToDelete);
  

  const modal = document.createElement('div');
  modal.id = 'confirmation-modal';
  modal.classList.add('fixed', 'inset-0', 'bg-black', 'bg-opacity-50', 'flex', 'justify-center', 'items-center');

  modal.innerHTML = `
    <div class="bg-white p-6 rounded-lg">
      <h2 class="text-xl font-bold">Confirmer la suppression</h2>
      <p>Êtes-vous sûr de vouloir supprimer cette classe ?</p>
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
      const classes = await fetchData('classe');
      const classe = classes.find(c => c.id === classToDelete);
      console.log(classe);
      
      if (classe) {
        
        classe.etat = "supprimée";
        console.log(classes);
        
        const success = await softDelete('classe', classToDelete, {etat : "supprimée"});
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
// modal pour modifier
function showEditModal(classe, filieres) {
  const modal = document.createElement('div');
  modal.id = 'edit-class-modal';
  modal.classList.add('fixed', 'inset-0', 'bg-black', 'bg-opacity-50', 'flex', 'justify-center', 'items-center', 'z-50');

  modal.innerHTML = `
  <div class="bg-gray-800 p-8 rounded-xl w-96 shadow-xl border border-gray-700">
    <h2 class="text-2xl font-bold mb-6 text-gray-100">Modifier la classe</h2>
    
    <div class="space-y-5">
      <div>
        <label class="block mb-2 text-sm font-medium text-gray-400">Libellé</label>
        <input type="text" id="edit-libelle" value="${classe.libelle}" 
               class="w-full px-4 py-2.5 bg-gray-700 border border-gray-600 rounded-lg 
                      text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent
                      placeholder-gray-400 transition-all" />
      </div>

      <div>
        <label class="block mb-2 text-sm font-medium text-gray-400">Niveau</label>
        <input type="text" id="edit-niveau" value="${classe.niveau}" 
               class="w-full px-4 py-2.5 bg-gray-700 border border-gray-600 rounded-lg 
                      text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent
                      placeholder-gray-400 transition-all" />
      </div>

      <div>
        <label class="block mb-2 text-sm font-medium text-gray-400">Filière</label>
        <select id="edit-filiere" 
                class="w-full px-4 py-2.5 bg-gray-700 border border-gray-600 rounded-lg 
                       text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent
                       appearance-none cursor-pointer transition-all">
          ${filieres.map(filiere => `
            <option value="${filiere.id}" ${filiere.id === classe.id_filiere ? 'selected' : ''}
                    class="bg-gray-800">
              ${filiere.libelle}
            </option>`).join('')}
        </select>
      </div>
    </div>

    <div class="flex justify-end gap-3 mt-8">
      <button id="cancelEdit" 
              class="px-5 py-2.5 bg-gray-600 hover:bg-gray-500 text-gray-100 rounded-lg
                     transition-colors duration-200 font-medium">
        Annuler
      </button>
      <button id="confirmEdit" 
              class="px-4 py-2 bg-[#b31822] rounded-xl hover:bg-[#d11a2a] text-white">
        Enregistrer
      </button>
    </div>
  </div>
`;
  document.body.appendChild(modal);

  document.getElementById('cancelEdit').addEventListener('click', () => {
    modal.remove();
  });

  document.getElementById('confirmEdit').addEventListener('click', async () => {
    const updatedLibelle = document.getElementById('edit-libelle').value.trim();
    const updatedNiveau = document.getElementById('edit-niveau').value.trim();
    const updatedFiliere = document.getElementById('edit-filiere').value;

    if (updatedLibelle && updatedNiveau) {
      const success = await updateData('classe', classe.id, {
        libelle: updatedLibelle,
        niveau: updatedNiveau,
        id_filiere: updatedFiliere
      });

      if (success) {
        displayClasses();
        modal.remove();
      } else {
        alert("Erreur lors de la mise à jour.");
      }
    } else {
      alert("Veuillez remplir tous les champs.");
    }
  });
}


// Appel initial
displayClasses();
