navbar = document.querySelector('.navbar');
navburger = document.querySelector('.navburger')
body = document.querySelector('body')
navopen = false;

// create the thing for the sidebar to collapse and expand on mobile
document.addEventListener('DOMContentLoaded', function()
{
    navburger.addEventListener('click', function(e)
    {
        //open navbar
    });

    document.addEventListener('click', function(e)
    {
        if(!e.currentTarget in navbar)
        {
            //close navbar and open
        }
    })
});