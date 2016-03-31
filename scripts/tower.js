TowerDefense.Tower = (function() {
    
    var baseColor = '#ffffff',
        cannonColor = '#000000';
    
    function createTower(spec) {
        var that = {};
        
        // Base properties
        that.baseColor = baseColor;
        that.radius = 20;
        
        // Cannon properties
        that.cannonColor = cannonColor;
        that.cannonLength = 25;
        that.cannonWidth = 10;
        
        that.x = spec.x;
        that.y = spec.y;
        
        that.row = spec.row;
        that.col = spec.col;
        
        return that;
    }
    
    return {
        createTower: createTower
    }
}());