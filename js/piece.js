//класс Piece для фигурок, чтобы отслеживать их положение на доске, 
//а также хранить цвет и форму. Чтобы фигурки могли отрисовывать себя на поле, 
//нужно передать им контекст рисования
class Piece {
    x;
    y;
    color;
    shape;
    ctx;
    typeId;
  
    constructor(ctx) {
      this.ctx = ctx;
      this.spawn();
    }
  
    // создание фигурки
    spawn() {
      this.typeId = this.randomizeTetrominoType(COLORS.length - 1);
      this.shape = SHAPES[this.typeId];
      this.color = COLORS[this.typeId];
      this.x = 0;
      this.y = 0;
    }

    // рисовка фигурки
    draw() {
      this.ctx.fillStyle = this.color;
      this.shape.forEach((row, y) => {
        row.forEach((value, x) => {
          // this.x, this.y - левый верхний угол фигурки на игровом поле
          // x, y - координаты ячейки относительно матрицы фигурки (3х3)
          // this.x + x - координаты ячейки на игровом поле
          if (value > 0) {
            this.ctx.fillRect(this.x + x, this.y + y, 1, 1);
          }
        });
      });
    }
    //метод move будет изменять текущие координаты тетрамино на поле с помощью клавиш-стрелок
    move(p) {
      this.x = p.x;
      this.y = p.y;
      this.shape = p.shape;
    }
  
    // расположить фигурку в центре поля
    setStartingPosition() {
      this.x = this.typeId === 4 ? 4 : 3;
    }
  
    // параметр noOfTypes - количество вариантов
    // случайным образом выбрать порядковый номер тетрамино
    randomizeTetrominoType(noOfTypes) {
      return Math.floor(Math.random() * noOfTypes + 1);
    }
  }