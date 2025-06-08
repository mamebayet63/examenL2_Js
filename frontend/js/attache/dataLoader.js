export let allClasses = [];
export let inscriptions = [];
export let coursClasse = [];

export function loadData(callback) {
  Promise.all([
    fetch('http://localhost:3000/classe').then(res => res.json()),
    fetch('http://localhost:3000/inscription').then(res => res.json()),
    fetch('http://localhost:3000/cours_classe').then(res => res.json())
  ])
    .then(([classes, insc, cours]) => {
      allClasses = classes;
      inscriptions = insc;
      coursClasse = cours;
      callback(); // Appelle la fonction une fois les données chargées
    })
    .catch(err => console.error('Erreur de chargement des données :', err));
}
