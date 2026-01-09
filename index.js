import express from "express";
import axios from "axios";
import cors from "cors";

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.static("public"));

// Convert city → lat/lon → weather
app.get("/api/weather", async (req, res) => {
  const city = req.query.city;

  if (!city) {
    return res.json({ error: "City required" });
  }

  try {
    // 1️⃣ Get latitude & longitude
    const geoURL = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}`;
    const geoResponse = await axios.get(geoURL);

    if (!geoResponse.data.results || geoResponse.data.results.length === 0) {
      return res.json({ error: "City not found" });
    }

    const { latitude, longitude, name } = geoResponse.data.results[0];

    // 2️⃣ Get weather
    const weatherURL = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`;
    const weatherResponse = await axios.get(weatherURL);

    res.json({
      city: name,
      temperature: weatherResponse.data.current_weather.temperature,
      wind: weatherResponse.data.current_weather.windspeed
    });

  } catch (error) {
    console.log(error.message);
    res.json({ error: "Weather fetch failed" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
