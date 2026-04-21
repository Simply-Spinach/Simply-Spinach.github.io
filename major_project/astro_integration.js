//enable to prevent API calls and instead use test data
const DEBUG_MODE = true;

function getAstronomyData()
{
    try
    {
        if (DEBUG_MODE)
        {
            return fetch("./test_astro_data");
        }
        else //use to reduce API calls
        {

        }
    }
    catch (error)
    {
        //error processing here
        console.error("Unable to retrieve data from getAstronomyData.  (Might be out of daily tokens)")
        return null;
    }
}