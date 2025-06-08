const tableBody = document.getElementById("absenceTable");
const statutFilter = document.getElementById("statutFilter");
const dateFilter = document.getElementById("dateFilter");
const searchFilter = document.getElementById("searchFilter");

let absencesData = [];
const user = JSON.parse(localStorage.getItem("user"));

async function fetchAbsences() {
  try {
    const [absencesRes, coursRes, modulesRes] = await Promise.all([
      fetch("http://localhost:3000/absence"),
      fetch("http://localhost:3000/cours"),
      fetch("http://localhost:3000/module")
    ]);

    const [absences, coursList, modules] = await Promise.all([
      absencesRes.json(),
      coursRes.json(),
      modulesRes.json()
    ]);

    const userAbsences = absences.filter(item => item.id_etudiant == user.id);

    absencesData = userAbsences.map(absence => {
      const cours = coursList.find(c => c.id == absence.id_cours);
      const module = modules.find(m => m.id == cours.id_module);

      const debut = new Date(`1970-01-01T${cours.heure_debut}`);
      const fin = new Date(`1970-01-01T${cours.heure_fin}`);
      const heures = ((fin - debut) / (1000 * 60 * 60)).toFixed(1);

      return {
        id: absence.id,
        date: cours.date,
        module: module ? module.libelle : "Inconnu",
        etat: absence.etat,
        heures: heures
      };
    });

    applyFilters();
  } catch (error) {
    console.error("Erreur lors du chargement des données :", error);
  }
}

function renderTable(data) {
    tableBody.innerHTML = "";
    if (data.length === 0) {
      tableBody.innerHTML = `<tr><td colspan="5" class="text-center p-4 text-slate-500">Aucune absence trouvée</td></tr>`;
      return;
    }
  
    data.forEach(item => {
      const row = `
        <tr class="hover:bg-slate-700/10 transition-colors duration-200">
          <td class="p-4 font-medium">${new Date(item.date).toLocaleDateString("fr-FR")}</td>
          <td class="p-4">${item.module}</td>
          <td class="p-4">
            <span class="px-3 py-1 bg-${getColor(item.etat)}/15 text-${getColor(item.etat)} rounded-full text-xs font-medium ring-1 ring-${getColor(item.etat)}/30">
              ${item.etat}
            </span>
          </td>
          <td class="p-4 text-right font-mono">${item.heures}</td>
          <td class="p-4 text-center">
            <button class="text-amber-400 hover:underline text-sm justify-btn" data-id="${item.id}" ${item.etat === 'Justifiée'|| item.etat === 'refusée'  ? 'disabled' : ''}>Justifier</button>
          </td>
        </tr>`;
      tableBody.insertAdjacentHTML("beforeend", row);
    });
  
    document.querySelectorAll(".justify-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        const id = btn.getAttribute("data-id");
        const absence = absencesData.find(a => a.id == id);
        openModal(absence);
      });
    });
  }
  
function getColor(etat) {
  switch (etat) {
    case "Justifiée": return "green-400";
    case "non justifiée": return "red-400";
    case "En attente": return "amber-400";
    default: return "slate-400";
  }
}

function applyFilters() {
  const statut = statutFilter.value;
  const date = dateFilter.value;
  const search = searchFilter.value.toLowerCase();

  const filtered = absencesData.filter(item => {
    const matchStatut = !statut || item.etat === statut;
    const matchDate = !date || item.date === date;
    const matchSearch = !search || item.module.toLowerCase().includes(search);
    return matchStatut && matchDate && matchSearch;
  });

  renderTable(filtered);
}

[statutFilter, dateFilter, searchFilter].forEach(el =>
  el.addEventListener("input", applyFilters)
);

// Chargement initial
fetchAbsences();

// === Modal Justification ===
const modal = document.getElementById("justifyModal");
const modalInfo = document.getElementById("modalInfo");
const justificationText = document.getElementById("justificationText");
const errorMessage = document.getElementById("errorMessage");
const cancelBtn = document.getElementById("cancelBtn");
const confirmBtn = document.getElementById("confirmBtn");

let currentAbsence = null;

function openModal(absence) {
  currentAbsence = absence;
  modalInfo.textContent = `Module : ${absence.module} | Date : ${new Date(absence.date).toLocaleDateString("fr-FR")}`;
  justificationText.value = "";
  errorMessage.textContent = "";
  errorMessage.classList.add("hidden");
  modal.classList.remove("hidden");
}

function closeModal() {
  modal.classList.add("hidden");
  currentAbsence = null;
}

cancelBtn.addEventListener("click", closeModal);

confirmBtn.addEventListener("click", async () => {
  const justification = justificationText.value.trim();

  if (!justification) {
    errorMessage.textContent = "Veuillez écrire une justification.";
    errorMessage.classList.remove("hidden");
    return;
  } else {
    errorMessage.textContent = "";
    errorMessage.classList.add("hidden");
  }

  try {
    // Mise à jour de l'absence
    await fetch(`http://localhost:3000/absence/${currentAbsence.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        justification: justification,
        etat: "En attente"
      })
    });

    // Ajout dans la table justification
    await fetch("http://localhost:3000/justification", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        id_absence: currentAbsence.id,
        id_etudiant: user.id,
        motif: justification,
        date_ajout: new Date().toISOString().split("T")[0]
      })
    });

    closeModal();
    fetchAbsences();
  } catch (error) {
    console.error("Erreur :", error);
    errorMessage.textContent = "Erreur lors de l'envoi de la justification.";
    errorMessage.classList.remove("hidden");
  }
});
