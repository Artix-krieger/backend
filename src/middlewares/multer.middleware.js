import multer from "multer";

const storage = multer.diskStorage({
  // destination is a function where you define where to save the files
  destination: function (req, file, cb) {
    // Here, "/public/temp" is the directory where the files will be stored
    cb(null, "./public/temp");
  },
  // filename is a function where you define the name of the saved file
  filename: function (req, file, cb) {
    console.log("Multer :: inside storage method ", file);
    // Here, I am using the original name of the file
    cb(null, file.originalname);
  },
});

export const upload = multer({
  storage,
});
