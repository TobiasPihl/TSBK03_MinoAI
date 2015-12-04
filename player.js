//Player Positon
var playerXPos = 3;
var playerYPos = 1;

//Input
var UP_ARROW;
var DOWN_ARROW;
var LEFT_ARROW;
var RIGHT_ARROW;

//Set up key input controls
function playerInputInit() {	
	UP_ARROW	= game.input.keyboard.addKey(Phaser.Keyboard.UP);
	DOWN_ARROW	= game.input.keyboard.addKey(Phaser.Keyboard.DOWN);
	LEFT_ARROW	= game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
	RIGHT_ARROW	= game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
}

//Key input loop
function inputCheckLoop() {
	game.time.events.loop(Phaser.Timer.SECOND/10, function(){
		if(UP_ARROW.isDown) {
			playerMovement(N);
		}
		else if(DOWN_ARROW.isDown) {
			playerMovement(S);
		}
		else if(RIGHT_ARROW.isDown) {
			playerMovement(E);
		}
		else if(LEFT_ARROW.isDown) {
			playerMovement(W);
		}
	})
}

/*	Move controls for player
	Check the tile if it's 1 or 0,
	if 1, can't move there,
	else update player position and redraw */
function playerMovement(dir) {
	switch (dir) {
		case N:
			if(maze[playerYPos-1][playerXPos] == 0) {
				eraseOldPlayerPos(playerXPos, playerYPos);
				playerYPos--;
				drawPlayer(playerXPos, playerYPos);
			}
		break;
		case E:
			if(maze[playerYPos][playerXPos+1] == 0) {
				eraseOldPlayerPos(playerXPos, playerYPos);
				playerXPos++;
				drawPlayer(playerXPos, playerYPos);
			}
		break;
		case S:
			if(maze[playerYPos+1][playerXPos] == 0) {
				eraseOldPlayerPos(playerXPos, playerYPos);
				playerYPos++;
				drawPlayer(playerXPos, playerYPos);
			}
		break;
		case W:
			if(maze[playerYPos][playerXPos-1] == 0) {
				eraseOldPlayerPos(playerXPos, playerYPos);
				playerXPos--;
				drawPlayer(playerXPos, playerYPos);
			}
		break;
	}
}
