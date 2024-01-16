const express = require("express");
const { UserModel, NutritionModel, WorkoutModel } = require("./models/user");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const bcryptjs = require("bcryptjs");
const multer = require("multer");

const upload = multer({ dest: "frontend/" }); // Bu dizini ihtiyaca göre güncelleyin

const path = require("path");
const app = express();
const PORT = 3005;

app.use(express.static(path.join(__dirname, "frontend"))); // Bu satırı ekledik
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "frontend/img")));

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
      return res.status(400).json({ error: "User not found" });
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
      return res.status(400).json({ error: "Invalid password" });
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
    const name = currentUser ? currentUser.name : null;

    // Kullanıcı adına göre veritabanından kullanıcıyı bul
    const user = await UserModel.findOne({ name: name });

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
        userimage: user.userimage,
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
    const {
      name,
      username,
      email,
      height,
      weight,
      oldPassword,
      newPassword,
      confirmPassword,
      userimage,
    } = req.body;

    // Kullanıcı adını currentUser'dan alın
    const userName = currentUser ? currentUser.name : null;

    // Kullanıcı adına göre veritabanından kullanıcıyı bul
    const user = await UserModel.findOne({ name: userName });

    if (user) {
      // Check if old password matches
      user.name = name || user.name;
      user.username = username || user.username;
      user.email = email || user.email;
      user.height = height || user.height;
      user.weight = weight || user.weight;
      user.userimage = userimage !== undefined ? userimage : user.userimage;

      // Yeni şifre varsa güncelle
      if (newPassword && confirmPassword) {
        if (newPassword !== confirmPassword) {
          return res
            .status(400)
            .json({ error: "New password and confirm password do not match" });
        }

        const isPasswordValid = await compare(oldPassword, user.password);
        if (!isPasswordValid) {
          return res.status(400).json({ error: "Invalid old password" });
        }

        user.password = await hashPass(newPassword);
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
    const { quantity, food, calories, protein, carbohydrate, fats } = req.body;

    // Kullanıcı adını currentUser'dan alın
    const userName = currentUser ? currentUser.name : null;

    if (userName) {
      // Beslenme verisini oluşturun
      const nutritionData = new NutritionModel({
        userName, // Kullanıcının adını ekle
        quantity,
        food,
        calories,
        protein,
        carbohydrate,
        fats,
      });

      // Veritabanına kaydetme işlemi
      await nutritionData.save();

      res.status(201).send("Nutrition data added successfully.");
    } else {
      res.status(404).json({ error: "User not found" });
    }
  } catch (error) {
    console.error("Error adding nutrition data:", error);
    res.status(500).send("Internal Server Error");
  }
});

app.get("/getNutritionDataByDate", async (req, res) => {
  try {
    // Kullanıcı adını currentUser'dan alın
    const userName = currentUser ? currentUser.name : null;

    // Kullanıcı adına göre veritabanından kullanıcıyı bul
    const user = await UserModel.findOne({ name: userName });

    if (user) {
      // Kullanıcının besin kayıtlarını çek
      const nutritionData = await NutritionModel.find({ user: user._id }); // _id üzerinden filtrele

      // JSON verilerini doğrudan gönder
      res.json(nutritionData);
    } else {
      res.status(404).json({ error: "User not found" });
    }
  } catch (error) {
    console.error("Error fetching nutrition data:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
// Add this route after your existing routes
app.get("/getNutritionDataByUser", async (req, res) => {
  try {
    const userName = req.query.userName;

    // Find the user by name
    const user = await UserModel.findOne({ name: userName });

    if (user) {
      // Fetch nutrition data for the user
      const nutritionData = await NutritionModel.find({ user: user._id });

      // Return the nutrition data as JSON
      res.json(nutritionData);
    } else {
      res.status(404).json({ error: "User not found" });
    }
  } catch (error) {
    console.error("Error fetching nutrition data:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post("/addWorkout", async (req, res) => {
  try {
    const { exerciseName, caloriesBurned, durationMinutes } = req.body;

    const userName = currentUser ? currentUser.name : null;

    if (userName) {
      // Egzersiz verisini oluşturun, bu noktada user'ın _id'sini kullanın
      const workoutData = {
        userName, // Kullanıcının adını ekle
        exerciseName,
        caloriesBurned,
        durationMinutes,
      };

      // Veritabanına kaydetme işlemi
      const workout = new WorkoutModel(workoutData);
      await workout.save();

      res.status(201).send("Workout data added successfully.");
    } else {
      res.status(404).json({ error: "User not found" });
    }
  } catch (error) {
    console.error("Error adding workout data:", error);
    res.status(500).send("Internal Server Error");
  }
});

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
