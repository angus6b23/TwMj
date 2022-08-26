// ------------------------------------------ //
// GLOBAL Variables
// ------------------------------------------ //
let allplayer=[NaN]; //Array for all players, such that allplayer[1].name = name of player1
let game_record=[NaN]; //Array for record of game, such that game_record[1] = Results of first game
let fulldata_JSON = new Array; // Array for undo and redo, saves most of the data
let msg = ''; //Message used for game log
let game_log = new Array; //Array saving all game log objects
let gamestat={ //Object for holding game statistics
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
let default_setting={ //Object for holding settings
    font: '',
    theme: 'Nord',
    fold: 1.5, //Mutiplier for each consecutive win
    break: 3, //Loser can choose to stop consecutive after 3 loses
    base: 0, //Base Money
    money: 1, //Multiplier (Money = yaku x money multiplier)
};
let player_template={
    balance: 0,//Current balance
    unrealized: 0,//Unrealized gains or loses(未結算)
    lossto1: 0,
    lossto2: 0,
    lossto3: 0,
    lossto4: 0,
    name: '',
    position: '',
    sf1: 0,
    sf2: 0,
    sf3: 0,
    sf4: 0,
    status: 'neutral',
    winning_streak: 0,
    max_winning_streak: 0,
    tsumo: 0,
    win: 0,
    lose: 0,
    deal_lose: 0,
    deal_win: 0,
    max_yaku: 0,
    instantget: 0,
    instantpay: 0,
    bal_arr: [],
    unr_arr: []
}
let mapped = new Object //Object for saving index of player position
// ------------------------------------------ //
// START POPUP FUNCTIONS
// ------------------------------------------ //
function start_game(start_obj){
    default_setting.money = parseInt(start_obj.multiplier); //Apply settings into corresponding object
    default_setting.break = parseInt(start_obj.break_streak);
    for (i = 1; i<5; i++){
        let new_player = {...player_template};
        new_player.name = start_obj.name_array[i];
        switch(i){
            case 1: new_player.position = 'E'; break;
            case 2: new_player.position = 'S'; break;
            case 3: new_player.position = 'W'; break;
            case 4: new_player.position = 'N'; break;
        }
        allplayer.push(new_player); //Push all players into single array
    }
    start_game_ui();
    app.emit('data_change');
}
function map_players(){
    for (i=1; i<5; i++){
        switch (allplayer[i].position) {
            case 'E': mapped.E = i; break;
            case 'S': mapped.S = i; break;
            case 'W': mapped.W = i; break;
            case 'N': mapped.N = i; break;
        }
    }
}
// ------------------------------------------ //
// EVENT HANDLEERS
// ------------------------------------------ //
app.on('data_change', async function(){
    await map_players();
    start_game_ui();
    app.emit('ui_update');
})

//
// Functions for Save and load
//
function save_setting(){
    localStorage.setItem('default_setting', JSON.stringify(default_setting));
}

function save(){
    gamestat.last_save = new Date();
    let data = new Object();
    data.allplayer = [...allplayer];
    data.gamestat = {...gamestat};
    data.game_record = [...game_record];
    let temp_JSON = JSON.stringify(data);
    fulldata_JSON.unshift(temp_JSON);
    localStorage.setItem('data', JSON.stringify(data));
    localStorage.setItem('log', JSON.stringify(game_log));
}

function load(){
    if (localStorage.getItem('default_setting') === null){
    } else {
        default_setting = JSON.parse(localStorage.getItem('default_setting'));
        apply_theme(default_setting.theme);
        set_font(default_setting.font);
    }
    if (localStorage.getItem('data') === null){
    } else {
        if (localStorage.getItem('log') === null){
        } else {
            game_log = JSON.parse(localStorage.getItem('log'));
            update_log_table();
        }
    data = JSON.parse(localStorage.getItem('data'));
    allplayer = data.allplayer;
    gamestat = data.gamestat;
    game_record = data.game_record;
    }
}
