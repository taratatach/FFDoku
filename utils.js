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

/* To shuffle an array */
Array.prototype.shuffle = function() {
	var s = [];
	while (this.length)
		s.push(this.splice(Math.random() * this.length, 1));
	while (s.length)
		this.push(s.pop());
	return this;
}

/* To add a class to a node */
function addClass(node, className) {
  node.className += " " + className;
}

/* To remove a class from a node */
function removeClass(node, className) {
  var classes = node.className.split(" ");
  var i = 0;
  
  while (i < classes.length && classes[i] != className)
    i++;
  
  if (i < classes.length)
    classes.splice(i, 1);
    
  node.className = classes.join(" ");
}
