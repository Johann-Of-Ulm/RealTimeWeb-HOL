var board;
var game;
var socket = io();

window.onload = function () {initGame()};

socket.once('board', function(brd){
    //on first connection load game position
    board.position(brd);
    game.load(brd);

    document.getElementById("turn").style.backgroundColor = wende(game.turn());
});

var wende = function (bw){
    
    if (bw == 'b'){
        return 'black';
    } else {
        return 'white';
    };
};

var initGame = function() {
   var cfg = {
       draggable: true,
       position: 'start',
       onDrop: handleMove,
   };
   
   board = new ChessBoard('gameBoard', cfg);
   game = new Chess();
};

var handleMove = function(source, target ) {
    var move = game.move({from: source, to: target});
    
    if (move === null)  return 'snapback';
    else socket.emit('move', move, game.fen());

    document.getElementById("turn").style.backgroundColor = wende(game.turn());
};

socket.on('move', function(msg) {
    //receive last move => update game and board position
    game.move(msg);
    board.position(game.fen());
    document.getElementById("turn").style.backgroundColor = wende(game.turn());
});

