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
		
		var searchSpeedInterval = Phaser.Timer.SECOND/2;
		var chaseSpeedInterval = Phaser.Timer.SECOND/6;
		var speedInterval = searchSpeedInterval;
		
		var searchUpdateInterval = Phaser.Timer.SECOND*5;
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
					console.log("Start Chasing");
					
					myState = State.CHASING;
					
					//restart moveMino loop with proper speed
					game.time.events.remove(moveMinoLoop); 
					Mino.moveMino();
					
					//restart updatePath loop with proper interval
					game.time.events.remove(patrolPathUpdateLoop); 
					Mino.updateMinoPath(updateInterval);
				}
				else if( !Mino.getLineOfSight() && myState == State.CHASING ) {
					console.log("Stop Chasing");
					
					myState = State.SEARCHING;
					
					//restart moveMino loop with proper speed
					game.time.events.remove(moveMinoLoop); 
					Mino.moveMino();
					
					//restart updatePath loop with proper interval
					game.time.events.remove(patrolPathUpdateLoop);
					Mino.updateMinoPath(updateInterval);
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
						console.log("At destination")
					}
					else {
						eraseOldPos(xPosition, yPosition);
						pathStep++;
						xPosition = globalPath[pathStep].x;
						yPosition = globalPath[pathStep].y;
						drawUnit("Mino", xPosition, yPosition);
					}
				});
			},

			getLineOfSight: function(){
					
					//var intersect = line.intersects(maze, true);
					//If the lenght between player and mino is smaller than line.lenght
					//change state
					
					//console.log(Math.floor(line.length));
					
					line = new Phaser.Line(xPosition, yPosition,
							player.getX(), player.getY());
					
					if(Math.floor(line.length) < 15){
						//myState = State.CHASING;
						return true; 		// WHY?
					}
					else {
						//myState = State.SEARCHING;
						return false;
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

			// Calculate path from current point to destination
			calculatePath: function(easystar) {
				easystar.findPath(xPosition, yPosition, xDestination, yDestination, drawPath);
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