const OpenAI = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

class AIService {
  static async analyzeContent(content) {
    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4-turbo-preview",
        messages: [
          {
            role: "system",
            content: "Vous êtes un expert en pédagogie universitaire. Analysez le contenu du cours et fournissez des suggestions d'amélioration."
          },
          {
            role: "user",
            content: `Analysez ce contenu de cours et fournissez des suggestions d'amélioration :\n\n${content}`
          }
        ],
        temperature: 0.7,
        max_tokens: 2000
      });

      return response.choices[0].message.content;
    } catch (error) {
      throw new Error(`Erreur lors de l'analyse du contenu : ${error.message}`);
    }
  }

  static async generateSuggestions(content) {
    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4-turbo-preview",
        messages: [
          {
            role: "system",
            content: "Vous êtes un expert en pédagogie universitaire. Générez des suggestions concrètes pour améliorer ce cours."
          },
          {
            role: "user",
            content: `Générez des suggestions d'amélioration pour ce cours :\n\n${content}`
          }
        ],
        temperature: 0.7,
        max_tokens: 2000
      });

      return response.choices[0].message.content;
    } catch (error) {
      throw new Error(`Erreur lors de la génération des suggestions : ${error.message}`);
    }
  }

  static async generateSummary(content) {
    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4-turbo-preview",
        messages: [
          {
            role: "system",
            content: "Vous êtes un expert en pédagogie universitaire. Créez un résumé structuré et hiérarchisé de ce cours."
          },
          {
            role: "user",
            content: `Créez un résumé structuré de ce cours :\n\n${content}`
          }
        ],
        temperature: 0.7,
        max_tokens: 2000
      });

      return response.choices[0].message.content;
    } catch (error) {
      throw new Error(`Erreur lors de la génération du résumé : ${error.message}`);
    }
  }

  static async generateQuiz(content) {
    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4-turbo-preview",
        messages: [
          {
            role: "system",
            content: "Vous êtes un expert en pédagogie universitaire. Créez un QCM de 5 questions avec leurs réponses basé sur ce cours."
          },
          {
            role: "user",
            content: `Créez un QCM de 5 questions avec leurs réponses basé sur ce cours :\n\n${content}`
          }
        ],
        temperature: 0.7,
        max_tokens: 2000
      });

      return response.choices[0].message.content;
    } catch (error) {
      throw new Error(`Erreur lors de la génération du QCM : ${error.message}`);
    }
  }

  static async generateSlides(content) {
    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4-turbo-preview",
        messages: [
          {
            role: "system",
            content: "Vous êtes un expert en pédagogie universitaire. Créez un plan de 5 diapositives pour ce cours."
          },
          {
            role: "user",
            content: `Créez un plan de 5 diapositives pour ce cours :\n\n${content}`
          }
        ],
        temperature: 0.7,
        max_tokens: 2000
      });

      return response.choices[0].message.content;
    } catch (error) {
      throw new Error(`Erreur lors de la génération des diapositives : ${error.message}`);
    }
  }

  static async generateStudentNotes(content) {
    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4-turbo-preview",
        messages: [
          {
            role: "system",
            content: "Vous êtes un expert en pédagogie universitaire. Créez une fiche de cours synthétique pour les étudiants."
          },
          {
            role: "user",
            content: `Créez une fiche de cours synthétique pour les étudiants basée sur ce cours :\n\n${content}`
          }
        ],
        temperature: 0.7,
        max_tokens: 2000
      });

      return response.choices[0].message.content;
    } catch (error) {
      throw new Error(`Erreur lors de la génération de la fiche de cours : ${error.message}`);
    }
  }

  static async generatePracticalWork(content) {
    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4-turbo-preview",
        messages: [
          {
            role: "system",
            content: "Vous êtes un expert en pédagogie universitaire. Créez une fiche de travaux pratiques avec objectifs, matériel et consignes."
          },
          {
            role: "user",
            content: `Créez une fiche de travaux pratiques basée sur ce cours :\n\n${content}`
          }
        ],
        temperature: 0.7,
        max_tokens: 2000
      });

      return response.choices[0].message.content;
    } catch (error) {
      throw new Error(`Erreur lors de la génération de la fiche de TP : ${error.message}`);
    }
  }
}

module.exports = AIService; 