(function () {
  const recipeInput = document.getElementById("recipe");
  const output = document.getElementById("output");
  const APP_ID = "3ded7ee0";
  const API_KEY = "35df7a93458677e792b2f856b3ea8da2";

  function fetchRecipe() {
    let ingr = recipeInput.value.split("\n"); // '\n' ile ayrılmış satırlara göre böl
    return fetch(
      `https://api.edamam.com/api/nutrition-details?app_id=${APP_ID}&app_key=${API_KEY}`,
      {
        method: "POST",
        cache: "no-cache",
        headers: {
          "Content-Type": "application/json", // Boşluk karakterini kaldır
        },
        body: JSON.stringify({ ingr }), // 'stringify' fonksiyonu düzeltilmiş
      }
    ).then((response) => response.json());
  }

  document
    .getElementById("recipe-check-form")
    .addEventListener("click", function (e) {
      e.preventDefault();
      fetchRecipe().then((data) => {
        let fragments = [];
        Object.keys(data.totalDaily).forEach((key) => {
          let obj = data.totalDaily[key];
          fragments.push(
            `<table class="table table-bordered">

            <tr>
              <td>${obj.label}</td>
              <td>${obj.quantity.toFixed(2)}${obj.unit}</td>
            </tr>
          </table>`
          
          );
        });

        console.log(data);
        document.getElementById("showTableBtn").addEventListener("click", function () {
          console.log("Button clicked");
        
          let tableHTML = `<table class="table table-bordered">
                            <thead>
                              <tr>
                                <th>Calories</th>

                              </tr>
                              <tr>
                          
                              <th>${data.calories}</th>
                            </tr>
                            </thead>
                            <tbody>`;
        
          // fragments dizisindeki her öğeyi tabloya ekleyin
          fragments.forEach(fragment => {
            tableHTML += `<tr>${fragment}</tr>`;
          });
        
          tableHTML += `</tbody></table>`;
        
          document.getElementById("tableContainer").innerHTML = tableHTML;
          document.getElementById("tableContainer").style.display = "block";
        });
        
        
      });
    });
})();

// Sabah,öğlen,akşam ve ek öğün için butona basıldığı zaman textarea, textarea aşaüısındaki calculate buypnuna basıldıgı zaman da kalori tablosu çıksın

// En sonunda toplam kalori miktarı yazsın yani kullanıcının girdiği kilo-boy-yaş-cinsiyet bilgis,ne göre aldıgı kalori miktaro uygun mu değil mi diye kontrol etsin ve feedback versin!

// BESLENMEYİ BİTİR BUGÜN
// HAFTAYA DA EGZERSİZİ BİTİR VE KULLANICI GİRİŞ ÇIKIŞINA BAŞLA
