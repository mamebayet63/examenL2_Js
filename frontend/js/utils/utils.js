// utils.js

// Récupération des données depuis le JSON server
export async function fetchData(resource) {
    try {
      const url = `http://localhost:3000/${resource}`;
      const response = await fetch(url);
  
      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }
  
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Erreur lors de la récupération des données:', error);
      return null;
    }
  }
  
  // Ajout d'un élément dans le JSON server
  export async function addToJsonServer(key, newItem) {
    try {
      const response = await fetch(`http://localhost:3000/${key}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(newItem)
      });
  
      if (!response.ok) {
        throw new Error(`Erreur lors de l'ajout dans ${key}`);
      }
  
      const createdItem = await response.json();
      return createdItem; // ✅ retourne l'objet ajouté (avec id généré automatiquement)
    } catch (error) {
      console.error(error);
      return null; // ✅ cohérence avec le test `if (res)`
    }
  }
  
   // Suppression (soft delete) : changement d'état à 'supprimée'
 
export async function softDelete(endpoint, id, data) {
    try {
      const response = await fetch(`http://localhost:3000/${endpoint}/${id}`, {
        method: 'PATCH',   // <-- ici
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({etat : "suprimée"}),
      });
  
      if (!response.ok) {
        throw new Error('Erreur lors de la mise à jour des données');
      }
  
      return await response.json();
    } catch (error) {
      console.error('Erreur de mise à jour:', error);
      throw error;
    }
  }
 
  // Modifier des données (partielle)
export async function updateData(resource, id, updatedData) {
  try {
    const response = await fetch(`http://localhost:3000/${resource}/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(updatedData)
    });

    if (!response.ok) {
      console.error("Erreur lors de la mise à jour :", response.statusText);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Erreur lors de la mise à jour :", error);
    return false;
  }
}

  
  
 