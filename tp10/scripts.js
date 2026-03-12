// Caelin Conner

// --------------------------------------------------------------------------------- Class Declarations

class gameBoard{

  // ------------------------------------------------------------------------------- Private Variables

  #board;
  #BOARD_SIZE = 3;
  #currentTurn = 0;
  #PLAYER_SYMBOLS = [];
  #playerWins = [];

  // ------------------------------------------------------------------------------- gameBoard Constructor

  constructor(boardSize, playerSymbols){
    this.#BOARD_SIZE = boardSize;
    this.#currentTurn = 0;

    this.#PLAYER_SYMBOLS = playerSymbols;

    //fill playerboard
    this.#board = [];
    for (let i = 0; i < this.#BOARD_SIZE; ++i)
    {
      let curRow = [];
      for(let j = 0; j < this.#BOARD_SIZE; ++j)
      {
        curRow.push('-');
      }
      this.#board.push(curRow);
    }

    //add all players to playerWins as 0
    this.#playerWins = [];
    for (let i = 0; i < playerSymbols.length; ++i)
    {
      this.#playerWins.push(0);
    }
  }

  // ------------------------------------------------------------------------------ gameBoard.checkGameboard and related functions

  // general gameboard state functions
  checkGameboard()
  {
    let output;

    //all functions we are using to detect a winning state
    //yes, the bind(this) is important for ensuring it's called on this object and not the array it's a part of for some stupid reason
    const checkFunctions = [this.#checkColumns.bind(this), this.#checkRows.bind(this), this.#checkDiagonal1.bind(this), this.#checkDiagonal2.bind(this)];

    //DEBUGGING for names of functions in console
    const checkFunctionNames = ['checkColumns', 'checkRows', 'checkDiagonal1 (r=c)', 'checkDiagonal2 (r!= c)'];
    
    //Check each function (should all return '-' on fail)
    for(let i = 0; i < checkFunctions.length; ++i)
    {
      //get output
      output = checkFunctions[i]();
      
      //break early upon detecting a win
      if(output != '-')
      {
        console.log("Win function " + checkFunctionNames[i] + " detected win");
        return output;
      }
      
    }
    
    console.log("No win detected.  Checking draw state ...")
    
    //no player won.  Check for draw state
    output = this.checkDrawState();
    
    switch (output)
    {
        case '-':
          console.log('No draw.  Continue game in final version')
          break;
      case 'd':
          console.log('Detected draw.  Game end')
    }
    
    return output;
  }

  #checkColumns()
  {
    //check each row
    for (let r = 0; r < this.#BOARD_SIZE; ++r)
    {
        //default check
        let output = this.#board[0][r]
        for (let c = 1; c < this.#BOARD_SIZE; ++c)
        {
          if (this.#board[c][r] != output)
          {
            output = '-';
          }
        }
      
        //return early on success
        if (output != '-')
        {
          return output;
        }
    }
    
    //return default blank because we haven't found anything
    return '-'; 
  }

  #checkRows()
  {
    //check each row
    for (let c = 0; c < this.#BOARD_SIZE; ++c)
    {
        //default check
        let output = this.#board[c][0]
        for (let r = 1; r < this.#BOARD_SIZE; ++r)
        {
          if (this.#board[c][r] != output)
          {
            output = '-';
          }
        }
      
        //return early on success
        if (output != '-')
        {
          return output;
        }
    }
    
    //return default blank because we haven't found anything
    return '-'; 
  }

  //Checks r=c diagonal
  #checkDiagonal1()
  {
    let output = this.#board[0][0];
    
    //checking for failure here.  Otherwise, output wins
    for (let i = 1; i < this.getSize(); ++i)
    {
      if (output != this.#board[i][i])
      {
        //failed
        return '-';
      }
    }
    
    return output;
  }

  //Checks the diagonal from top right to bottom left
  #checkDiagonal2()
  {
    let output = this.#board[0][this.#BOARD_SIZE - 1];
    
    console.log(output)
    
    for (let i = 1; i < this.#BOARD_SIZE; ++i)
    {    
      if (output != this.#board[i][this.#board[i].length - 1 - i])
      {
        //failed
        return '-';
      }
    }
    return output;
  }

  //Checks for basic game draw state
  //WARNING: ONLY USE AFTER ALL OTHER CHECKS FAILED
  checkDrawState()
  {
    //check for failure of draw state (contains '-' cell)
    for (let row of this.#board)
    {
      if(row.includes('-'))
      {
        return '-';
      }  
    }
    
    //all spots are filled.  We're in a draw (assuming a player didn't win)
    return 'd';
  }

  // ------------------------------------------------------------------------------- gameBoard DOM interactables
  
  //performs game logic (update and display) upon game cell being recieved
  OnGameCellClicked(cellObj, x,y)
  {
    //debugging
    //console.log('box clicked')
    
    //return early if cell is already full
    if(this.#board[x][y] != '-')
    {
      console.log('box already filled.  Cannot move here')
      return;
    }

    //fill cell (logic and actual)
    this.#board[x][y] = this.#PLAYER_SYMBOLS[this.#currentTurn];
    cellObj.classList.add('game_' + this.#PLAYER_SYMBOLS[this.#currentTurn] + '_occupied');

    //check for player win
    switch(this.checkGameboard())
    {
      case '-': //No win/draw state
        //next turn
        this.#currentTurn = (this.#currentTurn + 1) % this.#PLAYER_SYMBOLS.length;
        break;
      case 'd': //draw state
        window.setTimeout(this.#gameOver.bind(this), 1, 'Game draw'); //timeout needed just to allow graphics to update
        break;
      default: //our win condition (despite the "default" right here.  I just wanted the option to add another player with little edits if I wanted to)
        let message = 'player ' + this.#PLAYER_SYMBOLS[this.#currentTurn] + ' won';
        ++this.#playerWins[this.#currentTurn];
        window.setTimeout(this.#gameOver.bind(this), 1, message); //timeout needed just to allow graphics to update
        break;
    }

    //additional display updates
    this.updateTurnVisual();

    //temporarily send currentTurn to here
    console.log(this.#currentTurn);

  }

  //Updates displays for score based on internally heald count
  updateWins()
  {
    for (let i = 0; i < this.#PLAYER_SYMBOLS.length; ++i)
    {
      let symbol = this.#PLAYER_SYMBOLS[i];
      let text = document.querySelector('#game_info #' + symbol + '_wins');
      text.textContent = this.#playerWins[i];
    }
  }

  //Updates turn thingy to show proper turn
  updateTurnVisual()
  {
    //get image used to show who's turn it is
    let turnVisual = document.querySelector('img#player_turn');

    //update src to current player
    turnVisual.src = 'images/' + this.#PLAYER_SYMBOLS[this.#currentTurn] + '.png';
  }

  //shows game over message (seperate function due to DOM not updating visuals on box clicked before alert, causing indicator to not show up), and clears board
  #gameOver(message)
  {
    //display win message
    window.alert(message);

    //prep for next game
    this.boardClear();
    this.updateWins();
  }

  // ------------------------------------------------------------------------------- gameBoard getters/setters
  getSize()
  {
    return this.#BOARD_SIZE;
  }

  // clear the board
  boardClear()
  {
    //clear internal save
    for(let row of this.#board)
    {
      row.fill('-');
    }

    //update display
    let allCells = document.querySelectorAll('#game_grid > button');
    for (let cell of allCells)
    {
      for (let symbol of this.#PLAYER_SYMBOLS)
      {
        console.log(cell.classList);
        cell.classList.remove('game_' + symbol + '_occupied');
      }
    }
  }
}

//create game object
let game = new gameBoard(3, ['x','o']);

// --------------------------------------------------------------------------------- general gameBoard control related functions


// --------------------------------------------------------------------------------- DOM interaction

window.addEventListener('load', function()
{
  // ----------------------------------------------------------- Process triggers/events
  const BOARD_SIZE = game.getSize();

  //setup functions on game_cells
  for (let r = 0; r < BOARD_SIZE; ++r)
  {
    let nextRow = [];
    for (let c = 0; c < BOARD_SIZE; ++c)
    {
      //setup click event on cell
      let curId = 'game_cell_' + ( (r * 3) + c);
      //console.log(curId); FOR DEBUGGING PURPOUSES.  NOT NEEDED IN FINAL VERSION
      let curCell = document.getElementById(curId);
      curCell.addEventListener('click', function(){
        game.OnGameCellClicked(curCell,r,c);
      });
    }
  }
});

