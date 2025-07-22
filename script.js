const temperatureField = document.querySelector(".temp");
const locationField = document.querySelector(".location");
const dateandTimeField = document.querySelector(".datetime");
const conditionField = document.querySelector(".condition");
const iconField = document.querySelector(".weather-icon");
const searchField = document.querySelector(".search_area");
const form = document.querySelector(".form");

form.addEventListener("submit", searchForLocation);

let myLocation = "Delhi";

const fetchResults = async (locationQuery) => {
  let url = `https://api.weatherapi.com/v1/current.json?key=1db60e7142ed43d6a54131208250507&q=${locationQuery}&aqi=no`;

  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error("City not found!");

    const data = await res.json();
    console.log(data); // Debug

    let locationName = data.location.name;
    let localtime = data.location.localtime;
    let temp = data.current.temp_c;
    let condition = data.current.condition.text;
    let iconUrl = "https:" + data.current.condition.icon;

    updateDetails(temp, locationName, localtime, condition, iconUrl);
  } catch (error) {
    alert(error.message);
    console.error(error);
  }
};

function updateDetails(temp, locationName, localtime, condition, iconUrl) {
  const [dateStr, timeStr] = localtime.split(" "); // "YYYY-MM-DD", "HH:MM"
  
  // Convert to Date object to extract correct day name
  const dateParts = dateStr.split("-");
  const year = parseInt(dateParts[0]);
  const month = parseInt(dateParts[1]) - 1; // 0-indexed
  const day = parseInt(dateParts[2]);

  const localDate = new Date(year, month, day);
  const dayName = getDayName(localDate.getDay());

  // Update UI
  temperatureField.innerText = `${temp}°C`;
  locationField.innerText = locationName;
  dateandTimeField.innerText = `${dateStr} ${dayName} ${timeStr}`;
  conditionField.innerText = condition;
  iconField.src = iconUrl;
  iconField.alt = `${condition} icon`;
}

function getDayName(number) {
  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  return days[number] || "Unknown";
}

function searchForLocation(e) {
  e.preventDefault();
  const target = searchField.value.trim();
  if (target) fetchResults(target);
}

fetchResults(myLocation);
