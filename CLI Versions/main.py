import os
import random

data = {
    'player_num': 0,
    'player_option': '',
    'py_option': '',
    'py_num': 0
}

class Player:
    def __init__(self, name, buff_size=4096):
        self.name = name
        self.range = [x for x in range(11)]
    
    @staticmethod
    def check_odd_eif(_data):
        sum = _data['player_num'] + _data['py_num']
        if sum % 2 == 0:
            return 'e'
        else:
            return 'o'

    def check_win(self, _data):
        res = self.check_odd_eif(_data)
        print(f"""
        ================
        Your Number : {_data['player_num']}
        Python's Number : {_data['py_num']}
        Here, the sum is {_data['player_num'] + _data['py_num']}""")
        if (_data['player_option'] == 'even' and res == 'e') or (_data['player_option'] == 'odd' and res == 'o'):
            print("""
        Hooray! You Won!
        ================
            """)
        else:
            print("""
        Oops! You Lost!
        ================
            """)
        self.start_single_player(_data)

    def start_single_player(self, _data):
        _data['py_num'] = random.choice(self.range)
        num = int(input("Enter a number (0 - 10) --> "))
        if num <= 10 and num >= 0:
            _data['player_num'] = num
            self.check_win(_data)
    
    def sub_menu(self):
        os.system('clear')
        print(f"""
        ==========================
        |[1] -> Single Player
        |[2] -> Back to main menu
        ==========================
        """)
        try:
            mode = int(input("Select an option (1/2/3) --> "))
            if mode == 1:
                opt = str(input("Choose Your Option (odd/even) --> "))
                if opt == "odd":
                    data['player_option'] = "odd"
                    data['py_option'] = "even"
                else:
                    data['player_option'] = "even"
                    data['py_option'] = "odd"
                self.start_single_player(data)
            elif mode == 2:
                self.main_menu()
            else:
                print("[ERROR] --> Invalid Option!")
        except ValueError:
            print("[ERROR] --> Invalid Option!")

    def main_menu(self):
        os.system('clear')
        print(f"""
        =====================================
        Welcome {self.name} to --> Odd & Eif 
        =====================================
        |[1] -> Start Game
        |[2] -> How To Play
        |[3] -> Exit
        =====================================
        """)
        opt = int(input("Select an option (1/2/3) --> "))
        if opt == 1:
            self.sub_menu()
        elif opt == 2:
            pass
        elif opt == 3:
            pass
        else:
            print("[ERROR] --> Invalid Option!")
        

if __name__ == "__main__":
    name = str(input('Enter Your Name --> '))
    player = Player(name)
    player.main_menu()