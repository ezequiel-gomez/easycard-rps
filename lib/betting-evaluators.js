var fs = require('fs');

var bettingEvaluators = {
  addProfits: function (game) {
    var monto = 0;

    for (var i in game.players) {
      monto += game.players[i].bet;
    }
    game.winner.socket.emit('updatechat', 'servidor', 'has ganado $' + monto);
    fs.writeFile('./winner', '{player: ' + game.winner.info.name + ', action: 1, monto: ' + monto + '}', function (err,data) {
      if (err) {
        return console.log(err);
      }
    })
  },
  removeProfits: function (loser) {
    loser.socket.emit('updatechat', 'servidor', 'has perdido $' + loser.bet);
    fs.writeFile('./loser', '{player: ' + loser.info.name + ', action: 0, monto: ' + loser.bet + '}', function (err,data) {
      if (err) {
        return console.log(err);
      }
    })
  }
}

module.exports = bettingEvaluators;
