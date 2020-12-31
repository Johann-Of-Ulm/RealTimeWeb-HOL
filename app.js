var express = require('express');
var app = express();
app.use(express.static('public'));
var http = require('http').Server(app);
var port = process.env.PORT || 3000;
var io = require('socket.io')(http);
var schach;  //chess game state
var fs = require('fs');

var readBoard = function () {

    //read file containing last game state
    fs.readFile('schachbrett.txt', function(err, data) {
   
        if (err) {
            return console.error(err);
        }
        schach = data.toString();
        console.log('Game loaded: ' + schach);
    });
};

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/public/default.html');   
});

http.listen(port, function() {

    //read last game state from file; record to variable
    readBoard();

    console.log('listening on *: ' + port);
});

io.on('connection', function(socket) {

    //broadcast current game position to new client connection from variable
    socket.emit('board', schach); 

    console.log('new connection to game ' + schach);

    //broadcast all new moves; save game state to variable
    socket.on('move', (msg, msg2) => {

        socket.broadcast.emit('move', msg);
        schach = msg2;
    });

    socket.on('disconnect', function(socket){
        
        //save game state to file on any client disconnect
        fs.writeFile('schachbrett.txt', schach, function(err){
            if (err) throw err;
            console.log('Game saved: ' + schach);
        });
    })
});