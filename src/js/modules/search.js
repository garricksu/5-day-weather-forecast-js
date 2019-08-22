import { setCurrentWeather } from './current';
import { setMultiWeather } from './multi';
import { fahToKel } from '../utils/utils';

let city = "Sacramento, CA";

// cache DOM
const $searchForm = document.querySelector(".search__form");
const $searchInput = document.querySelector(".search__input");
const $searchCity = document.querySelector(".search__city");
const $spinnerWrapper = document.querySelector(".spinner-wrapper");
const GEOCODE_KEY = "AIzaSyCEGaEj0fmH-mXU3gzH9JvxcRUqG7XDIHs";
const DARKSKY_KEY = "48ca87ce29a97a4234ca46d1e2dbcf70";
const CORS_PROXY = `https://cors-anywhere.herokuapp.com/`


export const initializeSearch = () => {
  updateWeather(city);
  render();
  bindSearchEvents();
}

const bindSearchEvents = () => {
  $searchForm.addEventListener("submit", e => {
    e.preventDefault();
    $searchInput.classList.toggle("search__input--open");
    $searchInput.focus();
    if ($searchInput.value === "") return;
    city = $searchInput.value;
    $searchInput.value = "";
    updateWeather(city)
    render();
  })
}

const updateWeather = async query => {
  $spinnerWrapper.classList.toggle("spinner-wrapper--active")
  const {lat, lng} = await getLatLng(query);
  const weatherData = await getWeatherData(lat, lng);
  $spinnerWrapper.classList.toggle("spinner-wrapper--active")

  const weatherCurrent = weatherData.currently;
  weatherCurrent.temperature = fahToKel(weatherCurrent.temperature);
  setCurrentWeather(weatherCurrent);

  const weatherMulti = weatherData.daily.data.map(elem => {
    elem.temperatureHigh = fahToKel(elem.temperatureHigh);
    elem.temperatureLow = fahToKel(elem.temperatureLow);
    return elem;
  });

  weatherMulti[0].temperature = weatherCurrent.temperature;
  
  setMultiWeather(weatherMulti);
}

const getWeatherData = async(lat, lng) => {
  const reqLink = `${CORS_PROXY}https://api.darksky.net/forecast/${DARKSKY_KEY}/${lat},${lng}`
  const fetchData = await fetch(reqLink);
  const parsed = await fetchData.json();

  return parsed;
}

const getLatLng = async (query) => {
  const reqLink = `https://maps.googleapis.com/maps/api/geocode/json?address=${query}&key=${GEOCODE_KEY}`
  const fetchData = await fetch(reqLink);
  const parsed = await fetchData.json();
  const latLng = {
    lat: parsed.results[0].geometry.location.lat,
    lng: parsed.results[0].geometry.location.lng
  }
  return latLng;
}

const render = () => {
  $searchCity.innerHTML = city;
}