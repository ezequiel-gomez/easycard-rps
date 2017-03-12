'use strict'
const http = require('http');
const express = require('express');
const socketio = require('socket.io');

//Inicio de la configuración del servidor
const app = express();
const server = http.createServer(app);
const io = socketio(server);

app.use(express.static(__dirname + '/client'));

var port = Number(process.env.PORT || 8080);
server.listen(port, () => console.log('Ready to work!.'));
//Fin de la configuración del servidor

require('./lib/easycard');

//Definición del evaluador del juego
easyCard.setEvaluator(easyCard.getEvaluators().RPSEvaluator);

//Definición de las propiedades del juego
easyCard.setSettings({
  maxPlayers: 2,
  maxRounds: 3,
  pointsToWin: 2,
  sendChatEnabled: false,
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

var myGame = easyCard.initNewGame();

//Se crea un evento en el servidor para que detecte la conexión de nuevos jugadores
io.on('connection', onConnection);

function onConnection(socket) {
  myGame.addPlayer(socket);
}
