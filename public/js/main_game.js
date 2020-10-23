function add_result(type) {
    $('.result').empty();
    let message = type == 'win' ? 'Hooray! You Won!' : 'Oops! You Lost';
    console.log(message, type);
    $('.result').addClass(type);
    for(var i in message) { 
        if(message[i] === " ") {
            $(".result").append( $("<span>").html("&nbsp;") ); 
        } else {  
            $(".result").append( $("<span>").text(message[i]) ); 
        }
    }
    $('.result').append('<button class="btn btn-outline-primary btn-restart">restart</button>');
    $('.result').show();
}

function waiting_for_result() {
    root_info_layout.empty();
    root_info_layout.removeClass('m-0');
    root_info_layout.append(`
        <span>Waiting For Result</span>
        <div class="spinner">
            <div class="bounce1"></div>
            <div class="bounce2"></div>
            <div class="bounce3"></div>
        </div>
    `);
}
$(document).ready((e) => {
    const socket = io();
    const interface = new Interface();
    const layout = $('.messages');
    const root_info_layout = $('.root-info');
    var opponent, opponent_num;
    var _path = location.pathname.split('/');
    var thread = _path[_path.length - 1] == "" ? _path[3] : _path.pop();
    let name = prompt('Enter Your Name');
    var username = name == "" ? `Player ${Math.floor(Math.random() * 90 + 10)}` : name;
    socket.emit('connection_thread', {thread_id: thread, name: username});

    socket.on('thread_full', () => {
        document.write('Thread Full');
    });

    socket.on('opponent_connected', (data) => {
        opponent = data;
        var option = data.option == 'odd' ? 'even' : 'odd';
        var info = `
        Your Option is ${option}!<br>
        If the sum of your entered number and opponent's number is ${option}<br>
        Then you win! OR you lose!<br>
        <button class="btn btn-outline-primary btn-continue">continue</button>
        `;
        root_info_layout.addClass('m-0');
        root_info_layout.html(info);
        $('.btn-continue').click((e) => {
            root_info_layout.removeClass('m-0');
            root_info_layout.html(`
            <span>Waiting For Result</span>
            <div class="spinner">
                <div class="bounce1"></div>
                <div class="bounce2"></div>
                <div class="bounce3"></div>
            </div>
            `);
        });
    });

    function check_win(num1, num2) {
        var sum = parseInt(num1) + parseInt(num2);
        var res = sum % 2 == 0 ? 'even' : 'odd';
        console.log(num1, num2, opponent, res, sum);
        root_info_layout.hide();
        $('._self > .num').text(num2);
        $('.opponent > .name').text(`${opponent.name}'s Number`);
        $('.opponent > .num').text(num1);
        if ((opponent.option == 'odd' && res == 'odd') || (opponent.option == 'even' && res == 'even')) {
            add_result('lose');
        } else {
            add_result('win');
        }
        $('.game').show();
    }

    $('.game-select').change(function(e) {
        $(this).prop('disabled', true);
        var number = $(this).val();
        if (number >= 0 || number <= 10) {
            socket.emit('game_data_out', {number: number, to_socket: opponent.socket});
            if (opponent_num) {
                check_win(opponent_num, number);
            }
        } else {
            $(this).css({'animation': 'shake 0.8s', 'color': 'var(--danger)', 'border-color': 'var(--danger)'});
        }
    });

    socket.on('game_data_in', (data) => {
        var has_played = $('.game-select').prop('disabled');
        var number = $('.game-select').val();
        opponent_num = data.number;
        if (has_played) {
            check_win(opponent_num, number);
        }
    });

    $('.result').on('click', '.btn-restart', (e) => {
        opponent_num = undefined;
        $('.game-select').prop('disabled', false);
        $('.game').hide();
        root_info_layout.show();
        $('.result').removeClass('win lose');
        $('.game-select').val('');
        waiting_for_result(); 
    });

    // MESSAGING INTERFACE 
    socket.on('player_joined', (data) => {
        layout.append(interface.add_info_joined(data.name));
        $('.option').text(data.option);
    });

    socket.on('player_left', (data) => {
        root_info_layout.removeClass('m-0');
        root_info_layout.empty();
        root_info_layout.append(`
        <span>Waiting For Another Player</span>
        <div class="spinner">
            <div class="bounce1"></div>
            <div class="bounce2"></div>
            <div class="bounce3"></div>
        </div>
        `);
        layout.append(interface.add_info_left(data.name));
    });

    socket.on('message_in', (data) => {
        var is_flipped = $('.root-card').hasClass('flipped');
        if (!is_flipped) {
            $('.chat-option i').css({'animation': 'alert 0.8s', 'color': 'var(--danger)',
                                    'animation-iteration-count': 'infinite',
                                    'animation-direction': 'alernate-reverse'});
        }
        layout.append(interface.add_message(data.message, data.name));
    });

    $('.send-msg').click((e) => {
        var msg = $('.msg-input').val();
        if (msg && msg != "") {
            layout.append(interface.add_message_self(msg));
            socket.emit('message_out', {message: msg, name: username});
            $('.msg-input').val('');
        }
    });

    $('.chat-option').click((e) => {
        $('.chat-option i').css({'animation': '',
                                 'color': 'var(--primary)'});
        $('.root-card').toggleClass('flipped');
        $('.main-menu').fadeToggle();
    });
});
