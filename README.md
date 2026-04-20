# Salle d'Informatique - Système de Gestion des Accès

Système d'enregistrement des accès à la salle d'informatique permettant de tracer l'utilisation et l'accès à la ressource.

## 📋 Structure du projet

```
TP/
├── index.html              # Interface web
├── style.css               # Styles CSS
├── script.js               # Code JavaScript frontend
├── service-worker.js       # Service Worker (PWA)
├── manifest.json           # Manifest PWA
├── server.js               # Serveur Node.js backend
├── package.json            # Dépendances Node.js
├── .htaccess               # Configuration serveur
└── data/
    └── donnees.csv         # Fichier CSV des accès
```

## 🚀 Installation et démarrage

### 1. Installer les dépendances
```bash
npm install
```

### 2. Démarrer le serveur
```bash
npm start
```

Vous verrez:
```
✓ Serveur démarré sur http://localhost:3000
✓ Les données seront enregistrées dans: C:\...\data\donnees.csv
```

### 3. Ouvrir l'application
Allez sur: **http://localhost:3000**

---

## 📝 Utilisation

1. **Enregistrer un accès**
   - Sélectionner le groupe (A, B, C, D ou classe)
   - Sélectionner le jour (Lundi à Vendredi)
   - Entrer le nom complet

2. **Cliquer sur "Enregistrer l'accès"**
   - Les données sont enregistrées dans `data/donnees.csv`
   - Un message de confirmation s'affiche
   - L'accès s'ajoute au journal

3. **Consulter les accès**
   - Les 10 derniers accès s'affichent en bas
   - Cliquer sur "Rafraîchir les données" pour mettre à jour

4. **Exporter les données**
   - Cliquer sur "Télécharger le fichier" pour exporter en CSV

---

## 📊 Format du fichier CSV
contient:

```csv
Timestamp,Nom Complet,Classe,Jour
"20/04/2026 14:30:45","Jean Dupont","Groupe A","Lundi"
"20/04/2026 14:35:22","Marie Martin","6ème B","Mardi"
```

**Colonnes:**
- **Timestamp**: Date et heure d'accès
- **Nom Complet**: Nom de l'utilisateur
- **Classe**: Groupe/classe d'appartenance
- **Jour**: Jour de l'accès/04/2026 14:35:22","Marie Martin","5ème B","Mardi"
```

---
en mode développement (avec auto-rechargement)
npm run dev
```

---

## ✨ Fonctionnalités

✅ Enregistrement simple et rapide  
✅ Horodatage automatique des accès  
✅ Export CSV pour analyse  
✅ Journal des derniers accès  
✅ Stockage persistant  
✅ Interface responsive  
✅ Validation des formulaires  
✅ **Fonctionnement hors ligne (PWA)**
✅ **Installation sur téléphone/ordinateur**
✅ **Mode sombre support**  

---

## 🔒 Groupes disponibles

- **Groupes**: A, B, C, D
- **Classes**: 6ème à Terminale (A et B)

---

## 📅 Jours d'accès

- Lundi
- Mardi
- Mercredi
- Jeudi
- Vendredi

✅ Formulaire avec validation  
✅ Enregistrement automatique en CSV  
✅ Affichage des dernières entrées  
✅ Téléchargement du fichier CSV  
✅ Design responsive  
✅ Messages de confirmation/erreur  

---

## 📱 Progressive Web App (PWA)

L'application est une PWA complète qui offre:

### Fonctionnalités PWA

✅ **Fonctionnement hors ligne** - Travaille même sans connexion  
✅ **Installation** - Installez sur votre téléphone ou ordinateur  
✅ **Cache intelligent** - Les données sont automatiquement sauvegardées  
✅ **Icône d'installation** - Apparaît automatiquement (navigateurs compatibles)  
✅ **Mode sombre** - Support automatique du thème sombre  

### Comment installer l'app

#### Sur smartphone (Android/iOS)
1. Ouvrez l'application dans votre navigateur
2. Cherchez le bouton "Ajouter à l'écran d'accueil" ou "Installer"
3. Confirmez l'installation
4. L'app apparaît comme une application native

#### Sur navigateur (Chrome/Edge/Firefox)
1. Ouvrez l'application sur votre ordinateur
2. Cliquez sur l'icône d'installation dans la barre d'adresse
3. Confirmez
4. L'app s'ouvre dans une fenêtre dédiée

### Fonctionnement hors ligne

L'app reste partiellement fonctionnelle sans connexion:
- ✅ Accédez aux données en cache
- ✅ Remplissez les formulaires
- ✅ Visualisez l'historique (si en cache)
- ❌ Les données sont synchronisées quand vous êtes en ligne

### Fichiers PWA

- `manifest.json` - Métadonnées de l'application
- `service-worker.js` - Service Worker pour le cache
- `.htaccess` - Configuration serveur
- `web.config` - Configuration IIS
- `PWA-CHECKLIST.md` - Guide de test complet

---

## ⚠️ Troubleshooting

**Erreur: "npm: command not found"**
→ Installer Node.js depuis https://nodejs.org

**Erreur: "EADDRINUSE: address already in use :::3000"**
→ Un autre serveur utilise le port 3000
```bash
# Libérer le port
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

**Le fichier CSV n'est pas créé**
→ Vérifier que le dossier `data/` existe
→ Vérifier les permissions d'écriture

---

## 📄 License

MIT
