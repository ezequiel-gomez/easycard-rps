'use strict';

var Round = function () {
  this.playedCards = [];
  this.winner = null;

  var maxCards = 2;

  this.addCard = function (player, card) {
    if (this.playedCards.length < maxCards) {
      this.playedCards.push({player: player, card: card});
    }
  };
}

module.exports = Round;
