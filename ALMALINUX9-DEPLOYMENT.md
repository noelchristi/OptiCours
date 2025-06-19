# Déploiement OptiCours sur AlmaLinux 9 avec Webmin

## 🐧 Prérequis AlmaLinux 9

### Option 1: Installation via Webmin Terminal

1. **Accédez à Webmin** → **Tools** → **Command Shell**
2. **Exécutez le script d'installation** :
```bash
# Télécharger le script
wget https://raw.githubusercontent.com/noelchristi/OptiCours/main/install-almalinux9.sh

# Rendre exécutable
chmod +x install-almalinux9.sh

# Exécuter
./install-almalinux9.sh
```

### Option 2: Installation manuelle via SSH

```bash
# Connexion SSH
ssh root@votre-ip-vps

# Mise à jour
dnf update -y

# Installation Docker
dnf config-manager --add-repo https://download.docker.com/linux/centos/docker-ce.repo
dnf install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

# Démarrer Docker
systemctl start docker
systemctl enable docker

# Ajouter utilisateur au groupe docker
usermod -aG docker $USER

# Installation Docker Compose
curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
chmod +x /usr/local/bin/docker-compose
ln -sf /usr/local/bin/docker-compose /usr/bin/docker-compose

# Configuration firewall
firewall-cmd --permanent --add-port=3000/tcp
firewall-cmd --permanent --add-port=5000/tcp
firewall-cmd --permanent --add-port=5432/tcp
firewall-cmd --reload
```

## 📁 Préparation du projet

### 1. Cloner depuis GitHub
```bash
mkdir -p /opt/opticours
cd /opt/opticours
git clone https://github.com/noelchristi/OptiCours.git .
```

### 2. Configuration automatique
```bash
# Créer le fichier .env automatiquement
cat > backend/.env << 'EOF'
# Configuration du serveur
PORT=5000
NODE_ENV=production

# Base de données PostgreSQL
DB_HOST=postgres
DB_PORT=5432
DB_NAME=opticours
DB_USER=postgres
DB_PASSWORD=postgres

# JWT
JWT_SECRET=opticours_production_secret_2024

# URL du frontend
FRONTEND_URL=http://votre-ip-vps:3000
EOF

# Créer les dossiers nécessaires
mkdir -p backend/uploads backend/exports
chmod 755 backend/uploads backend/exports
```

## 🚀 Déploiement

### 1. Via Webmin Terminal
```bash
cd /opt/opticours
chmod +x deploy.sh
./deploy.sh
```

### 2. Via SSH
```bash
cd /opt/opticours
docker-compose up -d --build
```

## 🌐 Configuration Webmin

### 1. Configuration du proxy reverse (optionnel)

Si vous voulez utiliser un domaine :

1. **Installer Nginx** :
```bash
dnf install -y nginx
systemctl start nginx
systemctl enable nginx
```

2. **Configuration Nginx** :
```bash
nano /etc/nginx/conf.d/opticours.conf
```

Contenu :
```nginx
server {
    listen 80;
    server_name votre-domaine.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

3. **Redémarrer Nginx** :
```bash
systemctl restart nginx
```

### 2. Configuration SSL avec Certbot
```bash
# Installation Certbot
dnf install -y certbot python3-certbot-nginx

# Génération certificat
certbot --nginx -d votre-domaine.com
```

## 📊 Surveillance via Webmin

### 1. Module Docker
1. **Installer le module Docker** dans Webmin
2. **Accéder** : **Docker** → **Containers**
3. **Surveiller** les conteneurs OptiCours

### 2. Module System Status
1. **Accéder** : **System** → **System Status**
2. **Surveiller** l'utilisation CPU, RAM, disque

### 3. Logs
```bash
# Voir les logs des conteneurs
docker-compose logs -f

# Logs spécifiques
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f postgres
```

## 🔄 Maintenance

### Commandes utiles
```bash
# Redémarrer l'application
cd /opt/opticours
docker-compose restart

# Mettre à jour
cd /opt/opticours
git pull
docker-compose up -d --build

# Sauvegarder la base de données
docker-compose exec postgres pg_dump -U postgres opticours > backup_$(date +%Y%m%d).sql

# Restaurer
docker-compose exec -T postgres psql -U postgres opticours < backup_20231201.sql
```

### Surveillance des ressources
```bash
# Utilisation des conteneurs
docker stats

# Espace disque
df -h

# Mémoire
free -h

# Processus
top
```

## 🛠️ Dépannage

### Problèmes courants

1. **Docker ne démarre pas**
```bash
systemctl status docker
journalctl -u docker
```

2. **Ports déjà utilisés**
```bash
netstat -tulpn | grep :3000
netstat -tulpn | grep :5000
```

3. **Permissions**
```bash
chown -R $USER:$USER /opt/opticours
chmod +x /opt/opticours/deploy.sh
```

4. **Base de données**
```bash
docker-compose logs postgres
docker-compose exec postgres psql -U postgres -c "\l"
```

## 🔒 Sécurité

- Changez les mots de passe par défaut
- Utilisez des secrets forts
- Configurez le firewall
- Mettez à jour régulièrement
- Surveillez les logs

## 📞 Support

En cas de problème :
1. Vérifiez les logs : `docker-compose logs`
2. Vérifiez le statut : `docker-compose ps`
3. Redémarrez : `docker-compose restart` 