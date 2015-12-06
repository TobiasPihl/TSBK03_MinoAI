
//TO BE REMOVED ______

//maze properties
var maze = [];
var mazeWidth = 40;
var mazeHeight = 40;

//____________________

var mazeGraphics;
var tileSize = 10;

//Phaser game variable
var game;

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
		
		//Set easystar properties
		var easystar = new EasyStar.js();
		easystar.setGrid(maze);
		easystar.setAcceptableTiles([0]);

		//set initial random patrol point
		Mino.getRandomPoint();
		Mino.calculatePath(easystar /*, destinationX, destinationY*/);

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
