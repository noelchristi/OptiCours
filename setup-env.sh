#!/bin/bash

# Script de configuration automatique du fichier .env
echo "🔧 Configuration automatique du fichier .env..."

# Variables à configurer
VPS_IP="${VPS_IP:-votre-ip-vps}"
VPS_USER="${VPS_USER:-root}"
VPS_PATH="${VPS_PATH:-/opt/opticours}"
FRONTEND_URL="${FRONTEND_URL:-http://localhost:3000}"

# Vérifier que l'IP est configurée
if [ "$VPS_IP" = "votre-ip-vps" ]; then
    echo "❌ Veuillez configurer la variable VPS_IP"
    echo "   Exemple: VPS_IP=185.170.212.245 ./setup-env.sh"
    exit 1
fi

# Créer le fichier .env sur le VPS
echo "📝 Création du fichier .env..."
ssh $VPS_USER@$VPS_IP "cat > $VPS_PATH/backend/.env << 'EOF'
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
FRONTEND_URL=$FRONTEND_URL
EOF"

echo "✅ Configuration terminée!"
echo "📋 Le fichier .env a été créé avec les paramètres de production."
echo "🔐 N'oubliez pas de changer le JWT_SECRET en production!" 