// получаю контекст 2D для рисования
const canvas = document.getElementById('board'); 
const ctx = canvas.getContext('2d');
const canvasNext = document.getElementById('next');
const ctxNext = canvasNext.getContext('2d');

// хранение информации для пользователя
let accountValues = {
  score: 0,
  level: 0,
  lines: 0
}

// Обновление данных на экране
function updateAccount(key, value) {
  let element = document.getElementById(key);
  if (element) {
    element.textContent = value;
  }
}

// Проксирование доступа к свойствам accountValues
let account = new Proxy(accountValues, {
  set: (target, key, value) => {
    target[key] = value;
    updateAccount(key, value);
    return true;
  }
});

let requestId;

//Для перемещения тетрамино мы будем стирать старое отображение и 
//копировать его в новых координатах. Чтобы получить эти новые координаты,
//сначала скопируем текущие, а затем изменим нужную (x или y) на единицу.
moves = {
  [KEY.LEFT]: p => ({ ...p, x: p.x - 1 }),
  [KEY.RIGHT]: p => ({ ...p, x: p.x + 1 }),
  [KEY.DOWN]: p => ({ ...p, y: p.y + 1 }),
  [KEY.SPACE]: p => ({ ...p, y: p.y + 1 }),
  [KEY.UP]: p => board.rotate(p)
};

let board = new Board(ctx, ctxNext);
addEventListener();
initNext();

function initNext() {
  // Устанавливаем размеры холста
  ctxNext.canvas.width = 4 * BLOCK_SIZE;
  ctxNext.canvas.height = 4 * BLOCK_SIZE;
  // Устанавливаем масштаб
  ctxNext.scale(BLOCK_SIZE, BLOCK_SIZE);
}

function addEventListener() {
  document.addEventListener('keydown', event => {
    if (event.keyCode === KEY.P) {
      pause();
    }
    if (event.keyCode === KEY.ESC) {
      gameOver();
    } else if (moves[event.keyCode]) {
      // отмена действий по умолчанию
      event.preventDefault();
      // получение новых координат фигурки
      let p = moves[event.keyCode](board.piece);
      if (event.keyCode === KEY.SPACE) {
        // Жесткое падение
        while (board.valid(p)) {
          account.score += POINTS.HARD_DROP;
          // реальное перемещение фигурки, если новое положение допустимо
          board.piece.move(p);
          p = moves[KEY.DOWN](board.piece);
        }       
      } else if (board.valid(p)) {
        // реальное перемещение фигурки, если новое положение допустимо
        board.piece.move(p);
        if (event.keyCode === KEY.DOWN) {
          account.score += POINTS.SOFT_DROP;         
        }
      }
    }
  });
}

// начало новой игры
function resetGame() {
  account.score = 0;
  account.lines = 0;
  account.level = 0;
  board.reset();
  time = { start: 0, elapsed: 0, level: LEVEL[account.level] };
}

//Функция play будет вызвана при нажатии на кнопку Play. 
//Она очистит игровое поле с помощью метода reset
function play() {
  resetGame();
  time.start = performance.now();
  // Если есть старая игра, на которой запущена игра, отмените старую
  if (requestId) {
    cancelAnimationFrame(requestId);
  }

  animate();
}

// функция animate будет производить все необходимые перерисовки
// для одного цикла анимации, а затем рекурсивно вызовет сама себя 
// для выполнения перерисовок следующего цикла
function animate(now = 0) {
  // обновить истекшее время
  time.elapsed = now - time.start;
  // если время отображения текущего фрейма прошло 
  if (time.elapsed > time.level) {
    // начать отсчет сначала
    time.start = now;
    // "уронить" активную фигурку
    if (!board.drop()) {
      gameOver();
      return;
    }
  }

  // очистить холст для отрисовки нового фрейма
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

  // отрисовать игровое поле 
  board.draw();
  requestId = requestAnimationFrame(animate);
}

// Чтобы прервать игровой цикл, нужно отменить последний вызов requestAnimationFrame. 
// Также нужно показать пользователю сообщение.
function gameOver() {
  cancelAnimationFrame(requestId);
  ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
  ctx.fillRect(1, 3, 8, 1.2);
  ctx.font = '1px Arial';
  ctx.fillStyle = 'White';
  ctx.fillText('GAME OVER', 1.8, 4);
}

// пауза
function pause() {
  if (!requestId) {
    animate();
    return;
  }

  cancelAnimationFrame(requestId);
  requestId = null;
  
  ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
  ctx.fillRect(1, 3, 8, 1.2);
  ctx.font = '1px Arial';
  ctx.fillStyle = 'White';
  ctx.fillText('PAUSED', 3, 4);
}