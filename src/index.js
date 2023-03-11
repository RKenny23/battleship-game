function createGrid(gridId) {
  const grid = document.getElementById(gridId);
  for (let i = 0; i < 10; i++) {
    const row = document.createElement("div");
    row.className = "row";
    for (let j = 0; j < 10; j++) {
      const square = document.createElement("div");
      square.className = "square";
      row.appendChild(square);
    }
    grid.appendChild(row);
  }
}

createGrid("player-1-grid");
createGrid("player-2-grid");


