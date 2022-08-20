var psuedo_name_subfix = 1;
function generate_psudo_names(){
    let name = '玩家' + psuedo_name_subfix;
    psuedo_name_subfix++;
    return name;
}

var allplayer=[NaN]; //Array for all players, such that allplayer[1].name = name of player1
var gamestat={ //Object for holding game statistics
    round: 1,
    round_prevailing: 1,
    streak: 0, //Record current steak of banker(連莊)
    banker: 'E', //Record current position of banker(莊位)
    tie: 0, //Record how many ties in current game(流局)
    deal: 0, //Record how many deals in current game(出統)
    tsumo: 0, //Record how many tsumos in current game(自摸)
    avg_yaku: 0, //Record average yaku in current game(平均番數)
    max_yaku: 0, //Record maximum yaku in current game(最大番數)
    instantget: 0, //Record sum of amount of instant get(即收總和)
    instantpay: 0, //Record sum of amount of instant pay(即付總和)
    total_change: 0, //Record sum of movement of yaku (總番數流動)
    max_streak: 0, //Record maximum steak of banker(最大連莊)
    modified: false, //State if the results are modified (檢查番數有否被修改)
    last_save: '' //Record last save time
};
var default_setting={ //Object for holding settings
    font: '',
    theme: 'Nord',
    fold: 1.5, //Mutiplier for each consecutive win
    break: 3, //Loser can choose to stop consecutive after 3 loses
    base: 0, //Base Money
    money: 1, //Multiplier (Money = yaku x money multiplier)
};
