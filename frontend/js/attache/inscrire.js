// Sélecteurs
const openModalBtn = document.getElementById("open-modal-btn");
const closeModalBtn = document.getElementById("close-modal-btn");
const addStudentModal = document.getElementById("add-student-modal");
const addStudentForm = document.getElementById("add-student-form");

// Ouvrir le popup
openModalBtn.addEventListener("click", () => {
  addStudentModal.classList.remove("hidden");
  addStudentModal.classList.add("flex");
});

// Fermer le popup
closeModalBtn.addEventListener("click", () => {
  addStudentModal.classList.add("hidden");
  addStudentModal.classList.remove("flex");
});

// Envoyer les données du formulaire
addStudentForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const formData = new FormData(addStudentForm);
  const data = Object.fromEntries(formData.entries());

  // Ajoute le rôle 'student' et l'état 'actif'
  data.role = "student";
  data.etat = "actif";

  try {
    const res = await fetch("http://localhost:3000/utilisateurs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!res.ok) throw new Error("Erreur d'ajout");

    // Fermer le modal
    addStudentModal.classList.add("hidden");
    addStudentModal.classList.remove("flex");

    // Recharger la page ou relancer la fonction de chargement
    location.reload();
  } catch (err) {
    alert("Erreur lors de l'ajout de l'étudiant");
    console.error(err);
  }
});
