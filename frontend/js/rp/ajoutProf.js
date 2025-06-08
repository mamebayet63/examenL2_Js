import { addToJsonServer } from '../utils/utils.js';


  // Ajoute un écouteur d’événement au bouton "Nouveau Professeur"
  document.getElementById('openAddProfBtn').addEventListener('click', () => {
  toggleModal(true);
  
});
document.getElementById('closeAddProfBtn').addEventListener('click', () => {
  toggleModal(false);
});



// Gestion ouverture / fermeture modal
function toggleModal(state) {
    const addProfModal = document.getElementById('addProfModal');
    if (state) {
      addProfModal.classList.remove('hidden');
    } else {
      addProfModal.classList.add('hidden');
    }
  }
  

  
  // Validation et soumission du formulaire
  document.getElementById('addProfForm').addEventListener('submit', function(e) {
    e.preventDefault();
  
    // Réinitialisation des erreurs
    document.querySelectorAll(".error-message").forEach(err => err.textContent = "");
  
    // Récupération des champs
    const prenom = document.getElementById('prenom').value.trim();
    const nom = document.getElementById('nom').value.trim();
    const specialite = document.getElementById('specialite').value.trim();
    const grade = document.getElementById('grade').value.trim();
    const email = document.getElementById('email').value.trim();
    const adresse = document.getElementById('adresse').value.trim();
    const matricule = document.getElementById('matricule').value.trim();
    const photo = document.getElementById('photo').value.trim();
  
    let hasError = false;
  
    // Vérification des champs
    if (!prenom) {
      document.getElementById("prenomError").textContent = "Le prénom est obligatoire.";
      hasError = true;
    }
    if (!nom) {
      document.getElementById("nomError").textContent = "Le nom est obligatoire.";
      hasError = true;
    }
    if (!specialite) {
      document.getElementById("specialiteError").textContent = "La spécialité est obligatoire.";
      hasError = true;
    }
    if (!grade) {
      document.getElementById("gradeError").textContent = "Le grade est obligatoire.";
      hasError = true;
    }
    if (!email) {
      document.getElementById("emailError").textContent = "L'adresse email est obligatoire.";
      hasError = true;
    } else if (!/^\S+@\S+\.\S+$/.test(email)) {
      document.getElementById("emailError").textContent = "Format d'email invalide.";
      hasError = true;
    }
    if (!adresse) {
      document.getElementById("adresseError").textContent = "L'adresse est obligatoire.";
      hasError = true;
    }
    if (!matricule) {
      document.getElementById("matriculeError").textContent = "Le matricule est obligatoire.";
      hasError = true;
    }
    if (!photo) {
      document.getElementById("photoError").textContent = "Le lien photo est obligatoire.";
      hasError = true;
    }
  
    // Si erreur, stop ici
    if (hasError) return;
  
    // Désactivation bouton
    const submitButton = this.querySelector("button[type='submit']");
    submitButton.disabled = true;
    submitButton.textContent = "Ajout en cours...";
  
    // Données à envoyer ou à traiter
    const newProf = {
      prenom, nom, specialite, grade, email, adresse, matricule, photo,
      role: "prof", etat: "actif"

    };
  
    console.log("Nouveau Professeur :", newProf);

    addToJsonServer("utilisateurs", newProf);

  
    // Simulation traitement / Ajout réel ici avec fetch/ajax si nécessaire
  
    // Réactivation et reset
    setTimeout(() => {
      toggleModal(false);
      this.reset();
      submitButton.disabled = false;
      submitButton.textContent = "Ajouter le Professeur";
    }, 1500); // juste pour le test visuel
  });
  