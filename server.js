'use strict'

const http = require('http');
//import http from 'http';
const express = require('express');
const socketio = require('socket.io');

require('./lib/easycard');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

io.on('connection', onConnection);

app.use(express.static(__dirname + '/client'));

var port = Number(process.env.PORT || 8080);
server.listen(port, () => console.log('Ready to work!.'));

// Demo Example
easyCard.setSettings({
  maxPlayers: 2,
  maxRounds: 3,
  pointsToWin: 2,
  defineCustomEvents: function(player, game) {
    player.socket.on('optionselected', function (option) {
      var currentRound = game.getCurrentMatch().getCurrentRound() || '';

      currentRound.addCard(player, option);

      if (game.evaluator.checkRoundWinner(game)) {
        game.emitMessage(currentRound.playedCards[0].player.info.name + ': ' + currentRound.playedCards[0].card +
            ' - ' + currentRound.playedCards[1].player.info.name + ': ' + currentRound.playedCards[1].card);
        player.socket.emit('enableoptions');
        player.socket.broadcast.to(player.info.room).emit('enableoptions');
        if (game.evaluator.checkGameWinner(game)) {
          game.emitMessage('Partida reiniciada');
          game.restart();
        }
      } else {
        player.socket.emit('disableoptions');
        game.emitMessage('Falta que elija el otro jugador', 'Ya elegí', player);
      }
    });
  }
});

easyCard.setEvaluator(easyCard.getEvaluators().RPSEvaluator);

var myGame = easyCard.initNewGame();

function onConnection(socket) {
  myGame.addPlayer(socket);
}
