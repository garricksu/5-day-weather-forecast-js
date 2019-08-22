import { getAnimatedIcon, toCelFah } from '../utils/utils';

let currentWeather;
let currentDay = new Date().getDay();
let selectedDay;
let unit = "us";

// Cache DOM
const $currentIcon = document.querySelector(".current__icon");
const $currentSummary = document.querySelector(".current__summary");
const $tempNum = document.querySelector(".current__temp-num");
const $windSpeed = document.querySelector(".current__wind span");
const $humidity = document.querySelector(".current__humidity span");
const $precipitation = document.querySelector(".current__precipitation span");

export const setCurrentUnit = newUnit => {
  unit = newUnit;
  render();
}

export const setCurrentWeather = newWeather => {
  currentWeather = newWeather;
  selectedDay = new Date(currentWeather.time * 1000).getDay();
  render();
}

const render = () => {
  $currentIcon.innerHTML = getAnimatedIcon(currentWeather.icon);
  $currentSummary.textContent = currentWeather.summary;
  $windSpeed.textContent = Math.round(currentWeather.windSpeed);
  $humidity.textContent = Math.round(currentWeather.humidity * 100);
  $precipitation.textContent = Math.round(currentWeather.precipProbability * 100);
  $tempNum.innerHTML = (currentDay === selectedDay) ? `${toCelFah(currentWeather.temperature, unit)}&#176;`: `${toCelFah(currentWeather.temperatureHigh, unit)}/${toCelFah(currentWeather.temperatureLow, unit)}&#176;`;
}