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

// //Draw player, updating his position
// function drawPlayer(xPos, yPox, xPosNew, yPoxNew) {
	// mazeGraphics.beginFill(0x25DD00);
	// mazeGraphics.drawRect(playerXPos * tileSize, playerYPos * tileSize, tileSize, tileSize);
// }

// //Draw player, updating his position
// function drawMino() {
	// mazeGraphics.beginFill(0xFFFF00);
	// mazeGraphics.drawRect(minoXPos * tileSize, minoYPos * tileSize, tileSize, tileSize);
// }

// //when player moves, delete player icon from old position
// function eraseOldPlayerPos(xPos, yPos) {
	// mazeGraphics.beginFill(0x000000);
	// mazeGraphics.drawRect(xPos * tileSize, yPos * tileSize, tileSize, tileSize);
// }


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

// //Draw a path showing the calculated path to target location
// function drawPath(path){

	// var i = 1;
	// while (i<path.length-1) {
		// mazeGraphics.beginFill(0xFF0000);
		// mazeGraphics.drawRect(path[i].x * tileSize + 3, path[i].y * tileSize + 3, tileSize - 6, tileSize - 6);
		// i++;
		// mazeGraphics.endFill();
	// }
	// globalPath = path;

// }

// //Draw the maze based on the grid array
// function drawMaze(posX, posY){
	// mazeGraphics.clear();
	// mazeGraphics.beginFill(0x968551);
	// for(i = 0; i < mazeHeight; i ++){
		// for(j = 0; j < mazeWidth; j ++){
			// if( maze[i][j] == 1){
				// mazeGraphics.drawRect(j * tileSize, i * tileSize, tileSize, tileSize);
			// }
		// }
	// }
	// mazeGraphics.endFill();
// }
