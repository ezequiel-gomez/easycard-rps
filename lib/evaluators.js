var bettingEvaluator = require('./betting-evaluators');

var RPSEvaluator = {
  checkRoundWinner: function (game) {
    var currentRound = game.getCurrentMatch().getCurrentRound(),
        options = currentRound.playedCards;

    if (options.length == 2) {
      if (compare(options[0].card, options[1].card) == options[0].card) {
        currentRound.winner = options[0].player;
        currentRound.winner.points += 1;
      } else if (compare(options[0].card, options[1].card) == options[1].card) {
        currentRound.winner = options[1].player;
        currentRound.winner.points += 1;
      } else {
        currentRound.winner = 'empate';
      }
      game.refreshScore();
      return true;
    } else {
      return false;
    }

    function areThey (value1, value2, choice1, choice2) {
      if (value1 === choice1 && value2 === choice2) {
        return true;
      } else if (value1 === choice2 && value2 === choice1) {
        return true;
      }
      return false;
    }

    function compare (choice1, choice2) {
      if (areThey("papel", "piedra", choice1, choice2)) {
        return 'papel';
      } else if (areThey("papel", "tijera", choice1, choice2)) {
        return 'tijera';
      } else if (areThey("tijera", "piedra", choice1, choice2)) {
        return 'piedra';
      }
      return "Empate!";
    }
  },
  checkMatchWinner: function (game) {
    for (var i in game.players) {
      if (game.players[i].points >= game.pointsToWin) {
        game.getCurrentMatch().winner = game.players[i];
        return true;
      }
    }
    game.getCurrentMatch().startRound();
    return false;
  },
  checkGameWinner: function (game) {
    if (this.checkMatchWinner(game)) {
      game.winner = game.getCurrentMatch().winner;
      game.winner.socket.emit('gameover', 'winner');
      game.winner.socket.broadcast.to(game.winner.info.room).emit('gameover', 'loser');
      bettingEvaluator.addProfits(game);
      for (var i in game.players) {
        if (game.players[i].socket.id != game.winner.socket.id) {
          bettingEvaluator.removeProfits(game.players[i]);
        }
      }
      return true;
    } else {
      return false;
    }
  }
};

var TrucoEvaluator = {
  checkRoundWinner: function () {

  },
  checkMatchWinner: function () {

  },
  checkGameWinner: function () {

  }
};

module.exports = {
  RPSEvaluator: RPSEvaluator,
  TrucoEvaluator: TrucoEvaluator
};
