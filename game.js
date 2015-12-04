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
var mazeWidth = 60;
var mazeHeight = 40;
var mazeGraphics;

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


		//var Mino = new mino.js();
		//Initiate player input controllers
		playerInputInit();

		//Initiate key input loop
		inputCheckLoop();

		//draw the maze
		var Maze = new maze.js();
		maze = createMaze(maze, mazeWidth, mazeHeight);

		var Mino = new mino.js();
		//mazeGraphics = game.add.graphics(0, 0);
		//drawMaze(posX, posY);

		//Place the player initially
		drawPlayer();
		drawMino();

		//make sure enemy  position is walkable
		//maze[minoXPos][minoYPos] = 1;

		//set enemy state initially
		minoState = stateSearching;//stateSearching;

		//Set easystar properties
		var easystar = new EasyStar.js();
		easystar.setGrid(maze);
		easystar.setAcceptableTiles([0]);

		//set initial random patrol point
		getRandomPoint();
		calculatePath(easystar, destinationX, destinationY);

		//draw graphics and path initially
		//calculatePath(easystar, playerXPos, playerYPos);

		//start loop which updates the mino's pathfinding
		updateMinoPath(easystar);

		//start loop which moves enemy Mino
		moveMino();

		//var intersect = this.get
	}
}

//Draw player, updating his position
function drawPlayer(xPos, yPox, xPosNew, yPoxNew) {
	mazeGraphics.beginFill(0x25DD00);
	mazeGraphics.drawRect(playerXPos * tileSize, playerYPos * tileSize, tileSize, tileSize);
}

//Draw player, updating his position
function drawMino() {
	mazeGraphics.beginFill(0xFFFF00);
	mazeGraphics.drawRect(minoXPos * tileSize, minoYPos * tileSize, tileSize, tileSize);
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

//Draw a path showing the calculated path to target location
function drawPath(path){

	var i = 1;
	while (i<path.length-1) {
		mazeGraphics.beginFill(0xFF0000);
		mazeGraphics.drawRect(path[i].x * tileSize + 3, path[i].y * tileSize + 3, tileSize - 6, tileSize - 6);
		i++;
		mazeGraphics.endFill();
	}
	globalPath = path;

}

//Draw the maze based on the grid array
function drawMaze(posX, posY){
	mazeGraphics.clear();
	mazeGraphics.beginFill(0x968551);
	for(i = 0; i < mazeHeight; i ++){
		for(j = 0; j < mazeWidth; j ++){
			if( maze[i][j] == 1){
				mazeGraphics.drawRect(j * tileSize, i * tileSize, tileSize, tileSize);
			}
		}
	}
	mazeGraphics.endFill();
}
