function Game() {
	this.currGrid = null;
	this.baseGrid = null;
	this.solvGrid = null;
	this.levels = {
		'easy' : 25,
		'medium' : 20,
		'hard' : 17
	};
}


Game.prototype.newGame = function (level) {
	do {
		this.resetGrid();
		this.generateGrid(this.levels[level]);
	} while (this.solve() == false);
	this.currGrid = eval(uneval(this.baseGrid));
}

Game.prototype.changeValue = function(nb, l, c) {
  this.currGrid[l][c] = nb;
}

Game.prototype.checkInsert = function(nb, l, c) {
  return this.respect(this.currGrid, nb, l, c);
}

Game.prototype.respect = function (grid, nb, l, c) {
	/* Check if the number isn't already present in the line */
	for (var i = 0; i < 9; i++)
		if (i != c && grid[l][i] == nb)
		  return false;
	
	/* Check if the number isn't already present in the column */
	for (var i = 0; i < 9; i++)
		if (i != l && grid[i][c] == nb)
			return false;
	
	/* Check if the number isn't already present in the 3*3 square */
	for (var i = (3 * ~~(l / 3)); i < ((3 * ~~(l / 3)) + 3); i++) {
		for (var j = (3 * ~~(c / 3)); j < ((3 * ~~(c / 3)) + 3); j++)
			if ((i != l || j != c) && grid[i][j] == nb)
				return false;
	}
	
	return true;
}

Game.prototype.resetGrid = function () {
	this.baseGrid = new Array(9);
	for (i=0; i<9; i++) {
		this.baseGrid[i] = new Array(9);
		for (j=0; j<9; j++)
		  this.baseGrid[i][j] = null;
	}
}

Game.prototype.resetGame = function () {
  this.currGrid = eval(uneval(this.baseGrid));
}

Game.prototype.generateGrid = function (nbNumbersLeft) {
	if (nbNumbersLeft == 0)
		return true;
	
	var possibles = new Array(1, 2, 3, 4, 5, 6, 7, 8, 9).shuffle();
	
	do {
		var i = ~~(Math.random() * 9);
		var j = ~~(Math.random() * 9);
	} while (this.baseGrid[i][j]);
	
	var n = 0;
	do {
		var c = possibles[n];
		if (this.respect(this.baseGrid, c, i, j)) {
			this.baseGrid[i][j] =  c;
			if (this.generateGrid(nbNumbersLeft-1))
				return true;
		}
		i++;
	} while(n < possibles.length);
}

Game.prototype.solve = function () {
	this.solvGrid = eval(uneval(this.baseGrid));
	return (solve_sudoku(this.solvGrid))
}
