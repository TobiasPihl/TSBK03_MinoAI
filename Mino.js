var Mino = (function(){

		return {
				//Update the path which the monster is walking
				updateMinoPath: function(easystar){

					game.time.events.loop(Phaser.Timer.SECOND*5, function(){

						line = new Phaser.Line(minoXPos, minoYPos, playerXPos, playerYPos);

						if(Mino.getLineOfSight(line)){
						}

						switch(minoState) {
							case stateSearching:
								console.log("Searching");
								Mino.getRandomPoint();
								Mino.calculatePath(easystar, destinationX, destinationY);
							break;
							case stateChasing:
								console.log("Chasing");
								destinationX = player.getX(); //playerXPos;
								destinationY = player.getY(); //playerYPos;
								Mino.calculatePath(easystar, destinationX, destinationY);
							break;
						}
					});
				},

				//Move the mino enemy
				moveMino: function() {
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
				},

				getLineOfSight: function(line){

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
				},

				//validate a given random point by checking if it's walkable
				validatePoint: function(xPos, yPos) {

					//TODO: INSTEAD CHECK IF THERE IS A PATH TO THE RAND POINT
					if( maze[xPos+1][yPos] == 1 &&
							maze[xPos-1][yPos] == 1 &&
							maze[xPos][yPos+1] == 1 &&
							maze[xPos][yPos-1] == 1 )
						return false;

					//returns false if point not walkable
					return (maze[xPos][yPos] == 0);
				},

				//update all visuals ?????
				calculatePath: function(easystar, xPos, yPos) {
					easystar.findPath(minoXPos, minoYPos, 
							xPos, yPos, drawPath);
					easystar.calculate();
					pathStep = 0;

					updateGraphics();
				},

				//Get random spot in labyrinth
				getRandomPoint: function() {

					var xRand;
					var yRand;

					//keep trying until random point is walkable
					do {
						xRand = Math.floor(Math.random() * (mazeWidth-2)) + 1;
						yRand = Math.floor(Math.random() * (mazeHeight-2)) + 1;

						// console.log("Randomized: " + xRand + ", " + yRand);
						// console.log("rPoint has property: " + maze[xRand][yRand]);
					} while (!Mino.validatePoint(yRand, xRand));

					destinationX = xRand;
					destinationY = yRand;
				}
		}
})();
