//BELOW CODE DOES NOT WORK (Should be server side?)
import {ASTRONOMY_API_APP_ID, ASTRONOMY_API_SECRET} from './API_KEYS.mjs'

//enable to prevent API calls and instead use test data
const DEBUG_MODE = true;

const API_FORECAST_URL = "https://api.astronomyapi.com/api/v2/bodies/positions"

//const AUTH_SECRET = 

export class astronomyAPI
{
    #latitude;
    #longitude;

    async getForecastedAstronomyData(latitude, longitude)
    {
        //asign consts and vars
        const AUTH_STRING = btoa(`${ASTRONOMY_API_APP_ID}:${ASTRONOMY_API_SECRET}`);
        const URL_OPTIONS = 
        {
            method:'GET',
            headers:
            {
                'Authorization': 'Basic ' + AUTH_STRING,
                'Content-Type': 'application/json'
            }
        }   
        
        //prep dates
        let fullDate = new Date();
        let curMonth = fullDate.getMonth();
        if (curMonth < 10)
        {
            curMonth = '0' + String(curMonth);
        }
        let curDay = fullDate.getDay();
        if (curDay < 10)
        {
            curDay = '0' + String(curDay);
        }
        
        //prepare for the future
        let toMonth = fullDate.getMonth() + 1;
        if (toMonth < 10)
        {
            toMonth = '0' + String(toMonth);
        }

        //set our from and to dates
        let fromDate = `${fullDate.getFullYear()}-${curMonth}-${curDay}`;
        let toDate = `${fullDate.getFullYear()}-${toMonth}-${curDay}`;
        
        let curTime = `${fullDate.getHours()}%3A${fullDate.getMinutes()}%3A${fullDate.getSeconds()}`
        
        //prep url
        let url = `${API_FORECAST_URL}/?latitude=${latitude}&longitude=${longitude}&elevation=1&from_date=${fromDate}&to_date=${toDate}&time=${curTime}`;

        try
        {
            console.log("Attempting via URL: " + url);
            const response = await fetch(url, URL_OPTIONS)
            console.log("Response get!")
            if (response.ok)
            {
                return response.json();
            }
            else
            {
                console.error("Response was not ok")
                console.error("Response code: " + response.statusText)
                console.error(await response.text())
                return null;
            }
        }
        catch (error)
        {
            //error processing here
            console.error()
            return null;
        }
    }
}