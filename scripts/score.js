
TowerDefense.Score = (function() {

    var score = 0,
        hitBricks = [],
        scoreDiv = document.getElementById("score-div");

    function reset() {
        score = 0;
        for (var i = 0; i < 8; i++) {
            hitBricks[i] = 14;
        }
    }

    function currentScore() {
        return score;
    }

    function updateScore() {
        scoreDiv.innerHTML = "Score: " + score;
    }

    function hitBrick(row) {
        hitBricks[row]--;
        if (hitBricks[row] === 0) {
            score += 25;
        }

        if (row < 3) {
            score += 5;
        } else if (row < 5) {
            score += 3;
        } else if (row < 7) {
            score += 2;
        } else if (row < 9) {
            score += 1;
        }
    }

    function getHighScores() {
        var currHighScores = localStorage.getItem('highScores');

        var highScores = [];
        if (currHighScores !== null) {
            highScores = JSON.parse(currHighScores);
        }
        highScores.sort(compare);

        return highScores;
    }

    function getFormattedHighScores() {
        var highScores = getHighScores();

        if (highScores.length === 0) {
            return "No high scores!";
        }

        var string = "High Scores:<br/>";
        for (var i = 0; i < highScores.length; i++) {
            string += "" + highScores[i].name + " - " + highScores[i].score + "<br/>";
        }

        return string;
    }

    function storeScore() {
        var highScores = getHighScores();

        var name = "";
        if (highScores.length < 5) {
            name = prompt("You got a high score!");
            highScores.push({
                name: name,
                score: score
            })
        } else {
            if (highScores[4].score < score) {
                name = prompt("You got a high score!");
                highScores[4].name = name;
                highScores[4].score = score;
                highScores.sort(compare);
            }
        }

        localStorage.setItem('highScores', JSON.stringify(highScores));
    }

    function compare(a, b) {
        if (a.score > b.score) {
            return -1;
        } else if (a.score < b.score) {
            return 1;
        } else {
            return 0;
        }
    }

    function resetScores() {
        var array = [];
        localStorage.setItem('highScores', JSON.stringify(array));
    }

    return {
        reset: reset,
        currentScore: currentScore,
        hitBrick: hitBrick,
        updateScore: updateScore,
        getFormattedHighScores: getFormattedHighScores,
        storeScore: storeScore,
        resetScores: resetScores
    };

}());