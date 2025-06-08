    const form = document.getElementById('loginForm');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const errorMessage = document.getElementById('error-message');

    form.addEventListener('submit', function(e) {
      e.preventDefault();

      const email = emailInput.value.trim();
      const password = passwordInput.value.trim();

      if (email === '' || password === '') {
        errorMessage.textContent = 'Veuillez remplir tous les champs.';
        errorMessage.classList.remove('hidden');
        return;
      }

      // Requête JSON Server
      fetch('http://localhost:3000/utilisateurs')
        .then(response => response.json())
        .then(utilisateurs => {
          const user = utilisateurs.find(u => u.email === email && u.password === password);

          if (user) {
            // Connexion réussie
            alert(`Bienvenue ${user.prenom} ${user.nom} ! Rôle : ${user.role}`);
            // Tu pourrais stocker les infos dans localStorage si besoin :
            localStorage.setItem("user", JSON.stringify(user));
            // Puis rediriger
            // Redirection en fonction du rôle
            switch (user.role) {
                case 'rp':
                    window.location.href = '../views/rp/dashboard.html';
                    break;
                case 'Professeur':
                    window.location.href = '../professeur/listeCours.html';
                    break;
                case 'attache':
                    window.location.href = '../views/attache/dashboardatt.html';
                    break;
                case 'student':
                    window.location.href = '../views/student/dasboard.html';
                    break;
                default:
                    window.location.href = 'dashboard.html';
            }
          } else {
            errorMessage.textContent = 'Identifiants incorrects. Veuillez réessayer.';
            errorMessage.classList.remove('hidden');
          }
        })
        .catch(error => {
          console.error('Erreur de connexion au serveur JSON:', error);
          errorMessage.textContent = 'Erreur de connexion au serveur.';
          errorMessage.classList.remove('hidden');
        });
    });
