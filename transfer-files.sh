#!/bin/bash

# Script de transfert des fichiers vers AlmaLinux 9 VPS
echo "📤 Transfert des fichiers vers AlmaLinux 9 VPS..."

# Variables à configurer
VPS_IP="votre-ip-vps"
VPS_USER="root"
VPS_PATH="/opt/opticours"

# Vérifier la connexion SSH
echo "🔍 Test de connexion SSH..."
if ! ssh -o ConnectTimeout=10 $VPS_USER@$VPS_IP "echo 'Connexion SSH OK'"; then
    echo "❌ Impossible de se connecter au VPS. Vérifiez l'IP et les credentials SSH."
    exit 1
fi

# Créer le dossier sur le VPS
echo "📁 Création du dossier sur le VPS..."
ssh $VPS_USER@$VPS_IP "mkdir -p $VPS_PATH"

# Transférer les fichiers
echo "📤 Transfert des fichiers..."
scp -r backend/ $VPS_USER@$VPS_IP:$VPS_PATH/
scp -r frontend/ $VPS_USER@$VPS_IP:$VPS_PATH/
scp docker-compose.yml $VPS_USER@$VPS_IP:$VPS_PATH/
scp deploy.sh $VPS_USER@$VPS_IP:$VPS_PATH/
scp install-almalinux9.sh $VPS_USER@$VPS_IP:$VPS_PATH/
scp ALMALINUX9-DEPLOYMENT.md $VPS_USER@$VPS_IP:$VPS_PATH/

# Créer les dossiers nécessaires
echo "📂 Création des dossiers nécessaires..."
ssh $VPS_USER@$VPS_IP "mkdir -p $VPS_PATH/backend/uploads $VPS_PATH/backend/exports"

# Donner les bonnes permissions
echo "🔐 Configuration des permissions..."
ssh $VPS_USER@$VPS_IP "chmod +x $VPS_PATH/deploy.sh $VPS_PATH/install-almalinux9.sh"

echo "✅ Transfert terminé!"
echo "📋 Prochaines étapes sur le VPS:"
echo "   1. Se connecter au VPS: ssh $VPS_USER@$VPS_IP"
echo "   2. Aller dans le dossier: cd $VPS_PATH"
echo "   3. Installer Docker: ./install-almalinux9.sh"
echo "   4. Configurer .env: nano backend/.env"
echo "   5. Déployer: ./deploy.sh" 