// ------------------------------------------ //
// GLOBAL Variables
// ------------------------------------------ //
let allplayer=[NaN]; //Array for all players, such that allplayer[1].name = name of player1
let game_record=[NaN]; //Array for record of game, such that game_record[1] = Results of first game
let fulldata_JSON = new Array; // Array for undo and redo, saves most of the data
let msg = ''; //Message used for game log
let game_log = new Array; //Array saving all game log objects
let gamestat={ //Object for holding game statistics
    round: 1,//1 = 第一圈東局， 2 = 南局, 3 = 西局, 4 = 北局
    round_prevailing: 1,// 1 = 東位莊, 2 = 南位莊 ...
    total_games: 0,
    streak: 0, //Record current steak of banker(連莊)
    banker: 'E', //Record current position of banker(莊位)
    tie: 0, //Record how many ties in current game(流局)
    deal: 0, //Record how many deals in current game(出統)
    tsumo: 0, //Record how many tsumos in current game(自摸)
    avg_yaku: 0, //Record average yaku in current game(平均番數)
    max_yaku: 0, //Record maximum yaku in current game(最大番數)
    instant_get: 0, //Record sum of amount of instant get(即收總和)
    instant_pay: 0, //Record sum of amount of instant pay(即付總和)
    total_change: 0, //Record sum of movement of yaku (總番數流動)
    max_streak: 0, //Record maximum steak of banker(最大連莊)
    modified: false, //State if the results are modified (檢查番數有否被修改)
    double_winner: 0,//Record occurance of double winners(雙響)
    triple_winner: 0,//Record occurance of triple winners(三響)
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
class player_template{
    constructor(name, position){
        this.name = name;
        this.position = position;
        this.balance = 0;//Current balance
        this.unrealized = 0;//Unrealized gains or loses(未結算)
        this.loseto1 = 0;
        this.loseto2 = 0;
        this.loseto3 = 0;
        this.loseto4 = 0;
        this.sf1 = 0;
        this.sf2 = 0;
        this.sf3 = 0;
        this.sf4 = 0;
        this.status = 'neutral';
        this.winning_streak = 0;
        this.max_winning_streak = 0;
        this.tsumo = 0;
        this.win = 0;
        this.lose = 0;
        this.deal_lose = 0;
        this.deal_win = 0;
        this.max_yaku = 0;
        this.instant_get = 0;
        this.instant_pay = 0;
        this.bal_arr = [];
        this.unr_arr = [];
    }

}
class log_template{
    constructor(message){
        let time = new Date();
        let hour = toString(time.getHours());
        let minute = toString(time.getMinutes());
        this.timestamp = hour.padStart(2,'0') + ':' + minute.padStart(2,'0');
        this.message = message;
        this.removed = false;
    }
}
let mapped = new Object //Object for saving index of player position
// ------------------------------------------ //
// START POPUP FUNCTIONS
// ------------------------------------------ //
function start_game(start_obj){
    default_setting.money = parseInt(start_obj.multiplier); //Apply settings into corresponding object
    default_setting.break = parseInt(start_obj.break_streak);
    for (i = 1; i<5; i++){
        let position;
        switch(i){
            case 1: position = 'E'; break;
            case 2: position = 'S'; break;
            case 3: position = 'W'; break;
            case 4: position = 'N'; break;
        }
        let new_player = new player_template(start_obj.name_array[i], position);
        allplayer.push(new_player); //Push all players into single array
    }
    start_game_ui();
    app.emit('data_change');
}
function map_players(){ //Create mapped object, such that mapped.E will return the index of player who has position of east
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
// Function for Instant get and Instant pay
// ------------------------------------------ //
function instant_get(player_index, value){
    msg = allplayer[player_index].name + ' 即收了其他玩家 ' + value + ' 番';
    gamestat.instant_get += value * 3;
    gamestat.total_change += value * 3;
    for (i = 1; i <= 4; i++){
        if ( i == player_index){
            allplayer[i].balance += parseInt(value) * 3;
            allplayer[i].instant_get += parseInt(value) * 3;
        } else {
            allplayer[i].balance -= parseInt(value);
        }
        allplayer[i].bal_arr.push(allplayer[i].balance);
    }
    add_log(msg);
    app.emit('data_change');
}

function instant_pay(player_index, value){
    msg = allplayer[player_index].name + ' 即付了其他玩家 ' + value + ' 番';
    gamestat.instant_pay += value * 3;
    gamestat.total_change += value * 3;
    for (i = 1; i <= 4; i++){
        if ( i == player_index){
            allplayer[i].balance -= parseInt(value) * 3;
            allplayer[i].instant_pay += parseInt(value) * 3;
        } else {
            allplayer[i].balance += parseInt(value);
        }
        allplayer[i].bal_arr.push(allplayer[i].balance);
    }
    add_log(msg);
    app.emit('data_change');
}
// ------------------------------------------ //
// Function for Deal and Tsumo
// ------------------------------------------ //
function deal(player_index, game_arr){
    msg = '第' + gamestat.round + '場：<br>';
    // Manage game statistics first
    gamestat.total_change += Math.abs(game_arr[player_index]);
    allplayer[player_index].lose += 1;
    allplayer[player_index].deal_lose += 1;
    let winner_count = 0
    for (i = 1; i <= 4; i++){ //Count for how many player win in this game, also find for max yaku and generate log
        if(game_arr[i] > 0){
            winner_count += 1;
            allplayer[i].win += 1;
            allplayer[i].deal_win += 1;
            (game_arr[i] > gamestat.max_yaku) ? gamestat.max_yaku = game_arr[i] : null;
            (game_arr[i] > allplayer[i].max_yaku) ? allplayer[i].max_yaku = game_arr[i] : null;
            msg += allplayer[player_index].name + ' 己出銃了 ' + game_arr[i] + '番給 ' + allplayer[i].name + '<br>';
        }
    }
    (winner_count == 2) ? gamestat.double_winner += 1 : //Find for double and triple winner
    (winner_count == 3) ? gamestat.triple_winner += 1 : null;
    let total_yaku = parseInt(gamestat.avg_yaku) * (parseInt(gamestat.deal) + parseInt(gamestat.tsumo)) + Math.abs(parseInt(game_arr[player_index])); //Calculate total yakus
    gamestat.deal += 1; // Add 1 deal game to gamestat
    gamestat.avg_yaku = Math.round((total_yaku / (parseInt(gamestat.deal) + parseInt(gamestat.tsumo))) * 100 ) / 100; //Calculate and ound average yaku to 2 decimal places
    // Set player status before transaction
    for (i = 1; i <= 4; i++){
        (game_arr[i] > 0) ? allplayer[i].status = 'win' :
        (game_arr[i] == 0) ? allplayer[i].status = 'neutral' :
        (game_arr[i] < 0) ? allplayer[i].status = 'lose': null;
    }
    for (i = 1; i <= 4; i++){ //Loop for player to place transaction
        if(allplayer[i].status == 'win'){ //For winning players => Ignore other winning player, pay full score to neutral player, pay half score to losing player
            for (x = 1; x<=4; x++){ //Loop for targetting other player
                (allplayer[i]['loseto' + x] > 0 && allplayer[x].status == 'neutral') ? pay_full_price(i, x) :
                (allplayer[i]['loseto' + x] > 0 && allplayer[x].status == 'lose') ? pay_half_price(i, x): null;
            }
        }
        if (allplayer[i].status == 'neutral'){ //For neutral player => Ignore winning player, pay full to both neutral and losing players
            for ( x = 1; x<=4 ; x++){
                (allplayer[i]['loseto' + x] > 0 && allplayer[x].status != 'win') ? pay_full_price(i, x) : null;
            }
        }
        if (allplayer[i].status == 'lose'){//For losing player => Pay full price to other losing and neutral player, stack streak and price for winning players
            for (x = 1; x<=4; x++){
                (allplayer[i]['loseto' + x] > 0 && allplayer[x].status != 'win') ? pay_full_price(i,x) : null;
                if (allplayer[x].status == 'win'){
                    allplayer[i]['sf' + x] += 1;
                    allplayer[i]['loseto' + x ] = allplayer[i]['loseto' + x ] * parseFloat(default_setting.fold) + parseInt(game_arr[x]);
                }
            }
        }
    }
    add_log(msg);
    app.emit('data_change');
}
function pay_full_price(payer_index, receiver_index){
    msg += allplayer[payer_index].name + ' 已支付了 ' + allplayer[payer_index]['loseto' + receiver_index] + ' 番給 ' + allplayer[receiver_index].name + '<br>';
    allplayer[payer_index].balance -= allplayer[payer_index]['loseto' + receiver_index];
    allplayer[receiver_index].balance += allplayer[payer_index]['loseto' + receiver_index];
    allplayer[payer_index]['loseto' + receiver_index ] = 0;
    allplayer[payer_index]['sf' + receiver_index] = 0;
}
function pay_half_price(payer_index, receiver_index){
    msg += allplayer[payer_index].name + ' 已支付了 ' + allplayer[payer_index]['loseto' + receiver_index] + ' 番給 ' + allplayer[receiver_index].name + '[踢半]<br>';
    allplayer[payer_index].balance -= Math.floor(allplayer[payer_index]['loseto' + receiver_index] / 2);
    allplayer[receiver_index].balance += Math.floor(allplayer[payer_index]['loseto' + receiver_index] / 2);
    allplayer[payer_index]['loseto' + receiver_index ] = 0;
    allplayer[payer_index]['sf' + receiver_index] = 0;
}
// ------------------------------------------ //
// EVENT HANDLEERS
// ------------------------------------------ //
app.on('data_change', async function(){
    await map_players();
    start_game_ui();
    app.emit('ui_update');
})
// ------------------------------------------ //
// Functions for handling log
// ------------------------------------------ //
function add_log(message){
    let log = new log_template(message);
    game_log.unshift(log);
}

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
    data.log = [...game_log];
    let temp_JSON = JSON.stringify(data);
    fulldata_JSON.unshift(temp_JSON);
    localStorage.setItem('data', JSON.stringify(data));
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
