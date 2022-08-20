
const gameboard = (function() {
  const board = new Array(9);
  board.fill(0)
  let playerTurn = 1;
  const cells = document.querySelectorAll('.cell');  
  listenerOn();
  
  function listenerOn() {
    cells.forEach(cell => cell.addEventListener('click', playerMove))
  }
  
  function listenerOff() {
    cells.forEach(cell => cell.removeEventListener('click', playerMove))
  }
  
  function removeCellListener(cell) {
    cells[cell].removeEventListener('click', playerMove);
  }
  
  function playerMove(e) {
    const cell = e.target.id;
    let cross = document.createElement('img');
    cross.setAttribute('src', './images/cross.svg')
    cells[cell].appendChild(cross)
    removeCellListener(cell);
    console.log(playerTurn)
    board[cell] = playerTurn;
    if(gameplay.evaluateRound(board, playerTurn) === 0) {
      toggleTurn();
      computerMove();  
    }
  }
  
  function computerMove() {
    let cell = gameplay.computerAI(board);
    let circle = document.createElement('img');
    circle.setAttribute('src', './images/circle.svg')
    cells[cell].appendChild(circle);
    board[cell] = -1;
    if(gameplay.evaluateRound(board, playerTurn) === 0) {
      removeCellListener(cell);
      toggleTurn(); 
    }
  } 
  
  function toggleTurn() {
    if (playerTurn === 1) {
      playerTurn = -1;
    } else { 
      playerTurn = 1;
    }
  }
  
  function resetBoard() {
    cells.forEach(cell => cell.textContent = '')
    board.fill(0);
    listenerOn();
    playerTurn = 1;
  }
  
  return {playerTurn, computerMove, listenerOff, resetBoard, board};
})()


//-------------------------------------

const gameplay = (function() {
  
  const winResult = 
  [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];
  
  const length = winResult.length;
  
  const evaluateRound = function(board, playerTurn) {
    let winnerLine = [];
    
    for (let j = 0; j < length; j++) {
      if (winResult[j].every(i => board[i] === playerTurn)) {
        winnerLine = winResult[j];
        displayResults.declareWinner(playerTurn);
        gameboard.listenerOff(); 
        return 1;
      }
    }
      if (!board.includes(0)) {
        displayResults.declareWinner(0);
        return 1;
    }
    return 0;
  }

  function computerAI(board) {
    
    for (let i = 0; i < length; i++) {
      if (winResult[i].reduce((x, y) => x + board[y], 0) === -2) {
        return winResult[i].find(x => board[x] === 0)
      } 
    } 
    
    for (let i = 0; i < length; i++) {
      if (winResult[i].reduce((x, y) => x + board[y], 0) === 2) {
        return winResult[i].find(x => board[x] === 0)
      } 
    } 
    
    if (board[4] === 0) return 4;
    
    for (let i = 0; i < length; i++) {
      if (board[i] === 0) return i;
    }
  }

return {evaluateRound, computerAI};
})()

//-------------

const Players = (name) =>{
  let score = 0;
  const getName = () => name;
  const getScore = () => score;
  const addScorePoint = () => score++;
  return {getName, getScore, addScorePoint}; 
}

const player = Players('Player');
const computer = Players('Computer');


const displayResults = (function() {
    
  const playerScore = document.querySelector('.playerScore');
  const computerScore = document.querySelector('.computerScore');
  const playAgainButton = document.querySelector('.playAgain')



  function declareWinner(playerTurn) {
    
    playAgainButton.style.visibility = 'visible';
    playAgainButton.addEventListener('click', playAgain)

    if (playerTurn === -1) {
      computer.addScorePoint();
      computerScore.textContent = computer.getScore();
    }
   
    if (playerTurn === 1) {
      player.addScorePoint();
      playerScore.textContent = player.getScore();
    }
    
   if (playerTurn === 0) {
    console.log('tie')
   }

  }

  function playAgain() {
    gameboard.resetBoard();
    playAgainButton.removeEventListener('click', playAgain);
    playAgainButton.style.visibility = 'hidden';
  }

  return {declareWinner}
})() 

const start = document.querySelector('.startPage p');
start.addEventListener('click', startGame);
function startGame() {
  document.querySelector('.container').style.display = 'grid';
  document.querySelector('.startPage').style.display = 'none';
  start.removeEventListener('click', startGame);
}