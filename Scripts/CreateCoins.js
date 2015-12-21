var Coins = (function() {
	
	var playerPoints = 0;
	var numberOfCoins = 1;
	
	var xPosition;// = 0;
	var yPosition;// = 0;
	
	return {
		
		setPosition: function(x,y) { xPosition = x; yPosition = y; },
		
		getX: function() { return xPosition; }, 
		
		getY: function() { return yPosition; }, 
		
		createCoins: function() {
			Coins.getRandomPoint();
			drawUnit("Coin", xPosition, yPosition);
		},
		
		collectCheck: function(x,y) {
			if(x == xPosition && y == yPosition) {
				playerPoints += 1;
				console.log("Collected coin. Your points: " + playerPoints);
				eraseOldPos("Coin", xPosition, yPosition);
				Coins.createCoins();
			}
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