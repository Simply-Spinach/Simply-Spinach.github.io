body = document.querySelector('body');
button = document.querySelector('#darkmode_button');


document.addEventListener('DOMContentLoaded', function()
{
    button.addEventListener('click', function(e)
    {
        if(body.classList.contains('darkmode') )
        {
            setLightMode();
        }
        else
        {
            setDarkMode();
        }
    });
});

//Modifies website to enable dark mode
function setDarkmode()
{
    body.classList.add('darkmode');
    button.contains = '&#x2600;';
}

void setLightMode()
{
    body.classList.remove('darkmode');
    button.contains = '&#x263E;';
}