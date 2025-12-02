navbar = document.querySelector('.navbar')
navburger = document.querySelector('.navburger')
body = document.querySelector('body')
nav = document.querySelector('nav')

navopen = false;

// create the thing for the sidebar to collapse and expand on mobile
document.addEventListener('DOMContentLoaded', function()
{
    navburger.addEventListener('click', function(e)
    {
        //open navbar
        nav.classList.toggle('mob_navbar_open')
    });
});