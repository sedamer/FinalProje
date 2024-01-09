const express = require("express");
const { UserModel, NutritionModel } = require("./models/user");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const bcryptjs = require("bcryptjs");

const multer = require("multer");

const path = require("path");
const app = express();
const PORT = 3005;

app.use(express.static(path.join(__dirname, "frontend"))); // Bu satırı ekledik
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));
let currentUser = null;

async function hashPass(password) {
  const res = await bcryptjs.hash(password, 10);
  return res;
}
async function compare(userPass, hashPass) {
  const res = await bcryptjs.compare(userPass, hashPass);
  return res;
}

app.get("/", (req, res) => {
  if (req.cookies.jwt) {
    const verify = jwt.verify(
      req.cookies.jwt,
      "LoremipsumdolorsitmetconsecteturadipisicingelitErrorassumendaciduntuaeaborumepellendus"
    );
    res.render("home", { name: verify.name });
    //  res.sendFile(path.join(__dirname, "frontend", "login.html"));
  } else {
    res.render("login");
  }
});

app.post("/register", async (req, res) => {
  try {
    const check = await UserModel.findOne({ name: req.body.name });
    if (check) {
      res.send("User already exists");
    } else {
      const token = jwt.sign(
        { name: req.body.name },
        "LoremipsumdolorsitmetconsecteturadipisicingelitErrorassumendaciduntuaeaborumepellendus" // Özel anahtarı güvenli bir şekilde saklayın ve buraya ekleyin
      );
      res.cookie("jwt", token, {
        maxAge: 6000,
        httpOnly: true,
      });
      const data = {
        name: req.body.name,
        email: req.body.email,
        password: await hashPass(req.body.password),
        gender: req.body.gender,
        weight: req.body.weight,
        height: req.body.height,
        age: req.body.age,
        token: token,
      };
      console.log(req.body);
      await UserModel.insertMany(data);
      currentUser = {
        name: req.body.name,
      };
      res.sendFile(path.join(__dirname, "frontend", "home.html"));
    }
  } catch (error) {
    console.error("User registration error:", error);
    res.status(500).send("Internal Server Error");
  }
});

app.post("/login", async (req, res) => {
  try {
    const check = await UserModel.findOne({ name: req.body.name });
    if (!check) {
      res.send("Kullanıcı bulunamadı");
      return;
    }

    const passCheck = await compare(req.body.password, check.password);
    if (passCheck) {
      currentUser = {
        name: req.body.name,
      };
      res.cookie("jwt", check.token, {
        maxAge: 6000,
        httpOnly: true,
      });
      res.sendFile(path.join(__dirname, "frontend", "home.html"));
    } else {
      res.send("Yanlış girdiniz");
    }
  } catch (error) {
    console.error("User login error:", error);
    res.status(500).send("Internal Server Error");
  }
});

app.get("/get-current-user", (req, res) => {
  if (currentUser) {
    res.json(currentUser);
  } else {
    res.status(404).json({ error: "User not found" });
  }
});
app.post("/logout", (req, res) => {
  // Kullanıcı oturumunu temizle
  currentUser = null;
  // İlgili cookie'yi temizle (Eğer kullanılıyorsa)
  res.clearCookie("jwt");
  // İlgili token'ı temizle (Eğer kullanılıyorsa)
  // Örneğin: token = null;
  res.json({ message: "Çıkış başarılı" });
});
app.get("/profile", async (req, res) => {
  try {
    // Kullanıcı adını currentUser'dan alın
    const userName = currentUser ? currentUser.name : null;

    // Kullanıcı adına göre veritabanından kullanıcıyı bul
    const user = await UserModel.findOne({ name: userName });

    if (user) {
      // JSON verilerini doğrudan gönder
      res.json({
        userimage: user.userimage,
        name: user.name,
        email: user.email,
        gender: user.gender,
        height: user.height,
        weight: user.weight,
        age: user.age,
        // Diğer bilgileri de ekle
      });
    } else {
      res.status(404).json({ error: "User not found" });
    }
  } catch (error) {
    console.error("Error fetching user profile:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// editProfile endpoint'ını güncelleyin
app.post("/editProfile", async (req, res) => {
  try {
    const { name, username, email, height, weight, password, userimage } =
      req.body;

    // Kullanıcı adını currentUser'dan alın
    const userName = currentUser ? currentUser.name : null;

    // Kullanıcı adına göre veritabanından kullanıcıyı bul
    const user = await UserModel.findOne({ name: userName });

    if (user) {
      // Değişiklikleri uygula
      user.name = name || user.name;
      user.username = username || user.username;
      user.email = email || user.email;
      user.height = height || user.height;
      user.weight = weight || user.weight;
      user.userimage = userimage !== undefined ? userimage : user.userimage;

      // Yeni şifre varsa güncelle
      if (password) {
        user.password = await hashPass(password);
      }

      // Veritabanında güncelle
      await user.save();

      // Güncellenmiş kullanıcı bilgilerini JSON olarak yanıtla
      res.json({
        name: user.name,
        username: user.username,
        email: user.email,
        height: user.height,
        weight: user.weight,
        userimage: user.userimage,
      });
    } else {
      res.status(404).json({ error: "Kullanıcı bulunamadı" });
    }
  } catch (error) {
    console.error("Profil düzenleme hatası:", error);
    res.status(500).json({ error: "İç Sunucu Hatası" });
  }
});

app.post("/addNutrition", async (req, res) => {
  try {
    const { meal, food, calories } = req.body;
    const nutritionData = new NutritionModel({ meal, food, calories });
    await nutritionData.save();
    res.status(201).send("Nutrition data added successfully.");
  } catch (error) {
    console.error("Error adding nutrition data:", error);
    res.status(500).send("Internal Server Error");
  }
});

const nutritionData = new NutritionModel({
  meal: "Sabah",
  food: "Pilav",
  calories: 500,
});

nutritionData
  .save()
  .then(() => {
    console.log("Beslenme verisi başarıyla kaydedildi.");
  })
  .catch((error) => {
    console.error("Hata:", error);
  });

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
