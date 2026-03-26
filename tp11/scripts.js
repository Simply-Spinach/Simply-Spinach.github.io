window.addEventListener("load", function()
{
    // ----------------------------------------------------------------------------------- Get game elements

    //Contants
    const CARD_TYPES = 8;

    //template object for creating more cards
    let cardArea = document.querySelector("#game_grid");
    let cardTemplate = document.querySelector("#game_grid .card");
    let cards = [cardTemplate]; //Defined later to contain array of all game cards in game

    //additional variables
    let previousCard = null; //to be filled with the other card that was previously flipped, or null
    let turnCount = 0;
    
    function start(numCards)
    {
        //ensure valid number of cards so that every card has a pair
        if (numCards % 2 == 1)
        {
            throw new Error("function start requires an even amount of cards for a game to work");
        }

        //load all cards into the game (leave blank for now)
        for (let i = 1; i < numCards; ++i)
        {
            //put card in grid
            let curCard = cardTemplate.cloneNode(true);
            cardArea.append(curCard);
        }

        //update cards
        cards = Array.from(cardArea.querySelectorAll(".card"));


        //randomize cards to contain faces
        let unregisteredCards = cards;   //unregistered cards holds all the cards that currently haven't been used
        //console.log(unregisteredCards);
        while (unregisteredCards.length > 0)
        {
            //create random card to select
            let curCard = unregisteredCards.splice(Math.floor(Math.random() * unregisteredCards.length),1)[0];
            //console.log(curCard);
            let faceNum = (Math.floor(unregisteredCards.length / 2) % CARD_TYPES) + 1; //Note that we may have multiple sets of the same type if we don't have enough faces

            //assign card face
            curCard.querySelector('.face').classList.add("face_" + faceNum); 

            //add trigger to card on click
            curCard.addEventListener("click", function()
            {
                onCardClick(curCard);
            });
        }

        //game should be ready to run at this point
    }

    function onCardClick(card)
    {
        let cardFace;

        //"error" checks
        if (card.classList.contains("revealed") || card.classList.contains("paired"))
        {
            console.log("Card is already flipped.  Returning early from onCardClick");
            //return early.  Can't further reveal revealed cards
            return;
        }

        //make face up
        card.classList.add("revealed")

        //insert into previous card, if currently empty
        if (previousCard == null) //Turn part 1
        {
            previousCard = card;
            return;
        }
        else //Turn part 2
        {   
            //add 1 to turn count
            ++turnCount;
            
            //temporary holder for this since it gets overwritten later
            let privatePrev = previousCard;
            if (getCardSymbol(previousCard) == getCardSymbol(card)) //card turned
            {
                //add paired class to both cards
                card.classList.add("paired");
                previousCard.classList.add("paired");

                //fade out cards
                window.setTimeout(function(){privatePrev.style.opacity = 0;}, 500);
                window.setTimeout(function(){card.style.opacity = 0;}, 500);

                //check for game win (the player can only win if all the cards have the paired class applied to them
                if (cardArea.querySelectorAll(".paired").length == cardArea.querySelectorAll(".card").length)
                {
                    window.setTimeout(gameOver, 1000);
                }
            }
            else
            {
                //flip cards back to their previous position
                window.setTimeout(function() {privatePrev.classList.remove("revealed")}, 1000);
                window.setTimeout(function() {card.classList.remove("revealed")}, 1000);
            }

            //reset previous card
            previousCard = null;
        }
    }

    function getCardSymbol(card)
    {
        let face;

        //itterate through all css classes to find matching css class
        for (let cssClass of Array.from(card.querySelector(".face").classList))
        {
            if (cssClass.match(/face_\d+/g)) //regex match
            {
                //remove "face_" and just leave number
                face = cssClass.slice(5);
            }
        }

        //convert to int and return
        return parseInt(face);
    }

    function gameOver()
    {
        //get turn counter
        let gameOverScreen = document.querySelector(".game_over");
        let turnCounter = gameOverScreen.querySelector("#turn_count");

        turnCounter.innerHTML = turnCount;

        gameOverScreen.style.display = 'inherit';
    }

    //setup play_again button
    document.querySelector(".game_over #play_again").addEventListener("click", function()
    {
        //reload the page
        location.reload();
    });

    // ------------------------------------------------------------------------------------------------- Initialize game

    //start game with 16 cards (already knows there are 8 possible card types)
    start(16);
});