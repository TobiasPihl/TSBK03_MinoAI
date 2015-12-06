//Graphics drawer object
var drawGraphics = (function() {
	
	//Private variables
	var tileSize = 10;
	var mazeGraphics;
		
	return {
		
		//Get tileSize
		getTileSize: function () { return tileSize },
		
		//Clear graphics
		clearGraphics: function () { mazeGraphics.clear }, 
		
		//Draw player at position
		drawPlayer: function (xPos, yPos) {
			console.log("drawing player at:" + xPos + ", " + yPos);
			mazeGraphics.beginFill(0x25DD00);
			mazeGraphics.drawRect(xPos * tileSize, yPos * tileSize, tileSize, tileSize);
		},
		
		//Draw player, updating his position
		drawMino: function () {
			mazeGraphics.beginFill(0xFFFF00);
			mazeGraphics.drawRect(minoXPos * tileSize, minoYPos * tileSize, tileSize, tileSize);
		},
		
		//when player moves, delete player icon from old position
		eraseOldPlayerPos: function (xPos, yPos) {
			mazeGraphics.beginFill(0x000000);
			mazeGraphics.drawRect(xPos * tileSize, yPos * tileSize, tileSize, tileSize);
		},
		
		//Draw the maze based on the grid array
		drawMaze: function (posX, posY){
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
		},

		//Draw a path showing the calculated path to target location
		// drawPath: function (path){

			// var i = 1;
			// while (i<path.length-1) {
				// mazeGraphics.beginFill(0xFF0000);
				// mazeGraphics.drawRect(path[i].x * tileSize + 3, path[i].y * tileSize + 3, tileSize - 6, tileSize - 6);
				// i++;
				// mazeGraphics.endFill();
			// }
			// globalPath = path; //Edit
		// }
		
		
	}
})(); //self invoking function


