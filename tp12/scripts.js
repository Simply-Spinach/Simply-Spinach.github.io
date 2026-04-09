const WEATHER_API_KEY = 'e743aae5077a47e79e1231340260704';
const WEATHER_API_URL = `https://api.weatherapi.com/v1/forecast.json?key=${WEATHER_API_KEY}`;
const IP_API_URL = 'https://api.ipify.org/?format=json';

let city;
let numDays = 3;

const WEATHER_API_URL_OPTIONS = {
	method: 'GET'
};

async function getIPData()
{
    let url = IP_API_URL;

    try{
        const response = await fetch(url, {method:'GET'});
        if(response.ok)
        {
            const result = await response.json();
            return result;
        }
        else{
            throw(response.status);
        }
    }
    catch (error)
    {

    }
}

//Gets weatherData from a city, with a dayCount forecast
async function getWeatherData(city, dayCount) {
    
    //cook city for 
    city = city.trim();
    city = city.replace(/[!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~]/g, '');
    city = city.replaceAll(' ', '-');

    return await rawInputGetWeatherData(city,dayCount);
}

//Same as getWeatherData but doesn't cook the city input
async function rawInputGetWeatherData(city, dayCount)
{
    //prep local url
    let url = WEATHER_API_URL;
    url += `&q=${city}&days=${dayCount}`;

    //get response
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

//load data
let ipAPIPromise = getIPData();
let defaultWeatherPromise = null;

document.addEventListener("DOMContentLoaded", function()
{
    //create display object
    let weatherDisplay = new WeatherDisplay(null);

    //load data needed for weatherDisplay (async)
    ipAPIPromise.then(function(locationData)
    {
        console.log(locationData);
        defaultWeatherPromise = rawInputGetWeatherData(locationData.ip, numDays);
        defaultWeatherPromise.then(function(weatherData)
        {
            console.log(weatherData);
            weatherDisplay.SetWeather(weatherData);
            weatherDisplay.DisplayWeather(0);
        });
    });

    //wire up the search bar
    let searchBar = document.querySelector("nav form");
    searchBar.addEventListener("focus", function(e)
    {
        e.preventDefault();

        document.querySelector('body').classList.add('search_mode');
    });
    searchBar.addEventListener("submit", function(e)
    {
        //prevent submitting to server
        e.preventDefault();

        //remove search_mode from body
        document.querySelector('body').classList.remove('search_mode');
        
        //extract the search query
        let searchQuery = searchBar['searchbar'].value;
        
        //update display to have new data from server
        getWeatherData(searchQuery, numDays).then(function(weatherData)
        {
            weatherDisplay.SetWeather(weatherData);
            weatherDisplay.UpdateDisplay();
        });
    });

    //setup weather tabs
    let tabs = document.querySelectorAll("ol.day_tabs > li > button");
    
    for (let i = 0; i < tabs.length; ++i)
    {
        //easy to access current tab
        let tab = tabs[i];
        tab.addEventListener('click', function()
        {
            weatherDisplay.DisplayWeather(i);
        });
    }

});

//
class WeatherDisplay
{
    //set day
    #selectedDay = 0;

    //access DOM objects
    #display = document.querySelector('#weatherInfo');

    #curCity = document.querySelector('main h1');

    #tabContainer = document.querySelector("main #day_tabs");

    #condition = this.#display.querySelector('#condition');
    #conditionImg = document.querySelector('img#condition_img');

    #tempreture = this.#display.querySelector('#temp');
    #tempretureHigh = this.#display.querySelector('#temp_high');
    #tempretureLow = this.#display.querySelector('#temp_low');
    #tempretureUnit = new SimpleUnitHandler(this.#display.querySelectorAll("#temp_unit"), ['F', 'C']);
    
    #compass = this.#display.querySelector('#wind_compass');
    #compassArrow = this.#compass.querySelector('.arrow');
    #compassDirectionIndicator = this.#compass.querySelector('.arrow');

    #windSpeed = this.#display.querySelector('#wind_speed');
    #speedUnit = new SimpleUnitHandler(this.#display.querySelectorAll('#speed_unit'), ['mph','kph']);

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

        //reload
    }

    DisplayWeather(day)
    {
        this.#selectedDay = day;
        this.UpdateDisplay();
    }

    UpdateDisplay()
    {
        if(this.#selectedDay == 0)
        {
            this.#DisplayWeatherCurrent();
        }
        else
        {
            this.#DisplayWeatherForecast(this.#selectedDay);
        }
    }

    //Set all weather shown to that of current data
    #DisplayWeatherCurrent()
    {
        let selectedWeather = this.#weatherInfo.current;
        let selectedForecast = this.#weatherInfo.forecast.forecastday[0].day;

        //update styling
        this.#display.classList.remove('forecast_mode');
        this.#display.classList.add('current_Mode');

        //update everything related to weatherData
            
        //update title
        this.#UpdateTitle();

        //update condition
        this.#condition.textContent = selectedWeather.condition.text;
        console.log(this.#conditionImg);
        console.log(selectedWeather.condition.icon);
        this.#conditionImg.src = selectedWeather.condition.icon;

        //set current tempreture
        switch (this.#tempretureUnit.getUnit())
        {
            case 'F':
                this.#tempreture.textContent = selectedWeather.temp_f;
                this.#tempretureHigh.textContent = selectedForecast.maxtemp_f;
                this.#tempretureLow.textContent = selectedForecast.mintemp_f;
                break;
            case 'C':
                this.#tempreture.textContent = selectedWeather.temp_c;
                this.#tempretureHigh.textContent = selectedForecast.maxtemp_c;
                this.#tempretureLow.textContent = selectedForecast.mintemp_c;
                break;
            case 'K':
                this.#tempreture.textContent = selectedWeather.temp_c + 274.15; //incase I decide to enable it
                this.#tempretureHigh.textContent = selectedForecast.maxtemp_c + 274.15;
                this.#tempretureLow.textContent = selectedForecast.mintemp_c + 274.15;
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
    #DisplayWeatherForecast(day)
    {
        this.#display.classList.remove('current_mode');
        this.#display.classList.add('forecast_mode');

        //get information required for the day
        let allForecasted = this.#weatherInfo.forecast.forecastday;

        if (day > allForecasted.length)
        {
            console.warn("DisplayWeatherForecast doesn't have the selected day stored.  Reverting to closest available day");
            dat = allForecasted.length;
        } //quick safety to ensure day is correct length
        let selectedWeather = allForecasted[day].day;

        //update title
        this.#UpdateTitle();

        //update condition
        console.log(selectedWeather.condition);
        this.#condition.textContent = selectedWeather.condition.text;
        this.#conditionImg.src = selectedWeather.condition.icon;

        //set temp readings
        switch(this.#tempretureUnit.getUnit())
        {
            case 'F':
                this.#tempreture.textContent = selectedWeather.avgtemp_f;
                this.#tempretureHigh.textContent = selectedWeather.maxtemp_f;
                this.#tempretureLow.textContent = selectedWeather.mintemp_f;
                break;
            case 'C':
                this.#tempreture.textContent = selectedWeather.avgtemp_c;
                this.#tempretureHigh.textContent = selectedWeather.maxtemp_c;
                this.#tempretureLow.textContent = selectedWeather.mintemp_c;
                break;
            case 'K':
                this.#tempreture.textContent = selectedWeather.avgtemp_c + 274.15;
                this.#tempretureHigh.textContent = selectedWeather.maxtemp_c + 274.15;
                this.#tempretureLow.textContent = selectedWeather.mintemp_c + 274.15;
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
        let city = this.#weatherInfo.location.name;
        let region = this.#weatherInfo.location.region;
        if (region == null) //noticed "The Key" doesn't have one so I'm trying this
        {
            region = this.#weatherInfo.location.country;
        }

        if (region != null && region != '') //default (yes, there's still a chance here.  Look up "The Key", which somehow doesn't have a region, nor country)
        {            
            //update title (easy)
            document.title = `Weather: ${city}, ${region}`;

            //update actual text (not so easy)
            this.#curCity.innerHTML = `${city}<span id='region'>, ${region} </span>`;
        }
        else // region == null
        {
            //update title (easy)
            document.title = `Weather: ${city}`;

            //update actual text (not so easy)
            this.#curCity.innerHTML = `${city}`;
        }
    }
}

//simple controller for showing units (and toggling them)
class SimpleUnitHandler
{
    #domObjects;
    #units;
    #currentUnitID = 0;

    //Constructs dom object with a read, and units to swap between
    constructor(domObject, units)
    {
        this.#domObjects = domObject;
        this.#units = units;
    }

    nextUnit()
    {
        //goto next in sequence
        ++this.#currentUnitID;
        this.#currentUnitID %= this.#units.length;

        //update property text on all identifiers
        for (let domObject in this.#domObjects)
        {
            domObject.textContent = getUnit;
        }
    }

    getUnit()
    {
        return this.#units[this.#currentUnitID];
    }
}