body = document.querySelector('body');
button = document.querySelector('#darkmode_button');


document.addEventListener('DOMContentLoaded', function()
{
    button.addEventListener('click', function(e)
    {
        body.classList.toggle('darkmode');
    });
});