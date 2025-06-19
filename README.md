# OptiCours - Optimisation de cours par IA

OptiCours est une plateforme SaaS permettant aux enseignants universitaires d'optimiser leurs cours grâce à l'intelligence artificielle.

## Fonctionnalités

- Upload de cours (PDF, DOCX, PPTX)
- Analyse pédagogique par IA
- Génération automatique de :
  - Suggestions d'amélioration
  - Résumés structurés
  - QCM pour étudiants
  - Fiches de cours synthétiques
  - Fiches de travaux pratiques
  - Présentations PowerPoint
- Export en PDF et PowerPoint
- Notifications par email

## Prérequis

- Node.js 16+
- PostgreSQL 12+
- Compte OpenAI avec clé API

## Installation

1. Cloner le repository :
```bash
git clone https://github.com/votre-username/opticours.git
cd opticours
```

2. Installer les dépendances du backend :
```bash
cd backend
npm install
```

3. Installer les dépendances du frontend :
```bash
cd ../frontend
npm install
```

4. Configurer les variables d'environnement :
```bash
# Dans le dossier backend
cp .env.example .env
```

Modifier le fichier `.env` avec vos configurations :
```env
# Configuration du serveur
PORT=5000
NODE_ENV=development

# Base de données PostgreSQL
DB_HOST=localhost
DB_PORT=5432
DB_NAME=opticours
DB_USER=postgres
DB_PASSWORD=postgres

# JWT
JWT_SECRET=votre_secret_jwt_super_securise

# OpenAI API
OPENAI_API_KEY=votre_cle_api_openai

# Configuration SMTP pour les emails
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=votre_email@gmail.com
SMTP_PASSWORD=votre_mot_de_passe_application

# URL du frontend
FRONTEND_URL=http://localhost:3000
```

5. Créer la base de données PostgreSQL :
```sql
CREATE DATABASE opticours;
```

6. Initialiser la base de données :
```bash
cd backend
npx sequelize-cli db:migrate
```

## Démarrage

1. Démarrer le backend :
```bash
cd backend
npm run dev
```

2. Démarrer le frontend :
```bash
cd frontend
npm run dev
```

L'application sera accessible à l'adresse : http://localhost:3000

## Structure du projet

```
opticours/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── services/
│   │   └── middleware/
│   ├── uploads/
│   └── exports/
└── frontend/
    ├── src/
    │   ├── components/
    │   ├── pages/
    │   ├── services/
    │   └── utils/
    └── public/
```

## API Endpoints

### Authentification
- POST /api/auth/register - Inscription
- POST /api/auth/login - Connexion
- GET /api/auth/profile - Profil utilisateur

### Cours
- POST /api/courses - Upload d'un cours
- GET /api/courses - Liste des cours
- GET /api/courses/:id - Détails d'un cours
- DELETE /api/courses/:id - Supprimer un cours

### Export
- GET /api/export/pdf/:id - Exporter en PDF
- GET /api/export/pptx/:id - Exporter en PowerPoint

## Technologies utilisées

### Backend
- Node.js
- Express
- PostgreSQL
- Sequelize
- JWT
- OpenAI API
- Nodemailer
- Puppeteer
- pptxgenjs

### Frontend
- React
- Next.js
- Tailwind CSS
- Axios
- React Query

## Contribution

1. Fork le projet
2. Créer une branche pour votre fonctionnalité
3. Commiter vos changements
4. Pousser vers la branche
5. Ouvrir une Pull Request

## Licence

MIT 