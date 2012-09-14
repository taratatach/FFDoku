/*
    FFDoku is a Sudoku game primarily designed for the Firefox OS
    Copyright (C) 2012 Erwan GUYADER <erwanguyader@mailoo.org>, Antoine DUPARAY <flaburgan@geexxx.fr>

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

/* SITES INTERESSANTS
 *
 * http://killdream.github.com/blog/2011/10/understanding-javascript-oop/
 */

/*
 * Class representing the game interactions
 */
function Grid (game) {
 	/* Initialize attributes */ 	
	this.game = game;
	
 	this.commands = document.getElementById('commands');
 	this.commands.className = 'hidden';
	this.gameInfos = document.getElementById('gameInfos');
	this.gameInfos.className = 'hidden';
 	this.newGame = document.getElementById('newGame');
	this.startGame = document.getElementById('startGame');
	this.cancel = document.getElementById('cancel');
 	this.reset = document.getElementById('reset');
 	this.inserts = document.getElementsByClassName('insert');
 	this.erase = document.getElementById('erase');
  
  this.initGrid(this.game.baseGrid);
	
 	this.modifiedCell = null;
}

/*
 * Create the grid and fill it with the revealed numbers
 */
Grid.prototype.initGrid = function (gameGrid) {
	var self = this;
	var table = document.getElementById('grid');
	
	this.cells = [];
	for (var i=0; i<9; i++) {
		var tr = document.createElement('tr');
		table.appendChild(tr);
		
		this.cells[i] = [];
		for (var j=0; j<9; j++) {
			var td = document.createElement('td');

			if (!gameGrid[i][j]) {
			  td.id = String((i+1) + '-' + (j+1));
				td.className = 'cell';
			}
			else {
				td.className = 'number';
				td.innerHTML = gameGrid[i][j];
			}

      if (i % 3 == 2)
        addClass(td, 'borderBottom');
      if (i % 3 == 0)
        addClass(td, 'borderTop');
      if (j % 3 == 2)
        addClass(td, 'borderRight');
      if (j % 3 == 0)
        addClass(td, 'borderLeft');
      
			tr.appendChild(td);

 			this.cells[i][j] = td;
		}
	}
	
  /* Add events */
 	self.addEvents.call(self);
}

/*
 * Add events to every cell and button but also the body itself
 */
Grid.prototype.addEvents = function () {
	var self = this;
	
	document.addEventListener('click', 
		function(e) {
			self.getEvtBody.call(self, e);
		},
	false);
	
	var cells = document.getElementsByClassName('cell');
	for(var i=0; i<cells.length; i++) {
		cells[i].addEventListener('click',
			function(e) {
				self.getEvtClickCell.call(self, e);
			}, 
		false);
		cells[i].addEventListener('change',
			function(e) {
				self.getEvtChangeCell.call(self, e);
			},
		false);
	}
	
	this.newGame.addEventListener('click',
		function(e) {
			self.getEvtNewGame.call(self, e);
		},
	false);
	
	this.startGame.addEventListener('click',
		function() {
			self.getEvtStartGame.call(self);
		},
	false);

  this.cancel.addEventListener('click',
    function (e) {
      self.getEvtCancel.call(self, e);
    },
  false);
    
	this.reset.addEventListener('click',
		function(e) {
			self.getEvtReset.call(self, e);
		},
	false);
  
	for(var i=0; i<this.inserts.length; i++)
		this.inserts[i].addEventListener('click',
			function(e) {
				self.getEvtInsert.call(self, e);
			},
		false);
	
	this.erase.addEventListener('click',
	  function(e) {
	    self.getEvtErase.call(self, e);
	  },
	false);
}

/*
 * Called when body is clicked but no other event is called before
 * ( asserted with stopPropagation() in the other click handlers )
 */
Grid.prototype.getEvtBody = function (e) {
		this.commands.className = 'hidden';
}

/*
 * Called when a cell is clicked, either with a revealed number or
 * an editable one.
 * Change the visibility of the insertion "popup"
 */
Grid.prototype.getEvtClickCell = function (e) {
	this.modifiedCell = e.target;
	if (this.commands.className == 'hidden') {
		var strs = this.modifiedCell.id.split('-');
		this.commands.className = 'displayed line_' + strs[0] + ' col_' + strs[1];
	}
	else
		this.commands.className = 'hidden';
	e.stopPropagation();
}

/*
 * Called when the content of an editable cell is changed.
 * Call the verification method of the Game class to check
 * if the inserted number is correct or not, changing the
 * cell's color accordingly.
 */
Grid.prototype.getEvtChangeCell = function (e) {
	this.modifiedCell = e.target;

	// get cell value, cell line and cell column
	var value = this.modifiedCell.innerHTML;
	var strs = this.modifiedCell.id.split('-');
	var line = parseInt(strs[0])-1;
	var col = parseInt(strs[1])-1;
	
	// check if value inserted is correct, otherwise change background to red
	if (!this.game.respect(value, line, col)) {
	  removeClass(this.modifiedCell, 'right');
		addClass(this.modifiedCell, 'wrong');
	}
	else {
		removeClass(this.modifiedCell, 'wrong');
		addClass(this.modifiedCell, 'right');
	}
		
  // insert value in Game.grid
	this.game.changeValue(value,  line, col);
}

/*
 * Called when the user clicks on a number in the insertion "popup"
 */
Grid.prototype.getEvtInsert = function (e) {
	this.modifiedCell.innerHTML = e.target.innerHTML;
	this.commands.className = 'hidden';
	var event = document.createEvent('HTMLEvents');  
	event.initEvent('change',true,false);  
	this.modifiedCell.dispatchEvent(event);
	e.stopPropagation();
}

/*
 * Called when the user clicks on the Erase button in the insertion "popup"
 */
Grid.prototype.getEvtErase = function(e) {
  // get cell line and cell column
  var strs = this.modifiedCell.id.split('-');
	var line = parseInt(strs[0])-1;
	var col = parseInt(strs[1])-1;
	
  // insert null value in Game.grid
	this.game.changeValue(null,  line, col);
	
	this.modifiedCell.innerHTML = '';
	removeClass(this.modifiedCell, 'right');
	removeClass(this.modifiedCell, 'wrong');
	this.commands.className = 'hidden';
	e.stopPropagation();
 }

/*
 * Called when the user clicks on the New Game button
 * Shows the new game "popup"
 */
Grid.prototype.getEvtNewGame = function (e) {
	this.gameInfos.className = 'displayed center';
	e.stopPropagation();
}

/*
 * Called when the user clicks on the Cancel button in the new game "popup"
 * Hide the new game "popup"
 */
Grid.prototype.getEvtCancel = function (e) {
  this.gameInfos.className = 'hidden';
	e.stopPropagation();
}

/*
 * Called when the user clicks on the Start Game button in the new game "popup"
 * Hide the new game popup, delete the current grid, create a new game with the
 * Game class and create a new grid with the new revealed numbers
 */
Grid.prototype.getEvtStartGame = function () {
	var level = document.getElementById('level').value;
	
	/* Create new game */
	this.game.newGame(level);
	
	/* delete previous grid */
	var table =  document.getElementById('grid');
	table.innerHTML = '';
  
	/* init new grid */
	this.initGrid(this.game.baseGrid);
	
	this.gameInfos.className = 'hidden';
}

/*
 * Called when the user clicks on the Reset button
 * Delete the current grid and create a new one with only the revealed numbers
 * from the Game class
 */
Grid.prototype.getEvtReset = function (e) {
	this.game.resetGame();
  
	/* delete previous grid */
	var table =  document.getElementById('grid');
	table.innerHTML = '';
  
	/* init new grid */
	this.initGrid(this.game.baseGrid);
	
	e.stopPropagation();
}
