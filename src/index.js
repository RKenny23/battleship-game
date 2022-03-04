const playerGrid = document.getElementById('player-grid');
const opponentGrid = document.getElementById('opponent-grid');

const tiles = [];

function createGameBoard(div) {
  for (let i = 0; i < 100; i++) {
    const tile = document.createElement('div');
    tile.dataset.id = i;
    div.appendChild(tile).className = 'tile';
    tiles.push(tile);
  }
}

createGameBoard(playerGrid);
createGameBoard(opponentGrid);
