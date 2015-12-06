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
				case N:
					if(maze[yPosition-1][xPosition] == 0) {
						eraseOldPlayerPos(xPosition, yPosition);
						yPosition--;
						drawPlayer(xPosition, yPosition);
					}
				break;
				case E:
					if(maze[yPosition][xPosition+1] == 0) {
						eraseOldPlayerPos(xPosition, yPosition);
						xPosition++;
						drawPlayer(xPosition, yPosition);
					}
				break;
				case S:
					if(maze[yPosition+1][xPosition] == 0) {
						eraseOldPlayerPos(xPosition, yPosition);
						yPosition++;
						drawPlayer(xPosition, yPosition);
					}
				break;
				case W:
					if(maze[yPosition][xPosition-1] == 0) {
						eraseOldPlayerPos(xPosition, yPosition);
						xPosition--;
						drawPlayer(xPosition, yPosition);
					}
				break;
			}
		}
	}
})(); //self invoking function


