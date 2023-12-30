// calculateCalories.js

function calculateCalories() {
  var apiKey = "21f646cc531ee89503677fed7e8b1997";
  var apiId = "38b6b0bc";

  var exerciseInput = document.getElementById("exerciseInput").value;
  var durationInput = document.getElementById("durationInput").value;

  var requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-app-id": apiId,
      "x-app-key": apiKey,
    },
    body: JSON.stringify({
      query: `${exerciseInput} for ${durationInput} minutes`,
    }),
  };

  fetch("https://trackapi.nutritionix.com/v2/natural/exercise", requestOptions)
    .then((response) => response.json())
    .then((data) => {
      console.log("API Response:", data);

      var resultContainer = document.getElementById("resultContainer");
      resultContainer.innerHTML = `<p>Exercise: ${data.exercises[0].name}</p>
                                      <p>Calories Burned: ${data.exercises[0].nf_calories}
                                      <p>Duration Minute: ${data.exercises[0].duration_min}</p>
                                      `;
    })
    .catch((error) => {
      console.error("API Error:", error.message);
    });
}
