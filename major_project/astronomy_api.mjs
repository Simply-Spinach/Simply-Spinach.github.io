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
        const AUTH_STRING = btoa(`${ASTRONOMY_API_APP_ID}}:${ASTRONOMY_API_SECRET}`);
        const URL_OPTIONS = 
        {
            method:'GET',
            headers:
            {
                'Authorization': ('Basic ' + AUTH_STRING),
                'Content-Type': 'application/json'
            }
        }

        //prep url


        //prep dates
        let curDate = new Date();

        let fromDate = `${curDate.getFullYear()}-${curDate.getMonth()}-${curDate.getDay()}`;
        let toDate = `${curDate.getFullYear() + 1}-${curDate.getMonth()}-${curDate.getDay()}`;

        let curTime = `${curDate.getHours()}%3A${curDate.getMinutes()}%3A${curDate.getSeconds()}`

        let url = `${API_FORECAST_URL}/?latitude=${latitude}&longitude=${longitude}&elevation=0&from_date=${fromDate}&to_date=${toDate}&time=${curTime}`;

        try
        {
            const response = await fetch(url, URL_OPTIONS)
            return JSON(response);
        }
        catch (error)
        {
            //error processing here
            console.error("Unable to retrieve data from getAstronomyData.  (Might be out of daily tokens)")
            return null;
        }
    }
}