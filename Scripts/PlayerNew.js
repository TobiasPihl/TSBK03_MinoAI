//Player Object
var player = (function() {
	
	//player coordinates
	var xPosition = 0;
	var yPosition = 0;
	
	return {
		
		//Gets player X coordinate
		getX: function() {return xPosition},
		
		//Gets player Y coordinate
		getY: function() {return yPosition},
		
		//Sets new player position
		setPosition: function(x, y) {xPosition = x, yPosition = y},
			
		//Moves player in a direction if there is  not wall there
		playerMovement: function(dir) {
			switch (dir) {
				case Direction.NORTH:
					if(maze[yPosition-1][xPosition] == 0) {
						eraseOldPos("Player", xPosition, yPosition);
						yPosition--;
						drawUnit("Player", xPosition, yPosition);
					}
				break;
				case Direction.EAST:
					if(maze[yPosition][xPosition+1] == 0) {
						eraseOldPos("Player", xPosition, yPosition);
						xPosition++;
						drawUnit("Player", xPosition, yPosition);
					}
				break;
				case Direction.SOUTH:
					if(maze[yPosition+1][xPosition] == 0) {
						eraseOldPos("Player", xPosition, yPosition);
						yPosition++;
						drawUnit("Player", xPosition, yPosition);
					}
				break;
				case Direction.WEST:
					if(maze[yPosition][xPosition-1] == 0) {
						eraseOldPos("Player", xPosition, yPosition);
						xPosition--;
						drawUnit("Player", xPosition, yPosition);
					}
				break;
			}
		}
	}
})(); //self invoking function


