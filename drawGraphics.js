//Draw unit
function drawUnit(type, xPos, yPos) {
	
	var color = 0x000000;
	
	switch (type) {
		case "Player":
			color = 0x25DD00;
		break;
		case "Mino":
			color = 0xFFFF00;
		break;
	}
	mazeGraphics.beginFill(color);
	mazeGraphics.drawRect(xPos * tileSize, yPos * tileSize, tileSize, tileSize);
}

//Erase unit from its old postition
function eraseOldPos(xPos, yPos) {
	
	//Send type and check if there should be any other color than black
	mazeGraphics.beginFill(0x000000);
	mazeGraphics.drawRect(xPos * tileSize, yPos * tileSize, tileSize, tileSize);
}

//Draw the maze based on the grid array
function drawMaze(posX, posY){
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
}

//Draw a path showing the calculated path to target location
function drawPath(path){

	var i = 1;
	while (i<path.length-1) {
		mazeGraphics.beginFill(0xFF0000);
		mazeGraphics.drawRect(path[i].x * tileSize + 3, path[i].y * tileSize + 3, tileSize - 6, tileSize - 6);
		i++;
		mazeGraphics.endFill();
	}
	globalPath = path;
}

