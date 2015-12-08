
//maze properties
var maze = [];
var mazeWidth = 30;
var mazeHeight = 30;

//____________________

var mazeGraphics;
var tileSize = 10;

//Phaser game 
var game;

//Easystar 
var easystar;

//easystar path
var globalPath = null;
var pathStep = 0;

//World
var Direction = {
	NORTH : 0,
	EAST  : 1,
	SOUTH : 2,
	WEST  : 3,
};

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

		//Set easystar properties
		easystar = new EasyStar.js();
		easystar.setGrid(maze);
		easystar.setAcceptableTiles([0]);

		//set initial random patrol point
		Mino.getRandomPoint(mazeWidth, mazeHeight);
		Mino.calculatePath(easystar);

		//start loop which moves enemy Mino
		Mino.moveMino();

		//start loop which updates the mino's pathfinding
		Mino.updateMinoPath();

		//var intersect = this.get

		//set controllers
		UP_ARROW	= game.input.keyboard.addKey(Phaser.Keyboard.UP);
		DOWN_ARROW	= game.input.keyboard.addKey(Phaser.Keyboard.DOWN);
		LEFT_ARROW	= game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
		RIGHT_ARROW	= game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);

		//Initiate key input loop
		inputCheckLoop();
	},

	update: function(){
		
		//changes state to chasing ir requirements are met
		Mino.shouldChaseTest();
	}
}

//update all visuals
function updateGraphics(easystar) {
	mazeGraphics.clear();
	drawMaze();
	drawUnit("Player", player.getX(), player.getY());
	drawUnit("Mino", Mino.getX(), Mino.getY());
}

//Key input loop
function inputCheckLoop() {
	game.time.events.loop(Phaser.Timer.SECOND/10, function(){
		if(UP_ARROW.isDown) {
			player.playerMovement(Direction.NORTH);
		}
		else if(DOWN_ARROW.isDown) {
			player.playerMovement(Direction.SOUTH);
		}
		else if(RIGHT_ARROW.isDown) {
			player.playerMovement(Direction.EAST);
		}
		else if(LEFT_ARROW.isDown) {
			player.playerMovement(Direction.WEST);
		}
	})
}
