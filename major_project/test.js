
document.addEventListener('DOMContentLoaded', function()
{
    //retrieved from https://stackoverflow.com/questions/20256760/javascript-console-log-to-html
    //supposed to output console log to the DOM so I don't need to open up the actual code
    var old = console.log;
    var logger = document.querySelector('body');
    console.log = function (message) {
        if (typeof message == 'object') {
            logger.innerHTML += (JSON && JSON.stringify ? JSON.stringify(message) : message) + '<br />';
        } else {
            logger.innerHTML += message + '<br />';
        }
    }

    //just edited versions of what's above
    console.error = function (message) {
        if (typeof message == 'object') {
            logger.innerHTML += '<span class="error"> ' + (JSON && JSON.stringify ? JSON.stringify(message) : message) + '</span> <br />';
        } else {
            logger.innerHTML += '<span class="error">' + message + '</span> <br />';
        }
    }
    console.warn = function (message) {
        if (typeof message == 'object') {
            logger.innerHTML += '<span class="warning"> ' + (JSON && JSON.stringify ? JSON.stringify(message) : message) + '</span> <br />';
        } else {
            logger.innerHTML += '<span class="warning">' + message + '</span> <br />';
        }
    }

    //enter test code here
    console.log("Hello world!  This is a test");
    console.error("this is totally a real error");
    console.warn("This warning doesn't matter");
});