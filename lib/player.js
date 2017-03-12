var Player = function (options) {
  options = options || {};

  const default_info = {
    name: RandomName(1, 1000),
    room: 'sala_1',
    type: 'player',
    extra_data: {}
  }

  this.info = Object.assign(default_info, options.info);
  this.points = 0;
  this.roundswon = 0;
  this.socket = options.socket;
  this.EventsLoaded = false;
  this.bet = 0;

  this.socket.join(this.info.room);

  function RandomName (min, max) {
    return 'Fulanito' + (Math.floor(Math.random() * (max - min + 1)) + min);
  }
}

module.exports = Player;
