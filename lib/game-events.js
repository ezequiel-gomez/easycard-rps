'use strict';

var Game = require('./game');

var GameEvents = function (players) {
  var game = new Game(players),
      waitingPlayer;

  players.forEach((player, index) => {

    player.socket.emit('enableoptions');

    if (!player.EventsLoaded) {
      player.EventsLoaded = true;
      player.socket.broadcast.to(player.info.room).emit('updatechat', 'servidor', player.info.name + ' se ha unido a la partida');

      // Evento por defecto del chat.
      if (easyCard.getSettings().sendChatEnabled) {
        player.socket.on('sendchat', function (data) {
          player.socket.emit('updatechat', player.info.name, data);
          player.socket.broadcast.to(player.info.room).emit('updatechat', player.info.name, data);
        });
      }

      // Evento por defecto del chat.
      if (easyCard.getSettings().sendBetEnabled) {
        player.socket.on('sendbet', function (data) {
          player.bet = parseInt(data);
          player.socket.emit('updatechat', player.info.name, 'has apostado $' + data);
          player.socket.broadcast.to(player.info.room).emit('updatechat', player.info.name, 'ha apostado $' + data);
        });
      }

      // Evento por defecto cuando se desconecta un jugador del juego.
      player.socket.on('disconnect', function() {
        if (player.info.type == 'player') {
          players.splice(players.indexOf(player), 1);
          player.socket.broadcast.to(player.info.room).emit('updatechat', 'servidor', player.info.name + ' se ha desconectado');
          player.socket.leave(player.info.room);
          if (players.length > 0) {
            player.socket.broadcast.to(player.info.room).emit('disableoptions');
            player.socket.emit('updatechat', 'servidor', 'partida terminada');
            player.socket.broadcast.to(player.info.room).emit('updatechat', 'servidor', 'partida terminada');
          }
        }
      });

      var settings = easyCard.getSettings();
      if (typeof(settings.defineCustomEvents) == 'function') {
        settings.defineCustomEvents(player, game);
      }
    }
  });
};

module.exports = GameEvents;
