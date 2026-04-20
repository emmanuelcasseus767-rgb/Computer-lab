# Déploiement PWA en Production

Guide complet pour déployer l'application PWA en production avec HTTPS.

## 📋 Prérequis

- Un serveur web (Apache, Nginx, IIS)
- Un certificat SSL/TLS (Let's Encrypt, Cloudflare, etc.)
- Node.js installé sur le serveur
- Git (optionnel)

## 🚀 Étapes de déploiement

### 1. Cloner/Copier l'application

```bash
# Via Git
git clone <votre-repo> /var/www/salle-informatique
cd /var/www/salle-informatique

# Ou copier manuellement les fichiers
```

### 2. Installer les dépendances

```bash
npm install
```

### 3. Configurer HTTPS avec Let's Encrypt (Recommandé - Gratuit)

#### Sur Heroku (simple)
```bash
git push heroku main
# Heroku fourni automatiquement HTTPS
```

#### Sur VPS/Serveur dédié

##### Avec Certbot (Apache/Nginx)
```bash
# Installation
sudo apt-get install certbot python3-certbot-apache

# Générer le certificat
sudo certbot certonly --apache -d votre-domaine.com

# Auto-renouvellement (dans crontab)
0 0 * * * /usr/bin/certbot renew --quiet
```

##### Avec Cloudflare (gratuit aussi)
```
1. Aller sur cloudflare.com
2. Ajouter votre domaine
3. Changer les nameservers
4. Activer HTTPS dans l'onglet SSL/TLS
```

### 4. Configurer le serveur web

#### Apache (.htaccess déjà configuré)
```apache
# Vérifier que mod_rewrite est activé
a2enmod rewrite

# Redirection HTTP → HTTPS
<VirtualHost *:80>
    ServerName votre-domaine.com
    Redirect permanent / https://votre-domaine.com/
</VirtualHost>

<VirtualHost *:443>
    ServerName votre-domaine.com
    SSLEngine on
    SSLCertificateFile /chemin/vers/cert.pem
    SSLCertificateKeyFile /chemin/vers/key.pem
    
    DocumentRoot /var/www/salle-informatique
    
    <Directory /var/www/salle-informatique>
        AllowOverride All
        Require all granted
    </Directory>
</VirtualHost>
```

#### Nginx
```nginx
server {
    listen 80;
    server_name votre-domaine.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name votre-domaine.com;
    
    ssl_certificate /chemin/vers/cert.pem;
    ssl_certificate_key /chemin/vers/key.pem;
    
    # Sécurité SSL
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;
    
    # Compression
    gzip on;
    gzip_types text/plain text/css application/javascript application/json;
    
    root /var/www/salle-informatique;
    
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    # Cache
    location ~* \.(css|js|json|svg)$ {
        expires 1month;
        add_header Cache-Control "public, immutable";
    }
    
    # Service Worker - pas de cache
    location /service-worker.js {
        add_header Cache-Control "no-cache, must-revalidate";
        add_header Service-Worker-Allowed "/";
    }
}
```

#### IIS (web.config déjà configuré)
```
1. Ouvrir IIS Manager
2. Sélectionner le site
3. Cliquer sur "Bindings"
4. Ajouter le certificat HTTPS
5. Le web.config gère le reste
```

### 5. Démarrer le serveur Node.js

```bash
# En mode développement
npm start

# En production (avec PM2)
npm install -g pm2
pm2 start server.js --name "salle-informatique"
pm2 startup
pm2 save
```

### 6. Vérifier le déploiement

```bash
# Tester HTTPS
curl -I https://votre-domaine.com

# Vérifier le certificat
openssl s_client -connect votre-domaine.com:443

# Vérifier la PWA avec Lighthouse
# Ouvrir DevTools → Lighthouse → PWA
```

## 🔒 Sécurité

### En-têtes de sécurité recommandés

```apache
# .htaccess
Header set Strict-Transport-Security "max-age=31536000; includeSubDomains"
Header set X-Content-Type-Options "nosniff"
Header set X-Frame-Options "DENY"
Header set X-XSS-Protection "1; mode=block"
Header set Referrer-Policy "strict-origin-when-cross-origin"
```

### Variables d'environnement

```bash
# .env
NODE_ENV=production
API_URL=https://votre-domaine.com/api
PORT=3000
```

## 📊 Monitoring

### PM2 Monitoring
```bash
pm2 web              # Accessible sur http://localhost:9615
pm2 monit            # Monitoring en temps réel
pm2 logs             # Voir les logs
```

### Certbot Auto-renew
```bash
# Tester le renouvellement
sudo certbot renew --dry-run

# Voir le statut
sudo certbot certificates
```

## 🚨 Troubleshooting

### HTTPS ne fonctionne pas
- Vérifier le certificat: `openssl x509 -in cert.pem -noout`
- Vérifier les ports: `sudo netstat -tlnp | grep 443`
- Vérifier les logs: `sudo tail -f /var/log/apache2/error.log`

### PWA n'est pas reconnue
- Accéder via HTTPS (obligatoire)
- Vérifier manifest.json: `curl https://votre-domaine.com/manifest.json`
- Vérifier le service worker: `curl https://votre-domaine.com/service-worker.js`
- Ouvrir DevTools → Lighthouse → PWA

### Service Worker ne se met à jour
- Nettoyer le cache: DevTools → Application → Clear storage
- Forcer le renouvellement: `Ctrl+Shift+R`

## 📈 Performance

Utiliser Lighthouse pour vérifier:

```
Ouvrir DevTools
→ Lighthouse
→ Sélectionner PWA
→ Analyser
```

Les scores doivent être:
- ✅ PWA: > 90
- ✅ Performance: > 80
- ✅ Accessibility: > 90
- ✅ Best Practices: > 90

## 📚 Ressources

- [Let's Encrypt](https://letsencrypt.org/)
- [PWA Checklist](https://developers.google.com/web/progressive-web-apps/checklist)
- [MDN PWA Guide](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps)
- [Lighthouse](https://developers.google.com/web/tools/lighthouse)

---

**Note**: L'application est prête pour la production et supporte tous les serveurs modernes (Apache, Nginx, IIS).
