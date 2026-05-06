const multer = require("multer");
const path = require("path");

// storage config
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    const uniqueName = Date.now() + path.extname(file.originalname);
    cb(null, uniqueName);
  },
});

// file filter (allow multiple types)
const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/vnd.ms-word.document.macroEnabled.12",
    "application/vnd.ms-excel",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "image/jpeg",
    "image/png",
    "image/jpg",
    "application/octet-stream",
    "application/zip",
  ];

  const extension = file.originalname.toLowerCase().split(".").pop();
  const wordExtensions = ["doc", "docx"];
  const isWordMime = file.mimetype.includes("word");
  const isWordExtension = wordExtensions.includes(extension);

  if (
    allowedTypes.includes(file.mimetype) ||
    isWordMime ||
    isWordExtension ||
    ["application/octet-stream", "application/zip"].includes(file.mimetype)
  ) {
    return cb(null, true);
  }

  cb(new Error("File type not supported"), false);
};

const upload = multer({ storage, fileFilter });

module.exports = upload;
