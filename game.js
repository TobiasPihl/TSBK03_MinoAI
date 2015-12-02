var game;

//map properties
var tileSize = 10;
var mazeGraphics;

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

var maze = [];
var mazeWidth = 60;
var mazeHeight = 40;

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

window.onload = function() {
	game = new Phaser.Game(mazeWidth*tileSize, mazeHeight*tileSize, Phaser.CANVAS, "");
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
    var moves = [];
    var u = 0;
    var v = Math.floor((Math.random() * 10) + 1);
    for(var i = 0; i < mazeHeight; i ++){
         maze[i] = [];
         for(var j = 0; j < mazeWidth; j ++){
              maze[i][j] = 1;
              u ++;

              if(u == v){
                maze[i][j] = 0;
                v = Math.floor((Math.random() * 8) + 4);
                u = 0;
              }
         }
    }
    maze[posX][posY] = 0;
    moves.push(posY + posY * mazeWidth);
    while(moves.length){
         var possibleDirections = "";
         if(posX+2 > 0 && posX + 2 < mazeHeight - 1 && maze[posX + 2][posY] == 1){
              possibleDirections += "S";
         }
         if(posX-2 > 0 && posX - 2 < mazeHeight - 1 && maze[posX - 2][posY] == 1){
              possibleDirections += "N";
         }
         if(posY-2 > 0 && posY - 2 < mazeWidth - 1 && maze[posX][posY - 2] == 1){
              possibleDirections += "W";
         }
         if(posY+2 > 0 && posY + 2 < mazeWidth - 1 && maze[posX][posY + 2] == 1){
              possibleDirections += "E";
         }
         if(possibleDirections){
              var move = game.rnd.between(0, possibleDirections.length - 1);
              switch (possibleDirections[move]){
                   case "N":
                        maze[posX - 2][posY] = 0;
                        maze[posX - 1][posY] = 0;
                        posX -= 2;
                        break;
                   case "S":
                        maze[posX + 2][posY] = 0;
                        maze[posX + 1][posY] = 0;
                        posX += 2;
                        break;
                   case "W":
                        maze[posX][posY - 2] = 0;
                        maze[posX][posY - 1] = 0;
                        posY -= 2;
                        break;
                   case "E":
                        maze[posX][posY + 2]=0;
                        maze[posX][posY + 1]=0;
                        posY += 2;
                        break;
              }
              moves.push(posY + posX * mazeWidth);
         }
         else{
              var back = moves.pop();
              posX = Math.floor(back / mazeWidth);
              posY = back % mazeWidth;
         }
    }
		//mazeGraphics = game.add.graphics(0, 0);
		//drawMaze(posX, posY);

		//Place the player initially
		drawPlayer();
		drawMino();

		//Set easystar properties
		var easystar = new EasyStar.js();
		easystar.setGrid(maze);
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
			if(maze[playerYPos-1][playerXPos] == 0) {
				eraseOldPlayerPos(playerXPos, playerYPos);
				playerYPos--;
				drawPlayer(playerXPos, playerYPos);
			}
		break;
		case E:
			if(maze[playerYPos][playerXPos+1] == 0) {
				eraseOldPlayerPos(playerXPos, playerYPos);
				playerXPos++;
				drawPlayer(playerXPos, playerYPos);
			}
		break;
		case S:
			if(maze[playerYPos+1][playerXPos] == 0) {
				eraseOldPlayerPos(playerXPos, playerYPos);
				playerYPos++;
				drawPlayer(playerXPos, playerYPos);
			}
		break;
		case W:
			if(maze[playerYPos][playerXPos-1] == 0) {
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

		try{
			eraseOldPlayerPos(minoXPos,minoYPos);
			pathStep++;
			minoXPos = globalPath[pathStep].x;
			minoYPos = globalPath[pathStep].y;
			drawMino();
		}
		catch(err){
			console.log("Some Error");
		}		
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
