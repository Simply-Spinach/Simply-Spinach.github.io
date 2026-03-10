// --------------------------------------------------------------------------------- Variable Declarations

//Main entrance to check gameboard values (honestly would have probably made it a class due to how big it is if it was possible to change more values)
const BOARD_SIZE = 3; //yes, you can make a 100 * 100 game of tic-tac-toe if you want to by editing this, as long as it's square, well, as long as you edit the DOM correctly

// "-" indicates unmarked, "x" indicates an X mark, "o" indicates an O mark
let logicBoard = []; //filled in loop below so we can resize it if we *really* wanted to
for (let i = 0; i < BOARD_SIZE; ++i)
{
  let curRow = [];
  for(let j = 0; j < BOARD_SIZE; ++j)
  {
    curRow.push('-');
  }
  logicBoard.push(curRow);
}

const PLAYER_SYMBOLS = ['x', 'o']; //did this to get it to act a lot like an Enum.  Perhaps maybe we could maybe add more types later

let currentTurn = 0;


// --------------------------------------------------------------------------------- general gameBoard control related functions

// clear the board
function boardClear(board)
{
  for(row in board)
  {
    for (cell in row)
    {
      cell = '-';
    }
  }
}

// general gameboard state functions
function checkGameboard(board)
{
  let output;

  //all functions we are using to detect a winning state
  const checkFunctions = [checkColumns, checkRows, checkDiagonal1, checkDiagonal2];

  //DEBUGGING
  const checkFunctionNames = ['checkColumns', 'checkRows', 'checkDiagonal1 (r=c)', 'checkDiagonal2 (r!= c)'];
  
  //Check each function (should all return '-' on fail)
  for(let i = 0; i < checkFunctions.length; ++i)
  {
    //get output
    output = checkFunctions[i](board);
    
    //break early upon detecting a win
    if(output != '-')
    {
      console.log("Win function " + checkFunctionNames[i] + " detected win");
      return output;
    }
    
  }
  
  console.log("No win detected.  Checking draw state ...")
  
  //no player won.  Check for draw state
  output = checkDrawState(board);
  
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

function checkColumns(gameBoard)
{
  //check each row
  for (let r = 0; r < BOARD_SIZE; ++r)
  {
      //default check
      let output = gameBoard[0][r]
      for (let c = 1; c < BOARD_SIZE; ++c)
      {
        if (gameBoard[c][r] != output)
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

function checkRows(gameBoard)
{
  //check each row
  for (let c = 0; c < BOARD_SIZE; ++c)
  {
      //default check
      let output = gameBoard[c][0]
      for (let r = 1; r < BOARD_SIZE; ++r)
      {
        if (gameBoard[c][r] != output)
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
function checkDiagonal1(board)
{
  let output = board[0][0];
  
  //checking for failure here.  Otherwise, output wins
  for (let i = 1; i < BOARD_SIZE; ++i)
  {
    if (output != board[i][i])
    {
      //failed
      return '-';
    }
  }
  
  return output;
}

//Checks the diagonal from top right to bottom left
function checkDiagonal2(board)
{
  let output = board[0][BOARD_SIZE - 1];
  
  console.log(output)
  
  for (let i = 1; i < BOARD_SIZE; ++i)
  {    
    if (output != board[i][board[i].length - 1 - i])
    {
      //failed
      return '-';
    }
  }
  return output;
}

//Checks for basic game draw state
//WARNING: ONLY USE AFTER ALL OTHER CHECKS FAILED
function checkDrawState(board)
{
  //check for failure of draw state (contains '-' cell)
  for (column of board)
  {
    for (cell of column)
    {
      if (cell == '-') //only check required
      {
        return '-';
      }
    }
  }
  
  //all spots are filled.  We're in a draw (assuming a player didn't win)
  return 'd';
}

// --------------------------------------------------------------------------------- DOM interaction

window.addEventListener('load', function()
{
  
  let gameLogicBoard = []; //loaded later with DOM content
  
  // ----------------------------------------------------------- Create general cell function

  //performs game logic (update and display) upon game cell being recieved
  function OnGameCellClicked(cellObj, x,y)
  {
    //debugging
    console.log('box clicked')
    //return early if cell is already full
    if(logicBoard[x][y] != '-')
    {
      console.log('box already filled.  Cannot move here')
      return;
    }

    //fill cell (logic and actual)
    logicBoard[x][y] = PLAYER_SYMBOLS[currentTurn];
    cellObj.classList.add('game_' + PLAYER_SYMBOLS[currentTurn] + '_occupied');

    //check for player win
    switch(checkGameboard(logicBoard))
    {
      case '-': //default.  No win/lose state
        //next turn
        currentTurn = (currentTurn + 1) % PLAYER_SYMBOLS.length;
        break;
      case 'd': //draw state
        window.alert("Draw");
        boardClear(logicBoard);
        break;
      default: //our win condition (despite the "default" right here.  I just wanted the option to add another player with little edits if I wanted to)
        window.alert(PLAYER_SYMBOLS[currentTurn] + " won");
        boardClear(logicBoard);
        break;
    }  

    //temporarily send currentTurn to here
    console.log(currentTurn);

  }

  // ----------------------------------------------------------- Process triggers/events

  //setup functions on game_cells
  for (let r = 0; r < BOARD_SIZE; ++r)
  {
    let nextRow = [];
    for (let c = 0; c < BOARD_SIZE; ++c)
    {
      let curId = 'game_cell_' + ( (r * 3) + c);
      console.log(curId);
      let curCell = document.getElementById(curId);
      curCell.addEventListener('click', function(){
        OnGameCellClicked(curCell,r,c);
      });
      nextRow.push(curCell);
    }

    //push onto board
    gameLogicBoard.push(nextRow);
  }
});