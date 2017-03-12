var socket = io();

socket.on('connect', function () {
  socket.emit('newplayer', newPlayer());
});

function newPlayer () {
  var playerName = prompt("Cuál es tu nombre?");
  if (playerName !== null) {
    return {name: playerName};
  }
}

socket.on('updatechat', onMessage);
socket.on('getplayername', getPlayerName);
socket.on('getopponentname', getOpponentName);
socket.on('updateplayerpoints', updatePlayerPoints);
socket.on('updateopponentpoints', updateOpponentPoints);
socket.on('getmaxpoints', getMaxPoints);
socket.on('enablechatinput', enableChatInput);
socket.on('enablebettinginput', enableBettingInput);
socket.on('gameover', GameOver);

function enableChatInput () {
  var form = document.createElement('form'),
      input = document.createElement('INPUT'),
      button = document.createElement('BUTTON'),
      container = document.getElementsByClassName('input_controls')[0];

  input.setAttribute('autocomplete', 'off');
  input.id = 'chat-input';
  button.className = 'enviar';
  button.innerHTML = 'Enviar';

  form.appendChild(input);
  form.appendChild(button);

  container.appendChild(form);

  form.addEventListener('submit', function(e) {
    var input = document.getElementById('chat-input');
    var message = input.value;
    if (message.trim() != '') {
      input.value = '';
      socket.emit('sendchat', message);
    }
    e.preventDefault();
  });
}

function enableBettingInput () {
  var form = document.createElement('form'),
      input = document.createElement('INPUT'),
      button = document.createElement('BUTTON'),
      container = document.getElementsByClassName('input_controls')[0];

  input.setAttribute('autocomplete', 'off');
  input.setAttribute('placeholder', 'Monto');
  input.setAttribute('type', 'number');
  input.setAttribute('maxlength', '7');
  input.id = 'betting-input';
  button.className = 'enviar';
  button.innerHTML = 'Apostar';

  form.appendChild(input);
  form.appendChild(button);

  container.appendChild(form);

  form.addEventListener('submit', function(e) {
    var input = document.getElementById('betting-input');
    var message = input.value;
    if (message.trim() != '') {
      input.value = '';
      socket.emit('sendbet', message);
    }
    e.preventDefault();
  });
}

function onMessage (username, data) {
  var list = document.getElementById('chat-text');
  var el = document.createElement('li');

  el.innerHTML = '<b>' + username + '</b> ' + data;
  list.appendChild(el);
  list.scrollTop = list.scrollHeight;
}

function updatePlayerPoints (points) {
  document.getElementsByClassName('player_points')[0].innerHTML = points;
}

function updateOpponentPoints (points) {
  document.getElementsByClassName('opponent_points')[0].innerHTML = points;
}

function getPlayerName (name) {
  document.getElementsByClassName('player_name')[0].innerHTML = name;
}

function getOpponentName (name) {
  document.getElementsByClassName('opponent_name')[0].innerHTML = name;
}

function getMaxPoints (maxPoints) {
  document.getElementsByClassName('max_points_label')[0].innerHTML = 'Meta';
  document.getElementsByClassName('max_points')[0].innerHTML = maxPoints;
}

function GameOver (result) {
  if (result == 'winner') {
    onMessage('servidor', 'Ganaste!');
  } else {
    onMessage('servidor', 'Perdiste!');
  }
}

//DEMO RPS
socket.on('disableoptions', disableOptions);
socket.on('enableoptions', enableOptions);


function optionsClickHandler (e) {
  if (e.target.id) {
    socket.emit('optionselected', e.target.id);
  }
}

function disableOptions () {
  var options = document.getElementsByClassName('game_options')[0];
  options.style.opacity = 0.5;
  options.removeEventListener('click', optionsClickHandler);
}

function enableOptions () {
  var options = document.getElementsByClassName('game_options')[0];
  options.style.opacity = 1;
  options.addEventListener('click', optionsClickHandler);
}
