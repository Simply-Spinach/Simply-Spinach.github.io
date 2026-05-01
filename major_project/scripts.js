import {getWeatherFromCoords, getWeatherFromCity} from "./weather_api.mjs"
import {getForecastedAstronomyData} from "./astronomy_api.mjs"

//prepare setup for modifying the dom
document.addEventListener("DOMContentLoaded", function()
{
    // actual executed code goes here
    let domHandler = new domLoader();

    let searchFourm = document.querySelector('form#citySearch');

    console.log(searchFourm);

    searchFourm.addEventListener('submit', function(e)
    {
        e.preventDefault();

        domHandler.setLocationCity(searchFourm['searchbar'].value)
    });
});

//create domLoader class for ease of use
class domLoader
{
    //setup day identifier to copy and paste
    /*
    #dayHolder = document.querySelector("#dayIdentifier");
    #dayInfoTemplate = dayHolder.querySelector(".dayInfo");

    //setup constelations and such to load
    #timelineSections = document.querySelectorAll(' #timeline-holder .section-type');
    #planets = docuemnt.querySelector("#planets");
    #constelations = document.querySelector("#constelations");

    //prep timeline template object
    #timelineTemplate = timelineHolder.querySelector('.timeline');
    */
    //setup api calls

    #timeHandler;
    #dayHandler

    #curLocationStr;
    #astroData;
    #weatherData;


    constructor()
    {
        //load dayHandler and timeHandler
        this.#dayHandler = new domDayHandler();

        //load first data
        this.setLocationGPS();
    }

    setLocationCity(cityName)
    {
        //update weather and pull lat/long from update to input into getForecastedAstronomyData
        getWeatherFromCity(cityName).then((weatherData) => 
        {
            //update current weatherData
            this.#weatherData = weatherData;

            //update forecastAstroData using lat and long pulled from weatherData for convenience
            getForecastedAstronomyData(weatherData.location.lat, weatherData.location.lon, 0 /*No altitude data so setting to 0*/).then((astroData) =>
            {
                //update data from astroData
                this.#astroData = astroData;
                
                //update visuals
                this.update();
            });
        });
    }

    async setLocationGPS()
    {
        //get current location
        if (navigator.geolocation)
        {
            navigator.geolocation.getCurrentPosition((location) =>
            {
                console.log(location);
                this.#curLocationStr = `${location.coords.latitude}, ${location.coords.longitude}`;

                //load weather data
                getWeatherFromCoords(location.coords.latitude, location.coords.longitude).then((e) =>
                {
                    this.#weatherData = e;
                    console.log(this.#weatherData);

                    //load astro data
                    getForecastedAstronomyData(location.coords.latitude, location.coords.longitude, location.coords.altitude).then((e) =>
                    {
                        console.log(e);
                        this.#astroData = e;

                        //update visuals
                        this.update();
                    });
                });

            });



        }
        else
        {
            console.warn("GPS request failed.  Remember to implement backup method (like IP?)")
        }
    }

    update()
    {
        this.#dayHandler.update(this.#weatherData, this.#astroData);
    }
}

const DAY_NODE_CONTAINER_QUERY = '#dayIdentifier'
const DAY_NODE_QUERY = '.dayInfo';
const DAY_NODE_DAY_NAME_QUERY = '.day';

class domDayHandler
{
    #daysContainer;
    #dayTemplate;

    constructor()
    {
        this.#daysContainer = document.querySelector(DAY_NODE_CONTAINER_QUERY);
        this.#dayTemplate = this.#daysContainer.querySelector(DAY_NODE_QUERY);

        this.#daysContainer.removeChild(this.#dayTemplate);
    }

    //Clears all days from the daysContainer
    clear()
    {
        for (let child of this.#daysContainer.children)
        {
            if (child.classList.contains(DAY_NODE_QUERY)) //is a child we should remove
            {
                this.#daysContainer.removeChild(child);
            }
        }
    }

    update(weatherData, astroData)
    {
        //for simplicity, clear all dayss from daysContainer
        this.clear();

        //console.log(weatherData);
        console.log(astroData);

        let weatherForecastAvailable = weatherData.forecast.forecastday.length;
        let astroForecastAvailable = astroData.data.table.header.length; /* I really can't figure out how to do the math here and I don't want to worry about it*/;

        for (let i = 0; i < astroForecastAvailable; ++i)
        {
            //create day to add to daysContainer
            let currentTime = new Date();
            let curDay = this.#dayTemplate.cloneNode(true);
            let curAstro = astroData.data.table[i];
            //fill with relevant information
            
            //TODO: UPDATE SRC OF MOON PHASE TO BE AN ACURATE IMAGE
            //curDay.querySelector('img.moonPhase').src = ``;
            
            //set day
            if (i == 0)
            {
                curDay.querySelector(DAY_NODE_DAY_NAME_QUERY).innerText = 'Today';
            }
            else if (i == 1)
            {
                curDay.querySelector(DAY_NODE_DAY_NAME_QUERY).innerText = "Tomorrow";
            }
            else if (i < 7) //same week
            {
                let daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
                let selectWeekDay = (currentTime.getDay() + i) % 6;
                
                curDay.querySelector(DAY_NODE_DAY_NAME_QUERY).innerText = daysOfWeek[selectWeekDay];
            }
            else //just throw out the date
            {
                let nodeTime = currentTime;
                nodeTime.setDate(currentTime.getDate() + i);
                
                curDay.querySelector(DAY_NODE_DAY_NAME_QUERY).innerText = `${nodeTime.getMonth() + 1}-${nodeTime.getDate()}-${nodeTime.getFullYear()}`
            }

            //update sunset and sunrise
            if (i < weatherForecastAvailable - 1)
            {
                curDay.querySelector('.timeframe .sunset').innerText = weatherData.forecast.forecastday[i].astro.sunset;
                curDay.querySelector('.timeframe .sunrise').innerText = weatherData.forecast.forecastday[i + 1].astro.sunrise;
            }
            else if (i == weatherForecastAvailable - 1)
            {
                curDay.querySelector('.timeframe').innerHTML = `<span class="sunset">${weatherData.forecast.forecastday[i].astro.sunset}</span>`;
            }
            else
            {
                curDay.querySelector('.timeframe').innerHTML = '';
            }
            
            
            //Add to DOM
            this.#daysContainer.appendChild(curDay);
        }
    }
}