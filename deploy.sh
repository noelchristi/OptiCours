#!/bin/bash

# Script de déploiement pour OptiCours
echo "🚀 Démarrage du déploiement OptiCours..."

# Vérifier que Docker est installé
if ! command -v docker &> /dev/null; then
    echo "❌ Docker n'est pas installé. Veuillez l'installer d'abord."
    exit 1
fi

if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose n'est pas installé. Veuillez l'installer d'abord."
    exit 1
fi

# Arrêter les conteneurs existants
echo "🛑 Arrêt des conteneurs existants..."
docker-compose down

# Supprimer les images existantes
echo "🗑️  Suppression des images existantes..."
docker-compose down --rmi all

# Construire et démarrer les services
echo "🔨 Construction des images..."
docker-compose build --no-cache

echo "🚀 Démarrage des services..."
docker-compose up -d

# Attendre que les services soient prêts
echo "⏳ Attente du démarrage des services..."
sleep 30

# Vérifier le statut des services
echo "📊 Statut des services:"
docker-compose ps

echo "✅ Déploiement terminé!"
echo "🌐 Frontend: ${FRONTEND_URL:-http://localhost:3000}"
echo "🔧 Backend API: ${BACKEND_URL:-http://localhost:5000}"
echo "🗄️  Base de données PostgreSQL: localhost:5432" 