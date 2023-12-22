//egzersiz js api çekme
const express = require("express");
const fetch = require("node-fetch");

const app = express();

app.use(express.static("public")); // Public klasöründeki dosyaları kullanmak için

app.get("/getExerciseData", async (req, res) => {
  const { query, duration_min } = req.query;
  const nutritionixApiUrl = `https://api.nutritionix.com/v1_1/exercise`;

  // Nutritionix API anahtarları
  const appId = "38b6b0bc";
  const appKey = "21f646cc531ee89503677fed7e8b1997";
  const exerciseParams = {
    appId,
    appKey,
    query,
    duration_min,
  };

  try {
    const response = await fetch(
      `${nutritionixApiUrl}?${new URLSearchParams(exerciseParams)}`
    );
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error("Error fetching exercise data:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
