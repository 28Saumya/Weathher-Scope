function updateDateTime() {
  const now = new Date();
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  const date = now.toLocaleDateString(undefined, options);
  const time = now.toLocaleTimeString();
  document.getElementById("datetime").innerHTML = `${date} | ${time}`;
}

setInterval(updateDateTime, 1000);
updateDateTime();

async function getWeather() {
  const city = document.getElementById("city").value;
  const result = document.getElementById("result");
  const body = document.getElementById("body");

  if (!city) {
    result.innerHTML = "❌ Enter a city name";
    return;
  }

  result.innerHTML = "⏳ Loading...";

  try {
    const response = await fetch(`/api/weather?city=${city}`);
    const data = await response.json();

    if (data.error) {
      result.innerHTML = "❌ City not found";
      return;
    }

    const temp = data.temperature;

    let theme = "cloudy";
    let icon = "☁️";

    if (temp > 30) {
      theme = "hot";
      icon = "☀️";
    } else if (temp < 15) {
      theme = "cold";
      icon = "❄️";
    }

    body.classList.remove("hot", "cold", "rainy", "cloudy");
    body.classList.add(theme);

    result.innerHTML = `
      <h2>${icon} ${data.city}</h2>
      <p>🌡 Temperature: ${temp} °C</p>
      <p>🌬 Wind Speed: ${data.wind} km/h</p>
    `;
  } catch (error) {
    result.innerHTML = "⚠ Server error";
  }
}

function toggleTheme() {
  const body = document.getElementById("body");
  const btn = document.getElementById("themeToggle");

  if (body.classList.contains("light")) {
    body.classList.remove("light");
    body.classList.add("dark");
    btn.innerHTML = "🌙";
  } else {
    body.classList.remove("dark");
    body.classList.add("light");
    btn.innerHTML = "☀️";
  }
}
