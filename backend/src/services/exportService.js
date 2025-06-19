const fs = require('fs').promises;
const path = require('path');
const puppeteer = require('puppeteer');
const pptxgen = require('pptxgenjs');

class ExportService {
  static async generatePDF(course, outputPath) {
    try {
      const browser = await puppeteer.launch();
      const page = await browser.newPage();

      // Créer le contenu HTML
      const html = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; padding: 20px; }
            h1 { color: #2c3e50; }
            h2 { color: #34495e; margin-top: 20px; }
            .section { margin-bottom: 30px; }
            .quiz-question { background: #f8f9fa; padding: 10px; margin: 10px 0; }
            .answer { color: #27ae60; }
          </style>
        </head>
        <body>
          <h1>${course.title}</h1>
          
          <div class="section">
            <h2>Résumé du cours</h2>
            ${course.summary}
          </div>

          <div class="section">
            <h2>Suggestions d'amélioration</h2>
            ${course.suggestions}
          </div>

          <div class="section">
            <h2>QCM</h2>
            ${course.quiz}
          </div>

          <div class="section">
            <h2>Fiche de cours pour étudiants</h2>
            ${course.studentNotes}
          </div>

          <div class="section">
            <h2>Travaux Pratiques</h2>
            ${course.practicalWork}
          </div>
        </body>
        </html>
      `;

      await page.setContent(html);
      await page.pdf({
        path: outputPath,
        format: 'A4',
        margin: {
          top: '20px',
          right: '20px',
          bottom: '20px',
          left: '20px'
        }
      });

      await browser.close();
      return outputPath;
    } catch (error) {
      throw new Error(`Erreur lors de la génération du PDF : ${error.message}`);
    }
  }

  static async generatePPTX(course, outputPath) {
    try {
      const pptx = new pptxgen();

      // Titre
      const titleSlide = pptx.addSlide();
      titleSlide.addText(course.title, {
        x: '10%',
        y: '40%',
        w: '80%',
        h: '20%',
        fontSize: 44,
        color: '2C3E50',
        bold: true,
        align: 'center'
      });

      // Résumé
      const summarySlide = pptx.addSlide();
      summarySlide.addText('Résumé du cours', {
        x: '5%',
        y: '5%',
        w: '90%',
        h: '10%',
        fontSize: 32,
        color: '34495E',
        bold: true
      });
      summarySlide.addText(course.summary, {
        x: '5%',
        y: '20%',
        w: '90%',
        h: '70%',
        fontSize: 18,
        color: '2C3E50'
      });

      // Suggestions
      const suggestionsSlide = pptx.addSlide();
      suggestionsSlide.addText('Suggestions d\'amélioration', {
        x: '5%',
        y: '5%',
        w: '90%',
        h: '10%',
        fontSize: 32,
        color: '34495E',
        bold: true
      });
      suggestionsSlide.addText(course.suggestions, {
        x: '5%',
        y: '20%',
        w: '90%',
        h: '70%',
        fontSize: 18,
        color: '2C3E50'
      });

      // QCM
      const quizSlide = pptx.addSlide();
      quizSlide.addText('QCM', {
        x: '5%',
        y: '5%',
        w: '90%',
        h: '10%',
        fontSize: 32,
        color: '34495E',
        bold: true
      });
      quizSlide.addText(course.quiz, {
        x: '5%',
        y: '20%',
        w: '90%',
        h: '70%',
        fontSize: 18,
        color: '2C3E50'
      });

      // Fiche de cours
      const notesSlide = pptx.addSlide();
      notesSlide.addText('Fiche de cours pour étudiants', {
        x: '5%',
        y: '5%',
        w: '90%',
        h: '10%',
        fontSize: 32,
        color: '34495E',
        bold: true
      });
      notesSlide.addText(course.studentNotes, {
        x: '5%',
        y: '20%',
        w: '90%',
        h: '70%',
        fontSize: 18,
        color: '2C3E50'
      });

      // TP
      const tpSlide = pptx.addSlide();
      tpSlide.addText('Travaux Pratiques', {
        x: '5%',
        y: '5%',
        w: '90%',
        h: '10%',
        fontSize: 32,
        color: '34495E',
        bold: true
      });
      tpSlide.addText(course.practicalWork, {
        x: '5%',
        y: '20%',
        w: '90%',
        h: '70%',
        fontSize: 18,
        color: '2C3E50'
      });

      await pptx.writeFile(outputPath);
      return outputPath;
    } catch (error) {
      throw new Error(`Erreur lors de la génération du PowerPoint : ${error.message}`);
    }
  }
}

module.exports = ExportService; 