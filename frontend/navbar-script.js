document.addEventListener("DOMContentLoaded", () => {
  fetch("/get-current-user")
    .then((response) => response.json())
    .then((data) => {
      const userNameElement = document.getElementById("userName");
      if (userNameElement) {
        userNameElement.textContent = data.name;
      }
    })
    .catch((error) => console.error("Error getting current user:", error));
});
document.addEventListener("DOMContentLoaded", () => {
  const logoutLink = document.getElementById("logoutLink");

  logoutLink.addEventListener("click", (event) => {
    event.preventDefault();

    // Çıkış isteği gönder
    fetch("/logout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        // Çıkış başarılı olduğunda yapılacak işlemler
        console.log(data); // İsteğe bağlı: Sunucudan gelen yanıtı kontrol et
        // Örneğin, kullanıcıyı giriş sayfasına yönlendirme gibi işlemler yapabilirsiniz
        window.location.href = "/login.html"; // Örnek: Kullanıcıyı giriş sayfasına yönlendir
      })
      .catch((error) => console.error("Çıkış işlemi sırasında hata:", error));
  });
});
