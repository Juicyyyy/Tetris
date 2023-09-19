'use strict';

const COLS = 10; // кол-во колонок
const ROWS = 20; // кол-во рядов
const BLOCK_SIZE = 30; // размер одного блока
const LINES_PER_LEVEL = 10;
const COLORS = [ // цвета фигурок
  'none',
  '#0000CD',
  '#00FFFF',
  '#FF8C00',
  '#FFFF00',
  '#7CFC00',
  '#BA55D3',
  '#FF0000'
];
Object.freeze(COLORS);

// пустая клетка – 0, а занятая – от 1 до 7, в зависимости от цвета
const SHAPES = [ // формы фигурок
  [],
  [[0, 0, 0, 0], [1, 1, 1, 1], [0, 0, 0, 0], [0, 0, 0, 0]],
  [[2, 0, 0], [2, 2, 2], [0, 0, 0]],
  [[0, 0, 3], [3, 3, 3], [0, 0, 0]],
  [[4, 4], [4, 4]],
  [[0, 5, 5], [5, 5, 0], [0, 0, 0]],
  [[0, 6, 0], [6, 6, 6], [0, 0, 0]],
  [[7, 7, 0], [0, 7, 7], [0, 0, 0]]
];
Object.freeze(SHAPES);

//Коды клавиш 
const KEY = {
  ESC: 27, //конец игры
  SPACE: 32, // ускоренное падение
  LEFT: 37, // влево
  UP: 38, // перевернуть фугурку
  RIGHT: 39, // вправо
  DOWN: 40, // ускорение вниз
  P: 80 // пауза
}
Object.freeze(KEY);

// баллы за сбор целых рядов
const POINTS = {
  SINGLE: 100,
  DOUBLE: 300,
  TRIPLE: 500,
  TETRIS: 800,
  SOFT_DROP: 1,
  HARD_DROP: 2,
}
Object.freeze(POINTS);

// уровни игры и соответсвующая скорость
const LEVEL = {
  0: 800,
  1: 720,
  2: 630,
  3: 550,
  4: 470,
  5: 380,
  6: 300,
  7: 220,
  8: 130,
  9: 100,
  10: 80,
  11: 80,
  12: 80,
  13: 70,
  14: 70,
  15: 70,
  16: 50,
  17: 50,
  18: 50,
  19: 30,
  20: 30,
}
Object.freeze(LEVEL);