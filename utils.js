/* To shuffle an array */
Array.prototype.shuffle = function() {
	var s = [];
	while (this.length)
		s.push(this.splice(Math.random() * this.length, 1));
	while (s.length)
		this.push(s.pop());
	return this;
}