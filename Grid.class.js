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

/* SITES INTERESSANTS
 *
 * http://killdream.github.com/blog/2011/10/understanding-javascript-oop/
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
 	this.reset = document.getElementById('reset');
 	this.inserts = document.getElementsByClassName('insert');
 	this.erase = document.getElementById('erase');
  	
	this.initGrid(this.game.baseGrid);
	
 	this.modifiedCell = null;
}

Grid.prototype.initGrid = function (gameGrid) {
	var self = this;
	var table = document.getElementById('grid');
	
	this.cells = new Array(9);
	for (i=0; i<9; i++) {
		var tr = document.createElement('tr');
		table.appendChild(tr);
		
		this.cells[i] = new Array(9);
		for (j=0; j<9; j++) {
			var td = document.createElement('td');
			var input = document.createElement('input');
			
			input.type = "text";
			input.id = String((i+1) + '-' + (j+1));
			if (gameGrid[i][j] == null)
				input.className = 'cell';
			else {
				input.className = 'number';
				input.value = gameGrid[i][j];
				input.setAttribute('disabled', 'disabled');
			}
			
			td.appendChild(input);
			tr.appendChild(td);
			
			this.cells[i][j] = input;
		}			
	}
	
  /* Add events */
 	self.addEvents.call(self);
}

Grid.prototype.addEvents = function () {
	var self = this;
	
	document.addEventListener('click', 
		function(e) {
			self.getEvtBody.call(self, e);
		},
	true);
	
	var cells = document.getElementsByClassName('cell');
	for(i=0; i<cells.length; i++) {
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
		function() {
			self.getEvtNewGame.call(self);
		},
	false);
	
	this.startGame.addEventListener('click',
		function() {
			self.getEvtStartGame.call(self);
		},
	false);
  
	this.reset.addEventListener('click',
		function() {
			self.getEvtReset.call(self);
		},
	false);
  
	for(i=0; i<this.inserts.length; i++)
		this.inserts[i].addEventListener('click',
			function(e) {
				self.getEvtInsert.call(self, e);
			},
		false);
	
	this.erase.addEventListener('click',
	  function() {
	    self.getEvtErase.call(self);
	  },
	false);
}

Grid.prototype.getEvtBody = function (e) {
	if (e.target.nodeName != 'INPUT')
		this.commands.className = 'hidden';
	if (e.target.id != 'gameInfos'
		&& e.target.parentNode.id != 'gameInfos'
		&& e.target.parentNode.parentNode.id != 'gameInfos'
		&& e.target.parentNode.parentNode.parentNode.id != 'gameInfos') {
		this.gameInfos.className = 'hidden';
	}
}

Grid.prototype.getEvtClickCell = function (e) {
	this.modifiedCell = e.target;
	if (this.commands.className == 'hidden') {
		var strs = this.modifiedCell.id.split('-');
		this.commands.className = 'displayed line_' + strs[0] + ' col_' + strs[1];
	}
	else
		this.commands.className = 'hidden';
}

Grid.prototype.getEvtChangeCell = function (e) {
	this.modifiedCell = e.target;

	// get cell value, cell line and cell column
	var value = this.modifiedCell.value;
	var strs = this.modifiedCell.id.split('-');
	var line = parseInt(strs[0])-1;
	var col = parseInt(strs[1])-1;
	
	// insert value in Game.grid
	this.game.changeValue(value,  line, col);
	
	// check if value inserted is correct, otherwise change background to red
	if (!this.game.respect(value, line, col))
		this.modifiedCell.className = 'cell wrong';
	else
		this.modifiedCell.className = 'cell right';
}

Grid.prototype.getEvtInsert = function (e) {
	this.modifiedCell.value = e.target.innerHTML;
	this.commands.className = 'hidden';
	var event = document.createEvent('HTMLEvents');  
	event.initEvent('change',true,false);  
	this.modifiedCell.dispatchEvent(event);
}

Grid.prototype.getEvtErase = function() {
	this.modifiedCell.value = '';
	this.modifiedCell.className = 'cell';
	this.commands.className = 'hidden';
 }

Grid.prototype.getEvtNewGame = function () {
	this.gameInfos.className = 'displayed center';
}

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

Grid.prototype.getEvtReset = function () {
	this.game.resetGame();
  
	/* delete previous grid */
	var table =  document.getElementById('grid');
	table.innerHTML = '';
  
	/* init new grid */
	this.initGrid(this.game.baseGrid);
}
