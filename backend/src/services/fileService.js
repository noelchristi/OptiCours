const fs = require('fs').promises;
const path = require('path');
const pdf = require('pdf-parse');
const mammoth = require('mammoth');
const pptx2json = require('pptx2json');
const multer = require('multer');

// Configuration du stockage des fichiers
const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../../uploads');
    try {
      await fs.mkdir(uploadDir, { recursive: true });
      cb(null, uploadDir);
    } catch (error) {
      cb(error);
    }
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

// Filtre pour les types de fichiers acceptés
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/vnd.openxmlformats-officedocument.presentationml.presentation'];
  
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Type de fichier non supporté. Formats acceptés : PDF, DOCX, PPTX'));
  }
};

// Configuration de multer
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB max
  }
});

class FileService {
  static getUploadMiddleware() {
    return upload.single('file');
  }

  static async extractContent(filePath, fileType) {
    try {
      let content = '';

      switch (fileType) {
        case 'pdf':
          const pdfData = await fs.readFile(filePath);
          const pdfResult = await pdf(pdfData);
          content = pdfResult.text;
          break;

        case 'docx':
          const docxResult = await mammoth.extractRawText({ path: filePath });
          content = docxResult.value;
          break;

        case 'pptx':
          const pptxResult = await pptx2json(filePath);
          content = pptxResult.slides.map(slide => slide.text).join('\n');
          break;

        default:
          throw new Error('Type de fichier non supporté');
      }

      return content;
    } catch (error) {
      throw new Error(`Erreur lors de l'extraction du contenu : ${error.message}`);
    }
  }

  static async deleteFile(filePath) {
    try {
      await fs.unlink(filePath);
    } catch (error) {
      console.error(`Erreur lors de la suppression du fichier : ${error.message}`);
    }
  }

  static getFileType(mimetype) {
    const types = {
      'application/pdf': 'pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'docx',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation': 'pptx'
    };
    return types[mimetype] || null;
  }
}

module.exports = FileService; 