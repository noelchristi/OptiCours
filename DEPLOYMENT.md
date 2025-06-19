# Guide de Déploiement OptiCours sur VPS

## Prérequis sur le VPS

### 1. Installation de Docker
```bash
# Ubuntu/Debian
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER

# CentOS/RHEL
sudo yum install -y docker
sudo systemctl start docker
sudo systemctl enable docker
sudo usermod -aG docker $USER
```

### 2. Installation de Docker Compose
```bash
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
```

### 3. Installation de Git
```bash
# Ubuntu/Debian
sudo apt update && sudo apt install -y git

# CentOS/RHEL
sudo yum install -y git
```

## Déploiement

### 1. Cloner le projet
```bash
git clone <votre-repo-url>
cd saas_uni
```

### 2. Configuration des variables d'environnement

Créer le fichier `.env` dans le dossier backend :
```bash
# Configuration du serveur
PORT=5000
NODE_ENV=production

# Base de données PostgreSQL
DB_HOST=postgres
DB_PORT=5432
DB_NAME=opticours
DB_USER=postgres
DB_PASSWORD=votre_mot_de_passe_securise

# JWT
JWT_SECRET=votre_secret_jwt_super_securise

# OpenAI API (optionnel pour le déploiement initial)
OPENAI_API_KEY=votre_cle_api_openai

# URL du frontend
FRONTEND_URL=http://votre-domaine.com
```

### 3. Déploiement avec Docker Compose
```bash
# Rendre le script exécutable
chmod +x deploy.sh

# Lancer le déploiement
./deploy.sh
```

Ou manuellement :
```bash
# Construire et démarrer les services
docker-compose up -d --build

# Vérifier le statut
docker-compose ps

# Voir les logs
docker-compose logs -f
```

## Configuration du domaine

### 1. Configuration Nginx (optionnel)
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

### 2. Configuration SSL avec Let's Encrypt
```bash
# Installation de Certbot
sudo apt install certbot python3-certbot-nginx

# Génération du certificat SSL
sudo certbot --nginx -d votre-domaine.com
```

## Maintenance

### Commandes utiles
```bash
# Voir les logs
docker-compose logs -f [service_name]

# Redémarrer un service
docker-compose restart [service_name]

# Mettre à jour l'application
git pull
docker-compose up -d --build

# Sauvegarder la base de données
docker-compose exec postgres pg_dump -U postgres opticours > backup.sql

# Restaurer la base de données
docker-compose exec -T postgres psql -U postgres opticours < backup.sql
```

### Surveillance
```bash
# Vérifier l'utilisation des ressources
docker stats

# Vérifier l'espace disque
df -h

# Vérifier les conteneurs
docker ps
```

## Dépannage

### Problèmes courants

1. **Ports déjà utilisés**
   ```bash
   # Vérifier les ports utilisés
   sudo netstat -tulpn | grep :3000
   sudo netstat -tulpn | grep :5000
   ```

2. **Problèmes de permissions**
   ```bash
   # Donner les bonnes permissions
   sudo chown -R $USER:$USER .
   ```

3. **Base de données ne démarre pas**
   ```bash
   # Vérifier les logs PostgreSQL
   docker-compose logs postgres
   ```

## Sécurité

- Changez les mots de passe par défaut
- Utilisez des secrets forts pour JWT_SECRET
- Configurez un pare-feu
- Mettez à jour régulièrement Docker et les images
- Surveillez les logs pour détecter les activités suspectes 