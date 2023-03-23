const startButton = document.querySelector('#start-button');
const infoDisplay = document.querySelector('#info');
const turnDisplay = document.querySelector('#turn-display');

// Creates gameboards
const width = 10;

function createGrid(user) {
  const grid = document.getElementById(user);

  for (let i = 0; i < width * width; i++) {
    const square = document.createElement('div');
    square.className = 'square';
    square.id = i;
    grid.appendChild(square);
  }
}

createGrid('player-grid');
createGrid('computer-grid');

// Handles ship flipping within the container
const shipContainer = document.querySelector('.ship-container');
const flipButton = document.querySelector('#flip-button');

let angle = 0;
function flip() {
  const optionShips = Array.from(shipContainer.children);
  angle = angle === 0 ? 90 : 0;
  optionShips.forEach(
    (optionShip) => (optionShip.style.transform = `rotate(${angle}deg)`)
  );
}

flipButton.addEventListener('click', flip);

// Creates new ships
class Ship {
  constructor(name, length) {
    this.name = name;
    this.length = length;
  }
}

const destroyer = new Ship('destroyer', 2);
const submarine = new Ship('submarine', 3);
const cruiser = new Ship('cruiser', 3);
const battleship = new Ship('battleship', 4);
const carrier = new Ship('carrier', 5);
let notDropped;

// Adds ships to an array
const ships = [destroyer, submarine, cruiser, battleship, carrier];

// Checks for valid ship placement
function getValidity(allBoardBlocks, isHorizontal, startIndex, ship) {
  let validStart = isHorizontal
    ? startIndex <= width * width - ship.length
      ? startIndex
      : width * width - ship.length
    : startIndex <= width * width - width * ship.length
    ? startIndex
    : startIndex - ship.length * width + width;

  let shipBlocks = [];

  for (let i = 0; i < ship.length; i++) {
    if (isHorizontal) {
      shipBlocks.push(allBoardBlocks[Number(validStart) + i]);
    } else {
      shipBlocks.push(allBoardBlocks[Number(validStart) + i * width]);
    }
  }

  let valid;

  if (isHorizontal) {
    shipBlocks.every(
      (_shipBlock, index) =>
        (valid =
          shipBlocks[0].id % width !==
          width - (shipBlocks.length - (index + 1)))
    );
  } else {
    shipBlocks.every(
      (_shipBlock, index) =>
        (valid = shipBlocks[0].id < 90 + (width * index + 1))
    );
  }

  const notTaken = shipBlocks.every(
    (shipBlock) => !shipBlock.classList.contains('taken')
  );

  return { shipBlocks, valid, notTaken };
}

function addShipPiece(user, ship, startId) {
  const allBoardBlocks = document.querySelectorAll(`#${user}-grid div`);
  let randomBoolean = Math.random() < 0.5;
  let isHorizontal = user === 'player' ? angle === 0 : randomBoolean;
  let randomStartIndex = Math.floor(Math.random() * width * width);

  let startIndex = startId ? startId : randomStartIndex;

  const { shipBlocks, valid, notTaken } = getValidity(
    allBoardBlocks,
    isHorizontal,
    startIndex,
    ship
  );

  if (valid && notTaken) {
    shipBlocks.forEach((shipBlock) => {
      shipBlock.classList.add(ship.name);
      shipBlock.classList.add('taken');
    });
  } else {
    if (user === 'computer') addShipPiece(user, ship, startId);
    if (user === 'player') notDropped = true;
  }
}

ships.forEach((ship) => addShipPiece('computer', ship));

// Handles drag and drop
let draggedShip;
const optionShips = Array.from(shipContainer.children);
optionShips.forEach((optionShip) =>
  optionShip.addEventListener('dragstart', dragStart)
);

const allPlayerBlocks = document.querySelectorAll('#player-grid div');
allPlayerBlocks.forEach((playerBlock) => {
  playerBlock.addEventListener('dragover', dragOver);
  playerBlock.addEventListener('drop', dropShip);
});

function dragStart(e) {
  notDropped = false;
  draggedShip = e.target;
}

function dragOver(e) {
  e.preventDefault();
  const ship = ships[draggedShip.id];
  highLightArea(e.target.id, ship);
}

function dropShip(e) {
  const startId = e.target.id;
  const ship = ships[draggedShip.id];
  addShipPiece('player', ship, startId);
  if (!notDropped) {
    draggedShip.remove();
  }
}

// Add highlight to board on drag
function highLightArea(startIndex, ship) {
  const allBoardBlocks = document.querySelectorAll('#player-grid div');
  let isHorizontal = angle === 0;

  const { shipBlocks, valid, notTaken } = getValidity(
    allBoardBlocks,
    isHorizontal,
    startIndex,
    ship
  );

  if (valid && notTaken) {
    shipBlocks.forEach((shipBlock) => {
      shipBlock.classList.add('hover');
      setTimeout(() => shipBlock.classList.remove('hover'), 500);
    });
  }
}

let gameOver = false;
let playerTurn;

// Start Game

function startGame() {
  if (playerTurn === undefined) {
    if (shipContainer.children.length != 0) {
      infoDisplay.textContent = 'Please place all your pieces first!';
    } else {
      const allBoardBlocks = document.querySelectorAll('#computer-grid div');
      allBoardBlocks.forEach((block) =>
        block.addEventListener('click', handleClick)
      );
      playerTurn = true;
      infoDisplay.textContent = 'Your go';
      infoDisplay.textContent = 'Fire away!';
    }
  }
}

startButton.addEventListener('click', startGame);

let playerHits = [];
let computerHits = [];
const playerSunkShips = [];
const computerSunkShips = [];

function handleClick(e) {
  if (!gameOver) {
    if (e.target.classList.contains('taken')) {
      e.target.classList.add('boom');
      infoDisplay.textContent = "You hit the computer's ship!";
      let classes = Array.from(e.target.classList);
      classes = classes.filter((className) => className !== 'square');
      classes = classes.filter((className) => className !== 'boom');
      classes = classes.filter((className) => className !== 'taken');
      playerHits.push(...classes);
      checkScore('player', playerHits, playerSunkShips);
    }
    if (!e.target.classList.contains('taken')) {
      infoDisplay.textContent = 'Missed';
      e.target.classList.add('empty');
    }
    playerTurn = false;
    const allBoardBlocks = document.querySelectorAll('#computer-grid div');
    allBoardBlocks.forEach((block) => block.replaceWith(block.cloneNode(true)));
    setTimeout(computerGo, 3000);
  }
}

function computerGo() {
  if (!gameOver) {
    turnDisplay.textContent = 'Computers turn';
    infoDisplay.textContent = 'The computer is thinking...';

    setTimeout(() => {
      let randomGo = Math.floor(Math.random() * width * width);
      const allBoardBlocks = document.querySelectorAll('#player-grid div');

      if (
        allBoardBlocks[randomGo].classList.contains('taken') &&
        allBoardBlocks[randomGo].classList.contains('boom')
      ) {
        computerGo();
        return;
      } else if (
        allBoardBlocks[randomGo].classList.contains('taken') &&
        !allBoardBlocks[randomGo].classList.contains('boom')
      ) {
        allBoardBlocks[randomGo].classList.add('boom');
        infoDisplay.textContent = 'The computer hit your ship!';
        let classes = Array.from(allBoardBlocks[randomGo].classList);
        classes = classes.filter((className) => className !== 'square');
        classes = classes.filter((className) => className !== 'boom');
        classes = classes.filter((className) => className !== 'taken');
        computerHits.push(...classes);
        checkScore('computer', computerHits, computerSunkShips);
      } else {
        infoDisplay.textContent = 'Nothing hit this time.';
        allBoardBlocks[randomGo].classList.add('empty');
      }
    }, 3000);

    setTimeout(() => {
      playerTurn = true;
      turnDisplay.textContent = 'Your go';
      infoDisplay.textContent = 'Please take your turn.';
      const allBoardBlocks = document.querySelectorAll('#computer-grid div');
      allBoardBlocks.forEach((block) =>
        block.addEventListener('click', handleClick)
      );
    }, 6000);
  }
}

function checkScore(user, userHits, userSunkShips) {
  function checkShip(shipName, shipLength) {
    if (
      userHits.filter((storedShipName) => storedShipName === shipName)
        .length === shipLength
    ) {
      infoDisplay.textContent = `You sunk the ${user}'s ${shipName}`;
      if (user === 'player') {
        playerHits = userHits.filter(
          (storedShipName) => storedShipName !== shipName
        );
      }
      if (user === 'computer') {
        computerHits = userHits.filter(
          (storedShipName) => storedShipName !== shipName
        );
      }
      userSunkShips.push(shipName);
    }
  }

  checkShip('destroyer', 2);
  checkShip('submarine', 3);
  checkShip('cruiser', 3);
  checkShip('battleship', 4);
  checkShip('carrier', 5);

  console.log('playerHits', playerHits);
  console.log('playerSunkShips', playerSunkShips);

  if (playerSunkShips.length === 5) {
    infoDisplay.textContent = 'You sunk all the computers ships. You won!';
    gameOver = true;
  }

  if (computerSunkShips.length === 5) {
    infoDisplay.textContent = 'The computer has sunk all your ships. You lost!';
    gameOver = true;
  }
}
