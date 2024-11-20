import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Ensure the uploads directory exists
const uploadsDir = '/tmp';
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Set up multer storage options
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, `${file.fieldname}-${uniqueSuffix}${path.extname(file.originalname)}`);
  }
});

// Allowed file types
const allowedTypes = /jpeg|jpg|png|gif|mp4|mkv|avi|pdf|doc|docx/;

// File filter function to validate file types
const fileFilter = (req, file, cb) => {
  const mimeType = allowedTypes.test(file.mimetype);
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());

  if (mimeType && extname) {
    return cb(null, true);
  }
  cb(new Error('Error: File upload only supports the following filetypes - jpeg, jpg, png, gif, mp4, mkv, avi, pdf, doc, docx'));
};

// Initialize multer with storage and file filter options
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 1024 * 1024 * 50 // 50MB file size limit, adjust as needed
  }
});

export { upload };
