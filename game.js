
//TO BE REMOVED ______
var playerXPos = 10;
var playerYPos = 10;


//enemy
var minoXPos = 18;
var minoYPos = 18;

//Enemy states
var minoState;
var stateSearching = 0;
var stateChasing = 1;

//maze properties
var maze = [];
var mazeWidth = 40;
var mazeHeight = 40;
//____________________

var mazeGraphics;
var tileSize = 10;

//Phaser game variable
var game;

//random destinationpoint
var destinationX;
var destinationY;

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
	game = new Phaser.Game(mazeWidth * tileSize, 
			mazeHeight * tileSize, 
			Phaser.auto, 'content');
	game.state.add("PlayGame",playGame);
	game.state.start("PlayGame");
}

var playGame = function(game){}; //Delete This Or Use IT???

playGame.prototype = {

	//CREATE FUNCTION
	create: function(){
		
		//set Player position
		player.setPosition(5, 5);
	
		//NO NEED TO DO THIS, FIX
		maze = Maze.createMaze(maze, mazeWidth, mazeHeight);
		
		//set enemy state initially
		minoState = stateSearching;//stateSearching;

		//Set easystar properties
		var easystar = new EasyStar.js();
		easystar.setGrid(maze);
		easystar.setAcceptableTiles([0]);

		//set initial random patrol point
		Mino.getRandomPoint();
		Mino.calculatePath(easystar, destinationX, destinationY);

		//start loop which updates the mino's pathfinding
		Mino.updateMinoPath(easystar);

		//start loop which moves enemy Mino
		Mino.moveMino();

		//var intersect = this.get
		
		//set controllers
		UP_ARROW	= game.input.keyboard.addKey(Phaser.Keyboard.UP);
		DOWN_ARROW	= game.input.keyboard.addKey(Phaser.Keyboard.DOWN);
		LEFT_ARROW	= game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
		RIGHT_ARROW	= game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
		
		//Initiate key input loop
		inputCheckLoop();
	}
}

//update all visuals
function updateGraphics(easystar) {
	
	mazeGraphics.clear();
	//drawGraphics.clearGraphics();
	
	drawMaze();
	drawPlayer(player.getX(), player.getY());
	drawMino();
}

//Key input loop
function inputCheckLoop() {
	game.time.events.loop(Phaser.Timer.SECOND/10, function(){
		if(UP_ARROW.isDown) {
			player.playerMovement(N);
		}
		else if(DOWN_ARROW.isDown) {
			player.playerMovement(S);
		}
		else if(RIGHT_ARROW.isDown) {
			player.playerMovement(E);
		}
		else if(LEFT_ARROW.isDown) {
			player.playerMovement(W);
		}
	})
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
	globalPath = path; //Edit
}
