// Configuration - Serveur local
const API_URL = 'http://localhost:3000/api';

// Initialiser l'application au chargement
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('dataForm');
    
    // Gérer la soumission du formulaire
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        submitFormData();
    });

    // Charger les dernières entrées au démarrage
    setTimeout(() => {
        loadLastEntries();
    }, 500);

    // Vérifier la connectivité
    updateOnlineStatus();
    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);
});

// Fonction pour mettre à jour l'état online/offline
function updateOnlineStatus() {
    if (navigator.onLine) {
        document.body.classList.remove('offline');
        console.log('En ligne');
    } else {
        document.body.classList.add('offline');
        console.log('Hors ligne');
    }
}

// Fonction pour soumettre les données du formulaire
async function submitFormData() {
    const classe = document.getElementById('classe').value;
    const jour = document.getElementById('Jour').value;
    const nomComplet = document.getElementById('nomComplet').value;
    const submitBtn = document.getElementById('submitBtn');
    const spinner = submitBtn.querySelector('.spinner');

    // Validation
    if (!classe || !jour || !nomComplet) {
        showMessage('Veuillez remplir tous les champs', 'error');
        return;
    }

    // Désactiver le bouton et afficher le spinner
    submitBtn.disabled = true;
    spinner.style.display = 'inline-block';

    try {
        // Préparer les données
        const formData = {
            classe: classe,
            Jour: jour,
            nomComplet: nomComplet,
            timestamp: new Date().toLocaleString('fr-FR')
        };

        // Envoyer les données au serveur
        const response = await fetch(API_URL + '/submit', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });

        const result = await response.json();

        if (result.success) {
            showMessage('Accès enregistré avec succès', 'success');
            
            // Réinitialiser le formulaire
            document.getElementById('dataForm').reset();
            
            // Recharger les dernières entrées après un délai
            setTimeout(async () => {
                await loadLastEntries();
            }, 1000);
        } else {
            showMessage('Erreur: ' + (result.message || 'Une erreur est survenue'), 'error');
        }
    } catch (error) {
        console.error('Erreur lors de l\'envoi:', error);
        if (!navigator.onLine) {
            showMessage('Mode hors ligne - Données mises en cache localement', 'error');
        } else {
            showMessage('Erreur: Vérifiez que le serveur est démarré (npm start)', 'error');
        }
    } finally {
        // Réactiver le bouton et masquer le spinner
        submitBtn.disabled = false;
        spinner.style.display = 'none';
    }
}

// Fonction pour afficher les messages
function showMessage(message, type) {
    const messageDiv = document.getElementById('message');
    messageDiv.textContent = message;
    messageDiv.className = 'message ' + type;
    messageDiv.style.display = 'block';

    // Masquer le message après 5 secondes
    setTimeout(function() {
        messageDiv.style.display = 'none';
    }, 5000);
}

// Fonction pour charger les dernières entrées
async function loadLastEntries() {
    const lastEntriesDiv = document.getElementById('lastEntries');

    try {
        // Récupérer les données du serveur
        const response = await fetch(API_URL + '/entries', {
            method: 'GET'
        });
        
        const data = await response.json();

        if (data.entries && data.entries.length > 0) {
            let html = '<ul style="list-style: none; padding: 0;">';
            
            // Afficher les 10 dernières entrées
            data.entries.slice(0, 10).forEach(entry => {
                html += `<li style="padding: 12px; border-bottom: 1px solid #e0e0e0; font-size: 14px;">
                    <strong style="color: #667eea;">${entry.nomComplet}</strong> - ${entry.classe}
                    <br><small style="color: #999;">${entry.Jour} | ${entry.timestamp}</small>
                </li>`;
            });
            
            html += '</ul>';
            lastEntriesDiv.innerHTML = html;
        } else {
            lastEntriesDiv.innerHTML = '<p style="color: #999; text-align: center; padding: 20px;">Aucun accès enregistré</p>';
        }
    } catch (error) {
        console.error('Erreur lors du chargement des entrées:', error);
        if (!navigator.onLine) {
            lastEntriesDiv.innerHTML = '<p style="color: #999; font-size: 12px;">Données en cache (hors ligne)</p>';
        } else {
            lastEntriesDiv.innerHTML = '<p style="color: #999; font-size: 12px;">Impossible de charger les données</p>';
        }
    }
}

// Fonction pour rafraîchir les entrées
function refreshEntries() {
    loadLastEntries();
}

// Fonction pour télécharger le CSV
function downloadCSV() {
    if (!navigator.onLine) {
        alert('Impossible de télécharger en mode hors ligne');
        return;
    }
    window.location.href = API_URL + '/download';
}
