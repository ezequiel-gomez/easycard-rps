'use strict';

var Card = function(number, suit, priority) {
  this.number = number;
  this.suit = suit;
  this.priority = priority;
  this.name = this.number + '_' + this.suit;
}

module.exports = Card;