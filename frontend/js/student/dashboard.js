import { fetchData } from '../utils/utils.js'; // adapte le chemin selon ton projet

document.addEventListener('DOMContentLoaded', async () => {
    const currentUser = JSON.parse(localStorage.getItem('user'));

    if (!currentUser || currentUser.role !== 'student') {
        // Rediriger si l'utilisateur n'est pas connecté ou pas étudiant
        window.location.href = 'login.html';
        return;
    }

    try {
        // Charger les données nécessaires en parallèle
        const [inscriptions, coursClasse, absences, cours, justifications] = await Promise.all([
            fetchData('inscription'),
            fetchData('cours_classe'),
            fetchData('absence'),
            fetchData('cours'),
            fetchData('justification') // Nouvelle ligne
        ]);
        console.log(justifications);
        

        if (![inscriptions, coursClasse, absences, cours].every(Boolean)) {
            throw new Error("Certaines données n'ont pas été chargées correctement.");
        }

        // 1. Récupérer les classes de l'étudiant
        const classesEtudiant = inscriptions
            .filter(ins => ins.id_etudiant == currentUser.id)
            .map(ins => ins.id_classe);

        // 2. Identifier les cours correspondants aux classes
        const coursIdsEtudiant = coursClasse
            .filter(cc => classesEtudiant.includes(cc.id_classe))
            .map(cc => cc.id_cours);

        const nbCoursProgrammes = new Set(coursIdsEtudiant).size;

        // 3. Récupérer les absences de l'étudiant
        const absencesEtudiant = absences.filter(abs => abs.id_etudiant == currentUser.id);

        // 4. Récupérer les cours correspondant aux absences
        const coursAbsents = cours.filter(c =>
            absencesEtudiant.some(abs => abs.id_cours == c.id)
        );

        // 5. Calcul des heures d'absences
        let totalHeuresAbsence = 0;
        coursAbsents.forEach(c => {
            const [hDebut, mDebut] = c.heure_debut.split(':').map(Number);
            const [hFin, mFin] = c.heure_fin.split(':').map(Number);
            const duree = (hFin * 60 + mFin) - (hDebut * 60 + mDebut);
            totalHeuresAbsence += duree / 60; // conversion en heures
        });

        // 6. Mise à jour du DOM
        document.getElementById('coursCount').textContent = nbCoursProgrammes;
        document.getElementById('absenceHeures').textContent = `${totalHeuresAbsence.toFixed(1)}h`;
    } catch (error) {
        console.error("Erreur lors du chargement ou du traitement des données :", error);
    }

    // 2. Traitement des justifications de l'étudiant
const justificationsEtudiant = justifications
.filter(j => {
    const absence = absences.find(a => a.id == j.absence_id);
    return absence && absence.id_etudiant == currentUser.id;
})
.map(j => {
    const absence = absences.find(a => a.id == j.absence_id);
    const coursInfo = cours.find(c => c.id == absence.id_cours);

    return {
        type: "Justification soumise",
        date: absence.date_absence,
        cours: coursInfo ? coursInfo.libelle : 'Cours inconnu',
        statut: j.date_traitement ? 'Validée' : 'En attente',
        ilYA: 'récemment' // Tu peux ajouter un calcul plus précis si tu veux
    };
});

// 3. Fonction pour afficher les activités
function getStatusBadgeColor(status) {
switch (status) {
    case 'En attente':
        return 'bg-yellow-400/10 text-yellow-400';
    case 'Validée':
        return 'bg-green-400/10 text-green-400';
    case 'Refusée':
        return 'bg-red-400/10 text-red-400';
    default:
        return 'bg-slate-500/10 text-slate-300';
}
}

const container = document.getElementById('recentActivities');
container.innerHTML = ''; // Nettoyage

justificationsEtudiant.forEach(activity => {
const div = document.createElement('div');
div.className = 'p-4 bg-slate-700/20 rounded-xl';
div.innerHTML = `
    <div class="flex items-center justify-between mb-2">
        <div class="text-sm text-slate-300">${activity.type}</div>
        <div class="text-xs text-slate-400">${activity.ilYA}</div>
    </div>
    <div class="text-sm text-slate-400">Absence du ${activity.date} - ${activity.cours}</div>
    <div class="mt-2">
        <span class="px-2 py-1 ${getStatusBadgeColor(activity.statut)} text-xs rounded-full">${activity.statut}</span>
    </div>
`;
container.appendChild(div);
});
});
