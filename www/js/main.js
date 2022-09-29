// ------------------------------------------ //
// GLOBAL Variables
// ------------------------------------------ //
let allplayer=[NaN]; //Array for all players, such that allplayer[1].name = name of player1
let game_record=[NaN]; //Array for record of game, such that game_record[1] = Results of first game
let fulldata_JSON = new Array; // Array for undo and redo, saves most of the data
let msg = ''; //Message used for game log
let game_log = new Array; //Array saving all game log objects
let manual_adjust_array = new Array; // Array for adding adjutments
let gamestat={ //Object for holding game statistics
    round: 1,// 1 = 1st game, 2 = 2nd game ...
    round_prevailing: 1,//1 = 第一局東圈東， 2 = 東局南 ... 5 = 第一局南圈東 ... 17 = 第二局東圈東
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
    money: 0.5, //Multiplier (Money = yaku x money multiplier)
    display_as_money: false //Display money instead of score on main table when true;
};
let chart_created = false;
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
        this.max_streak = 0;
        this.tsumo = 0;
        this.win = 0;
        this.lose = 0;
        this.deal_lose = 0;
        this.deal_win = 0;
        this.cut_half = 0;
        this.max_yaku = 0;
        this.instant_get = 0;
        this.instant_pay = 0;
        this.bal_arr = [];
    }
}
class log_template{
    constructor(message){
        let time = new Date();
        let hour = time.getHours().toString();
        let minute = time.getMinutes().toString();
        this.timestamp = hour.padStart(2,0) + ':' + minute.padStart(2,0);
        this.message = message;
        this.removed = false;
    }
}
class chart_config{
    constructor(legend_boolean){
        this.type = 'line';
        this.data = {
                labels: generate_pseudolabels(),
                datasets: generate_chart_dataset()
        }
        this.options = {
            maintainAspectRatio: false,
            plugins:{
                legend:{
                    display: legend_boolean
                }
            }
        }
        this.default = {
            global: {
                defaultFontColor: (themes[default_setting.theme]['is_Dark']) ? '#FFFFFF' : '#000000',
            }
        }
    }
}
let mapped = new Object //Object for saving index of player position
// Function for returning numbers in 2 decimal places
function round_to_2_dec(num){
    num = Math.round(num * 100) / 100;
    return num;
}
// ------------------------------------------ //
// START POPUP FUNCTIONS
// ------------------------------------------ //
function start_game(start_obj){
    default_setting.money = start_obj.multiplier; //Apply settings into corresponding object
    default_setting.break = start_obj.break_streak;
    for (i = 1; i<5; i++){
        let position;
        switch(i){
            case 1: position = 'E'; break;
            case 2: position = 'S'; break;
            case 3: position = 'W'; break;
            case 4: position = 'N'; break;
            default: console.error('Error while staring game: Unknown case');
        }
        let new_player = new player_template(start_obj.name_array[i], position);
        allplayer.push(new_player); //Push all players into single array
    }
    map_players();
    fill_names();
    app.emit('setting_change');
    app.emit('data_change');
}
function map_players(){ //Create mapped object, such that mapped.E will return the index of player who has position of east
    for (i=1; i<5; i++){
        switch (allplayer[i].position) {
            case 'E': mapped.E = i; break;
            case 'S': mapped.S = i; break;
            case 'W': mapped.W = i; break;
            case 'N': mapped.N = i; break;
            default: console.error('Error while mapping players: Unknown case');
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
            msg += allplayer[player_index].name + ' 出銃了 ' + game_arr[i] + '番給 ' + allplayer[i].name + '<br>';
        }
    }
    (winner_count == 2) ? gamestat.double_winner += 1 : //Find for double and triple winner
    (winner_count == 3) ? gamestat.triple_winner += 1 : null;
    let total_yaku = parseInt(gamestat.avg_yaku) * (parseInt(gamestat.deal) + parseInt(gamestat.tsumo)) + Math.abs(parseInt(game_arr[player_index])); //Calculate total yakus
    gamestat.deal += 1; // Add 1 deal game to gamestat
    gamestat.avg_yaku = round_to_2_dec(total_yaku / (parseInt(gamestat.deal) + parseInt(gamestat.tsumo))); //Calculate and ound average yaku to 2 decimal places
    transaction('deal', game_arr); //Call transaction after collecting statistics
}
function tsumo(player_index, game_arr){
    msg = '第' + gamestat.round + '場：<br>';
    // Manage game statistics first
    gamestat.total_change += Math.abs(game_arr[player_index]);
    allplayer[player_index].win += 1;
    allplayer[player_index].tsumo += 1;
    let total_yaku = 0;
    let tsumo_max_yaku = 0
    for (i = 1; i <= 4; i++){ //Find for max yaku and generate log
        if(game_arr[i] < 0){
            allplayer[i].lose += 1; //Record losers
            (Math.abs(game_arr[i]) > gamestat.max_yaku) ? gamestat.max_yaku = Math.abs(game_arr[i]) : null;
            (Math.abs(game_arr[i]) > allplayer[player_index].max_yaku) ? allplayer[player_index].max_yaku = Math.abs(game_arr[i]) : null;
            total_yaku += Math.abs(game_arr[i]);
            (game_arr[i] < 0 && Math.abs(game_arr[i]) > tsumo_max_yaku) ? tsumo_max_yaku = Math.abs(game_arr[i]) : null; //Record largest yaku for calculating average yaku for game stats
        }
    }
    let avg_yaku = round_to_2_dec(total_yaku / 3);
    let game_total_yaku = parseInt(gamestat.avg_yaku) * (parseInt(gamestat.deal) + parseInt(gamestat.tsumo)) + tsumo_max_yaku;
    gamestat.tsumo += 1;
    gamestat.avg_yaku = round_to_2_dec(parseInt(game_total_yaku) / (parseInt(gamestat.deal) + parseInt(gamestat.tsumo)));
    msg += allplayer[player_index].name + ' 自摸了 ' + avg_yaku + '番<br>';
    transaction('tsumo', game_arr);
}
function transaction(action, game_arr){
    game_record.push(game_arr);
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
        else if (allplayer[i].status == 'neutral'){ //For neutral player => Ignore winning player, pay full to both neutral and losing players
            for ( x = 1; x<=4 ; x++){
                (allplayer[i]['loseto' + x] > 0 && allplayer[x].status != 'win') ? pay_full_price(i, x) : null;
            }
        }
        else if (allplayer[i].status == 'lose'){//For losing player => Pay full price to other losing and neutral player, stack streak and price for winning players
            for (x = 1; x<=4; x++){
                (allplayer[i]['loseto' + x] > 0 && allplayer[x].status != 'win') ? pay_full_price(i,x) : null;
                if (allplayer[x].status == 'win'){
                    allplayer[i]['sf' + x] += 1;
                    (action == 'deal' ) ? allplayer[i]['loseto' + x ] = Math.ceil(allplayer[i]['loseto' + x ] * parseFloat(default_setting.fold)) + parseInt(game_arr[x]) : //Select value from winner if deal
                    (action == 'tsumo') ? allplayer[i]['loseto' + x ] = Math.ceil(allplayer[i]['loseto' + x ] * parseFloat(default_setting.fold)) + Math.abs(parseInt(game_arr[i])) : null;  //Select value from loser if tsumo
                }
            }
        }
        allplayer[i].bal_arr.push(allplayer[i].balance);
    }
    gamestat.round += 1; // Add round to gamestat
    (allplayer[mapped[gamestat.banker]].status == 'win') ? hold_banker() : pass_banker();
    add_log(msg);
    app.emit('data_change');
}
function pay_full_price(payer_index, receiver_index){
    let to_pay = parseInt(allplayer[payer_index]['loseto' + receiver_index]);
    msg += allplayer[payer_index].name + ' 已支付了 ' + to_pay + ' 番給 ' + allplayer[receiver_index].name + '<br>';
    allplayer[payer_index].balance -= to_pay;
    allplayer[receiver_index].balance += to_pay;
    allplayer[payer_index]['loseto' + receiver_index ] = 0;
    allplayer[payer_index]['sf' + receiver_index] = 0;
}
function pay_half_price(payer_index, receiver_index){
    let to_pay = parseInt(Math.floor(allplayer[payer_index]['loseto' + receiver_index] / 2));
    msg += allplayer[payer_index].name + ' 已支付了 ' + to_pay + ' 番給 ' + allplayer[receiver_index].name + '[踢半]<br>';
    allplayer[payer_index].balance -= to_pay;
    allplayer[receiver_index].balance += to_pay;
    allplayer[payer_index]['loseto' + receiver_index ] = 0;
    allplayer[payer_index]['sf' + receiver_index] = 0;
    allplayer[payer_index].cut_half += 1;
}
function hold_banker(){
    gamestat.streak += 1;
    (gamestat.streak > allplayer[mapped[gamestat.banker]].max_streak) ? allplayer[mapped[gamestat.banker]].max_streak = gamestat.streak : null;
    (gamestat.streak > gamestat.max_streak) ? gamestat.max_streak = gamestat.streak: null;
}
function pass_banker(){
    gamestat.round_prevailing += 1;
    gamestat.streak = 0;
    switch(gamestat.banker){
        case 'E': gamestat.banker = 'S'; break;
        case 'S': gamestat.banker = 'W'; break;
        case 'W': gamestat.banker = 'N'; break;
        case 'N': gamestat.banker = 'E'; break;
        default: console.error('Error while passing banker: Unknown case');
    }
}
// ------------------------------------------ //
// Function for tie
// ------------------------------------------ //
function tie(action){
    msg = '第' + gamestat.round + '場：<br>流局';
    gamestat.tie += 1;
    game_record.push(['tie']);
    (action == 'hold_banker') ? hold_banker() :
    (action == 'pass_banker') ? pass_banker() : null ;
    add_log(msg);
    app.emit('data_change');
}
// ------------------------------------------ //
// Function for ending streak
// ------------------------------------------ //
function end_streak(payer_index, receiver_index){
    msg = allplayer[payer_index].name + ' 選擇中止與 ' + allplayer[receiver_index].name + ' 的拉踢<br>';
    pay_full_price(payer_index, receiver_index);
    add_log(msg);
    app.emit('data_change');
}
// ------------------------------------------ //
// Function for Charts
// ------------------------------------------ //
// Generate pseudo-labels on x-axis for chart
function generate_pseudolabels(){
    let label_array = []
    for (i = 0; i < allplayer[1].bal_arr.length; i++){
        label_array.push(' ');
    }
    return label_array;
}
function generate_chart_dataset(){
    let dataset_array = [];
    let current_theme = themes[default_setting.theme]
    for (i=1; i<=4; i++){
        let color_string = '--p' + i + '-color'
        let data_object = {
            fill: false,
            tension: 0.25,
            label: allplayer[i].name,
            data: allplayer[i].bal_arr,
            borderColor: current_theme[color_string]
        }
        dataset_array.push(data_object);
    }
    return dataset_array;
}
// ------------------------------------------ //
// Function for changing seat
// ------------------------------------------ //
function change_seat(option){
    msg = '調位：<br>'
    option = $('input[name="change-seat"]:checked').val();
    if (option == 'default'){
        let temp_allplayer = {...allplayer};
        for (i=1; i<=4; i++){
            (temp_allplayer[i].position == 'E') ? allplayer[i].position = 'S' :
            (temp_allplayer[i].position == 'S') ? allplayer[i].position = 'E' :
            (temp_allplayer[i].position == 'W') ? allplayer[i].position = 'N' :
            (temp_allplayer[i].position == 'N') ? allplayer[i].position = 'W' : null;
        }
    } else {
        let east_value = $('input[name="seat-east"]:checked').val()
        let south_value = $('input[name="seat-south"]:checked').val()
        let west_value = $('input[name="seat-west"]:checked').val()
        let north_value = $('input[name="seat-north"]:checked').val()
        allplayer[east_value].position = 'E';
        allplayer[south_value].position = 'S';
        allplayer[west_value].position = 'W';
        allplayer[north_value].position = 'N';
    }

    for (i=1; i<=4; i++){
        let position = ( allplayer[i].position == 'E' ) ? '東位' :
        ( allplayer[i].position == 'S' ) ? '南位' :
        ( allplayer[i].position == 'W' ) ? '西位' :
        ( allplayer[i].position == 'N' ) ? '北位' : null;
        msg += allplayer[i].name + ' 現在為 ' + position + '<br>';
    }
    map_players();
    fill_names();
    add_log(msg);
    app.emit('data_change');
    app.popup.close();
    app.tab.show('#view-home');
}
// ------------------------------------------ //
// Function for Renaming players
// ------------------------------------------ //
function rename(player_index, new_name){
    new_name = new_name.toString();
    if (new_name == ''){
        catch_error('新名字不能為空白');
    } else {
        msg = allplayer[player_index].name + ' 已改名為 ' + new_name;
        allplayer[player_index].name = new_name;
        fill_names();
        add_log(msg);
        app.emit('data_change');
    }
}
// ------------------------------------------ //
// Function for manual adjustment
// ------------------------------------------ //
function adjust(){
    msg = '詐糊・手動調整：<br>'
    if (manual_adjust_array.length == 0){
        catch_error('請先新增行動');
        return false;
    } else {
        for (i=0; i< manual_adjust_array.length; i++){
            if (manual_adjust_array[i].action == 'add'){
                msg += allplayer[manual_adjust_array[i]['player_index']].name + ' 增加了' + manual_adjust_array[i].value + '番<br>';
                allplayer[manual_adjust_array[i]['player_index']].balance += parseInt(manual_adjust_array[i].value);
            }
            else if (manual_adjust_array[i].action == 'minus'){
                msg += allplayer[manual_adjust_array[i]['player_index']].name + ' 減少了' + manual_adjust_array[i].value + '番<br>';
                allplayer[manual_adjust_array[i]['player_index']].balance -= parseInt(manual_adjust_array[i].value);
            }
            else if (manual_adjust_array[i].action == 'equal'){
                msg += allplayer[manual_adjust_array[i]['player_index']].name + ' 設定為' + manual_adjust_array[i].value + '番<br>';
                allplayer[manual_adjust_array[i]['player_index']].balance = parseInt(manual_adjust_array[i].value);
            }
        }
        manual_adjust_array = [];
        gamestat.modified = true;
        add_log(msg);
        app.emit('data_change');
        return true;
    }
}
// ------------------------------------------ //
// Function for import
// ------------------------------------------ //
function import_data(data){
    try{
        allplayer = data.allplayer;
        gamestat = data.gamestat;
        game_record = data.game_record;
        game_log = data.log;
        map_players();
        fill_names();
        app.emit('data_change');
        app.popup.close('#start-popup');
        app.tab.show('#view-home');
        app.toolbar.show('.toolbar');
    } catch(err){
        catch_error(err);
    }
}
// ------------------------------------------ //
// Function for capturing summary
// ------------------------------------------ //
async function capture(){
    $('.left .capture-button').addClass('none');
    $('.left .preloader').removeClass('none');
    $('#summary-title').removeClass('none');
    $('#summary-url').text(window.location.href);
    $('.timestamp').text(new Date());
    let element = $('.capture')[0];
    let image = await html2canvas(element, {windowWidth: element.scrollWidth, windowHeight: element.scrollHeight});
    image.toBlob(function(blob){
        const path = URL.createObjectURL(blob);
        let timestamp = new Date();
        let filename = 'Twmj-Summary-' + timestamp.getDate().toString().padStart(2, 0) + '-' + (timestamp.getMonth() + 1).toString().padStart(2, 0);
        download(filename, path);
    })
    $('.left .capture-button').removeClass('none');
    $('.left .preloader').addClass('none');
    $('#summary-title').addClass('none');
    $('.timestamp').text('');
    $('#summary-url').text('');
}
// ------------------------------------------ //
// EVENT HANDLEERS
// ------------------------------------------ //
app.on('data_change', function(){
    // Calculate unrealized gain or loses for all player
    for (i=1; i<=4; i++){
        allplayer[i].unrealized = 0;
        for (x = 1; x<=4 ; x++){
            if ( i !== x ){
                allplayer[i].unrealized += allplayer[x]['loseto' + i];
                allplayer[i].unrealized -= allplayer[i]['loseto' + x];
            }
        }
    }
    save();
    app.emit('ui_update');
})
app.on('setting_change', function(){
    localStorage.setItem('default_setting', JSON.stringify(default_setting));
})
// ------------------------------------------ //
// Functions for handling log
// ------------------------------------------ //
function add_log(message){
    let log = new log_template(message);
    game_log.unshift(log);
}

// ------------------------------------------ //
// Functions for Save and load
// ------------------------------------------ //
function save(){
    (undo_count > 0) ? fulldata_JSON = fulldata_JSON.slice(undo_count):null;
    undo_count = 0;
    gamestat.last_save = new Date();
    let data = new Object();
    data.allplayer = [...allplayer];
    data.gamestat = {...gamestat};
    data.game_record = [...game_record];
    data.log = [...game_log];
    fulldata_JSON.unshift(JSON.stringify(data));
    localStorage.setItem('data', JSON.stringify(data));
}

function load(){
    if (localStorage.getItem('default_setting') === null){
    } else {
        default_setting = JSON.parse(localStorage.getItem('default_setting'));
    }
    if (localStorage.getItem('data') === null){
        return false;
    } else {
        data = JSON.parse(localStorage.getItem('data'));
        allplayer = data.allplayer;
        gamestat = data.gamestat;
        game_record = data.game_record;
        game_log = data.log;
        return true;
    }
}
