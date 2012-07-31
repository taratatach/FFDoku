/*
    FFDoku is a Sudoku game primarily designed for the Firefox OS
    Copyright (C) 2012 Erwan GUYADER <erwanguyader@mailoo.org>, Antoine DUPARAY <antoineduparay@gmail.com>

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU Affero General Public License as
    published by the Free Software Foundation, either version 3 of the
    License, or (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Affero General Public License for more details.

    You should have received a copy of the GNU Affero General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.


*/

/*
 * Class representing the game logic
 */
function Game(level) {
	this.levels = {
		'easy' : 25,
		'medium' : 20,
		'hard' : 17
	};

	this.newGame(level);
}

/*
 * Initializes the 'grids' (just the numbers)
 * and the arrays containing the already taken numbers
 */
Game.prototype.init = function () {
	this.currGrid = [];
	this.baseGrid = [];
	this.solvGrid = [];
	
	// Numbers not free to use in lines, columns and squares
	this.linesTaken = [];
	this.colsTaken = [];
	this.sqrsTaken = [];
	
	
	for (var i=0; i<9; i++) {
		this.linesTaken[i] = [false, false, false, false, false, false, false, false, false];
		this.colsTaken[i] = [false, false, false, false, false, false, false, false, false];
		this.sqrsTaken[i] = [false, false, false, false, false, false, false, false, false];
		
		this.currGrid[i] = [];
		this.baseGrid[i] = [];
		this.solvGrid[i] = [];
	}
}

/*
 * Calls the init function and the grid generation functions
 */
Game.prototype.newGame = function (level) {
	this.init();
	this.generateGrid(81);
	this.generateRevealed(this.levels[level]);
	this.currGrid = eval(uneval(this.baseGrid));
}

/*
 * Called when a value is inserted by the player
 * Puts that value into the current grid
 */
Game.prototype.changeValue = function(nb, l, c) {
	this.currGrid[l][c] = nb;
}

/*
 * Called whenever we want to check if the given number
 * can be placed in the given case (identified by line # and col #)
 * using the taken arrays.
 */
Game.prototype.respect = function (nb, l, c) {
	var sqr = ~~(l / 3) * 3 + ~~(c / 3);
	
	/* Check if the number isn't already present in the line, column or square */
	return ((!this.linesTaken[l][nb-1] && !this.colsTaken[c][nb-1]) && !this.sqrsTaken[sqr][nb-1]);
}

/*
 * Called when the player wants to reset the game
 * Just copies back the base grid into the current grid
 */
Game.prototype.resetGame = function () {
	this.currGrid = eval(uneval(this.baseGrid));
}

/*
 * Generates the 81 numbers starting in case [0,0]
 * Recursive function : if we can't fit no number into one case,
 * we backtrack to the precedent case and try a new number.
 * Once a number is placed, we add it to the taken arrays.
 */
Game.prototype.generateGrid = function (nbNumbersLeft) {
	if (nbNumbersLeft == 0)
		return true;
	
	var possibles = [1, 2, 3, 4, 5, 6, 7, 8, 9].shuffle();
	
	var i = ~~((81 - nbNumbersLeft) / 9);
	var j = (81 - nbNumbersLeft) % 9;
	
	var n = 0;
	do {
		var c = possibles[n];
		if (this.respect(c, i, j)) {
			this.solvGrid[i][j] =  c;
			this.setTaken(c, i, j);
			if (this.generateGrid(nbNumbersLeft-1))
				return true;
			else
				this.setFree(c, i, j);
		}
		n++;
	} while(n < possibles.length);
}

/*
 * Once the solved grid with the 81 numbers is generated,
 * we generate the base grid by taking $nbNumbers$ random numbers
 * from the solved grid and putting them into the base grid.
 */
Game.prototype.generateRevealed = function(nbNumbers) {
	while (nbNumbers--) {
		do {
			var i = ~~(Math.random() * 9);
			var j = ~~(Math.random() * 9);
		} while (this.baseGrid[i][j]);
		
		this.baseGrid[i][j] = this.solvGrid[i][j];
	}
	for (var i=0; i<9; i++)
		for (var j=0; j<9; j++)
			if (!this.baseGrid[i][j])
				this.setFree(this.solvGrid[i][j], i, j);
}

/*
 * Set the taken boolean of the given line, column and square (calculated)
 * for the given number to true
 */
Game.prototype.setTaken = function (nb, l, c) {
	/* Set the number as present in the line */
	this.linesTaken[l][nb-1] = true;
	
	/* Set the number as present in the column */
	this.colsTaken[c][nb-1] = true;
	
	/* Set the number as present in the 3*3 square */
	var sqr = ~~(l / 3) * 3 + ~~(c / 3);
	this.sqrsTaken[sqr][nb-1] = true;
}

/*
 * Set the taken boolean of the given line, column and square (calculated)
 * for the given number to false
 */
Game.prototype.setFree = function (nb, l, c) {
	/* Set the number as not present in the line */
	this.linesTaken[l][nb-1] = false;
	
	/* Set the number as not present in the column */
	this.colsTaken[c][nb-1] = false;
	
	/* Set the number as not present in the 3*3 square */
	var sqr = ~~(l / 3) * 3 + ~~(c / 3);
	this.sqrsTaken[sqr][nb-1] = false;
}
