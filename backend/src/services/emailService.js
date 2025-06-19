const nodemailer = require('nodemailer');

class EmailService {
  static async sendCourseProcessedEmail(user, course) {
    try {
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        secure: process.env.SMTP_SECURE === 'true',
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASSWORD
        }
      });

      const mailOptions = {
        from: `"OptiCours" <${process.env.SMTP_USER}>`,
        to: user.email,
        subject: `Votre cours "${course.title}" a été traité`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #2c3e50;">Bonjour ${user.firstName},</h2>
            
            <p>Votre cours "${course.title}" a été traité avec succès par notre système d'intelligence artificielle.</p>
            
            <div style="background-color: #f8f9fa; padding: 20px; border-radius: 5px; margin: 20px 0;">
              <h3 style="color: #34495e; margin-top: 0;">Résultats disponibles :</h3>
              <ul style="list-style-type: none; padding: 0;">
                <li style="margin: 10px 0;">✓ Analyse du contenu</li>
                <li style="margin: 10px 0;">✓ Suggestions d'amélioration</li>
                <li style="margin: 10px 0;">✓ Résumé structuré</li>
                <li style="margin: 10px 0;">✓ QCM pour étudiants</li>
                <li style="margin: 10px 0;">✓ Fiche de cours synthétique</li>
                <li style="margin: 10px 0;">✓ Fiche de travaux pratiques</li>
                <li style="margin: 10px 0;">✓ Plan de diapositives</li>
              </ul>
            </div>

            <p>Vous pouvez accéder à tous ces éléments en vous connectant à votre espace OptiCours.</p>
            
            <div style="margin: 30px 0;">
              <a href="${process.env.FRONTEND_URL}/courses/${course.id}" 
                 style="background-color: #3498db; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px;">
                Voir les résultats
              </a>
            </div>

            <p style="color: #7f8c8d; font-size: 14px;">
              Si vous avez des questions, n'hésitez pas à nous contacter.
            </p>

            <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">

            <p style="color: #7f8c8d; font-size: 12px;">
              Cet email a été envoyé automatiquement par OptiCours. Merci de ne pas y répondre.
            </p>
          </div>
        `
      };

      await transporter.sendMail(mailOptions);
    } catch (error) {
      throw new Error(`Erreur lors de l'envoi de l'email : ${error.message}`);
    }
  }

  static async sendWelcomeEmail(user) {
    try {
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        secure: process.env.SMTP_SECURE === 'true',
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASSWORD
        }
      });

      const mailOptions = {
        from: `"OptiCours" <${process.env.SMTP_USER}>`,
        to: user.email,
        subject: 'Bienvenue sur OptiCours !',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #2c3e50;">Bienvenue sur OptiCours, ${user.firstName} !</h2>
            
            <p>Nous sommes ravis de vous accueillir sur notre plateforme d'optimisation de cours par intelligence artificielle.</p>
            
            <div style="background-color: #f8f9fa; padding: 20px; border-radius: 5px; margin: 20px 0;">
              <h3 style="color: #34495e; margin-top: 0;">Ce que vous pouvez faire avec OptiCours :</h3>
              <ul style="list-style-type: none; padding: 0;">
                <li style="margin: 10px 0;">✓ Analyser vos cours existants</li>
                <li style="margin: 10px 0;">✓ Obtenir des suggestions d'amélioration</li>
                <li style="margin: 10px 0;">✓ Générer des résumés structurés</li>
                <li style="margin: 10px 0;">✓ Créer des QCM pour vos étudiants</li>
                <li style="margin: 10px 0;">✓ Produire des fiches de cours synthétiques</li>
                <li style="margin: 10px 0;">✓ Élaborer des fiches de travaux pratiques</li>
                <li style="margin: 10px 0;">✓ Générer des présentations PowerPoint</li>
              </ul>
            </div>

            <div style="margin: 30px 0;">
              <a href="${process.env.FRONTEND_URL}/dashboard" 
                 style="background-color: #3498db; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px;">
                Accéder à mon espace
              </a>
            </div>

            <p style="color: #7f8c8d; font-size: 14px;">
              Si vous avez des questions, notre équipe est là pour vous aider.
            </p>

            <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">

            <p style="color: #7f8c8d; font-size: 12px;">
              Cet email a été envoyé automatiquement par OptiCours. Merci de ne pas y répondre.
            </p>
          </div>
        `
      };

      await transporter.sendMail(mailOptions);
    } catch (error) {
      throw new Error(`Erreur lors de l'envoi de l'email de bienvenue : ${error.message}`);
    }
  }
}

module.exports = EmailService; 