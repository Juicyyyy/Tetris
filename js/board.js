
class Board {
    ctx;
    ctxNext;
    grid;
    piece;
    next;
    requestId;
    time;
  
    constructor(ctx, ctxNext) {
      this.ctx = ctx;
      this.ctxNext = ctxNext;
      this.init();
    }
  
    init() {
      // Вычисляем размер холста по константам.
      this.ctx.canvas.width = COLS * BLOCK_SIZE;
      this.ctx.canvas.height = ROWS * BLOCK_SIZE;
  
      // Масштабирую, чтобы нам не нужно было указывать размер при каждой оттрисовке
      this.ctx.scale(BLOCK_SIZE, BLOCK_SIZE);
    }
  
    // Сбрасывает игровое поле перед началом новой игры
    reset() {
      this.grid = this.getEmptyGrid();
      this.piece = new Piece(this.ctx);
      this.piece.setStartingPosition();
      this.getNewPiece();
    }
  
    getNewPiece() {
      this.next = new Piece(this.ctxNext);
      this.ctxNext.clearRect(
        0,
        0, 
        this.ctxNext.canvas.width, 
        this.ctxNext.canvas.height
      );
      this.next.draw();
    }
  
    draw() {
      this.piece.draw();
      this.drawBoard();
    }
  
    // конец игры
    drop() {
      let p = moves[KEY.DOWN](this.piece);
      if (this.valid(p)) {
        this.piece.move(p);
      } else {
        this.freeze();
        this.clearLines();
        if (this.piece.y === 0) {
          // Game over
          return false;
        }
        this.piece = this.next;
        this.piece.ctx = this.ctx;
        this.piece.setStartingPosition();
        this.getNewPiece();
      }
      return true;
    }

    // удаляет собранные линии
    clearLines() {
      let lines = 0;
  
      this.grid.forEach((row, y) => {
  
        // Если все клетки в ряду заполнены
        if (row.every(value => value > 0)) {
          lines++;
  
          // Удалить этот ряд
          this.grid.splice(y, 1);
  
          // Добавить наверх поля новый пустой ряд клеток
          this.grid.unshift(Array(COLS).fill(0));
        }
      });
      
      if (lines > 0) {
        // Добавить очки за собранные линии
        account.score += this.getLinesClearedPoints(lines);
        account.lines += lines;
  
        // If we have reached the lines for next level
        if (account.lines >= LINES_PER_LEVEL) {
          // Goto next level
          account.level++;  
          
          // Remove lines so we start working for the next level
          account.lines -= LINES_PER_LEVEL;
  
          // Increase speed of game
          time.level = LEVEL[account.level];
        }
      }
    }

    //определяет допустимость новых координат на игровом поле
    valid(p) {
      return p.shape.every((row, dy) => {
        return row.every((value, dx) => {
          let x = p.x + dx;
          let y = p.y + dy;
          return (
            value === 0 ||
            (this.insideWalls(x) && this.aboveFloor(y) && this.notOccupied(x, y))
          );
        });
      });
    }
  
    // заморозить фигурку
    // сохранять положение фигурки в матрице игрового поля
    freeze() {
      this.piece.shape.forEach((row, y) => {
        row.forEach((value, x) => {
          if (value > 0) {
            this.grid[y + this.piece.y][x + this.piece.x] = value;
          }
        });
      });
    }
  
    drawBoard() {
      this.grid.forEach((row, y) => {
        row.forEach((value, x) => {
          if (value > 0) {
            this.ctx.fillStyle = COLORS[value];
            this.ctx.fillRect(x, y, 1, 1);
          }
        });
      });
    }
  
    // Создает матрицу нужного размера, заполненную нулями
    // Для создания пустой матрицы поля и заполнения ее нулями используются методы массивов: Array.from() и Array.fill().
    getEmptyGrid() {
      return Array.from({ length: ROWS }, () => Array(COLS).fill(0));
    }
  
    insideWalls(x) {
      return x >= 0 && x < COLS;
    }
  
    aboveFloor(y) {
      return y <= ROWS;
    }
  
    // не занята ли клетка поля другими фигурками
    notOccupied(x, y) {
      return this.grid[y] && this.grid[y][x] === 0;
    }
    
    // Фигурки можно вращать относительно их «центра масс»
    // Мы должны транспонировать матрицу, а затем умножить ее на матрицу преобразования, которая изменит порядок столбцов.
    rotate(piece) {
      // Клонирование матрицы
      let p = JSON.parse(JSON.stringify(piece));
  
      // Транспонирование матрицы тетрамино
      for (let y = 0; y < p.shape.length; ++y) {
        for (let x = 0; x < y; ++x) {
          [p.shape[x][y], p.shape[y][x]] = [p.shape[y][x], p.shape[x][y]];
        }
      }
  
      // Изменение порядка колонок
      p.shape.forEach(row => row.reverse());
      return p;
    }
  
    // С каждым уровнем очков должно быть больше
    getLinesClearedPoints(lines, level) {
      const lineClearPoints =
        lines === 1
          ? POINTS.SINGLE
          : lines === 2
          ? POINTS.DOUBLE
          : lines === 3
          ? POINTS.TRIPLE
          : lines === 4
          ? POINTS.TETRIS
          : 0;
  
      return (account.level + 1) * lineClearPoints;
    }
  }