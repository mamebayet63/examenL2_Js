// app.js
document.addEventListener('DOMContentLoaded', () => {
    // 1) Récupérer et parser l'objet `user` depuis le localStorage
    const userData = localStorage.getItem('user');
    const user = userData ? JSON.parse(userData) : null;
  
    if (!user?.id) {
      console.error('Aucun user valide trouvé en localStorage');
      return;
    }
    const studentId = user.id;
    console.log('Student ID:', studentId);
  
    // 2) Afficher avatar & nom
    const avatarEl = document.getElementById('studentAvatar');
    const nameEl   = document.getElementById('studentName');
    if (avatarEl && nameEl) {
      const initials = `${user.prenom?.[0] || ''}${user.nom?.[0] || ''}`.toUpperCase();
      avatarEl.textContent = initials;
      nameEl.textContent   = `${user.prenom} ${user.nom}`;
    }
  
    const grid       = document.getElementById('coursesGrid');
    const empty      = document.getElementById('emptyState');
    const dateFilter = document.getElementById('dateFilter');
    const form       = document.getElementById('filterForm');
    const semesterEl = document.getElementById('currentSemester');
  
    // 3) Calcul du semestre
    const month    = new Date().getMonth() + 1;
    const semester = (month >= 1 && month <= 6) ? 'S2' : 'S1';
    semesterEl.textContent = `Semestre en cours : ${semester}`;
  
    /**
     * 4) Récupère les cours de l'étudiant :
     *    inscription → cours_classe → cours → module + professeur
     */
    async function fetchCourses(date = '') {
      try {
        // a) inscription
        const insRes = await fetch(`http://localhost:3000/inscription?id_etudiant=${studentId}`);
        const inscriptions = await insRes.json();
        if (inscriptions.length === 0) return [];
  
        const classeId = inscriptions[0].id_classe;
  
        // b) cours_classe
        const ccRes = await fetch(`http://localhost:3000/cours_classe?id_classe=${classeId}&etat=actif`);
        const liens = await ccRes.json();
        if (liens.length === 0) return [];
  
        // c) récupérer chaque cours + module + professeur
        const courses = await Promise.all(liens.map(async link => {
          // récupérer le cours
          const cRes = await fetch(`http://localhost:3000/cours/${link.id_cours}`);
          const c = await cRes.json();
  
          // récupérer le module
          const mRes = await fetch(`http://localhost:3000/module/${c.id_module}`);
          const m = await mRes.json();
  
          // Id du prof (parfois "professeur_id", parfois "proffesseur_id")
          const profId = c.professeur_id ?? c.proffesseur_id;
          let profPrenom = '', profNom = '';
          if (profId) {
            const pRes = await fetch(`http://localhost:3000/utilisateurs/${profId}`);
            const p = await pRes.json();
            profPrenom = p.prenom;
            profNom    = p.nom;
          }
  
          return {
            id:                c.id,
            module_libelle:    m.libelle,
            date:              c.date,
            heure_debut:       c.heure_debut,
            heure_fin:         c.heure_fin,
            salle:             c.salle,
            professeur_prenom: profPrenom,
            professeur_nom:    profNom
          };
        }));
  
        // d) filtre éventuel par date
        return date
          ? courses.filter(c => c.date === date)
          : courses;
  
      } catch (err) {
        console.error('Erreur fetchCourses:', err);
        return [];
      }
    }
  
    // 5) Fonction d'affichage
    function renderCourse(c) {
      const now        = new Date();
      const end        = new Date(`${c.date}T${c.heure_fin}`);
      const isFinished = now > end;
      const color      = isFinished ? 'cyan' : 'emerald';
      const status     = isFinished ? 'Terminé' : 'En cours';
      const icon       = isFinished ? 'fa-check-circle' : 'fa-book-open';
  
      return `
        <div class="group relative bg-slate-800/50 backdrop-blur-lg rounded-2xl border border-slate-700/30
                    hover:border-${color}-400/30 transition-all duration-300 hover:-translate-y-1 shadow-xl">
          <div class="p-6">
            <div class="flex justify-between items-start mb-4">
              <div class="bg-${color}-400/10 px-3 py-1 rounded-full text-${color}-400 text-sm">${status}</div>
              <i class="fas ${icon} text-slate-400 group-hover:text-${color}-400 transition-colors"></i>
            </div>
            <h3 class="text-xl font-bold text-slate-200 mb-2">${c.module_libelle}</h3>
            <div class="space-y-3 text-slate-400">
              <div class="flex items-center space-x-2">
                <i class="fas fa-chalkboard-teacher"></i>
                <span>${c.professeur_prenom} ${c.professeur_nom}</span>
              </div>
              <div class="flex items-center space-x-2">
                <i class="fas fa-clock"></i>
                <span>${c.date} • ${c.heure_debut}-${c.heure_fin}</span>
              </div>
              <div class="flex items-center space-x-2">
                <i class="fas fa-map-marker-alt"></i>
                <span>${c.salle}</span>
              </div>
            </div>
          </div>
          <div class="absolute inset-0 bg-gradient-to-b from-${color}-400/5 to-transparent opacity-0
                      group-hover:opacity-100 transition-opacity rounded-2xl flex items-center justify-center">
            <button class="px-6 py-2 bg-${color}-400/10 backdrop-blur-sm border border-${color}-400/30
                           rounded-xl text-${color}-400 hover:bg-${color}-400/20 transition-colors">
              Voir le détail
            </button>
          </div>
        </div>
      `;
    }
  
    // 6) Chargement & filtrage
    async function load(date = '') {
      grid.innerHTML = '';
      const list = await fetchCourses(date);
      if (list.length === 0) {
        empty.classList.remove('hidden');
      } else {
        empty.classList.add('hidden');
        grid.innerHTML = list.map(renderCourse).join('');
      }
    }
  
    load(); // initial
    form.addEventListener('submit', e => {
      e.preventDefault();
      load(dateFilter.value);
    });
  });
  