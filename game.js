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

//maze properties
var maze = [];
var mazeWidth = 60;
var mazeHeight = 40;

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
		updatePath(easystar);

		//start loop which moves enemy Mino
		moveMino();

		//Create line

		//var intersect = this.get
	}
}


//Move the mino enemy
function moveMino() {
	game.time.events.loop(Phaser.Timer.SECOND/15, function(){

		if( (minoXPos == destinationX && minoYPos == destinationY))
			console.log("At destination")
		else {
			eraseOldPlayerPos(minoXPos,minoYPos); //erase enemy(same funtion)
			pathStep++;
			minoXPos = globalPath[pathStep].x;
			minoYPos = globalPath[pathStep].y;
			drawMino();
		}
	});
}

//Update the path which the monster is walking
function updatePath(easystar){

	game.time.events.loop(Phaser.Timer.SECOND*5, function(){

		line = new Phaser.Line(minoXPos, minoYPos, playerXPos, playerYPos);

		if(getLineOfSight(line)){
		}

		switch(minoState) {
			case stateSearching:
				console.log("Searching");
				getRandomPoint();
				calculatePath(easystar, destinationX, destinationY);
			break;
			case stateChasing:
				console.log("Chasing");
				destinationX = playerXPos;
				destinationY = playerYPos;
				calculatePath(easystar, destinationX, destinationY);
			break;
		}
	});
}

//Get random spot in labyrinth
function getRandomPoint() {

	var xRand;
	var yRand;

	//keep trying until random point is walkable
	do {
		xRand = Math.floor(Math.random() * (mazeWidth-2)) + 1;
		yRand = Math.floor(Math.random() * (mazeHeight-2)) + 1;

		// console.log("Randomized: " + xRand + ", " + yRand);
		// console.log("rPoint has property: " + maze[xRand][yRand]);
	} while (!validatePoint(yRand, xRand));

	destinationX = xRand;
	destinationY = yRand;
}

//validate a given random point by checking if it's walkable
function validatePoint(xPos, yPos) {

	//TODO: INSTEAD CHECK IF THERE IS A PATH TO THE RAND POINT
	if( maze[xPos+1][yPos] == 1 &&
			maze[xPos-1][yPos] == 1 &&
			maze[xPos][yPos+1] == 1 &&
			maze[xPos][yPos-1] == 1 )
		return false;

	//returns false if point not walkable
	return (maze[xPos][yPos] == 0);
}

function getLineOfSight(line){

		//var intersect = line.intersects(maze, true);
		//If the lenght between player and mino is smaller than line.lenght
		//change state
		console.log(Math.floor(line.length));
		if(Math.floor(line.length) < 15){
			minoState = stateChasing;
			return true;
		}
		else {
			minoState = stateSearching;
		}
}

//update all visuals
function calculatePath(easystar, xPos, yPos) {
	easystar.findPath(minoXPos, minoYPos, xPos, yPos, drawPath);
	easystar.calculate();
	pathStep = 0;

	updateGraphics();
}

//update all visuals
function updateGraphics(easystar) {
	mazeGraphics.clear();
	drawMaze();
	drawPlayer();
	drawMino();
}
