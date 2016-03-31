
TowerDefense.Main = (function(Input, Graphics, Score, Tower, Grid) {
    'use strict';

    var keyboard = Input.Keyboard(),
        previousTime = performance.now();

    function update(elapsedTime) {
        var i, j,
            prevScore = Score.currentScore();

        keyboard.update(elapsedTime);
    }

    function render() {
        var i, j;
        
        Graphics.clear()
        
        var towers = Grid.getTowers();
        for (i = 0; i < towers.length; i++) {
            Graphics.drawTower(towers[i]);
        }
    }

    function gameLoop(currTime) {
        var elapsedTime = currTime - previousTime;
        previousTime = currTime;

        update(elapsedTime);
        render(elapsedTime);
        requestAnimationFrame(gameLoop);
    }
    
    function handleClick(e) {
        var gridLoc = Grid.gridLocationFromCoord(e.offsetX, e.offsetY);
        console.log(gridLoc);
        
        // Bottom or right edges of grid
        if (gridLoc.row === Grid.gridRows || gridLoc.col === Grid.gridCols) {
                return;
        }
        
        var coord = Grid.coordFromGridLocation(gridLoc.row, gridLoc.col);
        console.log(coord);
        
        var towerSpec = {
            x: coord.x,
            y: coord.y,
            row: gridLoc.row,
            col: gridLoc.col
        };
        var newTower = Tower.createTower(towerSpec);
        if (Grid.addTower(newTower)) {
            console.log("Added tower");
        } else {
            console.log("Tower already exists");
        }
    }

    var canvas = document.getElementById('canvas-main');
    canvas.onclick = handleClick;
    
    requestAnimationFrame(gameLoop);

}(TowerDefense.Input, TowerDefense.Graphics, TowerDefense.Score, TowerDefense.Tower, TowerDefense.Grid));
