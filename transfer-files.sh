#!/bin/bash

# Script de transfert des fichiers vers AlmaLinux 9 VPS
echo "📤 Transfert des fichiers vers AlmaLinux 9 VPS..."

# Variables à configurer
VPS_IP="${VPS_IP:-votre-ip-vps}"
VPS_USER="${VPS_USER:-root}"
VPS_PATH="${VPS_PATH:-/opt/opticours}"

# Vérifier que l'IP est configurée
if [ "$VPS_IP" = "votre-ip-vps" ]; then
    echo "❌ Veuillez configurer la variable VPS_IP"
    echo "   Exemple: VPS_IP=185.170.212.245 ./transfer-files.sh"
    exit 1
fi

# Vérifier la connexion SSH
echo "🔍 Test de connexion SSH..."
if ! ssh -o ConnectTimeout=10 $VPS_USER@$VPS_IP "echo 'Connexion SSH OK'"; then
    echo "❌ Impossible de se connecter au VPS. Vérifiez l'IP et les credentials SSH."
    exit 1
fi

# Créer le dossier sur le VPS
echo "📁 Création du dossier sur le VPS..."
ssh $VPS_USER@$VPS_IP "mkdir -p $VPS_PATH"

# Cloner directement depuis GitHub
echo "📥 Clonage depuis GitHub..."
ssh $VPS_USER@$VPS_IP "cd $VPS_PATH && git clone https://github.com/noelchristi/OptiCours.git ."

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