var GameEvents = require('./game-events'),
    Player = require('./player'),
    Interfaces = require('./interfaces'),
    Evaluators = require('./evaluators'),
    settings = {},
    evaluator = {};

const defaults = {
  maxPlayers: 2,
  maxRounds: 1,
  pointsToWin: 1,
  deckInfo: [],
  sendChatEnabled: false,
  sendBetEnabled: true
};

var EasyCard = function () {
  var players = [];

  this.addPlayer = function (socket) {
    socket.on('newplayer', function (data) {
      if (players.length < settings.maxPlayers) {
        socket.emit('updatechat', 'servidor', 'Bievenido!');
        players.push(new Player({socket: socket, info: data}));

        if (players.length == settings.maxPlayers) {
          new GameEvents(players);
        }
      } else {
        socket.emit('updatechat', 'servidor', 'No hay partidas disponibles');
      }
    });
  }
}

global.easyCard = {
  initNewGame: function() {
    return new EasyCard();
  },
  setSettings: function(newSettings) {
    settings = Object.assign(settings, defaults, newSettings);
  },
  getSettings: function() {
    return settings;
  },
  setEvaluator: function (newEvaluator) {
    Interfaces.checkForEvaluator(newEvaluator);
    evaluator = newEvaluator;
  },
  getEvaluator: function () {
    return evaluator;
  },
  getEvaluators: function () {
    return Evaluators;
  }
};
