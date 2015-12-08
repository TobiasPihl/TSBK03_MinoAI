//Mino Object
var Mino = (function(){

		//Private Variables
		var xPosition = 18;
		var yPosition = 18;

		var xDestination;
		var yDestination;

		var State = {
			SEARCHING: 1,
			CHASING: 2,
		};

		var myState = State.SEARCHING;

		return {

			//Get x coordinate
			getX: function() { return xPosition },

			//Get y coordinate
			getY: function() { return yPosition },

			//Set potition
			setPosition: function(xPos, yPos) {
				xPosition = xPos;
				yPosition = yPos;
			},

			//Update the path which the monster is walking
			updateMinoPath: function(easystar){

				game.time.events.loop(Phaser.Timer.SECOND*3, function(){

					line = new Phaser.Line(xPosition, yPosition,
							player.getX(), player.getY());

					if(Mino.getLineOfSight(line)) {
						myState = State.CHASING;
					}
					else{
						myState = State.SEARCHING;
					}

					switch( myState ) {
						case State.SEARCHING:
							console.log("Searching");
							Mino.getRandomPoint();
							Mino.calculatePath(easystar, xDestination, yDestination);
						break;
						case State.CHASING:
							console.log("Chasing");
							xDestination = player.getX();
							yDestination = player.getY();
							Mino.calculatePath(easystar, xDestination, yDestination);
						break;
					}
				});
			},

			//Move the mino enemy
			moveMino: function() {
				game.time.events.loop(Phaser.Timer.SECOND/15, function(){

					if( (xPosition == xDestination && yPosition == yDestination))
						console.log("At destination")
					else {
						eraseOldPos(xPosition, yPosition); //erase enemy(same funtion)
						pathStep++;
						if(globalPath == null){
							console.log("Path is null");
						}
						xPosition = globalPath[pathStep].x;
						yPosition = globalPath[pathStep].y;
						drawUnit("Mino", xPosition, yPosition);
					}
				});
			},

			//Returns true if there is no wall along the line
			//Wall equals a maze value of zero
			getLineOfSight: function(line){

					var arr = [];
					//Store all the coordinates values along the line in an array
					line.coordinatesOnLine(0.5, arr);

					//Loop through the array
					for(i = 0; i < arr.length; i++ ){

						//Check if the coordinates in the array equals a wall
						if(maze[ arr[i][1] ][ arr[i][0] ] == 1){
							console.log("NOT IN SIGHT");
							return false;
						}
					}

					//If the array cleared the check no wall where found
					// and the function returns true
					console.log("IN SIGHT");
					return true;
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
			calculatePath: function(easystar) {
				easystar.findPath(xPosition, yPosition,
						xDestination, yDestination, drawPath);
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
				} while (!Mino.validatePoint(yRand, xRand));

				xDestination = xRand;
				yDestination = yRand;
			}

		}
})();
