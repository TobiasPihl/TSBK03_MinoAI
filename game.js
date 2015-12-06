
//TO BE REMOVED ______
var playerXPos = 10;
var playerYPos = 10;

//____________________

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

//maze properties
var maze = [];
var mazeWidth = 80;
var mazeHeight = 60;
var tileSize = 10;

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

	preload: function(){
		//load preloader assets
	},

	//CREATE FUNCTION
	create: function(){
		// Setup game enviroment

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

		//start loop which moves enemy Mino
		Mino.moveMino();

		//start loop which updates the mino's pathfinding
		Mino.updateMinoPath(this.easystar);

		//var intersect = this.get

		//set controllers
		UP_ARROW	= this.game.input.keyboard.addKey(Phaser.Keyboard.UP);
		DOWN_ARROW	= this.game.input.keyboard.addKey(Phaser.Keyboard.DOWN);
		LEFT_ARROW	= this.game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
		RIGHT_ARROW	= this.game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);

		//Initiate key input loop
		inputCheckLoop();


	},

	update: function(){

	}

}

//update all visuals
function updateGraphics(easystar) {
	mazeGraphics.clear();
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
