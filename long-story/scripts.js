let story = document.querySelector('#story')

window.addEventListener('scroll', function(e)
{
    //Find where we are on the page and see what image is supposed to be there
    curScreen = Math.round(window.scrollY / window.innerHeight);

    if (curScreen < 3) //Title and first page
    {
        story.classList = 'space_img';
    }
    else if (curScreen < 4) //Storybeat 1
    {
        story.classList = 'star_img';
    }
    else if (curScreen < 5)
    {
        story.classList = 'star_img';
    }
    else if (curScreen < 6)
    {
        story.classList = 'space_img';
    }
    else if (curScreen < 7)
    {
        story.classList = 'blackhole_img';
    }
    else if (curScreen < 9)
    {
        story.classList = 'space_img';
    }
    else if (curScreen < 10)
    {
        story.classList = 'voyager_img';
    }
    else if (curScreen < 12)
    {
        story.classList = 'earth_img';
    }
});