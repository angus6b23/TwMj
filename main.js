var i=1 //used for empty names
var deferredPrompt; // Initialize deferredPrompt for use later to show browser install prompt
var allplayer=[NaN]; //Array for all players, such that allplayer[1].name = name of player1
var gamestat={ //Object for holding game statistics
    round: 1,
    round_prevailing: 1,
    streak: 0,
    banker: 'E',
    tie: 0,
    deal: 0,
    tsumo: 0,
    avg_yaku: 0,
    max_yaku: 0,
    instantget: 0,
    instantpay: 0,
    total_change: 0,
    max_streak: 0,
    modified: false,
    last_save: ''
};

var data = new Object();
var default_setting={ //Object for holding settings
    font: '',
    theme: 'Nord',
    fold: 1.5,
    break: 3,
    base: 0,
    money: 1,
    fullscreen: false,
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

var game_record=[NaN]; //Array for record of game, such that game_record[1] = Results of first game
var game = new Array; // Array for record of game, such that [30, 0, 0 , -30] = Player 4 loses 30 yaku to Player 1 at that game
var fulldataJSON = new Array; // Array for undo and redo, saves most of the data
let msg = '';
let turn_display = '第1局‧東圈東';
var undo_count = 0;
function nameobject(name, position){ //Function for creating player, edit the variables for player here
    let player={
        balance: 0,
        unrealized: 0,
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

let objforname = {
    name_east: "E",
    name_south: "S",
    name_west: "W",
    name_north: "N",
}

let instant_obj = new Object(); // Object for instant pay or get_or_pay
let ron_obj = new Object(); // Object for ron

function setfont(fontfamily){ //Function for changing font
    $('#global').css('font-family', fontfamily);
    $('.modal').css('font-family', fontfamily);
    default_setting.font = fontfamily;
}

function initiate(){ //Function for iniating new game
    getname();
    save_setting();
    save();
    initiate_ui();
}

function updatecssdirectioncolor(){ //change player colors when changing theme
    for ( x = 1; x < 5; x++){
        let temp_color=getComputedStyle(document.documentElement).getPropertyValue('--p' + x + '-color');
        if (allplayer.length > 2){
            document.documentElement.style.setProperty('--' + allplayer[x].position, temp_color);
        }
    }
}

function initiate_ui(){ //Function for initiating ui
    updatecssdirectioncolor();
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
    applytheme(default_setting.theme);
    updatetabledisplay();
    update_stat_table();
    updatehistorydisplay();
}

function applytheme(theme_name){
    let temp_theme = theme[theme_name];
    for ( properties in temp_theme ){
        document.documentElement.style.setProperty(properties, temp_theme[properties]);
    }
    updatecssdirectioncolor();
}

function updatetabledisplay(){
    if (gamestat.modified == true){
        $('#center i').removeClass('none');
    } else {
        $('#center i').addClass('none');
    }
    for (x = 1; x < 5; x++){ //Loop for all players, fill in name and balance into table
        if (allplayer[x].position == 'E'){
            if (allplayer[x].unrealized > 0){
                $('#E-text').html(allplayer[x].name + '<br>' + allplayer[x].balance + '(+' + allplayer[x].unrealized + ')');
            } else if (allplayer[x].unrealized < 0){
                $('#E-text').html(allplayer[x].name + '<br>' + allplayer[x].balance + '(' + allplayer[x].unrealized + ')');
            }
            else {
                $('#E-text').html(allplayer[x].name + '<br>' + allplayer[x].balance);
            }
            $('#east').css('background-color' , 'var(--p'+ x +'-color)');
        }
        if (allplayer[x].position == 'S'){
            if (allplayer[x].unrealized > 0){
                $('#S-text').html(allplayer[x].name + '<br>' + allplayer[x].balance + '(+' + allplayer[x].unrealized + ')');
            } else if (allplayer[x].unrealized < 0){
                $('#S-text').html(allplayer[x].name + '<br>' + allplayer[x].balance + '(' + allplayer[x].unrealized + ')');
            }
            else {
                $('#S-text').html(allplayer[x].name + '<br>' + allplayer[x].balance);
            }
            $('#south').css('background-color' , 'var(--p'+ x +'-color)');
        }
        if (allplayer[x].position == 'W'){
            if (allplayer[x].unrealized > 0){
                $('#W-text').html(allplayer[x].name + '<br>' + allplayer[x].balance + '(+' + allplayer[x].unrealized + ')');
            } else if (allplayer[x].unrealized < 0){
                $('#W-text').html(allplayer[x].name + '<br>' + allplayer[x].balance + '(' + allplayer[x].unrealized + ')');
            }
            else {
                $('#W-text').html(allplayer[x].name + '<br>' + allplayer[x].balance);
            }
            $('#west').css('background-color' , 'var(--p'+ x +'-color)');
        }
        if (allplayer[x].position == 'N'){
            if (allplayer[x].unrealized > 0){
                $('#N-text').html(allplayer[x].name + '<br>' + allplayer[x].balance + '(+' + allplayer[x].unrealized + ')');
            } else if (allplayer[x].unrealized < 0){
                $('#N-text').html(allplayer[x].name + '<br>' + allplayer[x].balance + '(' + allplayer[x].unrealized + ')');
            }
            else {
                $('#N-text').html(allplayer[x].name + '<br>' + allplayer[x].balance);
            }
            $('#north').css('background-color' , 'var(--p'+ x +'-color)');
        }
    }
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
    } else {
        $('#redo').removeClass('inactive');
    }
    if (eval(undo_count + 1) >= fulldataJSON.length){
        $('#undo').addClass('inactive');
    } else {
        $('#undo').removeClass('inactive');
    }
    $('#table .fa-exclamation-circle').addClass('none');
    $('#center .dots').remove(); // Update streak animation
    $('.breakmsg').remove();
    for ( x = 1; x < 5; x++){
        for ( y = 1; y < 5; y++){
            if (allplayer[x]['sf' + y] !== 0 && allplayer[x]['sf' + y] % parseInt(default_setting.break) == 0){
                breakmsg(x, y);
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
                for ( z = 0; z < allplayer[x]['sf' + y]; z++){
                    $('#center').append('<div class="dots ' + allplayer[x].position + allplayer[y].position + ' delay_' + z + '"></div>');
                }
            }
        }
    }
}

function updatehistorydisplay(){ //Update the display of record table
    $('.record_items').remove();
    for (x = 1 ; x < game_record.length ; x++){
        if (game_record[x].length == 1){
            $('#record_add').after('<tr class="record_items"><td>' + x + '</td><td colspan="4">流局</td>');
        } else {
            $('#record_add').after('<tr class="record_items"><td>' + x + '</td><td>' + game_record[x][1] + '</td><td>' + game_record[x][2] + '</td><td>' + game_record[x][3] + '</td><td>' + game_record[x][4] + '</td></tr>');
        }
    }
}

function getname(){ //Function for getting name from initial div
    for (x in objforname) {
        name = $('#' + x).val();
        name = checkname(name);
        player = nameobject(name, objforname[x]);
        allplayer.push(player);
    }
}

function checkname(name){ //sub name into empty player name string
    if (name === ''){
        name = '玩家' + i;
        i++;
        return name;
    }
    else {
        return name;
    }
}

function settablesize(){ //Control size of table according to window size
    var height=$(document).height();
    var width=$(document).width();
    if ( height * 0.7 <= width * 0.48 ){
        $('#table').css('height', '70vh');
        $('#table').css('width', '70vh');
    }
    else {
        $('#table').css('height', '48vw');
        $('#table').css('width', '48vw');
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
    $('.player_select a').removeClass('active')
    $('#ron input').val('');
    $('#ron input').addClass('none');
    $('#ron .center_button_container').addClass('none');
}

function validateinstant(get_or_pay){
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
    if (instant_obj.selected != null){
        if (instant_obj.value != null){
            return 0;
        }
        else {} // Add visual for invalid value input
    }
    else {} //Add visual for invalid player input
}

function instant(get_or_pay){
    checkundo();
    if (validateinstant(get_or_pay) == 0){
        if(get_or_pay == 'get'){
            for ( x = 1; x < 5; x++ ){
                if ( x == instant_obj.selected ){
                    allplayer[x].balance += parseInt(instant_obj.value) * 3;
                    allplayer[x].instantget += parseInt(instant_obj.value) * 3;
                    gamestat.instantget += parseInt(instant_obj.value) * 3;
                    gamestat.total_change += parseInt(instant_obj.value) * 3;
                }
                else {
                    allplayer[x].balance -= parseInt(instant_obj.value);
                }
            }
            msg = allplayer[instant_obj.selected].name + ' 即收了其他玩家 ' + instant_obj.value + ' 番';
            addhistory(msg)
        }
        else if(get_or_pay == 'pay'){
            for ( x = 1; x < 5; x++ ){
                if ( x == instant_obj.selected ){
                    allplayer[x].balance -= parseInt(instant_obj.value) * 3;
                    allplayer[x].instantpay += parseInt(instant_obj.value) * 3;
                    gamestat.instantpay += parseInt(instant_obj.value) * 3;
                    gamestat.total_change += parseInt(instant_obj.value) * 3;
                }
                else {
                    allplayer[x].balance += parseInt(instant_obj.value);
                }
            }
            msg = allplayer[instant_obj.selected].name + ' 即付了其他玩家 ' + instant_obj.value + ' 番';
            addhistory(msg);
        }
        resetinput_instant();
        save();
        updatetabledisplay();
        update_stat_table();
        $('#instant').modal('toggle');
    }
}

function deal(){
    msg = '第' + gamestat.round + '場：<br>';
    if ( ron_obj.value == 0 | ron_obj.value == '' | typeof(ron_obj.value) == 'undefined'){
        //Add warning for empty input
    } else {
        checkundo();
        game = [NaN];
        gamestat.total_change -= parseInt(ron_obj.value);
        let ex_draw = parseInt(gamestat.tsumo) + parseInt(gamestat.deal);
        gamestat.avg_yaku = Math.round((ex_draw * parseFloat(gamestat.avg_yaku) - parseInt(ron_obj.value)) * 100 / (ex_draw + 1)) / 100;
        for ( x = 1 ; x < 5 ; x++){ // Loop for all input field then push to an array to represent game summary
            let win_value = $('#deal .p' + x + 'form').val();
            if ( win_value !== '' && win_value > 0 ){
                allplayer[x].status = 'win';
                allplayer[x].win = parseInt(allplayer[x].win) + 1;
                allplayer[x].deal_win = parseInt(allplayer[x].deal_win) + 1;
                msg = msg + allplayer[ron_obj.selected].name + ' 出銃了 ' + win_value + '番給 ' + allplayer[x].name + '<br>';
                game.push(parseInt(win_value));
                if (win_value > gamestat.max_yaku){
                    gamestat.max_yaku = win_value;
                }
                if (win_value > allplayer[x].max_yaku){
                    allplayer[x].max_yaku = win_value;
                }
                } else if ( win_value == '' ||  win_value == 0) {
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
        addhistory(msg);
        save();
        updatetabledisplay();
        updatehistorydisplay();
        update_stat_table();
        resetinput_ron();
        $('#ron').modal('toggle');
    }
}

function tsumo(){
    msg = '第' + gamestat.round + '場：<br>';
    if ( ron_obj.value == 0 | typeof(ron_obj.value) == 'undefined'){
        //Add warning for empty input
    } else {
        checkundo();
        game = [NaN];
        for (x = 1; x < 5; x++){
            let value = $('#tsumo .p' + x + 'form').val();
            if (value == '' || value == 0){
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
        addhistory(msg);
        save();
        updatetabledisplay();
        updatehistorydisplay();
        update_stat_table();
        resetinput_ron();
        $('#ron').modal('toggle');
    }
}

function draw(){
    if($('#holdplus').hasClass('active')){
        default_setting.draw_action = 'hold+';
        checkundo();
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
        checkundo();
        post_draw();
    } else if($('#pass').hasClass('active')){
        default_setting.draw_action = 'pass';
        checkundo();
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
        //Add error of no selection
    }
}

function post_draw(){
    save_setting();
    msg = '第' + gamestat.round + '場：<br>流局';
    addhistory(msg);
    gamestat.round = parseInt(gamestat.round) + 1;
    gamestat.tie = parseInt(gamestat.tie) + 1;
    game_record.push(['流局']);
    calculateturn();
    save();
    updatetabledisplay();
    updatehistorydisplay();
    update_stat_table();
    $('#ron').modal('toggle');
}

function settle(deal_or_tsumo){
    for ( x = 1; x < 5 ; x++){ //loop for all player and search for status of current match
        if ( allplayer[x].status == 'lose' ){
            for ( y = 1; y < 5; y++){
                if( allplayer[y].status == 'win'){ //Lose play add value to 'streak from' and 'loss to' winning player
                    if ( parseInt(allplayer[x]['sf' + y]) > 0){
                        allplayer[x]['sf' + y] += 1;
                        if (deal_or_tsumo == 'tsumo'){
                            allplayer[x]['lossto' + y] = Math.ceil(parseInt(allplayer[x]['lossto' + y]) * parseFloat(default_setting.fold)) - parseInt(game[x]); // Pick the value from losing player of last match if the match ends with tsumo
                        } else if (deal_or_tsumo == 'deal'){
                            allplayer[x]['lossto' + y] = Math.ceil(parseInt(allplayer[x]['lossto' + y]) * parseFloat(default_setting.fold)) + parseInt(game[y]);// Pick the value from winning player of last match if the match ends with deal
                        }
                    }
                    else {
                        allplayer[x]['sf' + y] += 1;
                        if (deal_or_tsumo == 'tsumo'){
                            allplayer[x]['lossto' + y] -= parseInt(game[x]);
                        } else if (deal_or_tsumo == 'deal'){
                            allplayer[x]['lossto' + y] += parseInt(game[y]);
                        }
                    }
                } else if ( allplayer[y].status == 'neutral' || allplayer[y].status == 'lose' ){
                    if ( parseInt(allplayer[x]['lossto' + y]) > 0){
                        allplayer[x].balance -= parseInt(allplayer[x]['lossto' + y]);
                        allplayer[y].balance += parseInt(allplayer[x]['lossto' + y]);
                        msg = msg + allplayer[x].name + ' 付了 ' + allplayer[x]['lossto' + y] + '番給 ' + allplayer[y].name + '<br>';
                        allplayer[x]['sf' + y] = 0;
                        allplayer[x]['lossto' + y] =0;
                    }
                }
            }
        } else if ( allplayer[x].status == 'neutral'){
            for ( y = 1; y < 5; y++){
                if (parseInt(allplayer[x]['sf' + y]) > 0 && allplayer[y].status !== 'win'){
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
    calculateturn();
}

function iset(fm, to){ //Function for handlin instant settle
    checkundo();
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
    save();
    updatetabledisplay();
    addhistory(msg);
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
                //Add visual feedback for no operation
                return;
            }
        }
    }
    if (action !== 0){
        gamestat.modified = true;
        addhistory(msg);
        save();
    }
    updatetabledisplay();
    $('#settle').modal('toggle');
    resetinput_settle();
}

function resetinput_settle(){
    $('#adjust input').val('');
    $('#adjust .select').removeClass('active');
}

function calculateturn(){
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

    $('#option').on('shown.bs.modal', function(){ //Fill in default settings into option modal
        $('#option_base').val(default_setting.base);
        $('#option_money').val(default_setting.money);
        $('#option_fold').val(default_setting.fold);
        $('#option_break').val(default_setting.break);
        $('#theme_select').val(default_setting.theme);
        if (fulldataJSON.length > 0){
            checkundo();
            $('#export').val(fulldataJSON[0]);
            let download_data = "data:text/json;charset=utf-8," + fulldataJSON[0];
            $('#download').attr('href', download_data);
            $('#download').attr('download', 'TWMJ_Data.json');
            $('#download').click();
        }
    });
    $('#theme_select').change(function(){
        applytheme($('#theme_select').val());
    });
    $('#option').on('hide.bs.modal', function(){
        applytheme(default_setting.theme);
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
            $('#instant_settle table').after('<div class="iset" style="font-size: 4vh">暫未有拉踢可結算</div>');
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
            context_name=getplayernamebyposition('E');
            context_no=getplayernumberbyposition('E');
        }
        else if(event.target.id == 'south'){
            context_name=getplayernamebyposition('S');
            context_no=getplayernumberbyposition('S');
        }
        else if(event.target.id == 'west'){
            context_name=getplayernamebyposition('W');
            context_no=getplayernumberbyposition('W');
        }
        else if(event.target.id == 'north'){
            context_name=getplayernamebyposition('N')
            context_no=getplayernumberbyposition('N');
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
        allplayer[getplayernumberbyposition('E')].newposition = 'S';
        allplayer[getplayernumberbyposition('S')].newposition = 'E';
        allplayer[getplayernumberbyposition('W')].newposition = 'N';
        allplayer[getplayernumberbyposition('N')].newposition = 'W';
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
    msg = msg + '東位： ' + getplayernamebyposition('E') + '<br>';
    msg = msg + '南位： ' + getplayernamebyposition('S') + '<br>';
    msg = msg + '西位： ' + getplayernamebyposition('W') + '<br>';
    msg = msg + '北位： ' + getplayernamebyposition('N') + '<br>';
    $('#settle').modal('toggle');
    checkundo();
    save();
    updatetabledisplay();
    addhistory(msg);
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
        addhistory(msg);
        for (x = 1;x < 5; x++){
            $('.p' + x + 'name').html(allplayer[x].name);
            $('.p' + x + 'box').html(allplayer[x].name);
        }
        updatetabledisplay();
        checkundo();
        save();
    }
    $('#settle').modal('toggle');
}

function getplayernamebyposition(position){
    for (x=1; x<5; x++){
        if (allplayer[x].position == position){
            return allplayer[x].name
            break;
        }
    }
}

function getplayernumberbyposition(position){
    for (x=1; x<5; x++){
        if (allplayer[x].position == position){
            return x
            break;
        }
    }
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
    fulldataJSON.unshift(temp_JSON);
    localStorage.setItem('data', JSON.stringify(data));
}

function checkundo(){
    if(undo_count >= 1){
        fulldataJSON = [];
        undo_count = 0;
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
    location.reload();
}

function reload(){
    if (localStorage.getItem('default_setting') === null){
    } else {
        default_setting = JSON.parse(localStorage.getItem('default_setting'));
        applytheme(default_setting.theme);
        setfont(default_setting.font);
    }

    if (localStorage.getItem('data') === null){
    } else {
        data = JSON.parse(localStorage.getItem('data'));
        allplayer = data.allplayer;
        gamestat = data.gamestat;
        game_record = data.game_record;
        calculateturn();
        initiate_ui();
        save();
        }
}

function undo(){
    if ($('#undo').hasClass('inactive')){
    } else {
        undo_count = parseInt(undo_count) + 1;
        let temp_JSON = JSON.parse(fulldataJSON[parseInt(undo_count)]);
        allplayer = temp_JSON.allplayer;
        gamestat = temp_JSON.gamestat;
        game_record = temp_JSON.game_record;
        $('#history tr:nth-child(' + eval(parseInt(undo_count) + 2) + ')').addClass('removed');
        calculateturn();
        updatetabledisplay();
        update_stat_table();
        updatehistorydisplay();
    }
}

function redo(){
    if ($('#redo').hasClass('inactive')){
    } else {
        $('#history tr:nth-child(' + eval(parseInt(undo_count) + 2) + ')').removeClass('removed');
        undo_count = parseInt(undo_count) - 1;
        let temp_JSON = JSON.parse(fulldataJSON[parseInt(undo_count)
        ]);
        allplayer = temp_JSON.allplayer;
        gamestat = temp_JSON.gamestat;
        game_record = temp_JSON.game_record;
        calculateturn();
        updatetabledisplay();
        update_stat_table();
        updatehistorydisplay();
    }
}

function breakmsg(fm, to){
    let fan = allplayer[fm]['lossto' + to];
    $('#break table').append('<tr class="breakmsg mt-2"><td>' + allplayer[fm].name + ' 已被 ' + allplayer[to].name + ' 拉了' + allplayer[fm]['sf' + to] + '次<br>總番數為' + fan + '</td><td><a class="button" href="javascript:breakstreak(' + fm + ',' + to + ');">終止此拉踢</a></td></tr>');
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
    checkundo();
    msg = allplayer[fm].name + ' 終止了拉踢：<br>' + allplayer[fm].name + ' 付了 ' + allplayer[fm]['lossto' + to] + '番給 ' + allplayer[to].name;
    addhistory(msg);
    allplayer[fm].balance -= parseInt(allplayer[fm]['lossto' + to]);
    allplayer[to].balance += parseInt(allplayer[fm]['lossto' + to]);
    allplayer[fm]['sf' + to] = 0;
    allplayer[fm]['lossto' + to] = 0;
    update_player_unrealized();
    save();
    updatetabledisplay();
    $('#break').modal('toggle');
}

function addhistory(msg){
    $('#history_after').after('<tr><td>' + timestamp() + '</td><td>' + msg + '</td></tr>');
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

function playergraph(){
    let x_arr = new Array();
    for (x=1; x<=gamestat.round; x++){
        x_arr.push(x);
    }
    let trace1 = {
        x: x_arr,
        y: allplayer[1].bal_arr,
        mode: 'lines+markers'
    }
    let trace2 = {
        x: x_arr,
        y: allplayer[2].bal_arr,
        mode: 'lines+markers'
    }
    let plot_data = [trace1, trace2];
    let plot_layout = {
        margin: {
            l: 0,
            r: 0,
            t: 0,
            b: 0,
        }
    }
    let plot_config ={responsive: true};
    Plotly.newPlot('graph', plot_data, plot_layout, plot_config);
}

function fullscreen(){
      document.fullScreenElement && null !== document.fullScreenElement || !document.mozFullScreen && !document.webkitIsFullScreen ? document.documentElement.requestFullScreen ? document.documentElement.requestFullScreen() : document.documentElement.mozRequestFullScreen ? document.documentElement.mozRequestFullScreen() : document.documentElement.webkitRequestFullScreen && document.documentElement.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT) : document.cancelFullScreen ? document.cancelFullScreen() : document.mozCancelFullScreen ? document.mozCancelFullScreen() : document.webkitCancelFullScreen && document.webkitCancelFullScreen();
}

$(document).ready(function(){
    reload();
    settablesize();
    inputcontrol();
    uicontrol();
    $(window).resize(function(){
        settablesize();
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
