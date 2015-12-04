//Phaser game variable
var game;

//enemy
var minoXPos = 18;
var minoYPos = 18;

//random destinationpoint
var destinationX;
var destinationY;

//Enemy states
var minoState;
var stateSearching = 0;
var stateChasing = 1;

//map properties
var tileSize = 10;

var mino = [];

//maze properties
var maze = [];
var mazeWidth = 80;
var mazeHeight = 60;

//var mazeGraphics;

//easystar path
var globalPath = null;
var pathStep = 0;

//World
var N = 0;
var E = 1;
var S = 2;
var W = 3;

var posX = 1;
var posY = 1;

var line;
var tileHits = [];

window.onload = function() {
	game = new Phaser.Game(mazeWidth*tileSize, mazeHeight*tileSize, Phaser.auto, 'content');
	game.state.add("PlayGame",playGame);
	game.state.start("PlayGame");

}

var playGame = function(game){};

playGame.prototype = {

	//CREATE FUNCTION
	create: function(){

		//Initiate player input controllers
		playerInputInit();

		//Initiate key input loop
		inputCheckLoop();

		//draw the maze
		var Maze = new maze.js();
		maze = createMaze(maze, mazeWidth, mazeHeight);

		var Mino = new mino.js();

		//Place the player initially
		drawPlayer();
		drawMino();

		//set enemy state initially
		minoState = stateSearching;//stateSearching;

		//Set easystar properties
		var easystar = new EasyStar.js();
		easystar.setGrid(maze);
		easystar.setAcceptableTiles([0]);

		//set initial random patrol point
		getRandomPoint();
		calculatePath(easystar, destinationX, destinationY);

		//start loop which updates the mino's pathfinding
		updateMinoPath(easystar);

		//start loop which moves enemy Mino
		moveMino();

		//var intersect = this.get
	}
}

//when player moves, delete player icon from old position
function eraseOldPlayerPos(xPos, yPos) {
	mazeGraphics.beginFill(0x000000);
	mazeGraphics.drawRect(xPos * tileSize, yPos * tileSize, tileSize, tileSize);
}

//update all visuals
function updateGraphics(easystar) {
	mazeGraphics.clear();
	drawMaze();
	drawPlayer();
	drawMino();
}
