// Importer les fonctions utilitaires
import { fetchData, addToJsonServer } from '../utils/utils.js';

// Sélection des éléments DOM
const planifierBtn = document.getElementById('ajoutCours');
const modal = document.getElementById('modal-planifier');
const cancelBtn = document.getElementById('cancel-btn');
const form = document.getElementById('form-ajouter-cours');
const classesContainer = document.getElementById('cours-classes-container');
const professeurSelect = document.getElementById('cours-professeur');
const moduleSelect = document.getElementById('cours-module');


// Récupération des classes disponibles
async function fetchClasses() {
  const classes = await fetchData('classe');
  if (classes) {
    classesContainer.innerHTML = '';
    classes.forEach(classe => {
      const label = document.createElement('label');
      label.classList.add('text-white');
      label.innerHTML = `
        <input type="checkbox" class="cours-class" value="${classe.id}"> ${classe.libelle}
      `;
      classesContainer.appendChild(label);
    });
  }
}

// Récupération des professeurs
async function fetchProfesseurs() {
  const utilisateurs = await fetchData('utilisateurs');
  if (utilisateurs) {
    const professeurs = utilisateurs.filter(u => u.role === 'prof');
    professeurSelect.innerHTML = '<option value="">Sélectionner un professeur</option>';
    professeurs.forEach(prof => {
      const option = document.createElement('option');
      option.value = prof.id;
      option.textContent = `${prof.prenom} ${prof.nom}`;
      professeurSelect.appendChild(option);
    });
  }
}

async function fetchModule() {
    const modules = await fetchData('module');
    const moduleSelect = document.getElementById('cours-module');
  
    if (modules) {
      moduleSelect.innerHTML = '<option value="">Sélectionner un module</option>';
      modules.forEach(mod => {
        const option = document.createElement('option');
        option.value = mod.id;
        option.textContent = mod.libelle; // ou mod.libelle si c’est le nom du module
        moduleSelect.appendChild(option);
      });
    }
  }
  

// Ouvrir le modal
planifierBtn.addEventListener('click', (e) => {
    e.preventDefault();
    modal.classList.remove('hidden');
    fetchClasses();
    fetchProfesseurs();
    fetchModule(); // <-- ajoute cet appel ici
  });
  
// Fermer le modal
cancelBtn.addEventListener('click', () => {
  modal.classList.add('hidden');
});

// Validation du formulaire
function validateForm() {
  let isValid = true;
  document.querySelectorAll('.text-red-500').forEach(el => el.classList.add('hidden'));

  const date = document.getElementById('cours-date').value;
  const heureDebut = document.getElementById('cours-heure-debut').value;
  const heureFin = document.getElementById('cours-heure-fin').value;
  const selectedClasses = Array.from(document.querySelectorAll('.cours-class:checked')).map(c => c.value);
  const professeur = professeurSelect.value;
  const moduleId = moduleSelect.value;
  if (!moduleId) {
    document.getElementById('error-cours-module').classList.remove('hidden');
    isValid = false;
  }
  
  if (!date) {
    document.getElementById('error-cours-date').classList.remove('hidden');
    isValid = false;
  }
  if (!heureDebut) {
    document.getElementById('error-cours-heure-debut').classList.remove('hidden');
    isValid = false;
  }
  if (!heureFin) {
    document.getElementById('error-cours-heure-fin').classList.remove('hidden');
    isValid = false;
  }
  if (selectedClasses.length === 0) {
    document.getElementById('error-cours-classes').classList.remove('hidden');
    isValid = false;
  }
  if (!professeur) {
    document.getElementById('error-cours-professeur').classList.remove('hidden');
    isValid = false;
  }

  return isValid;
}

// Soumission du formulaire
form.addEventListener('submit', async (e) => {
  e.preventDefault();

  if (!validateForm()) return;

  const date = document.getElementById('cours-date').value;
  const heureDebut = document.getElementById('cours-heure-debut').value;
  const heureFin = document.getElementById('cours-heure-fin').value;
  const selectedClasses = Array.from(document.querySelectorAll('.cours-class:checked')).map(c => c.value);
  const professeur = professeurSelect.value;
  const moduleId = moduleSelect.value;

  const newCours = {
    date,
    heure_debut: heureDebut,
    heure_fin: heureFin,
    professeur_id: professeur,
    id_module: moduleId,
    etat: "actif",
    semestre:"S1"
  };
  
  

  // Ajouter le cours
  const addedCours = await addToJsonServer('cours', newCours);

  if (addedCours && addedCours.id) {
    console.log('Cours ajouté avec succès');

    // Ajout des relations avec les classes
    const relations = selectedClasses.map(classeId => ({
        id_cours: addedCours.id,
        id_classe: classeId,
        etat: "actif"
      }));
      console.log(relations);
      

    for (const relation of relations) {
        const res = await addToJsonServer('cours_classe', relation);
        if (res) {
          console.log(`Relation ajoutée : cours ${res.id_cours} → classe ${res.id_classe}`);
        } else {
          console.error(`Erreur lors de l'ajout de la relation pour la classe ${relation.id_classe}`);
        }
        
    }

    modal.classList.add('hidden');
    form.reset();
  } else {
    console.error('Erreur lors de l\'ajout du cours');
  }
});
