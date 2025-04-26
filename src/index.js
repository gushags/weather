import "./css-reset-josh.css";
import "./style.css";
import "./weather.js";
import "./view.js";

import { getWeather, handleError } from "./weather";
import {
  displayWeather,
  createMap,
  removefuture,
  removeMap,
  setEndOfContenteditable,
} from "./view.js";

getWeather("Santa Clarita")
  .then(displayWeather)
  .then(createMap)
  .catch(handleError);

const city = document.querySelector("#city");
city.addEventListener("keypress", function (e) {
  if (e.key === "Enter") {
    e.preventDefault();
    const newCity = city.textContent;
    removefuture();
    removeMap();
    getWeather(newCity).then(displayWeather).then(createMap).catch(handleError);
  }
});

const overlay = document.querySelector(".overlay");
overlay.addEventListener("click", () => {
  overlay.classList.add("display-hidden");
  city.focus();
  setEndOfContenteditable(city);
});
