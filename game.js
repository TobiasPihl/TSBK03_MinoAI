var game;

//map properties
var tileSize = 10;
var mazeGraphics;

//LEVEL
var testLevelWidth = 20;
var testLevelHeight = 20;
var testLevel =
   [[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
	  [1, 0, 1, 0, 1, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 1, 1, 1],
	  [1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 0, 0, 0, 1, 1, 1, 0, 1, 0, 1],
	  [1, 0, 1, 0, 1, 0, 0, 0, 0, 1, 0, 1, 0, 0, 1, 1, 0, 0, 0, 1],
	  [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 1, 0, 1, 0, 1, 1, 0, 1],
    [1, 0, 1, 0, 1, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 0, 1, 0, 1, 1],
    [1, 0, 1, 0, 1, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1],
    [1, 1, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 1, 0, 1, 1, 0, 1, 1, 1],
    [1, 0, 0, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 0, 1, 0, 1, 1, 1],
    [1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 1, 0, 1, 0, 1, 1, 1],
    [1, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 1, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 1, 0, 1, 0, 1],
    [1, 0, 1, 1, 0, 1, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1],
    [1, 0, 0, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1],
    [1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 1, 0, 1],
    [1, 1, 0, 1, 0, 1, 1, 1, 0, 0, 0, 1, 1, 1, 0, 1, 0, 1, 0, 1],
    [1, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 1, 0, 1, 1, 0, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1],
    [1, 0, 0, 1, 0, 1, 1, 0, 1, 0, 0, 0, 0, 1, 1, 0, 0, 1, 0, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]];

//Input
var UP_ARROW;
var DOWN_ARROW;
var LEFT_ARROW;
var RIGHT_ARROW;

//Graphics
var sprite;

window.onload = function() {
	game = new Phaser.Game(810, 610, Phaser.CANVAS, "");
	game.state.add("PlayGame",playGame);
	game.state.start("PlayGame");

	//load sprite
	//game.load.image('phaser', 'assets/sprites/phaser-dude.png');
}

var playGame = function(game){};


//MAIN GAME LOOP
function MainLoop() {

}

playGame.prototype = {

	//CREATE FUNCTION
	create: function(){

		//Set up input controlls
		UP_ARROW	= game.input.keyboard.addKey(Phaser.Keyboard.UP);
		DOWN_ARROW 	= game.input.keyboard.addKey(Phaser.Keyboard.DOWN);
		LEFT_ARROW 	= game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
		RIGHT_ARROW = game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);

		//Define on down actions
		UP_ARROW.onDown.add(function(){ alert("Up") }, this);
		DOWN_ARROW.onDown.add(function(){ alert("Down") }, this);
		LEFT_ARROW.onDown.add(function(){ alert("Left") }, this);
		RIGHT_ARROW.onDown.add(function(){ alert("Right") }, this);

		//Add graphics
		//sprite = game.add.sprite(300, 300, 'phaser');

		//Initialize game main loop
		game.time.events.loop(Phaser.Timer.SECOND/60, MainLoop)

		//draw the maze
		mazeGraphics = game.add.graphics(0, 0);
		drawMaze();

		//Set easystar properties
		var easystar = new EasyStar.js();
		easystar.setGrid(testLevel);
		easystar.setAcceptableTiles([0]);
		easystar.findPath(1, 1, 5, 1, drawPath);
		easystar.calculate();
	}
}

//Draw a path showing the calculated path to target location
function drawPath(path){

	var i = 0;
	game.time.events.loop(Phaser.Timer.SECOND/10, function(){
		if(i < path.length){
			mazeGraphics.beginFill(0xFF0000);
			mazeGraphics.drawRect(path[i].x * tileSize + 3, path[i].y * tileSize + 3, tileSize - 6, tileSize - 6);
			i++;
			mazeGraphics.endFill();
		}
	})
}

//Draw the maze based on the grid array
function drawMaze(){
     mazeGraphics.clear();
     mazeGraphics.beginFill(0xFFFFFF);
     for(i = 0; i < testLevelHeight; i ++){
          for(j = 0; j < testLevelWidth; j ++){
               if( testLevel[i][j] == 1){
                    mazeGraphics.drawRect(j * tileSize, i * tileSize, tileSize, tileSize);
               }
          }
     }
     mazeGraphics.endFill();
}
