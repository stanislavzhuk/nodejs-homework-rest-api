import path from 'path';
import multer from 'multer';

const destination = path.resolve('tmp');

const storage = multer.diskStorage({
  destination,
  filename: (req, file, cb) => {
    const { originalname } = file;
    const uniquePrefix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const filename = `${uniquePrefix}_${originalname}`;
    cb(null, filename);
  },
});

const limits = {
  fileSize: 1024 * 1024 * 5,
};

const upload = multer({
  storage,
  limits,
});

export default upload;
