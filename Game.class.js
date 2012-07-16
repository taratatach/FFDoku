function Game() {
	this.grid = null;
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
}

Game.prototype.respect = function (nb, l, c) {
	/* Check if the number isn't already present in the line */
	for (i = 0; i < 9; i++)
		if (i != c && this.grid[l][i] == nb)
			return false;
	
	/* Check if the number isn't already present in the column */
	for (i = 0; i < 9; i++)
		if (i != l && this.grid[i][c] == nb)
			return false;
	
	/* Check if the number isn't already present in the 3*3 square */
	for (i = ~~(l / 3); i < (~~(l / 3) + 3); i++)
		for (j = ~~(c / 3); j < (~~(c / 3) + 3); j++)
			if ((i != l || j != c) && this.grid[i][j] == nb)
				return false;
	
	return true;
}

Game.prototype.resetGrid = function () {
	this.grid = new Array(9);
	for (i=0; i<9; i++) {
		this.grid[i] = new Array(9);
		for (j=0; j<9; j++)
		  this.grid[i][j] = null;
	}
}

Game.prototype.generateGrid = function (nbNumbersLeft) {
	if (nbNumbersLeft == 0)
		return true;
	
	var possibles = new Array(1, 2, 3, 4, 5, 6, 7, 8, 9).shuffle();
	
	do {
		var i = ~~(Math.random() * 9);
		var j = ~~(Math.random() * 9);
	} while (this.grid[i][j]);
	
	var n = 0;
	do {
		var c = possibles[n];
		if (this.respect(c, i, j)) {
			this.grid[i][j] =  c;
			if (this.generateGrid(nbNumbersLeft-1))
				return true;
		}
		i++;
	} while(n < possibles.length);
}

Game.prototype.solve = function () {
	var g = eval(uneval(this.grid));
	return (solve_sudoku(g))
}