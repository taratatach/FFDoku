/* SITES INTERESSANTS
 *
 * http://killdream.github.com/blog/2011/10/understanding-javascript-oop/
 */

function Grid (game) {
	var table = document.getElementById('grid');
	this.commands = document.getElementById('commands');
	this.commands.className = 'hidden';
	
	/* Initialize attributes */
	this.cells = new Array(9);
	for (i=0; i<9; i++) {
		var tr = document.createElement('tr');
		table.appendChild(tr);
		
		this.cells[i] = new Array(9);
		for (j=0; j<9; j++) {
			var td = document.createElement('td');
			
			if (game.grid[i][j] == null)
  			td.className = 'cell';
	    else {
	      td.className = 'number';
	      td.innerHTML = game.grid[i][j];
	    }
	    
			tr.appendChild(td);
			
			this.cells[i][j] = td;
		}			
	}
	this.newGame = document.getElementById('newGame');
	this.reset = document.getElementById('reset');
	this.modifiedCell = null;
	this.inserts = document.getElementsByClassName('insert');
	this.erase = document.getElementById('erase');
	
	/* Add events */
	this.addEvents();
}

Grid.prototype.addEvents = function () {
	var self = this;
	
	document.addEventListener('click', 
		function(e) {
			self.getEvtBody.call(self, e)
		},
	true);
	
	var cells = document.getElementsByClassName('cell');
	for(i=0; i<cells.length; i++) {
		cells[i].addEventListener('click',
			function(e) {
				self.getEvtClickCell.call(self, e)
			}, 
		false);
		cells[i].addEventListener('change',
			function(e) {
				self.getEvtChangeCell.call(self, e)
			},
		false);
	}
	
  this.newGame.addEventListener('click', self.getEvtNewGame, false);
  
  this.reset.addEventListener('click', self.getEvtReset, false);
  
	for(i=0; i<this.inserts.length; i++)
		this.inserts[i].addEventListener('click',
			function(e) {
				self.getEvtInsert.call(self, e)
			},
		false);
	
	this.erase.addEventListener('click',
	  function() {
	    self.getEvtErase.call(self)
	  },
	false);
}

Grid.prototype.getEvtBody = function (e) {
	if (e.target.nodeName != 'TD')
		this.commands.className = 'hidden';
}

Grid.prototype.getEvtClickCell = function (e) {
	console.log(this);
	this.modifiedCell = e.target;
	if (this.commands.className == 'hidden')
		this.commands.className = 'displayed';
	else
		this.commands.className = 'hidden';
}

Grid.prototype.getEvtChangeCell = function (e) {
	// check if value inserted is correct
	
	// otherwise change background to red
}

Grid.prototype.getEvtInsert = function (e) {
	this.modifiedCell.innerHTML = e.target.innerHTML;
	this.commands.className = 'hidden';
}

Grid.prototype.getEvtErase = function() {
  this.modifiedCell.innerHTML = '';
  this.commands.className = 'hidden';
 }

Grid.prototype.getEvtNewGame = function (e) {
	alert('new game');
}

Grid.prototype.getEvtReset = function (e) {
	alert('reset');
}
