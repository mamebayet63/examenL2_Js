document.getElementById("openModal").addEventListener("click", () => {
    document.getElementById("modal").classList.remove("hidden");
  });
  
  document.getElementById("closeModal").addEventListener("click", () => {
    document.getElementById("modal").classList.add("hidden");
  });
  

  // Fonction pour récupérer et injecter les options
async function populateSelect(resource, selectId, labelField = 'libelle', valueField = 'id') {
    try {
      const response = await fetch(`http://localhost:3000/${resource}`);
      const data = await response.json();
      const select = document.getElementById(selectId);
  
      data.forEach(item => {
        const option = document.createElement('option');
        option.value = item[valueField];
        option.textContent = item[labelField];
        select.appendChild(option);
      });
    } catch (error) {
      console.error(`Erreur de chargement des ${resource}`, error);
    }
  }

    // Remplir les select quand la page se charge
    document.addEventListener('DOMContentLoaded', () => {
        // Si niveaux sont fixes
        const niveaux = ['L1', 'L2', 'L3'];
        const niveauSelect = document.getElementById("niveau");
        niveaux.forEach(niveau => {
          const option = document.createElement("option");
          option.value = niveau;
          option.textContent = niveau;
          niveauSelect.appendChild(option);
        });
      
        // Filieres et Modules dynamiques via JSON Server
        populateSelect("filiere", "id_filiere", "libelle", "id");
      });
      