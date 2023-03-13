function createGrid(gridId) {
  const grid = document.getElementById(gridId);
  for (let i = 0; i < 10; i++) {
    const row = document.createElement('div');
    row.className = 'row';
    for (let j = 0; j < 10; j++) {
      const square = document.createElement('div');
      square.className = 'square';
      row.appendChild(square);
    }
    grid.appendChild(row);
  }
}

createGrid('player-1-grid');
createGrid('player-2-grid');

const shipContainer = document.querySelector('.ship-container');
const flipButton = document.querySelector('#flip-button');

function flip() {
  const optionShips = Array.from(shipContainer.children);

  optionShips.forEach(
    (optionShip) =>
      (optionShip.getElementsByClassName.transform = `rotate(90deg)`)
  );

  optionShips.forEach(
    (optionShip) => (optionShip.getElementsByClassName.transform = 'scale(2)')
  );

  console.log(Array.from(shipContainer.children));
}

flipButton.addEventListener('click', flip);
