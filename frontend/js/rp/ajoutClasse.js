import { addToJsonServer } from '../utils/utils.js';

document.getElementById("addClassForm").addEventListener("submit", async (e) => {
    e.preventDefault();
  
    // Désactiver le bouton de soumission pour éviter plusieurs soumissions
    const submitButton = document.querySelector("#addClassForm button[type='submit']");
    submitButton.disabled = true;
    submitButton.textContent = "Ajout en cours...";
  
    // Récupération des valeurs
    const libelle = document.getElementById("libelle").value.trim();
    const niveau = document.getElementById("niveau").value;
    const id_filiere = document.getElementById("id_filiere").value;
  
    // Réinitialisation des messages d'erreur
    document.getElementById("libelleError").textContent = "";
    document.getElementById("niveauError").textContent = "";
    document.getElementById("filiereError").textContent = "";
  
    let hasError = false;
  
    // Validation libelle
    if (!libelle) {
      document.getElementById("libelleError").textContent = "Veuillez saisir le libellé.";
      hasError = true;
    }
  
    // Validation niveau
    if (!niveau) {
      document.getElementById("niveauError").textContent = "Veuillez sélectionner un niveau.";
      hasError = true;
    }
  
    // Validation filiere
    if (!id_filiere) {
      document.getElementById("filiereError").textContent = "Veuillez sélectionner une filière.";
      hasError = true;
    }
  
    if (hasError) {
      // Réactiver le bouton en cas d'erreur
      submitButton.disabled = false;
      submitButton.textContent = "Ajouter la classe";
      return;
    }
  
    // Création de l'objet à envoyer
    const newClasse = {
      libelle,
      niveau,
      id_filiere: parseInt(id_filiere),
      etat: "actif"
    };
    console.log(newClasse);
    
  
    const success = await addToJsonServer("classe", newClasse);
  
    // Réactiver le bouton après l'achèvement de la demande
    submitButton.disabled = false;
    submitButton.textContent = "Ajouter la classe";
  
    if (success) {
      // Message succès sans alert
      const successMessage = document.createElement("div");
      successMessage.className = "text-green-500 text-sm mt-2";
      successMessage.textContent = "Classe ajoutée avec succès !";
      document.getElementById("addClassForm").appendChild(successMessage);
  
      // Fermeture du modal après 1.5s et reset
      setTimeout(() => {
        document.getElementById("modal").classList.add("hidden");
        document.getElementById("addClassForm").reset();
        successMessage.remove();
      }, 1500);
  
    } else {
      // Message erreur général
      const errorMessage = document.createElement("div");
      errorMessage.className = "text-red-500 text-sm mt-2";
      errorMessage.textContent = "Erreur lors de l'ajout. Veuillez réessayer.";
      document.getElementById("addClassForm").appendChild(errorMessage);
  
      setTimeout(() => errorMessage.remove(), 2000);
    }
  });
  