const express = require('express');
const path = require('path');
const { auth } = require('../middleware/auth');
const { Course } = require('../models');
const ExportService = require('../services/exportService');
const fs = require('fs');

const router = express.Router();

// Exporter en PDF
router.get('/pdf/:id', auth, async (req, res) => {
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

    if (course.status !== 'completed') {
      return res.status(400).json({ error: 'Le cours n\'est pas encore traité.' });
    }

    const outputPath = path.join(__dirname, '../../exports', `${course.id}.pdf`);
    await ExportService.generatePDF(course, outputPath);

    res.download(outputPath, `${course.title}.pdf`, (err) => {
      if (err) {
        console.error('Erreur lors du téléchargement du PDF:', err);
      }
      // Supprimer le fichier après l'envoi
      fs.unlink(outputPath, (unlinkErr) => {
        if (unlinkErr) {
          console.error('Erreur lors de la suppression du PDF:', unlinkErr);
        }
      });
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Exporter en PowerPoint
router.get('/pptx/:id', auth, async (req, res) => {
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

    if (course.status !== 'completed') {
      return res.status(400).json({ error: 'Le cours n\'est pas encore traité.' });
    }

    const outputPath = path.join(__dirname, '../../exports', `${course.id}.pptx`);
    await ExportService.generatePPTX(course, outputPath);

    res.download(outputPath, `${course.title}.pptx`, (err) => {
      if (err) {
        console.error('Erreur lors du téléchargement du PowerPoint:', err);
      }
      // Supprimer le fichier après l'envoi
      fs.unlink(outputPath, (unlinkErr) => {
        if (unlinkErr) {
          console.error('Erreur lors de la suppression du PowerPoint:', unlinkErr);
        }
      });
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router; 