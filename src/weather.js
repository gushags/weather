// weather.js

import { viewError, showLoader } from "./view";

export const getWeather = function getWeatherFromAPI(url) {
  return new Promise(function (resolve, reject) {
    showLoader();
    fetch(
      `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${url}?unitGroup=us&key=CSTMFQVTDD4LWQ6UZC2ZNDBPD&contentType=json`,
      { mode: "cors" }
    ).then((response) => {
      if (response.status == 200) {
        resolve(response.json());
      } else {
        reject(response.status);
      }
    });
  });
};

export function handleError(error) {
  viewError(error);
}
