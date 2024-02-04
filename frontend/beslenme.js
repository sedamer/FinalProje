async function calculateNutri(index) {
  var apiKey = "b577da81671f0bfc280406a5b9bd1f3b";
  var apiId = "38b6b0bc";
  var recipe = document.getElementById(`recipe${index}`).value;
  var exercises = recipe
    .split("\n")
    .filter((exercise) => exercise.trim() !== "");

  var resultContainer = document.getElementById(`tableContainer${index}`);
  resultContainer.innerHTML = "";

  var totalCalories = 0;

  for (const [i, exercise] of exercises.entries()) {
    var requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-app-id": apiId,
        "x-app-key": apiKey,
      },
      body: JSON.stringify({
        query: exercise,
      }),
    };

    try {
      const response = await fetch(
        "https://trackapi.nutritionix.com/v2/natural/nutrients",
        requestOptions
      );
      const data = await response.json();

      console.log(`API Response for Exercise ${i + 1}:`, data);

      if (data.foods && data.foods.length > 0) {
        var calories = data.foods[0].nf_calories;
        totalCalories += calories;

        // Sunucuya göndermek için kullanılacak veri
        const nutritionData = {
          quantity: data.foods[0].serving_qty,
          food: data.foods[0].food_name,
          calories: calories,
          protein: data.foods[0].nf_protein || 0,
          carbohydrate: data.foods[0].nf_total_carbohydrate || 0,
          fats: data.foods[0].nf_total_fat || 0,
        };

        // Sunucuya POST isteği yap
        const saveRequestOptions = {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(nutritionData),
        };

        const saveResponse = await fetch("/addNutrition", saveRequestOptions);
        const saveResult = await saveResponse.text();

        console.log("Nutrition data added:", saveResult);
        resultContainer.innerHTML += `
          <table style="border: 1px solid black; width:100%;">
            <tr>
              <th>Quantity</th>
              <th>Unit</th>
              <th>Food</th>
              <th>Calories</th>
              <th>Protein(gr)</th>
              <th>Carbohydrate(gr)</th>
              <th>Fats(gr)</th>
            </tr>
            <tr>
              <td>${data.foods[0].serving_qty}</td>
              <td>${data.foods[0].serving_unit}</td>
              <td>${data.foods[0].food_name}</td>
              <td>${calories}</td>
              <td>${data.foods[0].nf_protein}</td>
              <td>${data.foods[0].nf_total_carbohydrate}</td>
              <td>${data.foods[0].nf_total_fat}</td>
            </tr>
          </table>
          <br>`;
      } else {
        resultContainer.innerHTML += `<p>No data available for Exercise ${
          i + 1
        }</p><br>`;
      }

      if (i === exercises.length - 1) {
        resultContainer.innerHTML += `<p>Total Calories Consumed: ${totalCalories}</p>`;
      }
    } catch (error) {
      console.error(`API Error for Exercise ${i + 1}:`, error.message);
    }
  }
}
