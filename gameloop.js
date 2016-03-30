
Breakout.Main = (function(Input, Graphics, Score) {
    'use strict';

    var keyboard = Input.Keyboard(),
        previousTime = performance.now(),
        bricks = Graphics.createBricks(),
        paddle = Graphics.createPaddle(),
        balls = [],
        bricksCollisionBox = Graphics.createBricksCollisionBox(),
        rowCollisionBoxes = Graphics.createRowCollisionBoxes(),
        wallCollisionBoxes = Graphics.createWallCollisionBoxes(),
        ceilingCollisionBox = Graphics.createCeilingCollisionBox(),
        floorCollisionBox = Graphics.createFloorCollisionBox(),
        bricksRemoved = 0,
        halfSize = false,
        remainingPaddles = 2,
        countdownDiv = document.getElementById("countdown-div"),
        secondsLeft = 4,
        pause = true;


    function didCollide(obj1, obj2) {
        //console.log(obj1, obj2);
        return obj1.x < obj2.x + obj2.width &&
                obj1.x + obj1.width > obj2.x &&
                obj1.y < obj2.y + obj2.height &&
                obj1.height + obj1.y > obj2.y;
    }

    function increaseBallSpeed() {
        for (var i = 0; i < balls.length; i++) {
            balls[i].xSpeed *= 1.20;
            balls[i].ySpeed *= 1.20;
        }
    }

    function removeBrick(row, col) {
        var brick = bricks[row][col];
        brick.visible = false;
        bricksRemoved++;
        if (bricksRemoved === 4 || bricksRemoved === 12
            || bricksRemoved === 36 || bricksRemoved === 62) {
            increaseBallSpeed()
        }

        // Create new particles
        for (var i = 0; i < 30; i++) {
            brick.particles.create();
        }

        // Hit top row
        if (row === 0 && halfSize === false) {
            halfSize = true;
            paddle.width /= 2.0;
        }
    }

    function checkWalls(currBall) {
        // Check for wall collisions
        for (var i = 0; i < wallCollisionBoxes.length; i++) {
            if (didCollide(currBall, wallCollisionBoxes[i])) {
                currBall.xSpeed *= -1;
            }
        }
        // Check for ceiling collision
        if (didCollide(currBall, ceilingCollisionBox)) {
            currBall.ySpeed *= -1;
        }
        // Check for floor collision
        if (didCollide(currBall, floorCollisionBox)) {
            currBall.remove = true;
        }
    }

    function updateBall(currBall) {
        var i, j;
        // Check for brick collisions
        if (didCollide(currBall, bricksCollisionBox)) {
            for (i = 0; i < rowCollisionBoxes.length; i++) {
                if (didCollide(currBall, rowCollisionBoxes[i])) {
                    for (j = 0; j < bricks[i].length; j++) {
                        if (bricks[i][j].visible === false) {
                            continue;
                        }
                        if (didCollide(currBall, bricks[i][j])) {
                            removeBrick(i, j);
                            Score.hitBrick(i);

                            currBall.ySpeed *= -1;
                        }
                    }
                }
            }
        }
        // Check for paddle collisions
        if (didCollide(currBall, paddle)) {
            currBall.ySpeed *= -1;
        }
        checkWalls(currBall);
    }

    function spawnNewBall() {
        balls.push(Graphics.createBall(paddle));
    }

    function countdown() {
        secondsLeft--;

        countdownDiv.innerHTML = secondsLeft;

        if (secondsLeft > 0) {
            delaySpawnBall();
        } else {
            countdownDiv.innerHTML = "";
            spawnNewBall();
        }
    }

    function delaySpawnBall() {
        window.setTimeout(countdown, 1000);
    }

    function loseLife() {
        remainingPaddles--;
        if(remainingPaddles < 0) {
            Breakout.Score.storeScore();
            //alert("Game over! Score: " + Score.currentScore());
        } else {
            secondsLeft = 4;
            delaySpawnBall();
        }
    }

    function update(elapsedTime) {
        var i, j,
            prevScore = Score.currentScore();

        keyboard.update(elapsedTime);

        var toRemove = [];
        for (i = 0; i < balls.length; i++) {
            balls[i].update(elapsedTime);
            updateBall(balls[i]);
            if (balls[i].remove) {
                toRemove.push(i);
            }
        }
        for (i = 0; i < toRemove.length; i++) {
            balls.splice(toRemove[i], 1);
            if (balls.length === 0) {
                loseLife();
            }
        }

        var prevVal = Math.floor(prevScore / 100),
            newVal = Math.floor(Score.currentScore() / 100);
        if (prevVal < newVal) {
            spawnNewBall();
        }

        for (i = 0; i < bricks.length; i++) {
            for (j = 0; j < bricks[i].length; j++) {
                bricks[i][j].particles.update(elapsedTime);
            }
        }
    }

    function render() {
        var i, j;

        Graphics.clear();
        for (i = 0; i < bricks.length; i++) {
            for (j = 0; j < bricks[i].length; j++) {
                Graphics.drawBrick(bricks[i][j]);
            }
        }
        Graphics.drawPaddlesRemaining(remainingPaddles);
        Graphics.drawPaddle(paddle);
        for (i = 0; i < balls.length; i++) {
            Graphics.drawBall(balls[i]);
        }
        for (i = 0; i < bricks.length; i++) {
            for (j = 0; j < bricks[i].length; j++) {
                bricks[i][j].particles.render();
            }
        }
        Score.updateScore();
    }

    function gameLoop(currTime) {
        var elapsedTime = currTime - previousTime;
        previousTime = currTime;

        if (pause) {
            requestAnimationFrame(gameLoop);
            return;
        }

        update(elapsedTime);
        render(elapsedTime);
        requestAnimationFrame(gameLoop);
    }

    function startGame() {
        Score.reset();
        remainingPaddles = 2;
        bricksRemoved = 0;
        paddle = Graphics.createPaddle();
        bricks = Graphics.createBricks();
        halfSize = false;
        pause = false;
        delaySpawnBall();

        keyboard.registerCommand(KeyEvent.DOM_VK_LEFT, paddle.moveLeft);
        keyboard.registerCommand(KeyEvent.DOM_VK_RIGHT, paddle.moveRight);

        window.requestAnimationFrame(gameLoop);
    }

    function hide(element) {
        element.style.display = 'none';
        element.style.zIndex = -1;
    }

    function show(element) {
        element.style.display = 'inline-block';
        element.style.zIndex = 10;
    }

    function inactivate(button) {
        var currButton = document.getElementById(button);
        currButton.className = "";
    }

    function activate(button) {
        var currButton = document.getElementById(button);
        currButton.className = "button-selected";
    }

    var currentMenu = 'mainmenu';
    var currentButton = 'play';
    function escapeKey() {
        if (currentMenu === 'highscores') {
            hide(document.getElementById('highscores-div'));
            mainMenu();
        } else if (currentMenu === 'credits') {
            hide(document.getElementById('credits-div'));
            mainMenu();
        } else if (currentMenu === 'game') {
            showPause();
        }
    }

    function upKey() {
        inactivate(currentButton);
        if (currentMenu === 'mainmenu') {
            if (currentButton === 'highscores') {
                currentButton = 'play';
            } else if (currentButton === 'credits') {
                currentButton = 'highscores';
            }
        } else if (currentMenu === 'pause') {
            if (currentButton === 'quit') {
                currentButton = 'resume';
            }
        }
        activate(currentButton);
    }

    function downKey() {
        inactivate(currentButton);
        if (currentMenu === 'mainmenu') {
            if (currentButton === 'play') {
                currentButton = 'highscores';
            } else if (currentButton === 'highscores') {
                currentButton = 'credits';
            }
        } else if (currentMenu === 'pause') {
            if (currentButton === 'resume') {
                currentButton = 'quit';
            }
        }
        activate(currentButton);
    }

    function enterKey() {
        console.log(currentButton);
        var button = document.getElementById(currentButton);
        button.click();
    }

    // From in-class demos
    // Create the keyboard input handler and register the keyboard commands

    //keyboard.registerCommand(KeyEvent.DOM_VK_SPACE, spawnNewBall);


    function keyDown(e) {
        if (e.keyCode === KeyEvent.DOM_VK_ESCAPE) {
            escapeKey();
            e.preventDefault();
        } else if (e.keyCode === KeyEvent.DOM_VK_UP) {
            upKey();
            e.preventDefault();
        } else if (e.keyCode === KeyEvent.DOM_VK_DOWN) {
            downKey();
            e.preventDefault();
        } else if (e.keyCode === KeyEvent.DOM_VK_RETURN) {
            enterKey();
            e.preventDefault();
        }
    }

    document.addEventListener('keydown', keyDown);

    function play() {
        hide(document.getElementById('mainmenu-div'));
        currentMenu = 'game';
        startGame();
    }

    function mainMenu() {
        show(document.getElementById('mainmenu-div'));
        currentMenu = 'mainmenu';
        currentButton = 'play';
    }

    function highScores() {
        hide(document.getElementById('mainmenu-div'));
        show(document.getElementById('highscores-div'));
        document.getElementById('highscores-body').innerHTML = Score.getFormattedHighScores();
        currentMenu = 'highscores';
    }

    function credits() {
        show(document.getElementById('credits-div'));
        currentMenu = 'credits';
    }

    function reset() {
        Score.resetScores();
    }

    function showPause() {
        pause = true;
        show(document.getElementById('pause-div'));
        currentMenu = 'pause';
        currentButton = 'resume';
    }

    function resume() {
        hide(document.getElementById('pause-div'));
        pause = false;
        currentMenu = 'game';
    }

    function quit() {
        hide(document.getElementById('pause-div'));
        mainMenu();
    }

    document.getElementById('play').onclick = play;
    document.getElementById('highscores').onclick = highScores;
    document.getElementById('credits').onclick = credits;
    document.getElementById('reset').onclick = reset;
    document.getElementById('resume').onclick = resume;
    document.getElementById('quit').onclick = quit;


}(Breakout.Input, Breakout.Graphics, Breakout.Score));
