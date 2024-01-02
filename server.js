const express = require("express");
//const mongoose = require("mongoose");
const UserModel = require("./models/user");
const path = require("path");
const app = express();
const PORT = 3005;
// 1. JSON verilerini dönüştürmek için
app.use(express.json());

// 2. Statik dosyaları sunmak için
app.use(express.static(path.join(__dirname, "frontend")));

// 3. Form verilerini dönüştürmek için
app.use(express.urlencoded({ extended: false }));
// app.use(express.urlencoded({ extended: false }));
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "frontend", "login.html")); // Düz HTML dosyasını gönder
});

app.post("/register", async (req, res) => {
  try {
    const data = {
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      gender: req.body.gender,
      weight: req.body.weight,
      height: req.body.height,
      age: req.body.age,
    };
    console.log(data);
    await UserModel.create(data);
    // Kayıt başarılı olduktan sonra home.html dosyasını gönder
    res.sendFile(path.join(__dirname, "frontend", "home.html"));
  } catch (error) {
    console.error("User registration error:", error);

    // Hata durumunda ise 500 hatası gönder
    res.status(500).send("Internal Server Error");
  }
});
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
// app.get("/insert", (req, res) => {
//   var userSchema = new UserModel();
//   userSchema.name = "Seda Mercan";
//   userSchema.email = "mrcnsedaa@gmail.com";
//   userSchema.password = "mercans123";
//   userSchema.age = 22;
//   userSchema.gender = "Female";
//   userSchema.height = 175;
//   userSchema.weight = 69;

//   userSchema
//     .save()
//     .then((savedUser) => {
//       res.status(201).send(savedUser);
//     })
//     .catch((err) => {
//       res.status(500).send(err);
//     });
// });
