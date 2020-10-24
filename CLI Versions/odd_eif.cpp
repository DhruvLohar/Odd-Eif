// Works In Turbo C++ Only!
// By Dhruv Lohar

#include <iostream.h>
#include <stdlib.h>
#include <time.h>
#include <string.h>

struct data 
{
    int player_num, cpp_num;
    char player_option, cpp_option;
}

class Player
{
public:
    void init_game();
    int check_odd_even(struct data _data);
    void display_help();
    void start(struct data _data);
    void check_win(struct data _data);
};

void Player ::init_game()
{
    int option;
    char mode[5];
    struct data game_data;
    cout << "==========================\n";
    cout << "| C++ Plays | Odd & Eif! |\n";
    cout << "==========================\n"
    cout << "1. Start Game\n";
    cout << "2. How to Play\n";
    cout << "3. Exit\n";
    cout << "Select a option (1/2/3) --> ";
    cin >> option;
    switch (option)
    {
    case 1:
        cout << "Enter your option (odd/even) -- > ";
        cin >> mode;
        if (stricmp("odd", mode) == 0)
        {
            game_data.player_option = 'o';
            game_data.cpp_option = 'e';
        }
        else
        {
            game_data.player_option = 'e';
            game_data.cpp_option = 'o';
        }
        start(game_data);
        break;
    case 2:
        display_help();
        break;
    case 3:
        cout << "[EXIT] -> Bye! See ya next time..." << endl;
        break;
    default:
        cout << "[ERROR] -> Invalid Option!" << endl;
        init_game();
        break;
    }
}

void Player ::display_help()
{
    char option;
    cout << "Select your option i.e. Odd or Even\n";
    cout << "Enter a random number from 0 to 10\n";
    cout << "If the sum of ur selected number and C++'s selected number is equal to ur option i.e. Odd or Even then u win!\n";
    cout << "Continue? (Y/N) --> ";
    cin >> option;
    if (option == 'y' || option == 'y')
    {
        init_game();
    }
    else
    {
        cout << "[EXIT] -- Bye! See ya next time..." << endl;
        exit(0);
    }
}

int Player ::check_odd_even(struct data _data)
{
    int sum = _data.player_num + _data.cpp_num;
    if (sum % 2 == 0)
    {
        return 1;
    }
    else
    {
        return 0;
    }
}

void Player ::check_win(struct data _data)
{
    int res = check_odd_even(_data);
    cout << "Your Number : " << _data.player_num << endl;
    cout << "C++'s Number : " << _data.cpp_num << endl;
    if (_data.player_option == 'e' && res == 1)
    {
        cout << "Horray! You Won!\n";
    }
    else
    {
        cout << "Oops! You Lost!\n";
    }
    start(_data);
}

void Player ::start(struct data _data)
{
    srand((int)time(0));
    _data.cpp_num = rand() % 10 + 1;
    int player_num;
    cout << "Enter a number (0 - 10) --> ";
    cin >> player_num;
    if (player_num <= 10 && player_num >= 0)
    {
        _data.player_num = player_num;
        check_win(_data);
    }
    else
    {
        cout << "[ERROR] -> Invalid Number!\n";
        start(_data);
    }
}

int main()
{
    Player player;
    player.init_game();
}
