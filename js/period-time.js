import { createDOM } from './utils/dom.js';
import { formatDate, formatTemp, formatSpeed } from './utils/format-date.js';


export function periodTimeTemplate({ temp, date, icon, description }, position) {
  const selected = setHTMLViewSelected(position);
  return `
  <li class="dayWeather-item ${selected ? "is-selected" : ""}" id="weather-section-${position.index}-${position.indexDay}">
    <span class="dayWeather-time">${date}</span>
    <img class="dayWeather-icon" height="48" width="48" src="https://openweathermap.org/img/wn/${icon}@2x.png" alt="${description}" rain="">
    <span class="dayWeather-temp">${temp}</span>
  </li>
  `
}

export function createPeriodTime(weather, indexWeatherSection) {

  const dateOptions = {
    hour: 'numeric',
    hour12: true,
  }
  const temp = formatTemp(weather.main.temp);
  const date = formatDate(new Date(weather.dt * 1000), dateOptions);
  const config = {
    temp,
    date,
    icon: weather.weather[0].icon,
    description: weather.weather[0].description,
  }
  const $periodOfTime = createDOM(periodTimeTemplate(config, indexWeatherSection));
  $periodOfTime.addEventListener("click", () => handleSetSelectedClick($periodOfTime.id))
  return $periodOfTime;
}

export function handleSetSelectedClick(selectedContainerId) {
  const $selectedDayWeather = document.querySelector(`#${selectedContainerId}`);
  hidePreviousDayWeatherSelected(selectedContainerId);
  $selectedDayWeather.classList.add("is-selected");
  $selectedDayWeather.setAttribute("aria-selected", true);
  showExtraWeather(selectedContainerId);
}

export function handledAppendExtra(extras, position) {
  const maxtemp = formatTemp(extras.temp_max);
  const mintemp = formatTemp(extras.temp_min);
  const speed = formatSpeed(extras.speed);
  const humidity = Number(extras.humidity);

  const extraWeather = {
    maxtemp,
    mintemp,
    speed,
    humidity,
  }
  const $extraPanel = createDOM(tabExtraWeatherInPanel(extraWeather, position));
  return $extraPanel;
}

function hidePreviousDayWeatherSelected(currentId) {
  const $selectedContainerToHide = document.querySelector(`.dayWeather-item.is-selected:not([id=${currentId}])`);
  if ($selectedContainerToHide) {
    $selectedContainerToHide.removeAttribute("aria-selected");
    $selectedContainerToHide.classList.remove("is-selected");
  }
}

function showExtraWeather(optionSelected) {
  const $dayWeatherSelectedToHide = document.querySelector(".dayWeather-summary:not([hidden])");
  const $currentdayWeatherSelected = document.querySelector(`[aria-labelledby="${optionSelected}"]`);
  if ($dayWeatherSelectedToHide) $dayWeatherSelectedToHide.hidden = true;
  $currentdayWeatherSelected.hidden = false;
}

function setHTMLViewSelected(position) {
  if (position.indexDay === 0 && position.index === 0) return true;
  return false;
}

function tabExtraWeatherInPanel(extras, position) {
  const selected = setHTMLViewSelected(position);
  return `<div class="dayWeather-summary" ${!selected ? "hidden" : ""} aria-labelledby="weather-section-${position.index}-${position.indexDay}">
                <span>Máx: ${extras.maxtemp}</span>
                <span>Mín: ${extras.mintemp}</span>
                <span>Viento: ${extras.speed}</span>
                <span>Humedad: ${extras.humidity}%</span>
            </div>`;
}