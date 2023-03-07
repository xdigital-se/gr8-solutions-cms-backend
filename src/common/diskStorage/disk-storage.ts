import { diskStorage } from 'multer';
import { v4 as uuidv4 } from 'uuid';

export const avatarStorage = diskStorage({
  // Specify where to save the file
  destination: (req, file, cb) => {
    cb(null, './storage/avatars');
  },
  // Specify the file name
  filename: (req, file, cb) => {
    cb(null, `${uuidv4().slice(0, 4)}.${file.mimetype.replace('image/', '')}`);
  },
});

export const blogStorage = diskStorage({
   // Specify where to save the file
   destination: (req, file, cb) => {
    cb(null, './storage/blogs');
  },
  // Specify the file name
  filename: (req, file, cb) => {
    cb(null, `${uuidv4().slice(0, 4)}.${file.mimetype.replace('image/', '')}`);
  },
})
