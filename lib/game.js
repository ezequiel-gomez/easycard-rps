'use strict';

var Match = require('./match');

var Game = function (players) {
  var currentMatch,
      that = this;

  this.players = players;

  function init () {
    currentMatch = {};
    that.matches = [];
    that.winner = null;
    that.pointsToWin = easyCard.getSettings().pointsToWin;
    that.maxRounds = easyCard.getSettings().maxRounds;
    that.evaluator = easyCard.getEvaluator();

    // Reset score
    for (var i in that.players) {
      that.players[i].points = 0;
      that.players[i].bet = 0;
    }

    that.showGameInfo();
    that.refreshScore();

    // Start new game
    that.addNewMatch();
  }

  this.getCurrentMatch = function () {
    return currentMatch;
  };

  this.addNewMatch = function () {
    currentMatch = new Match(this.players);
    this.matches.push(currentMatch);
  };

  this.refreshScore = function () {
    for (var i in this.players) {
      this.players[i].socket.emit('updateplayerpoints', this.players[i].points);
      this.players[i].socket.broadcast.to(this.players[i].info.room).emit('updateopponentpoints', this.players[i].points);
    }
  }

  this.displayInputs = function () {
    if (easyCard.getSettings().sendChatEnabled) {
      for (var i in this.players) {
        this.players[i].socket.emit('enablechatinput', '');
      }
    }
    if (easyCard.getSettings().sendBetEnabled) {
      for (var i in this.players) {
        this.players[i].socket.emit('enablebettinginput', '');
      }
    }
  }

  this.showGameInfo = function () {
    for (var i in this.players) {
      players[i].socket.emit('getplayername', players[i].info.name);
      players[i].socket.broadcast.to(players[i].info.room).emit('getopponentname', players[i].info.name);
      players[i].socket.emit('getmaxpoints', this.pointsToWin);
    }
  }

  this.emitMessage = function (message1, message2, player) {
    if (arguments.length == 3) {
      player.socket.emit('updatechat', 'servidor', message1);
      player.socket.broadcast.to(player.info.room).emit('updatechat', 'servidor', message2);
    } else if (arguments.length == 1) {
      for (var i in this.players) {
        this.players[i].socket.emit('updatechat', 'servidor', message1);
      }
    }
  }

  this.restart = function () {
    init();
  }

  init();
  this.displayInputs();
}

module.exports = Game;
