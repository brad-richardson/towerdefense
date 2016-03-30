
// ------------------------------------------------------------------
//
// This is the graphics rendering code for the game.
// From in-class demo
// ------------------------------------------------------------------
Breakout.Graphics = (function(Particles) {
    'use strict';

    var canvas = document.getElementById('canvas-main'),
        context = canvas.getContext('2d'),
        colors = ['#00ff00', '#0000ff', '#ff8c00', '#ffff00'],
        rowCount = 8,
        colCount = 14,
    // Take up 1/4 of screen starting from 1/8 of the way down
        brickYStart = canvas.height / 8,
        brickHeight = ((canvas.height / 4) / rowCount);

    function brick(spec) {
        var that = {};

        that.x = spec.width * spec.col;
        that.y = spec.yStart + (spec.height * spec.row);
        that.width = spec.width;
        that.height = spec.height;
        that.color = colors[Math.floor(spec.row/2.0)];
        that.visible = true;
        that.particles = Particles({
            image: 'fire.png',
            center: {x: that.x + that.width/2, y: that.y + that.height/2},
            speed: {mean: 50, stdev: 10},
            lifetime: {mean: 1, stdev: 0.25}
        });

        return that;
    }

    function clear() {
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.fillRect(0, 0, canvas.width, canvas.height);
    }

    function drawPaddlesRemaining(count) {
        context.save();
        context.fillStyle = '#ffffff';
        if (count >= 1) {
            context.fillRect(
                10,
                canvas.height - 20,
                canvas.width/10,
                10
            );
        }
        if (count == 2) {
            context.fillRect(
                20 + canvas.width/10,
                canvas.height - 20,
                canvas.width/10,
                10
            );
        }
        context.restore();
    }

    function drawBrick(brick) {
        if (!brick.visible) {
            return;
        }
        context.save();
        context.fillStyle = brick.color;
        context.fillRect(
            brick.x,
            brick.y,
            brick.width,
            brick.height
        );
        context.strokeRect(
            brick.x,
            brick.y,
            brick.width,
            brick.height
        );
        context.restore();

    }

    function drawPaddle(paddle) {
        context.save();
        context.fillStyle = '#ffffff';
        context.fillRect(
            paddle.x,
            paddle.y,
            paddle.width,
            paddle.height
        );
        context.restore();
    }

    function drawBall(ball) {
        context.save();
        context.fillStyle = '#ffffff';
        context.beginPath();
        // recenter origin from top left
        context.arc(ball.x + ball.radius, ball.y + ball.radius, ball.radius, 0, 2 * Math.PI);
        context.fill();
        context.restore();
    }

    function collisionBox(x, y, width, height) {
        return {
            x: x,
            y: y,
            width: width,
            height: height
        };
    }

    function createBricksCollisionBox() {
        return collisionBox(0, brickYStart, canvas.width, brickHeight * rowCount);
    }

    function createRowCollisionBoxes() {
        var i, rowBoxes = [];

        for (i = 0; i < rowCount; i++) {
            rowBoxes.push(collisionBox(0, brickYStart + (brickHeight * i), canvas.width, brickHeight));
        }

        return rowBoxes;
    }

    function createWallCollisionBoxes() {
        var wallBoxes = [];

        // left
        wallBoxes.push(collisionBox(-10, 0, 10, canvas.height));
        // right
        wallBoxes.push(collisionBox(canvas.width, 0, 10, canvas.height));

        return wallBoxes;
    }

    function createCeilingCollisionBox() {
        return collisionBox(0, -20, canvas.width, 20);
    }

    function createFloorCollisionBox() {
        return collisionBox(0, canvas.height, canvas.width, 20);
    }

    function createBricks() {
        var spec = {
            width: canvas.width / colCount,
            height: brickHeight,
            yStart: brickYStart,
            row: 0
        };
        var bricks = [];
        for (var i = 0; i < rowCount; i++) {
            spec.row = i;
            var row = [];
            for (var j = 0; j < colCount; j++) {
                spec.col = j;
                row.push(brick(spec));
            }
            bricks.push(row);
        }

        return bricks;
    }

    function createPaddle() {
        var that = {};

        that.width  = canvas.width / 5;
        that.height = 20;
        that.x = (canvas.width / 2) - (that.width / 2);
        that.y = canvas.height - (canvas.height / 8);


        var moveRate = 700; // pixels/second
        that.moveLeft = function (elapsedTime) {
            that.x -= moveRate * (elapsedTime / 1000);
            if (that.x < 0) {
                that.x = 0;
            }
        };

        that.moveRight = function (elapsedTime) {
            that.x += moveRate * (elapsedTime / 1000);
            if (that.x + that.width > canvas.width) {
                that.x = canvas.width - that.width;
            }
        };

        return that;
    }

    function createBall(paddleSpec) {
        var that = {};

        that.radius = 6;
        // x and y at top left of ball for collision detection
        that.x = paddleSpec.x + (paddleSpec.width / 2) - that.radius;
        that.y = paddleSpec.y - (that.radius * 2);
        that.height = that.radius * 2;
        that.width = that.radius * 2;
        that.xSpeed = 150;
        that.ySpeed = -300;
        that.attached = false;
        that.remove = false;

        that.update = function(elapsedTime) {
            if (that.attached) {
                return;
            }
            that.x += (that.xSpeed * (elapsedTime / 1000));
            that.y += (that.ySpeed * (elapsedTime / 1000));
        };

        that.release = function() {
            that.attached = false;
        };

        return that;
    }

    return {
        clear: clear,
        drawPaddlesRemaining: drawPaddlesRemaining,
        drawPaddle: drawPaddle,
        drawBrick: drawBrick,
        drawBall: drawBall,
        createBricksCollisionBox: createBricksCollisionBox,
        createRowCollisionBoxes: createRowCollisionBoxes,
        createCeilingCollisionBox: createCeilingCollisionBox,
        createWallCollisionBoxes: createWallCollisionBoxes,
        createFloorCollisionBox: createFloorCollisionBox,
        createBricks: createBricks,
        createPaddle: createPaddle,
        createBall: createBall
    };
}(Breakout.Particles));