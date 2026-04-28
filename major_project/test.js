import { weatherAPI } from "./weather_api.mjs";
import { astronomyAPI } from "./astronomy_api.mjs"; //CURRENTLY BROKEN!  CANNOT USE IN RELEASE BUILD

document.addEventListener("DOMContentLoaded",function()
{
    //DEBUG CODE

    /*
    //Check that we're able to get weather data
    console.log("Weather data retreival test: ")
    let curWeather = new weatherAPI("Seattle");
    curWeather.updateWeatherData().then(function(e)
    {
        console.log(curWeather.getWeatherData());
    })
    //*/

    

    ///*
    // test that we're getting the astronomy api properly
    console.log("Astronomy data retrieval test:")
    let astronomyData = new astronomyAPI();
    console.log("Attempting data retrieval")
    astronomyData.getForecastedAstronomyData(0,0).then(function(data)
    {
        console.log(data)
    })
    //*/
})
