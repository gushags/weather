// view.js
import { format } from "date-fns";

let counter = 0;

export function displayWeather(data) {
  console.log(data);
  createToday(data);
  createFuture(data);
  return data;
}

function createToday(data) {
  const city = document.querySelector("#city");
  const temp = document.querySelector("#temp");
  const icon = document.querySelector("#today-icon");
  const wind = document.querySelector("#wind");
  const uvIndex = document.querySelector("#uvindex");
  const address = document.querySelector("#full-address");
  const errorWeather = document.querySelector("#error-weather");
  errorWeather.textContent = "";
  city.textContent = data.address + " ";
  temp.textContent = Math.round(data.currentConditions.temp) + "°F";
  wind.textContent = "Wind: " + data.currentConditions.windspeed + "mph";
  uvIndex.textContent = "UV Index: " + data.currentConditions.uvindex;
  address.textContent = data.resolvedAddress;

  // set icon
  import(`./icons/${data.currentConditions.icon}.svg`).then((source) => {
    icon.src = source.default;
    icon.alt = data.currentConditions.icon;
  });
  if (counter > 0) {
    setEndOfContenteditable(city); // Set cursor on second city and beyond
  }
  console.log(counter);
  counter++;
}

// set cursor at end of city name
export function setEndOfContenteditable(contentEditableElement) {
  let range, selection;
  if (document.createRange) {
    range = document.createRange(); //Create a range (a range is a like the selection but invisible)
    range.selectNodeContents(contentEditableElement); //Select the entire contents of the element with the range
    range.collapse(false); //collapse the range to the end point. false means collapse to end rather than the start
    selection = window.getSelection(); //get the selection object (allows you to change selection)
    selection.removeAllRanges(); //remove any selections already made
    selection.addRange(range); //make the range you have just created the visible selection
  }
}

function createFuture(data) {
  const future = document.querySelector("#future");
  // format dates
  for (let i = 0; i < 5; i++) {
    let futureData = `<div class="day">
    <h3 class="future-date">${format(
      correctDate(data.days[i].datetime),
      "E, LLLL do"
    )}</h3>
    <div class="future-high">
      <h4>HIGH</h4>
      <p>${Math.round(data.days[i].tempmax)}°F</p>
    </div>
    <div class="future-low">
      <h4>LOW</h4>
      <p>${Math.round(data.days[i].tempmin)}°F</p>
    </div>
    <div class="chance-precip">
      <h4>CHANCE OF PRECIP:</h4>
      <p>${data.days[i].precipprob}%</p>
    </div>
    <img src="" class="future-icon" id="future-icon-${i}" alt="" />
  </div>`;

    import(`./icons/${data.days[i].icon}.svg`).then((source) => {
      const iconImg = document.querySelector(`#future-icon-${i}`);
      iconImg.src = source.default;
      iconImg.alt = data.days[i].icon;
    });
    future.insertAdjacentHTML("beforeend", futureData);
  }
}

export function createMap(data) {
  const mapContainer = document.querySelector("#map-container");
  const mapDiv = document.createElement("div");
  mapDiv.id = "map";
  mapContainer.appendChild(mapDiv);

  let map = L.map("map", {
    center: [data.latitude, data.longitude],
    zoom: 13,
    attributionControl: false,
    zoomControl: false,
  });
  map.dragging.disable();
  map.touchZoom.disable();
  map.doubleClickZoom.disable();
  map.scrollWheelZoom.disable();
  map.boxZoom.disable();
  map.keyboard.disable();
  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution:
      '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  }).addTo(map);
}

export function removeMap() {
  const mapContainer = document.querySelector("#map-container");
  mapContainer.replaceChildren();
}

export function removefuture() {
  const future = document.querySelector("#future");
  future.replaceChildren();
}

export function viewError(error) {
  const errorWeather = document.querySelector("#error-weather");
  errorWeather.textContent = `Something went wrong. Please try again.`;
  console.log("Error: " + error);
}

function correctDate(date) {
  let dateArray = date.split("-");
  let year = dateArray[0];
  let month = parseInt(dateArray[1], 10) - 1;
  let day = dateArray[2];
  let correctDate = new Date(year, month, day);
  return correctDate;
}
