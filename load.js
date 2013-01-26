(function () {
    function init() {
	var game = new Game('easy');
	new Grid(game);
    }
    
    window.addEventListener('load', init, false);
})();
