  import { softDelete } from "../utils/utils.js";

  document.addEventListener("DOMContentLoaded", () => {
    const tbody = document.querySelector("tbody");
    fetch("http://localhost:3000/utilisateurs?role=student")
    .then((res) => res.json())
    .then(async (students) => {
      tbody.innerHTML = "";
  
      // Charger les absences
      const absencesRes = await fetch("http://localhost:3000/absence");
      const absences = await absencesRes.json();
  
      // Map des absences par étudiant
      const absenceCountMap = {};
      absences.forEach(abs => {
        const etudiantId = abs.id_etudiant;
        if (!absenceCountMap[etudiantId]) {
          absenceCountMap[etudiantId] = 0;
        }
        absenceCountMap[etudiantId]++;
      });
  
      // Filtrer les étudiants avec état "actif"
      const activeStudents = students.filter(student => student.etat === "actif");
  
      // Générer les lignes du tableau pour les étudiants actifs uniquement
      activeStudents.forEach((student) => {
        const totalAbs = absenceCountMap[student.id] || 0;
  
        const tr = document.createElement("tr");
        tr.className = "hover:bg-gray-750 transition-colors";
        tr.innerHTML = `
          <td class="px-6 py-4">
            <span class="font-mono text-indigo-300">${student.matricule}</span>
          </td>
          <td class="px-6 py-4">
            <div class="flex items-center gap-4">
              <div class="flex-shrink-0 h-10 w-10">
                <img class="h-10 w-10 rounded-full border-2 border-indigo-500/30" 
                     src="${student.photo}" 
                     alt="${student.nom}">
              </div>
              <div>
                <div class="font-medium">${student.nom}</div>
                <div class="text-sm text-gray-400">${student.email}</div>
              </div>
            </div>
          </td>
          <td class="px-6 py-4 text-gray-300">${student.adresse}</td>
          <td class="px-6 py-4">
            <span class="px-2 py-1 text-xs font-medium rounded-full bg-emerald-400/20 text-emerald-400">
              ${totalAbs} absence(s)
            </span>
          </td>
          <td class="px-6 py-4">
            <div class="flex gap-3">
              <a href="#" class="text-indigo-400 hover:text-indigo-300">
                <i class="ri-edit-line"></i>
              </a>
              <a href="#" class="text-red-400 hover:text-red-300 delete-btn" data-id="${student.id}">
                <i class="ri-chat-delete-line"></i>
              </a>
            </div>
          </td>
        `;
        tbody.appendChild(tr);
      });
    })
    .catch((error) => {
      console.error("Erreur lors du chargement des étudiants :", error);
    });
  

    // Confirmation et soft delete
    const modal = document.getElementById("confirm-modal");
const confirmBtn = document.getElementById("confirm-btn");
const cancelBtn = document.getElementById("cancel-btn");

let currentIdToDelete = null;

tbody.addEventListener("click", (e) => {
  const deleteBtn = e.target.closest(".delete-btn");
  if (deleteBtn) {
    currentIdToDelete = deleteBtn.dataset.id;
    modal.classList.remove("hidden"); // Affiche le popup
  }
});

cancelBtn.addEventListener("click", () => {
  modal.classList.add("hidden");
  currentIdToDelete = null;
});

confirmBtn.addEventListener("click", async () => {
  if (!currentIdToDelete) return;

  try {
    await softDelete("utilisateurs", currentIdToDelete, { etat: "supprimée" });
    modal.classList.add("hidden");
    location.reload();
  } catch (err) {
    alert("Échec de la suppression.");
    modal.classList.add("hidden");
  }
});

  });
