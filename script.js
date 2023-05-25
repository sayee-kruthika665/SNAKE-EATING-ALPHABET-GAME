const GRID_SIZE = 30;
let snake = [{ x: 10, y: 10 }];
let direction = 'up';
let score = 0;
let word = '';
let timer = 5 * 60; 
let intervalId;
let colorBlocks = [];


function generateColorBlocks() {
  const colorBlocks = [];
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  for (let i = 0; i < 8; i++) {
    const letter = alphabet[Math.floor(Math.random() * alphabet.length)];
    const position = getRandomPosition();
    const color = getRandomColor();
    colorBlocks.push({ letter, position, color });
  }
  return colorBlocks;
}


function getRandomColor() {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}


function moveSnake() {
  const head = { x: snake[0].x, y: snake[0].y };
  // Move the head based on the current direction
  switch (direction) {
    case 'up':
      head.y--;
      break;
    case 'down':
      head.y++;
      break;
    case 'left':
      head.x--;
      break;
    case 'right':
      head.x++;
      break;
  }
  
  if (isWallCollision(head) || isSelfCollision(head)) {
    endGame();
    return;
  }
  snake.unshift(head);
  
  const eatenBlockIndex = colorBlocks.findIndex((block) => block.position.x === head.x && block.position.y === head.y);
  if (eatenBlockIndex !== -1) {
    const eatenBlock = colorBlocks[eatenBlockIndex];
    
    if (eatenBlock.letter === word[0]) {
      score += 5;
      word = word.substr(1);
      displayWord();
      
      if (word === '') {
        timer += score * 60; 
        restartGame();
        return;
      }
    } else {
      score++;
    }
    displayScore();
    colorBlocks.splice(eatenBlockIndex, 1);
  } else {
    snake.pop();
  }
  drawSnake();
}


function drawSnake() {
  const grid = document.getElementById('grid');
  grid.innerHTML = '';
  
  snake.forEach((segment) => {
    const cell = createCell(segment.x, segment.y, 'snake');
    grid.appendChild(cell);
  });
 
  colorBlocks.forEach((block) => {
    const { position, color } = block;
    const cell = createCell(position.x, position.y, 'cell', color, block.letter);
    grid.appendChild(cell);
  });
}


function createCell(x, y, className, backgroundColor, text) {
  const cell = document.createElement('div');
  cell.className = className;
  cell.style.gridColumn = x + 1;
  cell.style.gridRow = y + 1;
  if (backgroundColor) {
    cell.style.backgroundColor = backgroundColor;
  }
  if (text) {
    cell.textContent = text;
  }
  return cell;
}


function displayScore() {
  const scoreValue = document.getElementById('score-value');
  scoreValue.textContent = score.toString();
}


function displayWord() {
  const wordValue = document.getElementById('word-value');
  wordValue.textContent = word;
}


function displayTimer() {
  const minutes = Math.floor(timer / 60).toString().padStart(2, '0');
  const seconds = (timer % 60).toString().padStart(2, '0');
  const timerValue = document.getElementById('timer-value');
  timerValue.textContent = `${minutes}:${seconds}`;
}


function isWallCollision(head) {
  return head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE;
}


function isSelfCollision(head) {
  return snake.slice(1).some((segment) => segment.x === head.x && segment.y === head.y);
}


function handleKeydown(event) {
  const key = event.key.toLowerCase();
  if (key === 'arrowup' || key === 'w') {
    if (direction !== 'down') {
      direction = 'up';
    }
  } else if (key === 'arrowdown' || key === 's') {
    if (direction !== 'up') {
      direction = 'down';
    }
  } else if (key === 'arrowleft' || key === 'a') {
    if (direction !== 'right') {
      direction = 'left';
    }
  } else if (key === 'arrowright' || key === 'd') {
    if (direction !== 'left') {
      direction = 'right';
    }
  }
}


function startGame() {
  document.addEventListener('keydown', handleKeydown);
  intervalId = setInterval(() => {
    moveSnake();
    timer--;
    displayTimer();
    if (timer <= 0) {
      endGame();
    }
  }, 100);
  displayTimer();
}


function restartGame() {
  clearInterval(intervalId);
  document.removeEventListener('keydown', handleKeydown);
  snake = [{ x: 10, y: 10 }]; 
  direction = 'up'; 
  score = 0; 
  timer += 5 * 60; 
  colorBlocks = generateColorBlocks(); 
  word = colorBlocks[0].letter + colorBlocks[1].letter + colorBlocks[2].letter; 
  displayScore();
  displayWord();
  displayTimer();
  drawSnake();
  startGame();
}


function endGame() {
  clearInterval(intervalId);
  document.removeEventListener('keydown', handleKeydown);
  alert('Game Over');
}


function getRandomPosition() {
  let position = { x: 0, y: 0 };
  do {
    position.x = Math.floor(Math.random() * GRID_SIZE);
    position.y = Math.floor(Math.random() * GRID_SIZE);
  } while (snake.some((segment) => segment.x === position.x && segment.y === position.y));
  return position;
}


function init() {
  colorBlocks = generateColorBlocks();
  word = colorBlocks[0].letter + colorBlocks[1].letter + colorBlocks[2].letter;
  displayScore();
  displayWord();
  displayTimer();
  drawSnake();
  startGame();
}


init();
