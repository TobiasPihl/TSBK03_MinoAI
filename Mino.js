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
		
		var patrolPathUpdateLoop;
		var moveMinoLoop;
		
		var searchSpeedInterval = Phaser.Timer.SECOND/200;
		var chaseSpeedInterval = Phaser.Timer.SECOND/6;
		var speedInterval = searchSpeedInterval;
		
		var searchUpdateInterval = Phaser.Timer.SECOND*0.3;
		var chaseUpdateInterval = Phaser.Timer.SECOND/2;
		var updateInterval = searchUpdateInterval;
		
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
			
			//Set state
			setState: function(state) {},
			
			//Get state
			getState: function() {return myState},
			
			//Test if mino should start chasing
			shouldChaseTest: function() {
				
				if( Mino.getLineOfSight() && myState == State.SEARCHING ){
					myState = State.CHASING;
					
					//restart updatePath loop with proper interval
					game.time.events.remove(patrolPathUpdateLoop); 
					Mino.updateMinoPath();
					
					//restart moveMino loop with proper speed
					game.time.events.remove(moveMinoLoop); 
					Mino.moveMino();
				}
				else if( !Mino.getLineOfSight() && myState == State.CHASING ) {
					myState = State.SEARCHING;
					
					//restart updatePath loop with proper interval
					game.time.events.remove(patrolPathUpdateLoop);
					Mino.updateMinoPath();
					
					//restart moveMino loop with proper speed
					game.time.events.remove(moveMinoLoop); 
					Mino.moveMino();
				}
			},
			
			updateMinoPath: function(){
				
				switch (myState) {
					case State.SEARCHING:
						updateInterval = searchUpdateInterval;
					break;
					case State.CHASING:
						updateInterval = chaseUpdateInterval;
					break;
				}
				
				//A loop defining how often the mino updates his path when SEARCHING
				patrolPathUpdateLoop = game.time.events.loop(updateInterval, function(){
					Mino.choosePathByState();
				});
			},
			
			//A destination point for the path is set depending on active state
			choosePathByState: function () {
				switch( myState ) {
					case State.SEARCHING:
						Mino.getRandomPoint();
						Mino.calculatePath(easystar, xDestination, yDestination);
					break;
					case State.CHASING:
						xDestination = player.getX();
						yDestination = player.getY();
						Mino.calculatePath(easystar, xDestination, yDestination);
					break;
				}
			},

			//Move the Mino along path with an interval
			moveMino: function() {
				
				//choose speed depending on state
				switch (myState) {
					case State.SEARCHING:
						speedInterval = searchSpeedInterval;
					break;
					case State.CHASING:
						speedInterval = chaseSpeedInterval;
					break;
				}
				
				moveMinoLoop = game.time.events.loop(speedInterval, function(){

					if( (xPosition == xDestination && yPosition == yDestination)) {
					}
					else {
						eraseOldPos(xPosition, yPosition);
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

			//	TODO: MODIFY THIS IN ORDER TO MAKE MINO ACT DIFFERENTLY IF HE'S CLOSER TO PLAYER
			getRadious: function(){
				line = new Phaser.Line(xPosition, yPosition,
						player.getX(), player.getY());
			},
			
			//Returns true if there is no wall along the line
			//Wall equals a maze value of zero
			getLineOfSight: function(){
					
					//get line between mino and player
					line = new Phaser.Line(xPosition, yPosition,
						player.getX(), player.getY());
					
					var arr = [];
					//Store all the coordinates values along the line in an array
					line.coordinatesOnLine(0.5, arr);

					//Loop through the array
					for(i = 0; i < arr.length; i++ ){

						//Check if the coordinates in the array equals a wall
						if(maze[ arr[i][1] ][ arr[i][0] ] == 1){
							return false;
						}
					}

					//If the array cleared the check no wall where found
					// and the function returns true
					
					xDestination = player.getX();
					yDestination = player.getY();
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

			// Calculate path from current point to destination
			calculatePath: function(easystar) {
				if(!(xPosition == xDestination && yPosition == yDestination)) {
					easystar.findPath(xPosition, yPosition, xDestination, yDestination, drawPath);
					easystar.calculate();
					pathStep = 0;

					updateGraphics();
				}				
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
