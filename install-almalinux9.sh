#!/bin/bash

# Script d'installation pour AlmaLinux 9
echo "🚀 Installation d'OptiCours sur AlmaLinux 9..."

# Mise à jour du système
echo "📦 Mise à jour du système..."
sudo dnf update -y

# Installation des dépendances
echo "🔧 Installation des dépendances..."
sudo dnf install -y curl wget git

# Installation de Docker
echo "🐳 Installation de Docker..."
sudo dnf config-manager --add-repo https://download.docker.com/linux/centos/docker-ce.repo
sudo dnf install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

# Démarrer et activer Docker
echo "▶️  Démarrage de Docker..."
sudo systemctl start docker
sudo systemctl enable docker

# Ajouter l'utilisateur au groupe docker
echo "👤 Configuration des permissions..."
sudo usermod -aG docker $USER

# Installation de Docker Compose standalone (si nécessaire)
echo "📋 Installation de Docker Compose..."
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Créer un lien symbolique
sudo ln -sf /usr/local/bin/docker-compose /usr/bin/docker-compose

# Configuration du firewall
echo "🔥 Configuration du firewall..."
sudo firewall-cmd --permanent --add-port=3000/tcp
sudo firewall-cmd --permanent --add-port=5000/tcp
sudo firewall-cmd --permanent --add-port=5432/tcp
sudo firewall-cmd --reload

echo "✅ Installation terminée!"
echo "🔄 Veuillez vous reconnecter pour que les changements de groupe prennent effet."
echo "📋 Prochaines étapes:"
echo "   1. Reconnectez-vous à votre session"
echo "   2. Clonez le projet: git clone <votre-repo>"
echo "   3. Lancez le déploiement: ./deploy.sh" 