document.addEventListener("DOMContentLoaded", () => {
    const apiUrl = "http://localhost:3000"; // adapte selon ton port json-server
  
    const stats = {
      classes: 0,
      profs: 0,
      students: 0,
      cours: 0
    };
  
    // Fetch classes
    fetch(`${apiUrl}/classe`)
      .then(response => response.json())
      .then(data => {
        stats.classes = data.filter(classe => classe.etat === "actif").length;
        document.getElementById("classes-count").textContent = stats.classes;
      });
  
    // Fetch professeurs
    fetch(`${apiUrl}/utilisateurs`)
      .then(response => response.json())
      .then(data => {
        stats.profs = data.filter(user => user.role === "prof" && user.etat === "actif").length;
        document.getElementById("profs-count").textContent = stats.profs;
        stats.students = data.filter(user => user.role === "student" && user.etat === "actif").length;
        document.getElementById("students-count").textContent = stats.students;
      });
  
    // Fetch cours
    fetch(`${apiUrl}/cours`)
      .then(response => response.json())
      .then(data => {
        stats.cours = data.filter(cours => cours.etat === "actif").length;
        document.getElementById("cours-count").textContent = stats.cours;
      });
  });
  