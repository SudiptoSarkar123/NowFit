const multer = require('multer');
const path = require('path');
const fs = require('fs');


const uploadsDir = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });
const photosDir = path.join(__dirname, '../../uploads/photos');
const videosDir = path.join(__dirname, '../../uploads/videos');
if (!fs.existsSync(photosDir)) fs.mkdirSync(photosDir, { recursive: true });
if (!fs.existsSync(videosDir)) fs.mkdirSync(videosDir, { recursive: true });

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        if (file.mimetype.startsWith('image/')) {
            cb(null, photosDir);
        } else if (file.mimetype.startsWith('video/')) {
            cb(null, videosDir);
        } else {
            cb(new Error('Unsupported file type'), false);
        }
    },
    filename: (req, file, cb) => {
        const uniqueSufix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, uniqueSufix + path.extname(file.originalname));
    }
});

function fileFilter(req, file, cb) {
    if (
        file.mimetype.startsWith('image/') ||
        file.mimetype.startsWith('video/')
    ) {
        cb(null, true);
    } else {
        cb(new Error('Only image and video files are allowed!'), false);
    }
}

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 50 * 1024 * 1024 // 50MB max file size
    }
});

module.exports = upload;