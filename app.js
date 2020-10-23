const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io').listen(server);

app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/views/odd_eif.html');
});

app.get('/game/thread/:id/', (req, res) => {
    res.render('game_page', {thread_id: req.params.id});
});

var players = {};
var opponent, users;

io.on('connection', (socket) => {
    var username;
    var current_thread = null;

    socket.on('connection_thread', (data) => {
        username = data.name;
        console.log(`[SOCKET] --> User Connected ${username}`);

        let thread = data.thread_id.toString();
        io.in(thread).clients((error, clients) => {
            users = clients;
            var num_clients = clients.length;
            if (num_clients > 1) {
                io.to(socket.id).emit('thread_full', null);
            } else {
                _join(socket.id, username);
                socket.join(thread);
                socket.broadcast.to(thread).emit('player_joined', {name: username});
                console.log('joined', clients, socket.id, players);
                if (num_clients == 1) {
                    var self = players[socket.id];
                    opponent = players[clients[0]];
                    self.option = opponent.option == 'odd' ? 'even' : 'odd';
                    console.log(`${self.name} -> ${self.option}, ${opponent.name} -> ${opponent.option}`);
                    // Sends the data of 1stly connected player to now connected player!
                    io.to(self.socket).emit('opponent_connected', opponent); 
                    // Sends the data of 2ndly connected player to 1stly connected player!
                    io.to(opponent.socket).emit('opponent_connected', self);
                }
            }
        });
        current_thread = thread;
    });

    socket.on('game_data_out', (data) => {
        io.to(data.to_socket).emit('game_data_in', data);
    });

    socket.on('message_out', (data) => {
        socket.broadcast.to(current_thread).emit('message_in', data);
    });

    socket.on('disconnect', () => {
        console.log(`[SOCKET] --> User Disconnected ${username}`);
        socket.broadcast.to(current_thread).emit('player_left', {name: username});
    });
});

function _join(socket_id, username) {
    var options = ['odd', 'even'];
    players[socket_id] = {
        name: username,
        option: options[Math.floor(Math.random() * options.length)],
        socket: socket_id
    };
}

server.listen(3000, '127.0.0.1', () => {
    console.log('[SOCKET] --> Listening on 127.0.0.1:3000');
}); 
