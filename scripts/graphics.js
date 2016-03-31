
// ------------------------------------------------------------------
//
// This is the graphics rendering code for the game.
// From in-class demo
// ------------------------------------------------------------------
TowerDefense.Graphics = (function() {
    'use strict';

    var canvas = document.getElementById('canvas-main'),
        context = canvas.getContext('2d'),
        bgImg = document.getElementById('bg');

    function clear() {
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.strokeRect(0, 0, canvas.width, canvas.height);
        //context.fillRect(0, 0, canvas.width, canvas.height);
        //context.drawImage(bgImg, canvas.width, canvas.height);
    }
    
    function drawTower(tower) {
        // Draw base
        context.save();
        context.fillStyle = tower.baseColor;
        context.beginPath();
        context.arc(tower.x, tower.y, tower.radius, 0, 2 * Math.PI);
        context.fill();
        context.restore();
        
        // Draw cannon
        context.save();
        context.fillStyle = tower.cannonColor;
        context.fillRect(
            tower.x - tower.cannonWidth/2,
            tower.y,
            tower.cannonWidth,
            tower.cannonLength
        );
        context.restore();
    }

    return {
        clear: clear,
        drawTower: drawTower
    };
}());