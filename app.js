document.addEventListener("DOMContentLoaded", () => {
  const grid = document.querySelector(".grid");
  const flagsLeft = document.querySelector("#flags-left");
  const result = document.querySelector("#result");

  let width = 10;
  let bombAmount = 20;
  let flags = 0;
  let cells = [];
  let isGameOver = false;

  //create board
  function createBoard() {
    flagsLeft.innerHTML = bombAmount;

    // get shuffled game array with random bombs
    const bombsArray = Array(bombAmount).fill("bomb");
    const emptyArray = Array(width * width - bombAmount).fill("valid");
    const gameArray = emptyArray.concat(bombsArray);
    const shuffledArray = gameArray.sort(() => Math.random() - 0.5);

    for (let i = 0; i < width * width; i++) {
      let cell = document.createElement("div");
      cell.setAttribute("id", i);
      cell.classList.add(shuffledArray[i]);
      grid.appendChild(cell);
      cells.push(cell);

      // normal click
      cell.addEventListener("click", (e) => {
        click(cell);
      });

      //cntrl and left click
      cell.oncontextmenu = (e) => {
        e.preventDefault();
        addFlag(cell);
      };
    }

    // add numbers to cells
    for (let i = 0; i < cells.length; i++) {
      let total = 0;
      // check neighbours
      const isLeftEdge = i % width === 0;
      const isRightEdge = i % width === width - 1;

      // loop through neighbors and check for bombs
      if (cells[i].classList.contains("valid")) {
        if (i > 0 && !isLeftEdge && cells[i - 1].classList.contains("bomb"))
          total++;
        if (
          i > 9 &&
          !isRightEdge &&
          cells[i + 1 - width].classList.contains("bomb")
        )
          total++;
        if (i > 10 && cells[i - width].classList.contains("bomb")) total++;
        if (
          i > 11 &&
          !isLeftEdge &&
          cells[i - 1 - width].classList.contains("bomb")
        )
          total++;
        if (i < 98 && !isRightEdge && cells[i + 1].classList.contains("bomb"))
          total++;
        if (
          i < 90 &&
          !isLeftEdge &&
          cells[i - 1 + width].classList.contains("bomb")
        )
          total++;
        if (
          i < 88 &&
          !isRightEdge &&
          cells[i + 1 + width].classList.contains("bomb")
        )
          total++;
        if (i < 89 && cells[i + width].classList.contains("bomb")) total++;
        cells[i].setAttribute("data", total);
      }
    }
  }
  createBoard();

  //add Flag
  function addFlag(cell) {
    if (isGameOver) return;
    if (!cell.classList.contains("checked") && flags < bombAmount) {
      cell.classList.add("flag");
      cell.innerHTML = "🚩";
      flags++;
      flagsLeft.innerHTML = bombAmount - flags;
      checkForWin();
    } else if (cell.classList.contains("flag")) {
      cell.classList.remove("flag");
      cell.innerHTML = "";
      flags--;
      flagsLeft.innerHTML = bombAmount + flags;
    }
  }

  function click(cell) {
    let currentId = cell.id;
    if (isGameOver) return;
    if (cell.classList.contains("checked") || cell.classList.contains("flag"))
      return;
    if (cell.classList.contains("bomb")) {
      gameOver(cell);
    } else {
      let total = cell.getAttribute("data");
      if (total != 0) {
        cell.classList.add("checked");
        if (total == 1) cell.classList.add("one");
        if (total == 2) cell.classList.add("two");
        if (total == 3) cell.classList.add("three");
        if (total == 4) cell.classList.add("four");
        cell.innerHTML = total;
        return;
      }
      checkCell(cell, currentId);
    }
    cell.classList.add("checked");
  }

  //check neighboring cells once cell is clicked
  function checkCell(cell, currentId) {
    const isLeftEdge = currentId % width === 0;
    const isRightEdge = currentId % width === width - 1;

    setTimeout(() => {
      if (currentId > 0 && !isLeftEdge) {
        const newId = parseInt(currentId) - 1;
        const newSquare = document.getElementById(newId);
        click(newSquare);
      }
      if (currentId > 9 && !isRightEdge) {
        const newId = parseInt(currentId) + 1 - width;
        const newSquare = document.getElementById(newId);
        click(newSquare);
      }
      if (currentId > 10) {
        const newId = parseInt(currentId) - width;
        const newSquare = document.getElementById(newId);
        click(newSquare);
      }
      if (currentId > 11 && !isLeftEdge) {
        const newId = parseInt(currentId) - 1 - width;
        const newSquare = document.getElementById(newId);
        click(newSquare);
      }
      if (currentId < 98 && !isRightEdge) {
        const newId = parseInt(currentId) + 1;
        const newSquare = document.getElementById(newId);
        click(newSquare);
      }
      if (currentId < 90 && !isLeftEdge) {
        const newId = parseInt(currentId) - 1 + width;
        const newSquare = document.getElementById(newId);
        click(newSquare);
      }
      if (currentId < 88 && !isRightEdge) {
        const newId = parseInt(currentId) + 1 + width;
        const newSquare = document.getElementById(newId);
        click(newSquare);
      }
      if (currentId < 89) {
        const newId = parseInt(currentId) + width;
        const newSquare = document.getElementById(newId);
        click(newSquare);
      }
    }, 10);
  }

  function gameOver(cell) {
    console.log("BOOM! Game Over");
    isGameOver = true;

    // show all bombs
    cells.forEach((cell) => {
      if (cell.classList.contains("bomb")) {
        cell.innerHTML = "💣";
      }
    });
  }

  //check for win
  function checkForWin() {
    ///simplified win argument
    let matches = 0;

    for (let i = 0; i < cells.length; i++) {
      if (
        cells[i].classList.contains("flag") &&
        cells[i].classList.contains("bomb")
      ) {
        matches++;
      }
      if (matches === bombAmount) {
        result.innerHTML = "YOU WIN!";
        isGameOver = true;
      }
    }
  }
});
