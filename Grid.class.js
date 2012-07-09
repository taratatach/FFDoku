function Grid() {
	this.cells = null;
	this.newGameLink = null;
	this.reset = null;
}

Grid.prototype.constructor = Grid;
function Grid() {
	var table = document.getElementById('grid');
	
	/* Initialize attributes */
	this.cells = new Array(9);
	for (i=0; i<9; i++) {
		var tr = document.createElement('tr');
		table.appendChild(tr);
		
		this.cells[i] = new Array(9);
		for (j=0; j<9; j++) {
			var td = document.createElement('td');
			td.setAttribute('class', 'cell');
			tr.appendChild(td);
			
			this.cells[i][j] = td;
		}			
	}
		
	this.newGameLink = document.getElementById('newGame');
	
	this.reset = document.getElementById('reset');
	
	/* Add events */
	Grid.prototype.addEvents();
}

Grid.prototype.fillCell = function (number, cell) {
	cell.className = 'number';
	cell.nodeValue = String(number);
}

Grid.prototype.addEvents = function () {
	for(i=0; i<this.cells.length; i++)
  	this.cells[i].addEventListener('click', Grid.prototype.getEvtCell, false);
  	
  this.newGameLink.addEventListener('click', Grid.prototype.getEvtNewGame, false);
  	  	
  this.reset.addEventListener('click', Grid.prototype.getEvtReset, false);
}

Grid.prototype.getEvtCell = function (e) {
	alert('bouh');
}

Grid.prototype.getEvtNewGame = function (e) {

}

Grid.prototype.getEvtReset = function (e) {

}
