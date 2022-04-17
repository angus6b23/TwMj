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

let theme = { //Object for themes
    Nord:{
        '--p1-color': '#d08770',
        '--p2-color': '#ebcb8b',
        '--p3-color': '#a3be8c',
        '--p4-color': '#b48ead',
        '--bg-nord': '#2e3440',
        '--fg-nord': '#e5e9f0',
        '--highlight': '#81a1c1'
    },
    Nord_alt:{
        '--p1-color': '#8fbcbb',
        '--p2-color': '#88c0d0',
        '--p3-color': '#81a1c1',
        '--p4-color': '#5e81ac',
        '--bg-nord': '#2e3440',
        '--fg-nord': '#e5e9f0',
        '--highlight': '#a3be8c'
    },
    Dracula:{
        '--p1-color': '#8be9fd',
        '--p2-color': '#50fa7b',
        '--p3-color': '#bd93f9',
        '--p4-color': '#f1fa8c',
        '--bg-nord': '#282a36',
        '--fg-nord': '#f8f8f2',
        '--highlight': '#ff79c6'
    },
    Gruvbox_light:{
        '--p1-color': '#cc241d',
        '--p2-color': '#98971a',
        '--p3-color': '#d79921',
        '--p4-color': '#458588',
        '--bg-nord': '#fbf1c7',
        '--fg-nord': '#3c3836',
        '--highlight': '#689d6a'
    },
    Gruvbox_dark:{
        '--p1-color': '#fb4934',
        '--p2-color': '#b8bb26',
        '--p3-color': '#fabd2f',
        '--p4-color': '#83a598',
        '--bg-nord': '#3c3836',
        '--fg-nord': '#fbf1c7',
        '--highlight': '#8ec07c'
    },
    High_contrast:{
        '--p1-color': '#ff0000',
        '--p2-color': '#00ff00',
        '--p3-color': '#0000ff',
        '--p4-color': '#ffff00',
        '--bg-nord': '#ffffff',
        '--fg-nord': '#000000',
        '--highlight': '#ff00ff'
    },
};
let display_money=false
var game_record=[NaN]; //Array for record of game, such that game_record[1] = Results of first game
var game = new Array; // Array for record of game, such that [30, 0, 0 , -30] = Player 4 loses 30 yaku to Player 1 at that game
var fulldata_JSON = new Array; // Array for undo and redo, saves most of the data
var game_log = new Array;
let msg = ''; //Message used for game log
let turn_display = '第1局‧東圈東';
let instant_obj = new Object(); // Object for instant pay or get_or_pay
let ron_obj = new Object(); // Object for ron
var undo_count = 0;
let mapped = new Object(); //Object for mapping players to different position
function create_player(name, position){ //Function for creating player, edit the variables for player here
    let player={
        balance: 0,//Current balance
        unrealized: 0,//Unrealized gains or loses(未結算)
        lossto1: 0,
        lossto2: 0,
        lossto3: 0,
        lossto4: 0,
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
    player.name = name;
    player.position = position;
    return player
}

function set_font(fontfamily){ //Function for changing font
    $('#global').css('font-family', fontfamily);
    $('.modal').css('font-family', fontfamily);
    default_setting.font = fontfamily;
}

function initiate(){ //Function for iniating new game
    //Get player names and create players
    let i=1//Used for empty names
    let position_obj = { //Used for creating new players
        name_east: "E",
        name_south: "S",
        name_west: "W",
        name_north: "N",
    }
    for (x in position_obj) {
        name = $('#' + x).val();//Get Value from each element
        if (name === ''){//Check for empty names
            name = '玩家' + i;
            i++;
        }
        allplayer.push(create_player(name, position_obj[x]));
    }
    for (x=1; x<5; x++){
        allplayer[x].balance = parseFloat(default_setting.base);
        allplayer[x].bal_arr.push(allplayer[x].balance);
        allplayer[x].unr_arr.push(allplayer[x].balance);
    }
    save_setting();
    save();
    initiate_ui();
}

function update_streak_ball_color(){ //change player ball colors when changing theme / seat
    if (allplayer.length > 2){ //Check for initiation, do nothing if not yet initialized
        for ( x = 1; x < 5; x++){
            let temp_color=getComputedStyle(document.documentElement).getPropertyValue('--p' + x + '-color'); //Get Color of each player
            document.documentElement.style.setProperty('--' + allplayer[x].position, temp_color); //Apply color to each position
        }
    }
}

function map_players(){
    for (x=1; x<5; x++){
        if (allplayer[x].position == 'E'){
            mapped.E = parseInt(x);
        }
        else if (allplayer[x].position == 'S'){
            mapped.S = parseInt(x);
        }
        else if (allplayer[x].position == 'W'){
            mapped.W = parseInt(x);
        }
        else if (allplayer[x].position == 'N'){
            mapped.N = parseInt(x);
        }
    }
}


function initiate_ui(){ //Function for initiating ui
    update_streak_ball_color();
    map_players();
    $('#initial').addClass('none');
    $('#initial').css('display', 'none');
    $('.p1name').html(allplayer[1].name);
    $('.p1box').html(allplayer[1].name);
    $('.p2name').html(allplayer[2].name);
    $('.p2box').html(allplayer[2].name);
    $('.p3name').html(allplayer[3].name);
    $('.p3box').html(allplayer[3].name);
    $('.p4name').html(allplayer[4].name);
    $('.p4box').html(allplayer[4].name);
    $('#turn').html(turn_display);
    $('#option .nav li:nth(0)').addClass('none');
    $('#option li:nth-child(2) a').tab('show');
    $('#global').css('font-family', default_setting.font);
    apply_theme(default_setting.theme);
    playergraph();
    update_main_table();
    update_stat_table();
    update_history_table();
}

function apply_theme(theme_name){
    let temp_theme = theme[theme_name];
    for ( properties in temp_theme ){
        document.documentElement.style.setProperty(properties, temp_theme[properties]);
    }
    update_streak_ball_color();
}

function toggle_money_display(){
    display_money=!display_money;
    if (display_money){
        $('.toggle_money_display').html('錢');
    } else {
        $('.toggle_money_display').html('番')
    }
    update_main_table();
}


function update_main_table(){
    if (gamestat.modified == true){
        $('#center i').removeClass('none');
    } else {
        $('#center i').addClass('none');
    }
    if (display_money){
        for (x = 1; x < 5; x++){ //Loop for all players, fill in name and balance into main table
            let display_string
            if (allplayer[x].unrealized > 0){
                display_string = allplayer[x].name + '<br>$' + Math.round(allplayer[x].balance*default_setting.money*100)/100 + '(+' + Math.round(allplayer[x].unrealized*default_setting.money*100)/100 + ')'
            } else if (allplayer[x].unrealized < 0){
                display_string = allplayer[x].name + '<br>$' + Math.round(allplayer[x].balance*default_setting.money*100)/100 + '(' + Math.round(allplayer[x].unrealized*default_setting.money*100)/100 + ')'
            } else {
                display_string = allplayer[x].name + '<br>$' + Math.round(allplayer[x].balance*default_setting.money*100)/100;
            }
            $('#' + allplayer[x].position + '-text').html(display_string);
        }
    }else{
        for (x = 1; x < 5; x++){ //Loop for all players, fill in name and balance into main table
            let display_string
            if (allplayer[x].unrealized > 0){
                display_string = allplayer[x].name + '<br>' + allplayer[x].balance + '(+' + allplayer[x].unrealized + ')'
            } else if (allplayer[x].unrealized < 0){
                display_string = allplayer[x].name + '<br>' + allplayer[x].balance + '(' + allplayer[x].unrealized + ')'
            } else {
                display_string = allplayer[x].name + '<br>' + allplayer[x].balance;
            }
            $('#' + allplayer[x].position + '-text').html(display_string);
        }
    }
    $('#east').css('background-color', 'var(--p' + mapped.E + '-color');
    $('#south').css('background-color', 'var(--p' + mapped.S + '-color');
    $('#west').css('background-color', 'var(--p' + mapped.W + '-color');
    $('#north').css('background-color', 'var(--p' + mapped.N + '-color');
    $('.streak').html('');
    if (gamestat.streak > 0){ // Fill in streak in the color box
        if(gamestat.banker == 'E'){
            $('#east .streak').html(gamestat.streak);
        }
        else if(gamestat.banker == 'S'){
            $('#south .streak').html(gamestat.streak);
        }
        else if(gamestat.banker == 'W'){
            $('#west .streak').html(gamestat.streak);
        }
        else if(gamestat.banker == 'N'){
            $('#north .streak').html(gamestat.streak);
        }
    }
    $('#turn').html(turn_display);
    if (undo_count == 0){ //Update whether undo or redo button is inactive
        $('#redo').addClass('inactive');
        $('#footer_context a:nth(1)').addClass('inactive');
    } else {
        $('#redo').removeClass('inactive');
        $('#footer_context a:nth(1)').removeClass('inactive');
    }
    if (eval(undo_count + 1) >= fulldata_JSON.length){
        $('#undo').addClass('inactive');
        $('#footer_context a:nth(0)').addClass('inactive');
    } else {
        $('#undo').removeClass('inactive');
        $('#footer_context a:nth(0)').removeClass('inactive');
    }
    $('#table .fa-exclamation-circle').addClass('none');
    $('#center .dots').remove(); // Clear all streak animations before creating new animations
    $('.break_prompt').remove(); //Remove messages from modal 'Breaking consecutive wins'
    for ( x = 1; x < 5; x++){//Loop for allplayer
        for ( y = 1; y < 5; y++){ //allplayer[1].sf2 = 3 => Player 1 loses to player 2 consecutively for 3 times
            if (allplayer[x]['sf' + y] !== 0 && allplayer[x]['sf' + y] % parseInt(default_setting.break) == 0){
                $('#break table').append('<tr class="break_prompt mt-2"><td>'+
                 allplayer[x].name + ' 已被 ' + allplayer[y].name + ' 拉了' + allplayer[x]['sf' + y] + '次<br>總番數為' +
                 allplayer[x]['lossto' + y] + '</td><td><a class="button" href="javascript:breakstreak(' + x + ',' + y + ');">中止</a></td></tr>');
                 //Create prompt for break modal
                if (allplayer[x].position == 'E'){
                    $('#east i').removeClass('none');
                }
                else if (allplayer[x].position == 'S'){
                    $('#south i').removeClass('none');
                }
                else if (allplayer[x].position == 'W'){
                    $('#west i').removeClass('none');
                }
                else if (allplayer[x].position == 'N'){
                    $('#north i').removeClass('none');
                }
            }
            if (allplayer[x]['sf' + y] > 0){
                for ( z = 0; z < allplayer[x]['sf' + y]; z++){ //Create streak balls
                    $('#center').append('<div class="dots ' + allplayer[x].position + allplayer[y].position + ' delay_' + z + '"></div>');
                }
            }
        }
    }
}

function update_history_table(){ //Update the display of record table
    $('.record_items').remove();
    for (x = 1 ; x < game_record.length ; x++){
        if (game_record[x].length == 1){
            $('#record_add').after('<tr class="record_items"><td>' + x + '</td><td colspan="4">流局</td>');
        } else {
            $('#record_add').after('<tr class="record_items"><td>' + x + '</td><td>' + game_record[x][1] + '</td><td>' + game_record[x][2] + '</td><td>' + game_record[x][3] + '</td><td>' + game_record[x][4] + '</td></tr>');
        }
    }
}

function adjust_main_display_size(){ //Control size of table according to window size
    var height=$(document).height();
    var width=$(document).width();
    if (height < width){ //When landscape
        $('#main_left').removeClass('none');
        $('#main_right').removeClass('none');
        $('#footer_context').addClass('none');
        if ( height * 0.7 <= width * 0.48 ){
            $('#table').css('height', '70vh');
            $('#table').css('width', '70vh');
        }
        else {
            $('#table').css('height', '48vw');
            $('#table').css('width', '48vw');
        }
    } else { //When protrait
        protraitdefault();
        $('#table').css('height', '75vw');
        $('#table').css('width', '75vw');
    }
}

function inputcontrol(){ //only allow positive integers for input positiveintonly
    $('.positiveintonly').keydown(function(event){
        if (event.shiftKey == true) {
            event.preventDefault();
        }
        if ((event.keyCode >= 48 && event.keyCode <= 57) || (event.keyCode >= 96 && event.keyCode <= 105) || event.keyCode == 8 || event.keyCode == 9 || event.keyCode == 37 || event.keyCode == 39 || event.keyCode == 46 || event.keyCode == 35 || event.keyCode == 36) {
        } else {
            event.preventDefault();
        };
    });
    $('.numonly').keydown(function(event){
        if (event.shiftKey == true) {
            event.preventDefault();
        }
        if (event.keyCode == 110 || event.keyCode == 190 || (event.keyCode >= 48 && event.keyCode <= 57) || (event.keyCode >= 96 && event.keyCode <= 105) || event.keyCode == 8 || event.keyCode == 9 || event.keyCode == 37 || event.keyCode == 39 || event.keyCode == 46 || event.keyCode == 35 || event.keyCode == 36) {
        } else {
            event.preventDefault();
        };
    });
    $('.intonly').keydown(function(event){
        if (event.shiftKey == true) {
            event.preventDefault();
        }
        if (event.keyCode == 173 || event.keyCode == 109 || (event.keyCode >= 48 && event.keyCode <= 57) || (event.keyCode >= 96 && event.keyCode <= 105) || event.keyCode == 8 || event.keyCode == 9 || event.keyCode == 37 || event.keyCode == 39 || event.keyCode == 46 || event.keyCode == 35 || event.keyCode == 36) {
        } else {
            event.preventDefault();
        };
    });
    $('#ron input').keydown(function(event){ //Control tab and shift+tab on ron modal
        if (event.keyCode == 9 && event.shiftKey == false){
            let x = parseInt(this.classList[1].slice(1,2));
            x += 1;
            if ($('.p' + x + 'form').is(':disabled')) x+=1;
            event.preventDefault();
            $('.p' + x + 'form').focus();
        }
        else if (event.keyCode == 9 && event.shiftKey == true){
            let x = parseInt(this.classList[1].slice(1,2));
            x -= 1;
            if ($('.p' + x + 'form').is(':disabled')) x-=1;
            event.preventDefault();
            $('.p' + x + 'form').focus();
        }
    });
    $('#deal input').keydown(function(event){ //Submit deal on enter
        if (event.keyCode == 13){
            deal();
        };
    });
    $('#tsumo input').keydown(function(event){//Submit tsumo on enter
        if (event.keyCode == 13){
            tsumo();
        };
    });
    $('#change_name input').keydown(function(event){
        if (event.keyCode == 13){
            change_name();
            event.preventDefault();
        }
    });
}

function resetinput_instant(){
    $('.player_select a').removeClass('active');
    $('#instant .select_pan a').removeClass('active');
    $('.others').val('');
    $('#instant .center_button_container').addClass('none');
}

function resetinput_ron(){
    ron_obj.value = null;
    ron_obj.selected = null;
    $('.player_select a').removeClass('active')
    $('#ron input').val('');
    $('#ron input').addClass('none');
    $('#ron .center_button_container').addClass('none');
}

function validate_instant(get_or_pay){
    instant_obj.selected = null;
    instant_obj.value = null;
    for (x=1; x < 5; x++){
        if($('#instant .p' + x + 'box').hasClass('active')){
            instant_obj.selected = x;
            break;
        }
    }
    if (get_or_pay == 'get' && $('#instant' + get_or_pay + ' .select_pan:nth-child(2) a:nth-child(1)').hasClass('active')){
        instant_obj.value = 3;
    }
    else if (get_or_pay == 'get' && $('#instant' + get_or_pay + ' .select_pan:nth-child(2) a:nth-child(2)').hasClass('active')){
        instant_obj.value = 5;
    }
    else if (get_or_pay == 'get' && $('#instant' + get_or_pay + ' .select_pan:nth-child(2) a:nth-child(3)').hasClass('active')){
        instant_obj.value = 8;
    }
    else if (get_or_pay == 'get' && $('#instant' + get_or_pay + ' .select_pan:nth-child(2) a:nth-child(4)').hasClass('active') && $('#instantget_others').val() != ''){
        instant_obj.value = $('#instantget_others').val();
    }
    else if (get_or_pay == 'pay' && $('#instant' + get_or_pay + ' .select_pan:nth-child(2) a:nth-child(1)').hasClass('active')){
        instant_obj.value = 5;
    }
    else if (get_or_pay == 'pay' && $('#instant' + get_or_pay + ' .select_pan:nth-child(2) a:nth-child(2)').hasClass('active')){
        instant_obj.value = 10;
    }
    else if (get_or_pay == 'pay' && $('#instant' + get_or_pay + ' .select_pan:nth-child(2) a:nth-child(3)').hasClass('active') && $('#instantpay_others').val() != ''){
        instant_obj.value = $('#instantpay_others').val();
    }
    instant_obj.value = parseInt(instant_obj.value);
    if (instant_obj.selected != null){
        if (instant_obj.value > 0){
            return 0;
        }
        else{
            show_alert('輸入數值無效')
        }
    }
    else{
        show_alert('請先選擇玩家，然後選擇番數')
    } //visual warning for invalid player input
}

function instant(get_or_pay){
    if (validate_instant(get_or_pay) == 0){
        if(get_or_pay == 'get'){
            for ( x = 1; x < 5; x++ ){ //Loop for all players
                if ( x == instant_obj.selected ){ //Add balance and stat for selected player
                    allplayer[x].balance += parseInt(instant_obj.value) * 3;
                    allplayer[x].instantget += parseInt(instant_obj.value) * 3;
                }
                else { //Reduce balance for unselected player
                    allplayer[x].balance -= parseInt(instant_obj.value);
                }
            }
            //Add game statistics and log afterwards
            gamestat.instantget += parseInt(instant_obj.value) * 3;
            gamestat.total_change += parseInt(instant_obj.value) * 3;
            msg = allplayer[instant_obj.selected].name + ' 即收了其他玩家 ' + instant_obj.value + ' 番';
        }
        else if(get_or_pay == 'pay'){
            for ( x = 1; x < 5; x++ ){
                if ( x == instant_obj.selected ){
                    allplayer[x].balance -= parseInt(instant_obj.value) * 3;
                    allplayer[x].instantpay += parseInt(instant_obj.value) * 3;
                }
                else {
                    allplayer[x].balance += parseInt(instant_obj.value);
                }
            }
            gamestat.instantpay += parseInt(instant_obj.value) * 3;
            gamestat.total_change += parseInt(instant_obj.value) * 3;
            msg = allplayer[instant_obj.selected].name + ' 即付了其他玩家 ' + instant_obj.value + ' 番';
        }
        addlog(msg);
        resetinput_instant();
        push_balance_array();
        check_undo();
        update_main_table();
        update_stat_table();
        playergraph();
        $('#instant').modal('toggle');
    }
}

function deal(){
    msg = '第' + gamestat.round + '場：<br>';
    if ( ron_obj.value == 0 | ron_obj.value == '' | typeof(ron_obj.value) == 'undefined'){ //Check for empty or invalid input for ron_obj
        show_alert('輪入數值無效')//Warning for empty input
    } else {
        game = [NaN];
        gamestat.total_change -= parseInt(ron_obj.value);
        let ex_draw = parseInt(gamestat.tsumo) + parseInt(gamestat.deal); //For calculating average yakus for game stats
        gamestat.avg_yaku = Math.round((ex_draw * parseFloat(gamestat.avg_yaku) - parseInt(ron_obj.value)) * 100 / (ex_draw + 1)) / 100; //Calculate average yakus and round to 2 decimal places
        for ( x = 1 ; x < 5 ; x++){ // Loop for all input field then push to an array to represent game summary
            let win_value = $('#deal .p' + x + 'form').val();
            if ( win_value !== '' && win_value > 0 ){ //For winning player: Set status, add statistics, add log
                allplayer[x].status = 'win';
                allplayer[x].win = parseInt(allplayer[x].win) + 1;
                allplayer[x].deal_win = parseInt(allplayer[x].deal_win) + 1;
                msg = msg + allplayer[ron_obj.selected].name + ' 出銃了 ' + win_value + '番給 ' + allplayer[x].name + '<br>';
                game.push(parseInt(win_value));
                if (win_value > gamestat.max_yaku){ //Check for any update for game statistics for maximum win yaku
                    gamestat.max_yaku = win_value;
                }
                if (win_value > allplayer[x].max_yaku){ //Check for any update for player statistics for maximum win yaku
                    allplayer[x].max_yaku = win_value;
                }
            } else if ( win_value == '' ||  win_value == 0) {//For neutral player set status and add statistics
                allplayer[x].status = 'neutral';
                game.push(0);
            } else if ( win_value < 0) {
                allplayer[x].status = 'lose';
                allplayer[x].lose = parseInt(allplayer[x].lose) + 1;
                allplayer[x].deal_lose = parseInt(allplayer[x].deal_lose) + 1;
                game.push(parseInt(win_value));
            }
        }
        game_record.push(game);
        gamestat.deal = parseInt(gamestat.deal) + 1;
        settle('deal');
        addlog(msg);
        check_undo();
        update_main_table();
        update_history_table();
        update_stat_table();
        playergraph();
        resetinput_ron();
        $('#ron').modal('toggle');
    }
}

function tsumo(){
    msg = '第' + gamestat.round + '場：<br>';
    if ( ron_obj.value == 0 | typeof(ron_obj.value) == 'undefined'){
        show_alert('請先選擇自摸玩家，然後輸入番數')
        //Add warning for empty input
    } else {
        game = [NaN];
        for (x = 1; x < 5; x++){
            let value = $('#tsumo .p' + x + 'form').val();
            if (value == '' || value == 0){
                show_alert('玩家自摸時，需輸入所有其他的番數')
                // Add exception if no value input for tsumo
                game = [NaN];
                return;
            }
        }
        gamestat.total_change += parseInt(ron_obj.value);
        let ex_draw = parseInt(gamestat.tsumo) + parseInt(gamestat.deal);
        gamestat.avg_yaku = Math.round((ex_draw * parseFloat(gamestat.avg_yaku) + Math.floor(parseInt(ron_obj.value)/3)) * 100 / (ex_draw + 1)) / 100;
        if (Math.floor(ron_obj.value / 3) > gamestat.max_yaku){
            gamestat.max_yaku = Math.floor(ron_obj.value / 3);
        }
        for ( x = 1 ; x < 5 ; x++){ // Loop for all input field then push to an array to represent game summary
            let win_value = $('#tsumo .p' + x + 'form').val();
            if ( ron_obj.selected == x ){
                allplayer[x].status = 'win';
                allplayer[x].win = parseInt(allplayer[x].win) + 1;
                allplayer[x].tsumo = parseInt(allplayer[x].tsumo) + 1;
                if (Math.floor(ron_obj.value / 3) > allplayer[x].max_yaku){
                    allplayer[x].max_yaku = Math.floor(ron_obj.value / 3);
                }
                game.push(parseInt(win_value));
                }
            else if ( ron_obj.selected !== x ) {
                allplayer[x].status = 'lose';
                allplayer[x].lose = parseInt(allplayer[x].lose) + 1;
                game.push(eval(0 - parseInt(win_value)));
                }
            }
        msg = msg + allplayer[ron_obj.selected].name + ' 自摸了' + Math.floor(ron_obj.value / 3) + '番[平均]<br>';
        game_record.push(game);
        gamestat.tsumo = parseInt(gamestat.tsumo) + 1;
        settle('tsumo');
        addlog(msg);
        check_undo();
        update_main_table();
        update_history_table();
        update_stat_table();
        playergraph();
        resetinput_ron();
        $('#ron').modal('toggle');
    }
}

function draw(){
    if($('#holdplus').hasClass('active')){
        default_setting.draw_action = 'hold+';
        gamestat.streak = parseInt(gamestat.streak) + 1;
        if (gamestat.streak > gamestat.max_streak){
                gamestat.max_streak = gamestat.streak;
        }
        for (x=1; x<5; x++){
            if(allplayer[x].position == gamestat.banker){
                if (allplayer[x].max_winning_streak < gamestat.streak){
                    allplayer[x].max_winning_streak = gamestat.streak;
                }
                break;
            }
        }
        post_draw();
    } else if($('#hold').hasClass('active')){
        default_setting.draw_action = 'hold';
        post_draw();
    } else if($('#pass').hasClass('active')){
        default_setting.draw_action = 'pass';
        gamestat.streak = 0;
        if (gamestat.banker == 'E'){
            gamestat.banker = 'S';
        }else if (gamestat.banker == 'S'){
            gamestat.banker = 'W';
        }else if (gamestat.banker == 'W'){
            gamestat.banker = 'N';
        }else if (gamestat.banker == 'N'){
            gamestat.banker = 'E';
            gamestat.round_prevailing = parseInt(gamestat.round_prevailing) + 1;
        }
        post_draw();
    } else {
        show_alert('請輸入流局處理方式。')
    }
}

function post_draw(){
    save_setting();
    msg = '第' + gamestat.round + '場：<br>流局';
    addlog(msg);
    gamestat.round = parseInt(gamestat.round) + 1;
    gamestat.tie = parseInt(gamestat.tie) + 1;
    game_record.push(['流局']);
    generate_turn_display();
    check_undo();
    update_main_table();
    update_history_table();
    update_stat_table();
    playergraph();
    $('#ron').modal('toggle');
}

function settle(deal_or_tsumo){
    for ( x = 1; x < 5 ; x++){ //loop for all player and search for status of current match
        if ( allplayer[x].status == 'lose' ){ //Select the losing player x
            for ( y = 1; y < 5; y++){ //Select player y
                if( allplayer[y].status == 'win'){ //If player y wins,add value to 'streak from' and 'loss to' on player x
                    if ( parseInt(allplayer[x]['sf' + y]) > 0){ //Calculate the amount of losing value if the player is already losing
                        allplayer[x]['sf' + y] += 1;
                        if (deal_or_tsumo == 'tsumo'){
                            allplayer[x]['lossto' + y] = Math.ceil(parseInt(allplayer[x]['lossto' + y]) * parseFloat(default_setting.fold)) - parseInt(game[x]); // Pick the value from losing player of last match if the match ends with tsumo
                        } else if (deal_or_tsumo == 'deal'){
                            allplayer[x]['lossto' + y] = Math.ceil(parseInt(allplayer[x]['lossto' + y]) * parseFloat(default_setting.fold)) + parseInt(game[y]);// Pick the value from winning player of last match if the match ends with deal
                        }
                    }
                    else { //Simply set the value if not on streak
                        allplayer[x]['sf' + y] += 1;
                        if (deal_or_tsumo == 'tsumo'){
                            allplayer[x]['lossto' + y] -= parseInt(game[x]);
                        } else if (deal_or_tsumo == 'deal'){
                            allplayer[x]['lossto' + y] += parseInt(game[y]);
                        }
                    }
                } else if ( allplayer[y].status == 'neutral' || allplayer[y].status == 'lose' ){
                    if ( parseInt(allplayer[x]['lossto' + y]) > 0){ //Settle the value from the game before if player y is not winning again
                        allplayer[x].balance -= parseInt(allplayer[x]['lossto' + y]);
                        allplayer[y].balance += parseInt(allplayer[x]['lossto' + y]);
                        msg = msg + allplayer[x].name + ' 付了 ' + allplayer[x]['lossto' + y] + '番給 ' + allplayer[y].name + '<br>';
                        allplayer[x]['sf' + y] = 0;
                        allplayer[x]['lossto' + y] =0;
                    }
                }
            }
        } else if ( allplayer[x].status == 'neutral'){//Select neutral player x
            for ( y = 1; y < 5; y++){
                if (parseInt(allplayer[x]['sf' + y]) > 0 && allplayer[y].status !== 'win'){ //Settle value if player y is not winning again
                    allplayer[x].balance -= parseInt(allplayer[x]['lossto' + y]);
                    allplayer[y].balance += parseInt(allplayer[x]['lossto' + y]);
                    msg = msg + allplayer[x].name + ' 付了 ' + allplayer[x]['lossto' + y] + '番給 ' + allplayer[y].name + '<br>';
                    allplayer[x]['sf' + y] = 0;
                    allplayer[x]['lossto' + y] =0;
                }
            }
        } else if ( allplayer[x].status == 'win'){
            for ( y = 1; y < 5; y++){
                if (parseInt(allplayer[x]['sf' + y]) > 0 && allplayer[y].status == 'lose'){
                    allplayer[x].balance -= Math.floor(parseInt(allplayer[x]['lossto' + y]) / 2);
                    allplayer[y].balance += Math.floor(parseInt(allplayer[x]['lossto' + y]) / 2);
                    msg = msg + allplayer[x].name + ' 付了 ' + Math.floor(parseInt(allplayer[x]['lossto' + y]) / 2) + '番給 ' + allplayer[y].name + ' [踢半]<br>';
                    allplayer[x]['sf' + y] = 0;
                    allplayer[x]['lossto' + y] =0;
                } else if (parseInt(allplayer[x]['sf' + y]) > 0 && allplayer[y].status == 'neutral'){
                    allplayer[x].balance -= parseInt(allplayer[x]['lossto' + y]);
                    allplayer[y].balance += parseInt(allplayer[x]['lossto' + y]);
                    msg = msg + allplayer[x].name + ' 付了 ' + allplayer[x]['lossto' + y] + '番給 ' + allplayer[y].name + '<br>';
                    allplayer[x]['sf' + y] = 0;
                    allplayer[x]['lossto' + y] =0;
                }
            }
        }
    }
    update_player_unrealized();
    gamestat.round = parseInt(gamestat.round) + 1;
    for (x = 1; x < 5; x++){ // Loop for pass banker
        if(gamestat.banker == allplayer[x].position && allplayer[x].status == 'win'){
            gamestat.streak = parseInt(gamestat.streak) + 1;
            if (allplayer[x].max_winning_streak <= gamestat.streak){
                allplayer[x].max_winning_streak = gamestat.streak;
            }
            if (gamestat.streak > gamestat.max_streak){
                gamestat.max_streak = gamestat.streak;
            }
        } else if(gamestat.banker == allplayer[x].position && allplayer[x].status !== 'win' ){
            gamestat.streak = 0;
            if(gamestat.banker == 'E'){
                gamestat.banker = 'S';
                break;
            }
            else if(gamestat.banker == 'S'){
                gamestat.banker = 'W';
                break;
            }
            else if(gamestat.banker == 'W'){
                gamestat.banker = 'N';
                break;
            }
            else if(gamestat.banker == 'N'){
                gamestat.banker = 'E';
                gamestat.round_prevailing = parseInt(gamestat.round_prevailing) + 1;
                break;
            }
        }
    }
    generate_turn_display();
}

function iset(fm, to){ //Function for handling instant settle
    msg = '即時結算：<br>';
    $('#settle').modal('toggle');
    if(fm == 'all'){
        for(x=1; x<5; x++){
            for(y=1; y<5; y++){
                if (allplayer[x]['sf' + y] > 0){
                    msg = msg + allplayer[x].name + ' 付了 ' + allplayer[x]['lossto' + y] + '番給 ' + allplayer[y].name + '<br>';
                    allplayer[x]['sf' + y] = 0;
                    allplayer[y].balance += parseInt(allplayer[x]['lossto' + y]);
                    allplayer[x].balance -= parseInt(allplayer[x]['lossto' + y]);
                    allplayer[x]['lossto' + y] = 0;
                }
            }
        }
    } else {
        msg = msg + allplayer[fm].name + ' 付了 ' + allplayer[fm]['lossto' + to] + '番給 ' + allplayer[to].name + '<br>';
        allplayer[fm]['sf' + to] = 0;
        allplayer[to].balance += parseInt(allplayer[fm]['lossto' + to]);
        allplayer[fm].balance -= parseInt(allplayer[fm]['lossto' + to]);
        allplayer[fm]['lossto' + to] = 0;
    }
    update_player_unrealized();
    check_undo();
    update_main_table();
    playergraph();
    addlog(msg);
}

function adjust(){
    let action = 0;
    let msg = '手動番數調整：<br>'
    for(x=1; x<5; x++){
        let adj_value = $('#adjust tr:nth(' + x + ') input').val();
        if (adj_value == 0 || adj_value == ''){
        } else {
            if($('#adjust tr:nth(' + x + ') .select_pan a:nth(0)').hasClass('active')){
                allplayer[x].balance += parseInt(adj_value);
                action += 1;
                msg = msg + allplayer[x].name + ' 增加了 ' + adj_value +'番<br>'
            }
            else if ($('#adjust tr:nth(' + x + ') .select_pan a:nth(1)').hasClass('active')){
                allplayer[x].balance -= parseInt(adj_value);
                action += 1;
                msg = msg + allplayer[x].name + ' 減少了 ' + adj_value +'番<br>'
            }
            else if ($('#adjust tr:nth(' + x + ') .select_pan a:nth(2)').hasClass('active')){
                allplayer[x].balance = parseInt(adj_value);
                action += 1;
                msg = msg + allplayer[x].name + ' 的番數設定為 ' + adj_value +'番<br>'
            } else {
                show_alert(allplayer[x].name + ' 的數值因未選擇調整操作項而未被處理')
                return;
            }
        }
    }
    if (action !== 0){
        gamestat.modified = true;
        addlog(msg);
        check_undo();
    }
    update_main_table();
    playergraph();
    $('#settle').modal('toggle');
    resetinput_settle();
}

function resetinput_settle(){
    $('#adjust input').val('');
    $('#adjust .select').removeClass('active');
}

function generate_turn_display(){
    let turn = 1;
        if (parseInt(gamestat.round_prevailing) > 4){
            turn = Math.ceil(parseInt(gamestat.round_prevailing) / 4);
        }
    let round = parseInt(gamestat.round_prevailing);
        if ( round > 4 ){
            round -= (turn - 1) * 4;
        }
    let pw_tc = '';
    let banker_tc = '';
    $('#table div').removeClass('banker');
    if ( round == 1 ) { pw_tc = '東' };
    if ( round == 2 ) { pw_tc = '南' };
    if ( round == 3 ) { pw_tc = '西' };
    if ( round == 4 ) { pw_tc = '北' };
    if( gamestat.banker == 'E' ){
        banker_tc = '東';
        $('#east').addClass('banker');
    }
    if( gamestat.banker == 'S' ){
        banker_tc = '南';
        $('#south').addClass('banker');
    }
    if( gamestat.banker == 'W' ){
         banker_tc = '西';
        $('#west').addClass('banker');
    }
    if( gamestat.banker == 'N' ) {
        banker_tc = '北'
        $('#north').addClass('banker');
    }
    turn_display = '第' + turn + '局‧' + pw_tc + '圈' + banker_tc;
}

function timestamp(){
    var currentdate = new Date();
    if (currentdate.getHours() < 10){
        var hour = '0' + currentdate.getHours();
    } else {
        var hour = currentdate.getHours();
    }
    if (currentdate.getMinutes() < 10){
        var minute = '0' + currentdate.getMinutes();
    } else {
        var minute = currentdate.getMinutes();
    }
    var timestamp = hour + ':' + minute;
    return timestamp;
}

function uicontrol(){
    $('.select_pan a').click(function(){ //Click control for all selection panels
        $(this).parents('.select_pan').find('a').removeClass('active');
        $(this).addClass('active');
    });
    $('#instantget .select_pan:nth-child(2) a:nth-child(4)').click(function(){ //Focus on input field upon clicking others on instantget modal
        $('#instantget_others').focus();
    });
    $('#instantpay .select_pan:nth-child(2) a:nth-child(3)').click(function(){ //Focus on input field upon clicking others on instantpay modal
        $('#instantpay_others').focus();
    });
    $('#instant .nav-link').click(function(){ //Clear instant modal input on tab change
        resetinput_instant();
    });
    $('#instant').on('hidden.bs.modal', function(){ //Clear instant modal input on modal close
        resetinput_instant();
    });
    $('#ron .nav-link').click(function(){
        $('#ron span').remove();//Clear ron modal input on tab change
        resetinput_ron();
    });
    $('#ron .nav-link:nth(2)').click(function(){ //Display confirm button on selecting draw in ron modal
        $('#ron .center_button_container').removeClass('none');
    })
    $('#ron').on('hidden.bs.modal', function(){
        $('#ron span').remove();//Clear ron modal input on modal close
        resetinput_ron();
    });
    $('#ron .player_select a').click(function(){ //Show confirm button on selecting player
        $('#ron .center_button_container').removeClass('none');
    });
    $('#instant .player_select a').click(function(){ //Show confirm button on selecting player
        $('#instant .center_button_container').removeClass('none');
    });
    $('#ron .player_select a').click(function(){ //Show input field for ron modal
        $('#ron .signs').remove();
        $('.player_select input').removeClass('none');
        $('.player_select input').val('');
        $('.player_select a').removeClass('active');
        $(this).addClass('active');
        for (x=1; x<5; x++){
            if($(this).hasClass('p' + x + 'box')){
                ron_obj.selected = x;
                $('#ron input').prop('disabled', false);
                $('#ron input').attr('type', 'number');
                $('.p' + x + 'form' ).removeAttr('type');
                $('.p' + x + 'form').prop('disabled', true);
        } else {
                $('#deal .p' + x + 'form').before('<span class="signs">+</span>');
                $('#tsumo .p' + x + 'form').before('<span class="signs">-</span>');
            }
        }
        if(ron_obj.selected == 1){
            $('input.p2form').focus();
        } else {
            $('input.p1form').focus();
        }
    });
    $('#ron input').keyup(function(){ // Calculate input value for deal and tsumo modal
        ron_obj.value = 0;
        let deal_total = 0;
        let tsumo_total = 0;
        for (x=1; x<5; x++){
            if (x !== ron_obj.selected){
                if($('#deal .p' + x + 'form').val() == ''){
                } else {
                    deal_total += parseInt($('#deal .p' + x + 'form').val());
                }
                if($('#tsumo .p' + x + 'form').val() == ''){
                } else {
                    tsumo_total += parseInt($('#tsumo .p' + x + 'form').val());
                }
            }
        };
        deal_total = eval(0 - deal_total);
        $('#deal .p' + ron_obj.selected + 'form').val(deal_total);
        $('#tsumo .p' + ron_obj.selected + 'form').val('+' + tsumo_total);
        ron_obj.value = eval(deal_total + tsumo_total);
    });
    $('#log').on('shown.bs.modal', function(){
        update_log_table();
    });
    $('#option').on('shown.bs.modal', function(){ //Fill in default settings into option modal
        $('#option_base').val(default_setting.base);
        $('#option_money').val(default_setting.money);
        $('#option_fold').val(default_setting.fold);
        $('#option_break').val(default_setting.break);
        $('#theme_select').val(default_setting.theme);
        $('#export').val(fulldata_JSON[undo_count]);
        let download_data = "data:text/json;charset=utf-8," + fulldata_JSON[undo_count];
        $('#download').attr('href', download_data);
        $('#download').attr('download', 'TWMJ_Data.json');
    });
    $('#theme_select').change(function(){
        apply_theme($('#theme_select').val());
        default_setting.theme = $('#theme_select').val();
        save_setting();
    });
    $('#option').on('hide.bs.modal', function(){
        $('#export').val('');
        $('#import').val('');
        $('#import_error_msg').html('');
    });
    $('#clipboard').click(function(){
        navigator.clipboard.writeText($('#export').val());
        $('#clipboard').html('<i class="fas fa-clipboard-check"></i>已複制');
        setTimeout(function(){$('#clipboard').html('複制到剪貼簿')}, 3000);
    });
    $('#import_button').click(function(){
        import_json();
    });
    $('#confirm_import a:nth(1)').click(function(){
        $('#confirm_import').modal('hide');
    });
    $('#settle').on('shown.bs.modal', function(){ //Show settle modal text upon popup
        $('.iset').remove();
        for (x=1; x<5; x++){ //Loop for unrealized balance and inject table into modal
            for (y=1; y<5; y++){
                if(allplayer[x]['sf' + y] > 0){
                    $('#instant_settle table').append('<tr class="iset"><td>' + allplayer[x].name + '<i class="ml-2 mr-2 fas fa-arrow-right"></i>' + allplayer[y].name + '<i class="ml-2 fas fa-hand-holding-usd"></i>' + allplayer[x]['lossto' + y] + '番' + '<i class="ml-2 fas fa-people-arrows"></i>' + '拉' + allplayer[x]['sf' + y] + '次' + '</td><td><a class="button" href="javascript:iset(' + x + ', ' + y + ');">結算此項</a></td></tr>');
                }
            }
        }
        if ($('#instant_settle td').length == 0){ //Display text if there is anything unsettled
            $('#instant_settle table').after('<div class="iset" style="font-size: 2.5vh">暫未有拉踢可結算</div>');
            $('#instant_settle .center_button_container').addClass('none');
        } else {
            $('#instant_settle .center_button_container').removeClass('none');
        }
        for (x = 1; x < 5; x++){
            $('#adjust tr:nth(' + x + ') td:nth(1)').html(allplayer[x].balance); //Display score on adjust tab
            $('#change_name .p' + x + '_input').val(allplayer[x].name); //Input player name in change name tab
        }
    });

    $('#north,#east,#south,#west').click(function(event){ //Show quick function menu on clicking blocks
        let cursor_x = event.pageX;
        let cursor_y = event.pageY;
        let context_name = null;
        let context_no = 0;
        $('#context').removeClass('none');
        $('#context').css('top', cursor_y + 'px');
        $('#context').css('left', cursor_x + 'px');
        if(event.target.id == 'east'){
            context_name=allplayer[mapped.E].name;
            context_no=mapped.E;
        }
        else if(event.target.id == 'south'){
            context_name=allplayer[mapped.S].name;
            context_no=mapped.S;
        }
        else if(event.target.id == 'west'){
            context_name=allplayer[mapped.W].name;
            context_no=mapped.W;
        }
        else if(event.target.id == 'north'){
            context_name=allplayer[mapped.N].name;
            context_no=mapped.N;
        };
        $('#context_name div').html(context_name);
        $('#context_name').css('background-color', 'var(--p' + context_no + '-color)');
        $('#context_instantget').attr('href', 'javascript:context("get",' + context_no + ");");
        $('#context_instantpay').attr('href', 'javascript:context("pay",' + context_no + ");");
        $('#context_deal').attr('href', 'javascript:context("deal",' + context_no + ");");
        $('#context_tsumo').attr('href', 'javascript:context("tsumo",' + context_no + ");");
    });
    $('#settle').on('hide.bs.modal', function(){ // Reset instant settle and change seat upon modal close
        resetinput_settle();
        resetinput_change_seat();
    });
    $(document).click(function(event){ //Hide quick function menu when clicking outside blocks
        if (event.target.parentElement === null){
            return;
        }
        if (event.target.parentElement.id == 'context' | event.target.id == 'east' | event.target.id == 'south' | event.target.id == 'west' |event.target.id == 'north'){
        } else {
            $('#context').addClass('none');
        }
    });
    $('#change_seat_pan a:nth(0)').click(function(event){ //Reset custom seat selection upon clicking quick seat change_seat
        $('#change_seat .center_button_container').removeClass('none');
        $('#change_seat .player_select a').removeClass('none active');
        $('#pane1,#pane2,#pane3,#pane4').addClass('none');
    });
    $('#change_seat_pan a:nth(1)').click(function(){
        $('#change_seat .center_button_container').addClass('none');
        $('#pane1').removeClass('none');
    });
    $('#change_seat .player_select a').click(function(){
        let pane_no = 0;
        for (x = 1; x < 5; x++){
            if($(this).parent().is('#pane' + x)){
                pane_no = x;
            }
        }
        panel_control(pane_no);
    });
    $('#end a:nth(1)').click(function(){ //Hide end modal when clicking cancel
        $('#end').modal('hide');
    });
    $('.footer_select:nth(0)').click(function(){
        protraitdefault();
    })
    $('.footer_select:nth(1)').click(function(){
        $('#main_left').addClass('none');
        $('#main_right').removeClass('none');
        $('#footer_context').addClass('none');
        $('#footer_menu div').removeClass('highlight');
        $('.footer_select:nth(1)').addClass('highlight');
    })
    $('.footer_select:nth(2)').click(function(){
        $('#main_left').addClass('none');
        $('#main_right').addClass('none');
        $('#footer_context').removeClass('none');
        $('#footer_menu div').removeClass('highlight');
        $('.footer_select:nth(2)').addClass('highlight');
    })
    $('#footer_context a:nth(0)').click(function(){
    if(!$('#footer_context a:nth(0)').hasClass('inactive')){
        protraitdefault();
    }
        undo();
    });
    $('#footer_context a:nth(1)').click(function(){
    if(!$('#footer_context a:nth(1)').hasClass('inactive')){
        protraitdefault();
    }
        redo();
    });
}

function display_pause_screen(option){
    if (option){
        $('#main').addClass('none');
        $('#pause_screen').removeClass('none');
        $('#normal_footer').addClass('none');
        $('#pause_footer').removeClass('none');
        // Fill ranking of pause Screen
        let ranking = new Array;
        for (x=1; x<5; x++){
            let player_obj = new Object
            player_obj.index = x;
            player_obj.name = allplayer[x].name;
            player_obj.deal_lose = allplayer[x].deal_lose;
            player_obj.tsumo = allplayer[x].tsumo;
            player_obj.instantpay = allplayer[x].instantpay;
            player_obj.instantget = allplayer[x].instantget;
            player_obj.max_yaku = allplayer[x].max_yaku;
            player_obj.streak = allplayer[x].max_winning_streak;
            player_obj.yaku = parseInt(allplayer[x].balance) + parseInt(allplayer[x].unrealized);
            ranking.push(player_obj);
        }
        ranking.sort((b,a)=>a.yaku - b.yaku);
        for (x=0; x<4; x++){
            $('#ranking tr:nth(' + x + ') td:nth(1)').html(ranking[x].name);
            $('#ranking tr:nth(' + x + ') td:nth(1)').css('border-left', '1vh solid var(--p' + ranking[x].index + '-color');
            $('#ranking tr:nth(' + x + ') td:nth(2)').html(ranking[x].yaku);
        }
        ranking.sort((b,a)=>a.max_yaku-b.max_yaku);
        console.log(ranking)
        $('.milestone:nth(0)').css('color', 'var(--p' + ranking[0].index + '-color');
        $('.milestone:nth(0) span').html(ranking[0].name);
        ranking.sort((b,a)=>a.tsumo-b.max_tsumo); //Need other methods to get values!!
        console.log(ranking)
        $('.milestone:nth(1)').css('color', 'var(--p' + ranking[0].index + '-color');
        $('.milestone:nth(1) span').html(ranking[0].name);
        ranking.sort((a,b)=>a.deal_lose-b.max_deal_lose);
        console.log("max_lose" + ranking)
        $('.milestone:nth(2)').css('color', 'var(--p' + ranking[0].index + '-color');
        $('.milestone:nth(2) span').html(ranking[0].name);
        ranking.sort((b,a)=>a.instantget-b.max_instantget);
        $('.milestone:nth(3)').css('color', 'var(--p' + ranking[0].index + '-color');
        $('.milestone:nth(3) span').html(ranking[0].name);
        ranking.sort((b,a)=>a.streak-b.streak);
        $('.milestone:nth(4)').css('color', 'var(--p' + ranking[0].index + '-color');
        $('.milestone:nth(4) span').html(ranking[0].name);
        ranking.sort((b,a)=>a.instantpay-b.instantpay);
        $('.milestone:nth(5)').css('color', 'var(--p' + ranking[0].index + '-color');
        $('.milestone:nth(5) span').html(ranking[0].name);
    } else {
        $('#main').removeClass('none');
        $('#pause_screen').addClass('none');
        $('#normal_footer').removeClass('none');
        $('#pause_footer').addClass('none');
    }
}

function get_game_setting(){
    if ($('#option_base').val() == '' | $('#option_base').val() < 0 | isNaN(parseFloat($('#option_base').val()))) {
        $('#setting_error').html('無法更改設定：底必須為零或正數');
        return;
    }
    if ($('#option_money').val() == '' | parseFloat($('#option_money').val()) <= 0 | isNaN(parseFloat($('#option_money').val()))) {
        $('#setting_error').html('無法更改設定：金錢倍數必須為正數');
        return;
    }
    if ($('#option_fold').val() == '' | parseFloat($('#option_fold').val()) < 1 | isNaN(parseFloat($('#option_fold').val()))) {
        $('#setting_error').html('無法更改設定：拉的倍數必須大於 1');
        return;
    }
    if ($('#option_break').val() == '' | parseFloat($('#option_break').val()) < 0 | isNaN(parseInt($('#option_fold').val()))) {
        $('#setting_error').html('無法更改設定：中止拉踢局數必須為零或正數');
        return;
    }
    default_setting.base = parseFloat($('#option_base').val());
    default_setting.money = parseFloat($('#option_money').val());
    default_setting.fold = parseFloat($('#option_fold').val());
    default_setting.break = parseInt($('#option_break').val());
    $('#option').modal('toggle');
}

function fill_default(){
    $('#option_base').val(0);
    $('#option_money').val(1);
    $('#option_fold').val(1.5);
    $('#option_break').val(3);
}

function protraitdefault(){
    $('#main_left').removeClass('none');
    $('#main_right').addClass('none');
    $('#footer_context').addClass('none');
    $('#footer_menu div').removeClass('highlight');
    $('.footer_select:nth(0)').addClass('highlight');
}

function resetinput_change_seat(){
    $('#change_seat_pan a').removeClass('active');
    $('#change_seat .player_select a').removeClass('none active');
    $('#pane1,#pane2,#pane3,#pane4').addClass('none');
}

function panel_control(pane_no){
    for (x = pane_no+1;x < 5; x++){ //Loop for remaining panel
        $('#pane' + x + ' a').removeClass('none');//Reset any hiddened items
        for (y = pane_no;y > 0;y--){ //Loop for current and previous panels and find for active items
            for(z = 1;z < 5; z++){
                if($('#pane' + y + ' .p' + z + 'box').hasClass('active')){
                    $('#pane' + x + ' .p' + z + 'box').addClass('none');
                }
            }
        }
        $('#pane' + x + ' a').removeClass('active');
    }
    if (pane_no < 4){ //Show next panel upon selection
        let y = pane_no + 1;
        $('#pane' + y).removeClass('none');
        $('#change_seat .center_button_container').addClass('none');
        for (y = pane_no+2; y < 5; y++){
            $('#pane' + y).addClass('none');
        }
    } else {
        $('#change_seat .center_button_container').removeClass('none');
    }
}

function change_seat(){
    let msg = '換位：<br>'
    if ($('#change_seat_pan a:nth(0)').hasClass('active')){
        allplayer[mapped.E].newposition = 'S';
        allplayer[mapped.S].newposition = 'E';
        allplayer[mapped.W].newposition = 'N';
        allplayer[mapped.N].newposition = 'W';
    } else {
        for(x = 1; x < 5; x++){ //Loop all panel selection
            for ( y = 1; y < 5; y++){ //Loop for player selection
                if (x == 1){
                    if ($('#pane' + x + ' .p' + y + 'box').hasClass('active')){
                        allplayer[y].newposition = 'E';
                    }
                }
                if (x == 2){
                    if ($('#pane' + x + ' .p' + y + 'box').hasClass('active')){
                        allplayer[y].newposition = 'S';
                    }
                }
                if (x == 3){
                    if ($('#pane' + x + ' .p' + y + 'box').hasClass('active')){
                        allplayer[y].newposition = 'W';
                    }
                }
                if (x == 4){
                    if ($('#pane' + x + ' .p' + y + 'box').hasClass('active')){
                        allplayer[y].newposition = 'N';
                    }
                }
            }
        }
    }
    for (x = 1; x < 5; x++){
        if (allplayer[x].newposition == ''){
            return;
        }
        allplayer[x].position = allplayer[x].newposition;
        allplayer.newposition = '';
    }
    msg = msg + '東位： ' + allplayer[mapped.E].name + '<br>';
    msg = msg + '南位： ' + allplayer[mapped.S].name + '<br>';
    msg = msg + '西位： ' + allplayer[mapped.W].name + '<br>';
    msg = msg + '北位： ' + allplayer[mapped.N].name + '<br>';
    $('#settle').modal('toggle');
    check_undo();
    update_streak_ball_color();
    map_players();
    update_main_table();
    addlog(msg);
}

function change_name(){
    let msg = '改名：<br>';
    let action = 0;
    i = 1
    for (x = 1; x < 5; x++){
        let newname = $('#change_name .p' + x + '_input').val(); //Loop all input on change name
        if (newname !== allplayer[x].name){
            newname = checkname(newname);
            msg = msg + allplayer[x].name + ' 改名為 ' + newname + '<br>';
            allplayer[x].name = newname;
            action += 1;
        }
    }
    if (action > 0){
        addlog(msg);
        for (x = 1;x < 5; x++){
            $('.p' + x + 'name').html(allplayer[x].name);
            $('.p' + x + 'box').html(allplayer[x].name);
        }
        update_main_table();
        check_undo();
    }
    $('#settle').modal('toggle');
}


function context(action,target){
    $('#context').addClass('none');
    if (action == 'get'){
        $('#instant').modal('show');
        $('#instant .nav-link').removeClass('active');
        $('#instant .nav-link:nth(0)').addClass('active');
        $('#instantpay').removeClass('active');
        $('#instantget').tab('show');
        $('#instantget .p' + target + 'box').addClass('active');
        $('.center_button_container').removeClass('none');
    }
    if (action == 'pay'){
        $('#instant').modal('show');
        $('#instant .nav-link').removeClass('active');
        $('#instant .nav-link:nth(1)').addClass('active');
        $('#instantget').removeClass('active');
        $('#instantpay').tab('show');
        $('#instantpay .p' + target + 'box').addClass('active');
        $('.center_button_container').removeClass('none');
    }
    if (action == 'deal'){
        $('#ron').modal('show');
        $('#ron .nav-link').removeClass('active');
        $('#ron .nav-link:nth(0)').addClass('active');
        $('#tsumo').removeClass('active');
        $('#draw').removeClass('active');
        $('#deal').tab('show');
        $('#deal .p' + target + 'box').click();
    }
    if (action == 'tsumo'){
        $('#ron').modal('show');
        $('#ron .nav-link').removeClass('active');
        $('#ron .nav-link:nth(1)').addClass('active');
        $('#deal').removeClass('active');
        $('#draw').removeClass('active');
        $('#tsumo').tab('show');
        $('#tsumo .p' + target + 'box').click();
    }
}

function save(){
    gamestat.last_save = new Date();
    let data = new Object();
    data.allplayer = gatherallplayerdata();
    data.gamestat = gather(gamestat);
    data.game_record = gathergame_record();
    let temp_JSON = JSON.stringify(data);
    fulldata_JSON.unshift(temp_JSON);
    localStorage.setItem('data', JSON.stringify(data));
    localStorage.setItem('log', JSON.stringify(game_log));
}

function check_undo(){
    if(undo_count >= 1){
        for (x=0; x<game_log.length; x++){
            if(game_log[x].reverted == true && game_log[x].removed == false){
                game_log[x].removed = true;
            }
        }
        fulldata_JSON = fulldata_JSON.slice(parseInt(undo_count));
        undo_count = 0;
        save();
    } else {
        save();
    }
}

function save_setting(){
    localStorage.setItem('default_setting', JSON.stringify(default_setting));
}

function gatherallplayerdata(){
    let allplayer_data = [NaN];
    for (x = 1; x < 5; x++){
        let player_data = allplayer[x];
        let data_temp = new Object();
        for (property in player_data){
            data_temp[property] = player_data[property];
        }
        allplayer_data.push(data_temp);
    }
    return allplayer_data;
}

function gathergame_record(){
    let temp = new Array;
    for (x = 0; x < game_record.length; x++){
        temp.push(game_record[x]);
    }
    return temp;
}

function gather(obj){
    let temp = new Object();
    for (property in obj){
        temp[property] = obj[property];
    }
    return temp;
}

function end(){
    localStorage.removeItem('data');
    localStorage.removeItem('log');
    location.reload();
}

function reload(){
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
        generate_turn_display();
        initiate_ui();
        save();
        }
}

function undo(){
    if ($('#undo').hasClass('inactive')){
    } else {
        undo_count = parseInt(undo_count) + 1;
        let temp_JSON = JSON.parse(fulldata_JSON[parseInt(undo_count)]);
        allplayer = temp_JSON.allplayer;
        gamestat = temp_JSON.gamestat;
        game_record = temp_JSON.game_record;
        for (x=0; x<game_log.length; x++){
                if(game_log[x].reverted == false && game_log[x].removed == false){
                    game_log[x].reverted = true;
                    break;
                }
        }
        generate_turn_display();
        update_main_table();
        update_stat_table();
        playergraph();
        update_history_table();
    }
}

function redo(){
    if ($('#redo').hasClass('inactive')){
    } else {
        for (x=game_log.length-1; x>=0; x--){
            if(game_log[x].reverted == true && game_log[x].removed == false){
                game_log[x].reverted = false;
                break;
            }
        }
        undo_count = parseInt(undo_count) - 1;
        let temp_JSON = JSON.parse(fulldata_JSON[parseInt(undo_count)
        ]);
        allplayer = temp_JSON.allplayer;
        gamestat = temp_JSON.gamestat;
        game_record = temp_JSON.game_record;
        generate_turn_display();
        update_main_table();
        update_stat_table();
        playergraph();
        update_history_table();
    }
}

function update_player_unrealized(){
    for (x = 1; x < 5; x++){ // recalculate unrealized
        let unrealized = 0;
        for (y = 1; y < 5; y++){
            unrealized -= parseInt(allplayer[x]['lossto' + y]);
            unrealized += parseInt(allplayer[y]['lossto' + x]);
        }
        allplayer[x].unrealized = unrealized;
        allplayer[x].bal_arr.push(allplayer[x].balance);
        allplayer[x].unr_arr.push(eval(parseInt(allplayer[x].balance) + parseInt(allplayer[x].unrealized)));
    }
}

function push_balance_array(){
    for (x = 1; x < 5; x++){
        allplayer[x].bal_arr.push(allplayer[x].balance);
    }
}

function update_stat_table(){
    $('#stat_get :nth-child(2)').html(gamestat.instantget);
    $('#stat_pay :nth-child(2)').html(gamestat.instantpay);
    $('#stat_avg_yaku :nth-child(2)').html(gamestat.avg_yaku);
    $('#stat_total_change :nth-child(2)').html(gamestat.total_change);
    $('#game_max_yaku :nth-child(2)').html(gamestat.max_yaku);
    $('#game_max_streak :nth-child(2)').html(gamestat.max_streak);
    if (gamestat.instantget > 0){
            playerstat_display('#player_instantget', 'instantget', gamestat.instantget);
        }
    if (gamestat.instantpay > 0){
            playerstat_display('#player_instantpay', 'instantpay', gamestat.instantpay);
    }
    let rounds = parseInt(gamestat.round) - 1;
    if (rounds == 0){
    } else {
        playerstat_display_simple('#player_max_yaku', 'max_yaku');
        playerstat_display_simple('#player_max_streak', 'max_winning_streak');
        if (gamestat.tsumo + gamestat.deal > 0){
            playerstat_display('#player_win', 'win', gamestat.tsumo + gamestat.deal);
            playerstat_display('#player_lose', 'lose', gamestat.tsumo + gamestat.deal);
        }
        if (gamestat.tsumo > 0){
            playerstat_display('#player_tsumo', 'tsumo', gamestat.tsumo);
        }
        if (gamestat.deal > 0){
            playerstat_display('#player_deal', 'deal_lose', gamestat.deal);
        }
        $('#stat_round :nth-child(2)').html(rounds);
        $('#stat_draw :nth-child(2)').html(gamestat.tie);
        $('#stat_draw :nth-child(3)').html(Math.round(parseInt(gamestat.tie)/rounds * 100) + '%');
        $('#stat_deal :nth-child(2)').html(gamestat.deal);
        $('#stat_deal :nth-child(3)').html(Math.round(parseInt(gamestat.deal)/rounds * 100) + '%');
        $('#stat_tsumo :nth-child(2)').html(gamestat.tsumo);
        $('#stat_tsumo :nth-child(3)').html(Math.round(parseInt(gamestat.tsumo)/rounds * 100) + '%');
    }
}

function playerstat_display(id, property, fraction){
    for (x=2; x<=9; x++){
        let y = Math.floor(x/2);
        if (x%2 == 0){
            $(id + ' :nth-child(' + x + ')').html(allplayer[y][property]);
        }
        else{
            let temp_display = Math.round(allplayer[y][property] / fraction * 100);
            $(id + ' :nth-child(' + x + ')').html(temp_display + '%');
        }
    }
}

function playerstat_display_simple(id, property){
    for (x = 2; x <= 5; x++){
        let y = x - 1;
        $(id + ' :nth-child(' + x + ')').html(allplayer[y][property]);
    }
}

function breakstreak(fm, to){
    msg = allplayer[fm].name + ' 終止了拉踢：<br>' + allplayer[fm].name + ' 付了 ' + allplayer[fm]['lossto' + to] + '番給 ' + allplayer[to].name;
    addlog(msg);
    allplayer[fm].balance -= parseInt(allplayer[fm]['lossto' + to]);
    allplayer[to].balance += parseInt(allplayer[fm]['lossto' + to]);
    allplayer[fm]['sf' + to] = 0;
    allplayer[fm]['lossto' + to] = 0;
    update_player_unrealized();
    check_undo();
    update_main_table();
    playergraph();
    $('#break').modal('toggle');
}



function addlog(msg){
    let tempmsg = {
        time: timestamp(),
        message: msg,
        reverted: false,
        removed: false
    }
    game_log.unshift(tempmsg);
}

function update_log_table(){
    $('.dump_log').remove();
    for (x = game_log.length - 1; x >= 0; x--){
        if (game_log[x]['reverted']){
            $('#log_after').after('<tr class="removed dump_log"><td>' + game_log[x].time + '</td><td>' + game_log[x].message + '</td></tr>');
        } else {
            $('#log_after').after('<tr class="dump_log"><td>' + game_log[x].time + '</td><td>' + game_log[x].message + '</td></tr>');
        }
    }
}

function import_json(){
    let temp_data
    $('#import_error_msg').html('');
    $('#import_data_dump').html('');
    let temp_json = $('#import').val().toString();
    if(!temp_json){
        $('#import_error_msg').html('匯入內容為空白');
        return;
    }
    else{
        try{
            temp_data = JSON.parse(temp_json);
        }
        catch(err){
            $('#import_error_msg').html('匯入失敗: ' + err);
            return;
        }
    }
        try{
            $('#import_data_dump').append('<div>最後更改時間: ' + temp_data.gamestat.last_save + '</div>');
            $('#import_data_dump').append('<div>總局數: ' + temp_data.gamestat.round + '</div>');
            for (x=1; x<5; x++){
                if (temp_data.allplayer[x].unrealized > 0){
                    $('#import_data_dump').append('<div>' + temp_data.allplayer[x].name + ' : ' + temp_data.allplayer[x].balance + ' (+' + temp_data.allplayer[x].unrealized + ')</div>');
                }
                else if (temp_data.allplayer[x].unrealized == 0){
                    $('#import_data_dump').append('<div>' + temp_data.allplayer[x].name + ' : ' + temp_data.allplayer[x].balance + '</div>');
                }
                else if (temp_data.allplayer[x].unrealized < 0){
                    $('#import_data_dump').append('<div>' + temp_data.allplayer[x].name + ' : ' + temp_data.allplayer[x].balance + ' (' + temp_data.allplayer[x].unrealized + ')</div>');
                }
            }
        }
        catch(err){
            $('#import_error_msg').html('輸入的JSON 無效: ' + err);
            return;
        }
    $('#option').modal('hide');
    $('#confirm_import').modal('show');
    $('#confirm_import a:nth(0)').click(function(){
        $('#confirm_import').modal('hide');
        localStorage.removeItem('data');
        localStorage.setItem('data', temp_json);
        reload();
    });
}

function show_alert(alert_message){
    $('#alert_message').html(alert_message)
    $('#alert').removeClass('none');
    setTimeout(function(){
        $('#alert').addClass('none')
    }, 3000)
}

function playergraph(){
    if (allplayer.length < 2){ //Do not activate if not yet initialized
        return;
    }
    let x_arr = new Array();
    let currenttheme = theme[default_setting.theme]
    let stat_height = $('#stat_view').height() - 50;
    let stat_width = $('#stat_view').width() - 50;
    let trace1 = {
        y: allplayer[1].bal_arr,
        mode: 'lines+markers',
        name: allplayer[1]['name'],
        line: {
            color: currenttheme['--p1-color'],
            shape: 'linear'
        }
    }
    let trace2 = {
        y: allplayer[2].bal_arr,
        mode: 'lines+markers',
        name: allplayer[2]['name'],
        line: {
            color: currenttheme['--p2-color'],
            shape: 'linear'
        }
    }
    let trace3 = {
        y: allplayer[3].bal_arr,
        mode: 'lines+markers',
        name: allplayer[3]['name'],
        line: {
            color: currenttheme['--p3-color'],
            shape: 'linear'
        }
    }
    let trace4 = {
        y: allplayer[4].bal_arr,
        mode: 'lines+markers',
        name: allplayer[4]['name'],
        line: {
            color: currenttheme['--p4-color'],
            shape: 'linear'
        }
    }
    let plot_data = [trace1, trace2, trace3, trace4];
    let plot_layout = {
        width: stat_width,
        height: stat_height,
        plot_bgcolor: currenttheme['--bg-nord'],
        paper_bgcolor: currenttheme['--bg-nord'],
        showlegend: false,
        margin: {
            l: 0,
            r: 0,
            t: 0,
            b: 0,
        }
    }
    let plot_config = {
        width: stat_width,
        height: stat_height
    };
    Plotly.newPlot('graph_view', plot_data, plot_layout, plot_config);
}

function fullscreen(){
      document.fullScreenElement && null !== document.fullScreenElement || !document.mozFullScreen && !document.webkitIsFullScreen ? document.documentElement.requestFullScreen ? document.documentElement.requestFullScreen() : document.documentElement.mozRequestFullScreen ? document.documentElement.mozRequestFullScreen() : document.documentElement.webkitRequestFullScreen && document.documentElement.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT) : document.cancelFullScreen ? document.cancelFullScreen() : document.mozCancelFullScreen ? document.mozCancelFullScreen() : document.webkitCancelFullScreen && document.webkitCancelFullScreen();
}

$(document).ready(function(){
    reload();
    adjust_main_display_size();
    inputcontrol();
    uicontrol();
    $(window).resize(function(){
        adjust_main_display_size();
        playergraph();
    });
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('sw.js').  then((reg) => {
        // registration worked
            console.log('Registration succeeded.');
        }).catch((error) => {
        // registration failed
            console.log('Registration failed with ' + error);
        });
    }
    setInterval(function(){
            let dt = new Date();
            if (dt.getMinutes() < 10){
                var min = "0" + dt.getMinutes();
            }
            else {
                var min = dt.getMinutes();
            }
            let time = dt.getHours() + ":" + min;
            $('#time').html(time);
        }, 1000);
});
