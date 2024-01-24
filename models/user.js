const mongoose = require("mongoose");
const uri =
  "mongodb+srv://sedamercan:sedamercan123@wellness.veohtvh.mongodb.net/";

async function connect() {
  try {
    await mongoose.connect(uri);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error(error);
  }
}
connect();

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
  },
  gender: {
    type: String,
    required: true,
    enum: ["Male", "Female"],
  },
  height: {
    type: Number,
    required: true,
  },
  weight: {
    type: Number,
    required: true,
  },
  age: {
    type: Number,
  },
  verified: {
    type: Boolean,
    default: false,
  },
  verificationCode: {
    type: String,
  },
  userimage: {
    type: String,
  },
  token: {
    type: String,
    required: true,
  },
});

const nutritionSchema = new mongoose.Schema({
  userName: {
    type: String,
    required: true,
  },
  date: { type: Date, default: Date.now },
  quantity: {
    type: String,
    required: true,
  },
  food: {
    type: String,
    required: true,
  },
  calories: {
    type: Number,
    required: true,
  },
  protein: {
    type: Number,
  },
  carbohydrate: {
    type: Number,
  },
  fats: {
    type: Number,
  },
});
const workoutSchema = new mongoose.Schema({
  userName: {
    type: String,
    required: true,
  },
  date: { type: Date, default: Date.now },
  exerciseName: {
    type: String,
    required: true,
  },
  caloriesBurned: {
    type: Number,
    required: true,
  },
  durationMinutes: {
    type: Number,
    required: true,
  },
});

const UserModel = mongoose.model("user", userSchema);
const NutritionModel = mongoose.model("nutrition", nutritionSchema);
const WorkoutModel = mongoose.model("Workout", workoutSchema);

module.exports = { UserModel, NutritionModel, WorkoutModel };
