import multer from 'multer';
import path from 'path';
import fs from 'fs';

const uploadsDir = path.resolve('uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `resume-${uniqueSuffix}${ext}`);
  },
});

const ALLOWED_EXTENSIONS = [
  '.pdf',
  '.docx',
  '.doc',
  '.jpg',
  '.jpeg',
  '.png',
  '.webp',
  '.bmp',
  '.tiff',
];

const ALLOWED_MIME_TYPES = [
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/msword',
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/bmp',
  'image/tiff',
  'application/octet-stream', // Some browsers send octet-stream for .doc/.docx
];

const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();
  const mime = file.mimetype.toLowerCase();

  const isExtAllowed = ALLOWED_EXTENSIONS.includes(ext);
  const isMimeAllowed = ALLOWED_MIME_TYPES.includes(mime) || mime.startsWith('image/');

  if (isExtAllowed || isMimeAllowed) {
    cb(null, true);
  } else {
    cb(
      new Error(
        `Unsupported format: "${ext}". Please upload a PDF, Word document (DOCX/DOC), or Image (JPG, PNG, WebP).`
      ),
      false
    );
  }
};

export const uploadResume = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 15 * 1024 * 1024, // 15 MB limit
  },
});
