var Coins = (function() {
	
	var numberOfCoins = 1;
	
	var xPosition;// = 0;
	var yPosition;// = 0;
	
	return {
		
		setPosition: function(x,y) { xPosition = x; yPosition = y; },
		
		getX: function() { return xPosition; }, 
		
		getX: function() { return xPosition; }, 
		
		createCoins: function() {
			Coins.getRandomPoint;
			drawUnit("Coin", xPosition, yPosition);
		},
		
		getRandomPoint: function() {
			var xRand;
			var yRand;

			//keep trying until random point is walkable
			do {
				xRand = Math.floor(Math.random() * (mazeWidth-2)) + 1;
				yRand = Math.floor(Math.random() * (mazeHeight-2)) + 1;
			} while (!Coins.validatePoint(yRand, xRand));
			
			xPosition = xRand;
			yPosition = yRand;
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
		}
	}
})();