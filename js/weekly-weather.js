import { getWeeklyWeather } from './services/weather.js';
import { getLatLon } from './geolocation.js';
import { formatWeekList } from './utils/format-date.js';
import { createDOM } from './utils/dom.js';
import { createPeriodTime, handledAppendExtra } from './period-time.js';
import draggable from './draggable.js';


function tabPanelTemplate(id) {
  return `
    <div class="tabPanel" tabindex="0" aria-labelledby="tab-${id}">
      <div class="dayWeather" id="dayWeather-${id}">
        <ul class="dayWeather-list" id="dayWeather-list-${id}">
        </ul>
      </div>
    </div>
  `
}

function createTabPanel(id, extras) {
  const $panel = createDOM(tabPanelTemplate(id, extras));

  if (id > 0) {
    $panel.hidden = true;
  }
  return $panel;

}

function configWeeklyWeather(weeklist) {
  // const $container = document.querySelector('.weeklyWeather');
  const $container = document.querySelector('.tabs');

  // creamos panel
  weeklist.forEach((day, index) => {
    const $panel = createTabPanel(index);
    $container.append($panel);

    day.forEach((weather, indexDay) => {
      $panel.querySelector('.dayWeather-list').append(createPeriodTime(weather, { index, indexDay }));
      $panel.querySelector(".dayWeather").append(handledAppendExtra({ ...weather.main, ...weather.wind }, { index, indexDay }));
    })
  })

}

export default async function weeklyWeather() {
  const $container = document.querySelector('.weeklyWeather');
  const { lat, lon, isError } = await getLatLon();

  if (isError) return console.log('Hubo un error al ubicar');

  const { isError: weeklyWeatherError, data: weather } = await getWeeklyWeather(lat, lon);

  if (weeklyWeatherError) return console.log('Oh! Ha ocurrido un error trayendo el pronóstico del clima');

  const weeklist = formatWeekList(weather.list);
  configWeeklyWeather(weeklist);
  draggable($container);
}