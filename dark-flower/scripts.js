body = document.querySelector('body');
button = document.querySelector('#darkmode_button');


document.addEventListener('DOMContentLoaded', function()
{
    button.addEventListener('click', function(e)
    {
        if(body.classList.contains('darkmode') )
        {
            body.classList.remove('darkmode');
            button.innerHTML = '&#x263E;';
        }
        else
        {
            body.classList.add('darkmode');
            button.innerHTML = '&#x2600;';
        }
    });
});