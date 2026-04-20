# Checklist PWA - Salle d'Informatique

## Fichiers requis
- [x] manifest.json - Métadonnées de l'application
- [x] service-worker.js - Service Worker pour le cache
- [x] index.html - Page principale avec liens PWA
- [x] style.css - Styles incluant PWA support
- [x] script.js - JavaScript avec détection offline
- [x] .htaccess - Configuration serveur (Apache)
- [x] web.config - Configuration serveur (IIS)
- [x] robots.txt - SEO

## Tests de vérification

### 1. Vérifier l'enregistrement du Service Worker
```javascript
// Ouvrir la console du navigateur (F12)
// Aller dans DevTools → Application → Service Workers
// Vérifier que le service worker est "activated and running"
```

### 2. Vérifier le Manifest
```
// Aller dans DevTools → Application → Manifest
// Vérifier que tous les champs s'affichent correctement
```

### 3. Tester le fonctionnement hors ligne
```
1. Ouvrir l'application
2. Aller dans DevTools → Network → Throttling
3. Sélectionner "Offline"
4. Recharger la page (elle doit rester accessible)
5. Les données mises en cache doivent s'afficher
```

### 4. Tester l'installation
```
Chrome/Edge:
1. Ouvrir l'application
2. Cliquer sur l'icône "Installer" dans la barre d'adresse
3. L'app doit apparaître dans vos applications

Firefox:
1. Application → À propos
2. Chercher "Installable as Web App"

Safari (iOS):
1. Partager → Ajouter à l'écran d'accueil
```

### 5. Vérifier le Lighthouse
```
1. Ouvrir DevTools
2. Aller dans l'onglet "Lighthouse"
3. Sélectionner "PWA"
4. Cliquer sur "Analyser"
5. Vérifier que le score est élevé
```

## Optimisations PWA

✅ **Performance**
- Service Worker cache les fichiers
- Compression GZIP activée
- Cache HTTP configuré

✅ **Offline**
- Fonctionnement hors ligne complet
- Données mises en cache automatiquement

✅ **Installation**
- Manifest.json complet
- Icônes SVG (flexible et léger)
- Titre et description

✅ **Sécurité**
- HTTPS recommandé en production
- Service Worker validé

✅ **SEO**
- robots.txt configuré
- Métadonnées complètes

## Tester localement avec HTTPS (optionnel)

Pour tester les PWA localement avec HTTPS:

```bash
# Utiliser ngrok pour créer un tunnel HTTPS
ngrok http 3000

# Ou utiliser un certificat auto-signé avec Node.js
npm install -g local-ssl-proxy
local-ssl-proxy --source 3443 --target 3000
```

## Déploiement en production

Pour déployer en production:

1. **HTTPS obligatoire** - Les PWA nécessitent HTTPS
2. **Certificat SSL valide** - Utiliser Let's Encrypt (gratuit)
3. **Manifest.json** - Présent et valide
4. **Service Worker** - Enregistré et actif
5. **Icônes** - Au format recommandé
6. **Performance** - Lighthouse score ≥ 90

## Dépannage

### Service Worker ne s'enregistre pas
- Vérifier que HTTPS est actif (ou localhost)
- Vérifier la console pour les erreurs
- Nettoyer le cache du navigateur

### App n'apparaît pas à l'installation
- Vérifier manifest.json pour les erreurs
- Vérifier que les icônes sont accessibles
- Vérifier que start_url est correct

### Données non synchronisées offline
- Le service worker doit être correctement enregistré
- Les routes API doivent être cachées
- Vérifier les erreurs dans DevTools

---

**Note**: Pour une meilleure expérience PWA, utiliser HTTPS en production.
