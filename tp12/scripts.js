const API_KEY = 'e743aae5077a47e79e1231340260704';
const WEATHER_API_URL = `https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}`;

let city = 'Seattle'

const WEATHER_API_URL_OPTIONS = {
	method: 'GET'
};

async function getWeatherData(city) {
    //prep local url
    let url = WEATHER_API_URL;

    //convert city to something the api can read
    city = city.trim();
    city = city.replace(/[!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~]/g, '');
    city = city.replaceAll(' ', '-');

    url += `&q=${city}`;

    try {
        const response = await fetch(url, WEATHER_API_URL_OPTIONS);
        if (response.ok) {
            const result = await response.json();
            return result;
        } else {
            throw(response.status);
        }
    } catch (error) {

    }
}

//load data early (to prevent pop-in of the elements loading)
let apiPromise = null;
///*
//disable for testing (reduces API calls)
apiPromise = getWeatherData(city);
//*/

document.addEventListener("DOMContentLoaded", function()
{
    //access DOM objects
    let weatherDisplay = new WeatherDisplay(null);
    
    //use api promise system to fill in data required
    apiPromise.then(function(weatherData)
    {
        weatherDisplay.SetWeather(weatherData);

        //setup weather tabs
        let tabs = document.querySelectorAll("ol.day_tabs > li > button");
        
        for (let i = 0; i < tabs.length; ++i)
        {
            //easy to access current tab
            let tab = tabs[i];
            
            if (i == 0)
            {
                tab.addEventListener('click', function()
                {
                    weatherDisplay.DisplayWeatherCurrent();
                });
            }
            else
            {
                const day = i - 1;
                tab.addEventListener('click', function()
                {
                    weatherDisplay.DisplayWeatherForecast(day);
                });
            }
        }

        //setup default state
        weatherDisplay.DisplayWeatherCurrent();

    }, function(error)
    {
        throw Error("failed to retrieve data from API: " + error);
    });

});

//
class WeatherDisplay
{
    //access DOM objects
    #display = document.querySelector('#weatherInfo');

    #curCity = document.querySelector('main h1');

    #tabContainer = document.querySelector("main #day_tabs");

    #tempreture = this.#display.querySelector('#temp');
    #tempretureUnit = new SimpleUnitHandler(this.#display.querySelector("#temp_unit"), ['F', 'C']);
    
    #compass = this.#display.querySelector('#wind_compass');
    #compassArrow = this.#compass.querySelector('.arrow');
    #compassDirectionIndicator = this.#compass.querySelector('.arrow');

    #windSpeed = this.#display.querySelector('#wind_speed');
    #speedUnit = new SimpleUnitHandler(this.#display.querySelector('#speed_unit'), ['mph','kph']);

    #humidity = this.#display.querySelector('#humidity');

    #weatherInfo;

    constructor(weatherData)
    {
        this.#weatherInfo = weatherData;
    }

    //Sets area of weather readings
    async SetWeather(weatherData)
    {
        //clean data
        this.#weatherInfo = weatherData;
    }

    //Set all weather shown to that of current data
    DisplayWeatherCurrent()
    {
        let selectedWeather = this.#weatherInfo.current;

        //update styling
        this.#display.classList.remove('forecast_mode');
        this.#display.classList.add('current_Mode');

        //update everything related to weatherData
            
        //update title
        this.#UpdateTitle();

        //set current tempreture
        switch (this.#tempretureUnit.getUnit())
        {
            case 'F':
                this.#tempreture.textContent = selectedWeather.temp_f;
                break;
            case 'C':
                this.#tempreture.textContent = selectedWeather.temp_c;
                break;
            case 'K':
                this.#tempreture.textContent = selectedWeather.temp_c + 274.15; //incase I decide to enable it
                break;
            default:
                this.#tempreture.textContent = 'n/a (an error has occured getting this data)';
                break;
        }

        //setup compass
        let rotation = selectedWeather.wind_degree;
        this.#compassArrow.style.transform = `rotateZ(${rotation}deg)`;
        this.#compassDirectionIndicator.textContent = selectedWeather.wind_dir;

        //setup speed unit
        switch (this.#speedUnit.getUnit())
        {
            case 'mph':
                this.#windSpeed.textContent = selectedWeather.wind_mph;
                break;
            case 'kph':
                this.#windSpeed.textContent = selectedWeather.wind_kph;
                break;
            case 'mach':
                this.#windSpeed.textContent = selectedWeather.wind_mph * 1192.68;
                break;
        }

        //set humidity
        this.#humidity.textContent = selectedWeather.humidity;
    }

    //set weather shown to forecast of day
    DisplayWeatherForecast(day)
    {
        this.#display.classList.remove('current_mode');
        this.#display.classList.add('forecast_mode');

        //get information required for the day
        let allForecasted = this.#weatherInfo.forecast.forecastday;
        console.log(allForecasted);

        day %= allForecasted.length; //quick safety to ensure day is correct length
        let selectedWeather = allForecasted[day].day;

        //update title
        this.#UpdateTitle();

        //set temp readings
        switch(this.#tempretureUnit.getUnit())
        {
            case 'F':
                this.#tempreture.textContent = selectedWeather.avgtemp_f;
                break;
            case 'C':
                this.#tempreture.textContent = selectedWeather.avgtemp_c;
                break;
            case 'K':
                this.#tempreture.textContent = selectedWeather.avgtemp_c + 274.15;
                break;
        }

        //set wind speed
        switch(this.#speedUnit.getUnit())
        {
            case "mph":
                this.#windSpeed.textContent = selectedWeather.maxwind_mph;
                break;
            case "kph":
                this.#windSpeed.textContent = selectedWeather.maxwind_kph;
                break;
            default:
                this.#windSpeed.textContent = "n/a (an error has occured)";
                break;
        }

        //set humidity
        this.#humidity.textContent = selectedWeather.avghumidity;
    }

    #UpdateTitle()
    {
        //update title (easy)
        document.title = `Weather: ${this.#weatherInfo.location.name}, ${this.#weatherInfo.location.region}`;

        //update actual text (not so easy)
        this.#curCity.innerHTML = `${this.#weatherInfo.location.name}<span id='region'>, ${this.#weatherInfo.location.region} </span>`;
    }

    
}

//simple controller for showing units (and toggling them)
class SimpleUnitHandler
{
    #domObject;
    #units;
    #currentUnitID = 0;

    //Constructs dom object with a read, and units to swap between
    constructor(domObject, units)
    {
        this.#domObject = domObject;
        this.#units = units;
    }

    nextUnit()
    {
        //goto next in sequence
        ++this.#currentUnitID;
        this.#currentUnitID %= this.#units.length;

        //update property text on all identifiers
        this.#domObject.textContent = getUnit;
    }

    getUnit()
    {
        return this.#units[this.#currentUnitID];
    }
}