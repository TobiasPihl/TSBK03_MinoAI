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
    [1, 0, 1, 0, 1, 0, 0, 0, 1, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 1, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 1, 1],
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

//enemy
var minoXPos = 18;
var minoYPos = 18;

//easystar path
var globalPath = null;
var pathStep = 0;

//World
var N = 0;
var E = 1;
var S = 2;
var W = 3;

window.onload = function() {
	game = new Phaser.Game(810, 610, Phaser.CANVAS, "");
	game.state.add("PlayGame",playGame);
	game.state.start("PlayGame");
}

var playGame = function(game){};

playGame.prototype = {

	//CREATE FUNCTION
	create: function(){

	//Set up input controlls and actions
		UP_ARROW	= game.input.keyboard.addKey(Phaser.Keyboard.UP);
		DOWN_ARROW	= game.input.keyboard.addKey(Phaser.Keyboard.DOWN);
		LEFT_ARROW	= game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
		RIGHT_ARROW	= game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
		
		//Initiate key input loop
		inputCheckLoop();

		//draw the maze
		mazeGraphics = game.add.graphics(0, 0);
		drawMaze();

		//Place the player initially
		drawPlayer();
		drawMino();

		//Set easystar properties
		var easystar = new EasyStar.js();
		easystar.setGrid(testLevel);
		easystar.setAcceptableTiles([0]);

		//draw graphics and path initially
		updateGraphics(easystar);
		
		//start loop which updates the mino's pathfinding
		updatePath(easystar);
		
		//start loop which moves enemy Mino
		moveMino();
	}
}

//Key input loop
function inputCheckLoop() {
	game.time.events.loop(Phaser.Timer.SECOND/6, function(){
		if(UP_ARROW.isDown) {
			playerMovement(N);
		}
		else if(DOWN_ARROW.isDown) {
			playerMovement(S);
		}
		else if(RIGHT_ARROW.isDown) {
			playerMovement(E);
		}
		else if(LEFT_ARROW.isDown) {
			playerMovement(W);
		}
	})
}

//Move controls for player
/** Check the tile if it's 1 or 0, 
	if 1, can't move there, 
	else update player position and redraw **/
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

//Move the mino enemy
function moveMino() {
	game.time.events.loop(Phaser.Timer.SECOND, function(){
		
		eraseOldPlayerPos(minoXPos,minoYPos);
		pathStep++;
		minoXPos = globalPath[pathStep].x;
		minoYPos = globalPath[pathStep].y;
		drawMino();
	})
}

//Update the path which the monster is walking
function updatePath(easystar){
	game.time.events.loop(Phaser.Timer.SECOND*5, function(){
		updateGraphics(easystar);
	})
}

//update all visuals
function updateGraphics(easystar) {
	mazeGraphics.clear();
	drawMaze();
	easystar.findPath(minoXPos, minoYPos, playerXPos, playerYPos, drawPath);
	easystar.calculate();
	drawPlayer();
	drawMino();
	pathStep = 0;
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
