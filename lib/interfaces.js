var Utils = require('./utils');

const INTERFACES = {
  Evaluator: new Utils.Interface('Evaluator', [
    'checkGameWinner',
    'checkMatchWinner',
    'checkRoundWinner'
  ])
};

module.exports = {
  checkForEvaluator: function(object) {
    Utils.Interface.ensureImplements(object, INTERFACES.Evaluator);
  }
};
