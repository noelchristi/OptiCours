const express = require('express');
const { auth } = require('../middleware/auth');
const { Course } = require('../models');
const FileService = require('../services/fileService');
const AIService = require('../services/aiService');
const EmailService = require('../services/emailService');

const router = express.Router();

// Upload d'un nouveau cours
router.post('/', auth, FileService.getUploadMiddleware(), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Aucun fichier n\'a été uploadé.' });
    }

    const fileType = FileService.getFileType(req.file.mimetype);
    if (!fileType) {
      await FileService.deleteFile(req.file.path);
      return res.status(400).json({ error: 'Type de fichier non supporté.' });
    }

    const course = await Course.create({
      title: req.body.title || req.file.originalname,
      description: req.body.description,
      originalFile: req.file.path,
      fileType,
      userId: req.user.id,
      status: 'processing'
    });

    // Traitement asynchrone du cours
    processCourse(course, req.user).catch(console.error);

    res.status(201).json(course);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Récupérer tous les cours d'un enseignant
router.get('/', auth, async (req, res) => {
  try {
    const courses = await Course.findAll({
      where: { userId: req.user.id },
      order: [['createdAt', 'DESC']]
    });
    res.json(courses);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Récupérer un cours spécifique
router.get('/:id', auth, async (req, res) => {
  try {
    const course = await Course.findOne({
      where: {
        id: req.params.id,
        userId: req.user.id
      }
    });

    if (!course) {
      return res.status(404).json({ error: 'Cours non trouvé.' });
    }

    res.json(course);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Supprimer un cours
router.delete('/:id', auth, async (req, res) => {
  try {
    const course = await Course.findOne({
      where: {
        id: req.params.id,
        userId: req.user.id
      }
    });

    if (!course) {
      return res.status(404).json({ error: 'Cours non trouvé.' });
    }

    // Supprimer le fichier original
    await FileService.deleteFile(course.originalFile);

    // Supprimer le cours de la base de données
    await course.destroy();

    res.json({ message: 'Cours supprimé avec succès.' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Fonction de traitement asynchrone du cours
async function processCourse(course, user) {
  try {
    // Extraire le contenu du fichier
    const content = await FileService.extractContent(course.originalFile, course.fileType);

    // Analyser le contenu avec l'IA
    const analysis = await AIService.analyzeContent(content);
    const suggestions = await AIService.generateSuggestions(content);
    const summary = await AIService.generateSummary(content);
    const quiz = await AIService.generateQuiz(content);
    const slides = await AIService.generateSlides(content);
    const studentNotes = await AIService.generateStudentNotes(content);
    const practicalWork = await AIService.generatePracticalWork(content);

    // Mettre à jour le cours avec les résultats
    await course.update({
      status: 'completed',
      analysis,
      suggestions,
      summary,
      quiz,
      slides,
      studentNotes,
      practicalWork
    });

    // Envoyer un email de notification
    await EmailService.sendCourseProcessedEmail(user, course);
  } catch (error) {
    console.error('Erreur lors du traitement du cours:', error);
    await course.update({ status: 'failed' });
  }
}

module.exports = router; 