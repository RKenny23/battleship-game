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

const shipContainer = document.querySelector('.ship-container');
const flipButton = document.querySelector('#flip-button');


let angle = 0;
function flip() {
  const optionShips = Array.from(shipContainer.children);
  angle = angle === 0 ? 90 : 0
  optionShips.forEach(
    (optionShip) =>
      (optionShip.style.transform = `rotate(${angle}deg)`)
  );
}

flipButton.addEventListener('click', flip);

class Ship {
  constructor(name, length) {
    this.name = name
    this.length = length
  }
}

const destroyer = new Ship('destroyer', 2)
const submarine = new Ship('submarine', 3)
const cruiser = new Ship('cruiser', 3)
const battleship = new Ship('battleship', 4)
const carrier = new Ship('carrier', 5)

const ships = [destroyer, submarine, cruiser, battleship, carrier]

function addShipPiece(ship) {
  const allBoardBlocks = document.querySelectorAll('#computer-grid div')
  let randomBoolean = Math.random() < 0.5
  let isHorizontal = true
  let randomStartIndex = Math.floor(Math.random() * width * width)
  console.log(randomStartIndex)

  let shipBlocks = []

  for (let i = 0; i < ship.length; i++) {
    if (isHorizontal) {
      console.log(allBoardBlocks[Number(randomStartIndex) + i])
    }
  }
}

addShipPiece()