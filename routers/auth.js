// const express = require("express");
// const router = express.Router();
// const path = require("path");
// const multer = require("multer");

// // multer : dosya yükleme işlemlerini kolayca yönetmek için kullanırız. Http isteklerindeki dosyaları işker ve belirli klasörlere kaydeder.

// const AuthController = require("./authController");

// const storage = multer.diskStorage({
//   destination: "./frontend/images",
//   filename: function (req, file, cb) {
//     cb(
//       null,
//       file.fieldname + "-" + Date.now() + path.extname(file.originalname)
//     );
//   },
// });
// const upload = multer({ storage });

// router.post("/register", AuthController.register);

// module.exports = router;
