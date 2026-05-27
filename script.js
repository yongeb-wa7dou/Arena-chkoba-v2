function startGame() {
  const status = document.getElementById('status');
  status.textContent = 'Chargement d\'Arena Chkoba...';
  
  setTimeout(() => {
    status.textContent = 'Bienvenue dans les Legends ! © 2026 yongeb-wa7dou';
    alert('Arena Chkoba Legends est prêt ! Prochaine étape : on ajoute les vraies cartes.');
  }, 1000);
}

// Message console pour prouver la propriété
console.log('ARENA CHKOBA LEGENDS - Propriété de yongeb-wa7dou © 2026');
