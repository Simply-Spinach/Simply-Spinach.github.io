import { weatherAPI } from "./weather_api.mjs";
import { astronomyAPI } from "./astronomy_api.mjs";

document.addEventListener("DOMContentLoaded",function()
{
    //TEST CODE HERE
    
    
    //Check that we're able to get weather data
    console.log("Weather data retreival test: ")
    let curWeather = new weatherAPI("Seattle");
    curWeather.updateWeatherData().then(function(e)
    {
        console.log(curWeather.getWeatherData());
    })

    

    ///*
    // test that we're getting the astronomy api properly
    console.log("Astronomy data retrieval test:")
    let astronomyData = new astronomyAPI();
    astronomyData.getForecastedAstronomyData(0,0).then(function(data)
    {
        console.log(data)
    })
    //*/
})
