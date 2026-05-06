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

    #timelineHandler;
    #dayHandler

    #curLocationStr;
    #astroData;
    #weatherData;


    constructor()
    {
        //load dayHandler and timelineHandler
        this.#dayHandler = new domDayHandler();
        this.#timelineHandler = new domTimelineHandler();

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
        this.#timelineHandler.update(this.#weatherData, this.#astroData);
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
        //for simplicity, clear all days from daysContainer
        this.clear();


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

const COLUMN_SIZE = '15rem';
const LEFT_MARGIN = '0';

class domTimelineHandler
{
    #timelineTemplate;
    
    #planetsContainer;
    #constelationsContainer;

    constructor()
    {
        this.#timelineTemplate = document.querySelector(".timeline").cloneNode(true);

        //get containers by type
        this.#planetsContainer = document.querySelector(".timeline-holder > .sectionType#planets");
        this.#constelationsContainer = document.querySelector(".sectionType#constelations");

        console.log(this.#planetsContainer);

        this.clear()
    }

    clear()
    {
        //clear timelines from objects stored
        for (let child of this.#planetsContainer.querySelectorAll('.timeline'))
        {
            this.#planetsContainer.removeChild(child);
        }

        //now same for constelations        
        for (let child of this.#constelationsContainer.querySelectorAll('.timeline'))
        {
            this.#constelationsContainer.removeChild(child);
        }
    }

    update(weatherData, astroData)
    {
        //just reset us and rebuild the dom for simplicity of coding
        this.clear();

        console.log(astroData);

        //skip visibility of sun and moon because we don't care about the sun and the moon gets it's indicator anyway
        for (let i = 2; i < astroData.table.rows.length; ++i)
        {
            let planetData = astroData.table.rows[i]
            let curTimeline = this.#timelineTemplate.cloneNode(true);

            //prepare names to be visible
            curTimeline.querySelector(".objectLabel").innerText = planetData.entry.name;

            //mark days when viewable
            let lastEmptyDay = -1;
            let visibleDays = this.getDaysViewable(planetData);

            for (let i = 0; i < planetData.length && i; ++i)
            {
                if (visibleDays[i] == false)
                {
                    //create end for last object, if there
                }
                else //visibleDays[i] == true
                {
                    //create start object
                }
            }

        }
    }

    ifPlanetViewable(planetCell)
    {
        if (planetCell.position.altitude.degrees < 10)
        {
            return false;
        }
        else
        {
            return true;
        }
    }

    getDaysViewable(planet)
    {
        let cells = planet.cells;
        let output = Array(cells.length);

        for (let i = 0; i < cells.length; ++i)
        {
            output[i] = this.ifPlanetViewable(planet.cells[i])
        }
    }
}