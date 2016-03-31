TowerDefense.Grid = (function() {
    
    var gridRows = 9,
        gridCols = 16,
        canvas = document.getElementById('canvas-main'),
        width = canvas.width,
        height = canvas.height,
        cellWidth = width/gridCols,
        cellHeight = height/gridRows,
        grid = new Array(gridRows);
    
    function loc(row, col) {
        return {
            row: row,
            col: col
        };
    }
    
    function coord(x, y) {
        return {
            x: x,
            y: y
        }
    }
    
    // Return (row, col) location from (x,y) coordinate
    function gridLocationFromCoord(x, y) {
        var row = Math.floor((y/height) * gridRows);
        var col = Math.floor((x/width) * gridCols);
        
        return loc(row, col);
    }
    
    // Return (x,y) coordinate in middle of grid cell
    function coordFromGridLocation(row, col) {
        var x = ((col/gridCols) * width) + cellWidth/2;
        var y = ((row/gridRows) * height) + cellHeight/2;
        
        return coord(x, y);
    }
    
    // Check if grid is open and valid at location
    function isValid(row, col) {
        return grid[row][col] === undefined 
            && row < gridRows && col < gridCols;
    }
    
    // Add tower to grid, return true if succeeded
    function addTower(tower) {
        if (isValid(tower.row, tower.col)) {
            grid[tower.row][tower.col] = tower;
            return true;
        }
        return false;
    }
    
    // Return an array of towers from the grid
    function getTowers() {
        var towers = [];
        
        for (var i = 0; i < grid.length; i++) {
            for (var j = 0; j < grid[i].length; j++) {
                if (grid[i][j] !== undefined) {
                    towers.push(grid[i][j]);
                }
            }
        }
        
        return towers;
    }
    
    // Reset grid
    function reset() {
        for (var i = 0; i < gridRows; i++) {
            grid[i] = new Array(gridCols);
        }
    }
    reset();
    
    return {
        gridLocationFromCoord: gridLocationFromCoord,
        coordFromGridLocation: coordFromGridLocation,
        gridRows: gridRows,
        gridCols: gridCols,
        isValid: isValid,
        addTower: addTower,
        getTowers: getTowers,
        reset: reset
    }
}());