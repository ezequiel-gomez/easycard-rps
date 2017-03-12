'use strict';

var Round = require('./round');

var Match = function (options) {
  this.rounds = [];
  this.winner = null;

  this.getCurrentRound = function () {
    return this.rounds[this.rounds.length - 1];
  };

  this.startRound = function () {
    this.rounds.push(new Round());
  };

  this.startRound();
}

module.exports = Match;
