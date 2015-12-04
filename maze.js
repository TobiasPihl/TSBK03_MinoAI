//maze properties
var maze = [];
var mazeWidth = 60;
var mazeHeight = 40;

//maze.js = function(){

    //Create a maze by using the input varables of the maze's dimension
    function createMaze(maze, mazeWidth, mazeHeight){

        //Create a mutltidimensional array of ones
        //ones = wall
        //zeros = walkable
        //change some ones to zero in an irregular pattern
        mazeGraphics = game.add.graphics(0, 0);

        var moves = [];
        var counter = 0;
		
		// Randomized value for when to destroy a wall
		var randomVal = Math.floor((Math.random() * 10) + 1);
  
        var posX = 1;
        var posY = 1;

        for(var i = 0; i < mazeHeight; i ++){

          maze[i] = [];
          for(var j = 0; j < mazeWidth; j ++){
            maze[i][j] = 1;
            counter ++;
            if(counter == randomVal){
              //Check so that we dont destroy a wall at the edge
              if(i > 2 && j > 2){
                  maze[i - 1][j - 1] = 0;
              }
              randomVal = Math.floor((Math.random() * 8) + 4);
              counter = 0;
            }
          }
        }

        //Creat an walkable path through the maze
        maze[posX][posY] = 0;
        moves.push(posY + posY * mazeWidth);
        while(moves.length){
			var possibleDirections = "";
			if(posX+2 > 0 && posX + 2 < mazeHeight - 1 && maze[posX + 2][posY] == 1){
				possibleDirections += "S";
			}
			if(posX-2 > 0 && posX - 2 < mazeHeight - 1 && maze[posX - 2][posY] == 1){
				possibleDirections += "N";
			}
			if(posY-2 > 0 && posY - 2 < mazeWidth - 1 && maze[posX][posY - 2] == 1){
				possibleDirections += "W";
			}
			if(posY+2 > 0 && posY + 2 < mazeWidth - 1 && maze[posX][posY + 2] == 1){
				possibleDirections += "E";
			}
			if(possibleDirections){
				var move = game.rnd.between(0, possibleDirections.length - 1);
				switch (possibleDirections[move]){
					case "N":
						maze[posX - 2][posY] = 0;
						maze[posX - 1][posY] = 0;
						posX -= 2;
					break;
					case "S":
						maze[posX + 2][posY] = 0;
						maze[posX + 1][posY] = 0;
						posX += 2;
					break;
					case "W":
						maze[posX][posY - 2] = 0;
						maze[posX][posY - 1] = 0;
						posY -= 2;
					break;
					case "E":
						maze[posX][posY + 2]=0;
						maze[posX][posY + 1]=0;
						posY += 2;
					break;
				}
				moves.push(posY + posX * mazeWidth);
			}
			else{
				//Pop the stack with the finished maze
				var back = moves.pop();
				posX = Math.floor(back / mazeWidth);
				posY = back % mazeWidth;
			}
        }
        return maze;
	}
//}
