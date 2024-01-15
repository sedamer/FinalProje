// calculateCalo
function calculateCalories() {
  var apiKey = "21f646cc531ee89503677fed7e8b1997";
  var apiId = "38b6b0bc";
  var exerciseInput = document.getElementById("exerciseInput").value;
  var exercises = exerciseInput
    .split("\n")
    .filter((exercise) => exercise.trim() !== "");

  var resultContainer = document.getElementById("resultContainer");
  resultContainer.innerHTML = "";

  var totalCalories = 0;

  exercises.forEach((exercise, index) => {
    var requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-app-id": apiId,
        "x-app-key": apiKey,
      },
      body: JSON.stringify({
        query: `${exercise} for 1 minute`, // Assuming each exercise is done for 1 minute
      }),
    };

    fetch(
      "https://trackapi.nutritionix.com/v2/natural/exercise",
      requestOptions
    )
      .then((response) => response.json())
      .then((data) => {
        console.log(`API Response for Exercise ${index + 1}:`, data);

        if (data.exercises && data.exercises.length > 0) {
          var calories = data.exercises[0].nf_calories;
          totalCalories += calories;
          resultContainer.innerHTML += `
          <table style="border :1px solid black; width:100%;">
            <tr>
              <th>Exercise</th>
              <th>Calories Burned</th>
              <th>Duration Minutes</th>
            </tr>
            <tr>
              <td>${data.exercises[0].name}</td>
              <td>${calories}</td>
              <td>${data.exercises[0].duration_min}</td>
            </tr>
          </table>
          <br>`;

          // Save the workout to the database
          saveWorkoutToDatabase({
            exerciseName: data.exercises[0].name,
            caloriesBurned: calories,
            durationMinutes: data.exercises[0].duration_min,
          });
        } else {
          resultContainer.innerHTML += `<p>No data available for Exercise ${
            index + 1
          }</p><br>`;
        }
        // Döngü bittiğinde toplam kaloriyi göster
        if (index === exercises.length - 1) {
          resultContainer.innerHTML += `<p>Total Calories Burned: ${totalCalories}</p>`;
        }
      })
      .catch((error) => {
        console.error(`API Error for Exercise ${index + 1}:`, error.message);
      });
  });
}

function saveWorkoutToDatabase(workoutData) {
  fetch("/addWorkout", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(workoutData),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log("Workout data saved to database:", data);
    })
    .catch((error) => {
      console.error("Error saving workout to database:", error.message);
    });
}
