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

//Player
var playerXPos = 3;
var playerYPos = 1;

//World
var N = 0;
var E = 1;
var S = 2;
var W = 3;

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

	//Set up input controlls and actions
		UP_ARROW	= game.input.keyboard.addKey(Phaser.Keyboard.UP).
		onDown.add(	function() {
			playerMovement(N);
		}, this);
		
		DOWN_ARROW	= game.input.keyboard.addKey(Phaser.Keyboard.DOWN).
		onDown.add(	function() {
			playerMovement(S);
		}, this);
		
		LEFT_ARROW	= game.input.keyboard.addKey(Phaser.Keyboard.LEFT).
		onDown.add(	function() {
			playerMovement(W);
		}, this);
		
		RIGHT_ARROW	= game.input.keyboard.addKey(Phaser.Keyboard.RIGHT).
		onDown.add(	function() {
			playerMovement(E);
		}, this);
		
		//Add graphics
		//sprite = game.add.sprite(300, 300, 'phaser');

		//Initialize game main loop
		game.time.events.loop(Phaser.Timer.SECOND/60, MainLoop)

		//draw the maze
		mazeGraphics = game.add.graphics(0, 0);
		drawMaze();      
		
		//Place the player initially
		drawPlayer();

		//Set easystar properties
		var easystar = new EasyStar.js();
		easystar.setGrid(testLevel);
		easystar.setAcceptableTiles([0]);
		
		updatePath(easystar);
	}
}

//Move controls for player
/*** Check the tile if it's one or zero, if 1, can't move there ***/
function playerMovement(dir) {
	
	switch (dir) {
		
		case N:
			if(testLevel[playerYPos-1][playerXPos] == 0) {
				eraseOldPlayerPos(playerXPos, playerYPos);
				playerYPos--;
				drawPlayer(playerXPos, playerYPos);
			}
		break;
		case E:
			if(testLevel[playerYPos][playerXPos+1] == 0) {
				eraseOldPlayerPos(playerXPos, playerYPos);
				playerXPos++;
				drawPlayer(playerXPos, playerYPos);
			}
		break;
		case S:
			if(testLevel[playerYPos+1][playerXPos] == 0) {
				eraseOldPlayerPos(playerXPos, playerYPos);
				playerYPos++;
				drawPlayer(playerXPos, playerYPos);
			}	
		break;
		case W:
			if(testLevel[playerYPos][playerXPos-1] == 0) {
				eraseOldPlayerPos(playerXPos, playerYPos);
				playerXPos--;
				drawPlayer(playerXPos, playerYPos);
			}
		break;
	}
}

//Draw player, updating his position
function drawPlayer() {
	mazeGraphics.beginFill(0x25DD00);
	mazeGraphics.drawRect(playerXPos * tileSize, playerYPos * tileSize, tileSize, tileSize);
}

function eraseOldPlayerPos(xPos, yPos) {
	mazeGraphics.beginFill(0x000000);
	mazeGraphics.drawRect(xPos * tileSize, yPos * tileSize, tileSize, tileSize);
}

function updatePath(easystar){

	var i = 0;
	game.time.events.loop(Phaser.Timer.SECOND*2, function(){
		mazeGraphics.clear();
		drawMaze();
		drawPlayer();
		easystar.findPath(1, 1, playerXPos, playerYPos, drawPath);
		easystar.calculate();
		
	})
}

//Draw a path showing the calculated path to target location
function drawPath(path){

	var i = 0;
	game.time.events.loop(0*Phaser.Timer.SECOND/10, function(){
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
