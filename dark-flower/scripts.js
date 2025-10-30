body = document.querySelector('body');
button = document.querySelector('#darkmode_button');

button.addEventListener('click', function(e)
{
    body.classList.toggle('darkmode');
});