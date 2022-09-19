// ------------------------------------------ //
// GLOBAL VARIABLES
// ------------------------------------------ //
const themes = { //Object for themes
    Nord:{
        '--p1-color': '#d08770',
        '--p2-color': '#ebcb8b',
        '--p3-color': '#a3be8c',
        '--p4-color': '#b48ead',
        '--bg-nord': '#2e3440',
        '--fg-nord': '#e5e9f0',
        '--f7-theme-color': '#81a1c1',
        '--f7-theme-color-rgb:': '129, 161, 193',
        '--f7-theme-color-shade': '#668db4',
        '--f7-theme-color-tint': '#9cb5ce',
        'zh_name': '北歐',
        'is_Dark': true
    },
    Nord_alt:{
        '--p1-color': '#8fbcbb',
        '--p2-color': '#88c0d0',
        '--p3-color': '#81a1c1',
        '--p4-color': '#5e81ac',
        '--bg-nord': '#2e3440',
        '--fg-nord': '#e5e9f0',
        '--f7-theme-color': '#a3be8c',
        '--f7-theme-color-rgb': '163, 190, 140',
        '--f7-theme-color-shade': '#8eaf72',
        '--f7-theme-color-tint': '#b8cda6',
        'zh_name': '異色北歐',
        'is_Dark': true
    },
    Dracula:{
        '--p1-color': '#8be9fd',
        '--p2-color': '#50fa7b',
        '--p3-color': '#bd93f9',
        '--p4-color': '#f1fa8c',
        '--bg-nord': '#282a36',
        '--fg-nord': '#f8f8f2',
        '--f7-theme-color': '#ff79c6',
        '--f7-theme-color-rgb': '255, 121, 198',
        '--f7-theme-color-shade': '#ff50b5',
        '--f7-theme-color-tint': '#ffa2d7',
        'zh_name': '德古拉',
        'is_Dark': true
    },
    Gruvbox_light:{
        '--p1-color': '#cc241d',
        '--p2-color': '#98971a',
        '--p3-color': '#d79921',
        '--p4-color': '#458588',
        '--bg-nord': '#fbf1c7',
        '--fg-nord': '#3c3836',
        '--f7-theme-color': '#689d6a',
        '--f7-theme-color-rgb': '104, 157, 106',
        '--f7-theme-color-shade': '#578658',
        '--f7-theme-color-tint': '#81ad82',
        'zh_name': '亮色航空',
        'is_Dark': false
    },
    Gruvbox_dark:{
        '--p1-color': '#fb4934',
        '--p2-color': '#b8bb26',
        '--p3-color': '#fabd2f',
        '--p4-color': '#83a598',
        '--bg-nord': '#3c3836',
        '--fg-nord': '#fbf1c7',
        '--f7-theme-color': '#8ec07c',
        '--f7-theme-color-rgb': '142, 192, 124',
        '--f7-theme-color-shade': '#76b360',
        '--f7-theme-color-tint': '#a6cd98',
        'zh_name': '暗色航空',
        'is_Dark': true
    },
    Tomorrow_night:{
        '--p1-color': '#cc6666',
        '--p2-color': '#f0c674',
        '--p3-color': '#8abeb7',
        '--p4-color': '#b294bb',
        '--bg-nord': '#1d1f21',
        '--fg-nord': '#c5c8c6',
        '--f7-theme-color': '#969896',
        '--f7-theme-color-rgb': '150, 152, 150',
        '--f7-theme-color-shade': '#818481',
        '--f7-theme-color-tint': '#abacab',
        'zh_name': '暗色明日',
        'is_Dark': true
    },
    Tomorrow:{
        '--p1-color': '#c82829',
        '--p2-color': '#eab700',
        '--p3-color': '#3e999f',
        '--p4-color': '#8959a8',
        '--bg-nord': '#ffffff',
        '--fg-nord': '#4d4d4c',
        '--f7-theme-color': '#8e908c',
        '--f7-theme-color-rgb': '142, 144, 140',
        '--f7-theme-color-shade': '#7a7c77',
        '--f7-theme-color-tint': '#a2a4a1',
        'zh_name': '亮色明日',
        'is_Dark': false
    },
    High_contrast:{
        '--p1-color': '#ff0000',
        '--p2-color': '#00ff00',
        '--p3-color': '#0000ff',
        '--p4-color': '#ffff00',
        '--bg-nord': '#ffffff',
        '--fg-nord': '#000000',
        '--f7-theme-color': '#ff00ff',
        '--f7-theme-color-rgb': '255, 0, 255',
        '--f7-theme-color-shade': '#d600d6',
        '--f7-theme-color-tint': '#ff29ff',
        'zh_name': '高對比',
        'is_Dark': false
    },
};
// ------------------------------------------ //
// GLOBAL FUNCTIONS
// ------------------------------------------ //
// Function when triggering ui_update
app.on('ui_update', function(){
    // Update table display
    // Reomve all streak warning first
    $('#table .exclamation').remove();
    // Remove all animation dots
    $('#center .animation_dots').remove();
    // Remove all banker Class and streak counter
    $('#east, #south, #west, #north').removeClass('banker_block');
    $('#east, #south, #west, #north').text('');
    $('.action-break').addClass('none');
    for (i=1;i<=4;i++){
        $('.p' + i + '_name').text(allplayer[i].name); //Fill all player names
        // Fill all player balance
        if (default_setting.display_as_money){ //Calculate balance to money if display_as_money is true
            let display_balance = Math.round(allplayer[i].balance * default_setting.money * 100) / 100;
            let unrealized_balance = Math.round(allplayer[i].unrealized * default_setting.money * 100) / 100;
            (allplayer[i].unrealized == 0) ? $('.p' + i + '_balance').text('$' + display_balance):
            (allplayer[i].unrealized > 0) ? $('.p' + i + '_balance').text('$' + display_balance + ' (+$' + unrealized_balance + ')') :
            $('.p' + i + '_balance').text('$' + display_balance + ' (-$' + Math.abs(unrealized_balance) + ')');
        } else {
            (allplayer[i].unrealized == 0) ? $('.p' + i + '_balance').text(allplayer[i].balance):
            (allplayer[i].unrealized > 0) ? $('.p' + i + '_balance').text(allplayer[i].balance + ' (+' + allplayer[i].unrealized + ')') :
            $('.p' + i + '_balance').text(allplayer[i].balance + ' (' + allplayer[i].unrealized + ')');
        }
        for (x=1; x<=4; x++){
            //Apply streak_warning
            if (parseInt(allplayer[i]['sf' + x]) > 0  && parseInt(allplayer[i]['sf' + x]) % default_setting.break == 0){ //Copy streak warning node if streak % break = 0
                $('#p' + i + '-action-break').removeClass('none');
                let streak_warning = $('.exclamation')[0].cloneNode(true);
                switch (allplayer[i].position){
                    case 'E': $('#east').append(streak_warning);break;
                    case 'S': $('#south').append(streak_warning);break;
                    case 'W': $('#west').append(streak_warning);break;
                    case 'N': $('#north').append(streak_warning);break;
                }
            }
            //Add dot animations
            if (parseInt(allplayer[i]['sf' + x]) > 0){
                for (streak = 1; streak <= allplayer[i]['sf' + x]; streak++){
                    let animation_dots = $('.animation_dots');
                    animation_dots = animation_dots[animation_dots.length - 1].cloneNode();
                    animation_dots.classList.add( 'p' + i + '_to_p' + x );
                    animation_dots.classList.add('delay_' + (streak - 1));
                    $('#center').append(animation_dots);
                }
            }
        }
        // End of double for loop
        // Add banker animation and banker class
        if (gamestat.banker == allplayer[i].position){
            switch (allplayer[i].position){
                case 'E': $('#east').addClass('banker_block'); (gamestat.streak > 0) ? $('#east').html('<h1>' + gamestat.streak + '</h1>'):null; break;
                case 'S': $('#south').addClass('banker_block'); (gamestat.streak > 0) ? $('#south').html('<h1>' + gamestat.streak + '</h1>'):null; break;
                case 'W': $('#west').addClass('banker_block'); (gamestat.streak > 0) ? $('#west').html('<h1>' + gamestat.streak + '</h1>'):null; break;
                case 'N': $('#north').addClass('banker_block'); (gamestat.streak > 0) ? $('#north').html('<h1>' + gamestat.streak + '</h1>'):null; break;
            }
        }
    }
    // End of single for loop
    // Calculate round_prevailing text
    let round = Math.floor(gamestat.round_prevailing / 16 + 1) // 第n 局
    let round_prevailing_text = '第' + round + '局・';
    switch (Math.floor((gamestat.round_prevailing - ((round - 1) * 16) - 1)/ 4)){
        case 0: round_prevailing_text += '東圈'; break;
        case 1: round_prevailing_text += '南圈'; break;
        case 2: round_prevailing_text += '西圈'; break;
        case 3: round_prevailing_text += '北圈'; break;
    }
    switch (gamestat.round_prevailing % 4){
        case 0: round_prevailing_text += '北'; break;
        case 1: round_prevailing_text += '東'; break;
        case 2: round_prevailing_text += '南'; break;
        case 3: round_prevailing_text += '西'; break;
    }
    $('#round_counter').text(round_prevailing_text);
    // Add banker class to respective player cards;
    $('.p1_card, .p2_card, .p3_card, p4_card').removeClass('banker');
    $('.p' + mapped[gamestat.banker] + '_card').addClass('banker');
    // Fill Game Record
    let game_record_append = ''
    for (i=game_record.length - 1; i>= 1; i--){
        if(game_record[i].length == 5){
            game_record_append += '<tr><td>' + i + '</td><td>' + game_record[i][1] + '</td><td>' + game_record[i][2] + '</td><td>' + game_record[i][3] + '</td><td>'+ game_record[i][4] + '</td></tr>'
        } else {
            game_record_append += '<tr><td>' + i + '</td><td colspan="4">流局</td></tr>';
        }
    }
    $('#game_record').html(game_record_append);
});
// ------------------------------------------ //
// Auto Run Functions
// ------------------------------------------ //
app.on('pageInit', function(){ // Add event listeners for all pages
    if(load()){
        map_players();
        fill_names();
        app.emit('data_change');
        app.preloader.hide();
    } else {
        app.popup.open('#start-popup');
        app.preloader.hide();
    }
    $('.quick-actions .actions-button').on('click', function(){ //Event listeners for closing actions after click [Firefox]
        app.actions.close();
    })
})
$('.quick-actions .actions-button').on('click', function(){ //Event listeners for closing actions after click [Chromium]
    app.actions.close();
})
if(load()){
    map_players();
    fill_names();
    app.emit('data_change');
    app.preloader.hide();
} else {
    app.popup.open('#start-popup');
    app.preloader.hide();
}
// ------------------------------------------ //
// Starting RELATED FUNCTIONS
// ------------------------------------------ //
// Starting Modal Functions
function fill_names(){
    // Remove all Classes
    $('#N-text, #N-text2, #north, #E-text, #E-text2, #east, #S-text, #S-text2, #south, #W-text, #W-text2, #west, #N-text, #N-text2, #north').removeClass('p1_name, p1_balance, p1_bg, p2_name, p2_balance, p2_bg, p3_name, p3_balance, p3_bg, p4_name, p4_balance, p4_bg');
    $('#N-text').addClass('p' + mapped.N + '_name');
    $('#N-text2').addClass('p' + mapped.N + '_balance');
    $('#north').addClass('p' + mapped.N + '_bg');
    $('#E-text').addClass('p' + mapped.E + '_name');
    $('#E-text2').addClass('p' + mapped.E + '_balance');
    $('#east').addClass('p' + mapped.E + '_bg');
    $('#S-text').addClass('p' + mapped.S + '_name');
    $('#S-text2').addClass('p' + mapped.S + '_balance');
    $('#south').addClass('p' + mapped.S + '_bg');
    $('#W-text').addClass('p' + mapped.W + '_name');
    $('#W-text2').addClass('p' + mapped.W + '_balance');
    $('#west').addClass('p' + mapped.W + '_bg');
    $('.north-block').addClass('p' + mapped.N + '_action');
    $('.east-block').addClass('p' + mapped.E + '_action');
    $('.south-block').addClass('p' + mapped.S + '_action');
    $('.west-block').addClass('p' + mapped.W + '_action');
    let css_root = document.querySelector(':root')
    for (i=1; i<=4; i++){ //Set position in css for animations
        if (allplayer[i].position == 'E'){
            css_root.style.setProperty('--p' + i + '-position-top', 'calc(50% - 1vh)');
            css_root.style.setProperty('--p' + i + '-position-left', '-2vh');
        }
        else if (allplayer[i].position == 'S'){
            css_root.style.setProperty('--p' + i + '-position-top', 'calc(100% + 2vh)');
            css_root.style.setProperty('--p' + i + '-position-left', 'calc(50% - 1vh)');
        }
        else if (allplayer[i].position == 'W'){
            css_root.style.setProperty('--p' + i + '-position-top', 'calc(50% - 1vh)');
            css_root.style.setProperty('--p' + i + '-position-left', 'calc(100% + 2vh)');
        }
        else if (allplayer[i].position == 'N'){
            css_root.style.setProperty('--p' + i + '-position-top', '-2vh');
            css_root.style.setProperty('--p' + i + '-position-left', 'calc(50% - 1vh)');
        }
    }
}
// ------------------------------------------ //
// MAIN PAGE RELATED FUNCTIONS
// ------------------------------------------ //
// Adding event handlers for triggering action sheets
function open_action_sheet(player_index){
    switch(player_index){
        case 1: app.actions.open('.p1-actions'); break;
        case 2: app.actions.open('.p2-actions'); break;
        case 3: app.actions.open('.p3-actions'); break;
        case 4: app.actions.open('.p4-actions'); break;
    }
}
// Event handlers for clicking block
$('.east-block').click(function(){
    open_action_sheet(mapped.E);
})
$('.south-block').click(function(){
    open_action_sheet(mapped.S);
})
$('.west-block').click(function(){
    open_action_sheet(mapped.W);
})
$('.north-block').click(function(){
    open_action_sheet(mapped.N);
})
//Event handler for clicking tie button
$('.tie').on('click', function(){
    app.dialog.create({
        title: '流局',
        text: '請選擇流局時連不連莊',
        buttons: [
            {
                text: '連莊',
                onClick: function(){
                    tie('hold_banker');
                }
            },
            {
                text: '不連莊',
                onClick: function(){
                    tie('pass_banker');
                }
            },
            {
                text: '取消',
                onClick: function(){
                    app.dialog.close();
                },
                color: 'red'
            }
        ],
        verticalButtons: true
    }).open();
});
function create_break_dialog(player_index){
    let dialog_text = allplayer[player_index].name + '：<br>';
    let receiver_index;
    for(i = 1; i<=4; i++){
        if (allplayer[player_index]['sf' + i] > 0 && allplayer[player_index]['sf' + i] % default_setting.break == 0){
            dialog_text += '己被 ' + allplayer[i].name + ' 拉了' + allplayer[player_index]['sf' + i] + '次；總計' + allplayer[player_index]['loseto' + i] + '番<br>';
            receiver_index = i;
            break;
        }
    }
    dialog_text += '<br>是否終止此拉踢？'
    app.dialog.confirm(dialog_text, '中斷拉踢', function(){end_streak(player_index,receiver_index)}, function(){app.dialog.close()});
}
// ------------------------------------------ //
// POPUP RELATED FUNCTIONS
// ------------------------------------------ //
// Starting Modal Functions
function set_money_multiplier(value){ //Check money multiplier input before setting it as value
    let check_value = parseFloat(value);
    if (isNaN(check_value) || check_value <= 0 || check_value == ''){ //Throw toast error if input is invalid
        const money_multiplier_error_toast = app.toast.create({
            text: '設定錯誤！必須為正數！',
            position: 'bottom',
            closeTimeout: 1500,
        });
        money_multiplier_error_toast.open();
    } else {
        $('#start-form input[name="multiplier"]').val(value);
    }
}
function set_break_streak(value){ //Check break streak input before setting it as value
    let check_value = parseInt(value);
    if (isNaN(check_value) || check_value <= 0 || check_value == ''){ //Throw toast error if input is invalid
        const break_streak_error_toast = app.toast.create({
            text: '設定錯誤！必須為正整數！',
            position: 'bottom',
            closeTimeout: 1500,
        });
        break_streak_error_toast.open();
    } else {
        $('#start-form input[name="break_streak"]').val(value);
    }
}
function submit_start_form(){ //Function for handling start form submit
    const start_form = document.getElementById('start-form');
    let start_obj = new Object(); //Put all parameters to an object and submit to main.js for initiating
    start_obj.name_array = [NaN];
    start_obj.name_array.push(start_form.elements['east_name'].value);
    start_obj.name_array.push(start_form.elements['south_name'].value);
    start_obj.name_array.push(start_form.elements['west_name'].value);
    start_obj.name_array.push(start_form.elements['north_name'].value);
    start_obj.multiplier = parseFloat(start_form.elements['multiplier'].value);
    start_obj.break_streak = parseInt(start_form.elements['break_streak'].value);
    start_game(start_obj); //Function from Main.js
    // Call function in main.js here
    app.popup.close('#start-popup');
}
// ------------------------------------------ //
// Functions for InstantGet popup
// ------------------------------------------ //
// Putting the index of selected_player into the top div
function set_instantGet_position(player_selected){
    $('#instantGet-form .card').addClass('none');
    for (i=1; i<=4; i++){
        if (i == player_selected){ //Append selected player into specific position
            $('#p' +i + '_instantGet').removeClass('none');
            $('.instantGet_selected').append($('#p' + i + '_instantGet'));
        } else {
            $('#instantGet_cards').append($('#p' + i + '_instantGet'));
        }
    }
}
// Show number input when others is selected
function instantGet_change(){
    let selected_value = $('input[name="instant-get"]:checked').val();
    if (selected_value == 'others'){
        $('#instantGet-form input[type="number"]').removeClass('none');
        $('#instantGet-form input[type="number"]').focus();
    } else {
        $('#instantGet-form input[type="number"]').addClass('none');
        $('#instantGet-form input[type="number"]').val('');
    }
}
// Function for handling instant get submit format. Then call function in main.js
function submit_instantGet_form(){
    let instantGet_object = new Object();
    for(i=1; i<=4; i++){ //Search for index of selected player
        if($('.instantGet_selected div').hasClass('p' + i + '_card')){
            instantGet_object.selected = i;
            break;
        }
    }
    instantGet_object.value = $('#instantGet-form input[name="instant-get"]:checked').val();
    if (instantGet_object.value == 'others'){
        instantGet_object.value = $('input[name="instantGet_others"]').val();
    }
    instantGet_object.value = parseInt(instantGet_object.value) || 0;
    if (instantGet_object.value == 0){
        const instantGet_error_toast = app.toast.create({
            text: '尚未輸入即收的番數或輸入錯誤，即收番數必須為正整數',
            position: 'bottom',
            closeTimeout: 1500,
        });
        instantGet_error_toast.open();
        return;
    }
    instant_get(instantGet_object.selected, instantGet_object.value);
    app.popup.close('#instantGet-popup');
}
// ------------------------------------------ //
// Functions for InstantPay popup
// ------------------------------------------ //
// Putting the index of selected_player into the top div
function set_instantPay_position(player_selected){
    $('#instantPay-form .card').addClass('none');
    for (x=1; x<=4; x++){
        if (x == player_selected){ //Append selected player into specific position
            $('#p' +x + '_instantPay').removeClass('none');
            $('.instantPay_selected').append($('#p' + x + '_instantPay'));
        } else {
            $('#instantPay_cards').append($('#p' + x + '_instantPay'));
        }
    }
}
// Show number input when others is selected
function instantPay_change(){
    let selected_value = $('input[name="instant-pay"]:checked').val();
    if (selected_value == 'others'){
        $('#instantPay-form input[type="number"]').removeClass('none');
        $('#instantPay-form input[type="number"]').focus();
    } else {
        $('#instantPay-form input[type="number"]').addClass('none');
        $('#instantPay-form input[type="number"]').val('');
    }
}
function submit_instantPay_form(){
    let instantPay_object = new Object();
    for(i=1; i<=4; i++){ //Search for index of selected player
        if($('.instantPay_selected div').hasClass('p' + i + '_card')){
            instantPay_object.selected = i;
            break;
        }
    }
    instantPay_object.value = $('#instantPay-form input[name="instant-pay"]:checked').val();
    if (instantPay_object.value == 'others'){
        instantPay_object.value = $('input[name="instantPay_others"]').val();
    }
    instantPay_object.value = parseInt(instantPay_object.value) || 0;
    if (instantPay_object.value == 0){
        const instantPay_error_toast = app.toast.create({
            text: '尚未輸入即付的番數或輸入錯誤，即收番數必須為正整數',
            position: 'bottom',
            closeTimeout: 1500,
        });
        instantPay_error_toast.open();
        return;
    }
    instant_pay(instantPay_object.selected, instantPay_object.value);
    app.popup.close('#instantPay-popup');
}
// ------------------------------------------ //
// Functions for deal popup
// ------------------------------------------ //
// Putting the index of selected_player into the top div
function set_deal_position(player_selected){
    $('#deal-form input').prop('disabled', false);
    $('#deal-form input').val('');
    let position = 'left';
    for (i=1; i<=4; i++){
        if (i == player_selected){ //Append selected player into specific position
            $('.deal_selected').append($('#p' + i + '_deal'));
            $('.deal_selected .plus_or_minus').text('-');
            $('#p' + i + '_deal_input').prop('disabled', true);
        } else if (position == 'left'){ //Append other players into corresponding positions
            $('.deal_' + position).append($('#p' + i + '_deal'));
            $('.deal_' + position + ' .plus_or_minus').text('+');
            $('#p' + i + '_deal_input').prop('disabled', false)
            position = 'center';
        } else if (position == 'center'){
            $('.deal_' + position).append($('#p' + i + '_deal'));
            $('.deal_' + position + ' .plus_or_minus').text('+');
            $('#p' + i + '_deal_input').prop('disabled', false)
            position = 'right';
        } else {
            $('.deal_' + position).append($('#p' + i + '_deal'));
            $('.deal_' + position + ' .plus_or_minus').text('+');
            $('#p' + i + '_deal_input').prop('disabled', false)
        }
    }
}
// Fill in values automatically in deal popup
function deal_input_actions(){
    let left = parseInt($('.deal_left input').val()) || 0;
    let center = parseInt($('.deal_center input').val()) || 0;
    let right = parseInt($('.deal_right input').val()) || 0;
    let total = 0 + left + center + right;
    $('.deal_selected input').val(total);
}
// Function for handling deal submit format. Then call function in main.js
function submit_deal_form(){
    let deal_object = new Object(); //Create an object for storing index of selected player and array
    deal_object.array = [NaN];
    for(i=1; i<=4; i++){ //Search for index of selected player
        if($('.deal_selected div').hasClass('p' + i + '_card')){
            deal_object.selected = i;
            break;
        }
    }
    for (i=1; i<=4; i++){
        if (i == deal_object.selected){ // When the player is selected player
            if($('#p' + i +'_deal_input').val() == '' || $('#p' + i +'_deal_input').val() == 0){ //Throw error if no input or input = 0
                const deal_error_toast = app.toast.create({
                    text: '尚未輸入勝出玩家所贏的番數！',
                    position: 'bottom',
                    closeTimeout: 1500,
                });
                deal_error_toast.open();
                return;
            }
            else{
                let value = 0 - parseInt($('#p' + i +'_deal_input').val()); //Pass negative value to array for selected player
                deal_object.array.push(value);
            }
        } else {
            let value = parseInt($('#p' + i + '_deal_input').val()) || 0; //Pass 0 as empty value for other players
            deal_object.array.push(value);
        }
    }
    deal(deal_object.selected, deal_object.array); //Call function in main.js for managing deal
    app.popup.close('#deal-popup');
}
// Clear all inputs upon popup close
$('#deal-popup').on('popup:closed', function(){
    $('#deal-form input').val('');
});
// ------------------------------------------ //
// Functions for tsumo popup
// ------------------------------------------ //
// Putting the index of selected_player into the top div
function set_tsumo_position(player_selected){
    $('#tsumo-form input').prop('disabled', false);
    $('#tsumo-form input').val('');
    let position = 'left';
    for (i=1; i<=4; i++){
        if (i == player_selected){ //Append selected player into specific position
            $('.tsumo_selected').append($('#p' + i + '_tsumo'));
            $('.tsumo_selected input').prop('disabled', true);
            $('.tsumo_selected .plus_or_minus').text('+');
        } else if (position == 'left'){ //Append other players into corresponding positions
            $('.tsumo_' + position).append($('#p' + i + '_tsumo'));
            $('.tsumo_' + position + ' .plus_or_minus').text('-');
            $('#p' + i + '_tsumo_input').prop('disabled', false);
            position = 'center';
        } else if (position == 'center'){
            $('.tsumo_' + position).append($('#p' + i + '_tsumo'));
            $('.tsumo_' + position + ' .plus_or_minus').text('-');
            $('#p' + i + '_tsumo_input').prop('disabled', false);
            position = 'right';
        } else {
            $('.tsumo_' + position).append($('#p' + i + '_tsumo'));
            $('.tsumo_' + position + ' .plus_or_minus').text('-');
            $('#p' + i + '_tsumo_input').prop('disabled', false);
        }
    }
}
// Fill in values automatically in tsumo popup
function tsumo_input_actions(){
    let left = parseInt($('.tsumo_left input').val()) || 0;
    let center = parseInt($('.tsumo_center input').val()) || 0;
    let right = parseInt($('.tsumo_right input').val()) || 0;
    let total = 0 + left + center + right;
    $('.tsumo_selected input').val(total);
}
// Function for handling tsumo submit format. Then call function in main.js
function submit_tsumo_form(){
    let tsumo_object = new Object(); //Create an object for storing index of selected player and array
    tsumo_object.array = [NaN];
    for(i=1; i<=4; i++){ //Search for index of selected player
        if($('.tsumo_selected div').hasClass('p' + i + '_card')){
            tsumo_object.selected = i;
            break;
        }
    }
    for (i=1; i<=4; i++){
        if (i != tsumo_object.selected){ // When the player is selected player
            if($('#p' + i +'_tsumo_input').val() == '' || $('#p' + i +'_tsumo_input').val() == 0){ //Throw error if no input or input = 0
                const tsumo_error_toast = app.toast.create({
                    text: '尚未輸入所有非自摸玩家所輸的番數！',
                    position: 'bottom',
                    closeTimeout: 1500,
                });
                tsumo_error_toast.open();
                return;
            }
            else{
                let value = 0 - parseInt($('#p' + i +'_tsumo_input').val()); //Pass negative value to array for unselected player
                tsumo_object.array.push(value);
            }
        } else {
            let value = parseInt($('#p' + i + '_tsumo_input').val()); //Pass value for selected players
            tsumo_object.array.push(value);
        }
    }
    tsumo(tsumo_object.selected, tsumo_object.array);
    app.popup.close('#tsumo-popup');
}
// Clear all inputs upon popup close
$('#tsumo-popup').on('popup:closed', function(){
    $('#tsumo-form input').val('');
});
// ------------------------------------------ //
// SETTINGS RELATED FUNCTIONS
// ------------------------------------------ //
function display_as_money(){
    default_setting.display_as_money = !default_setting.display_as_money;
    app.emit('ui_update');
    app.tab.show('#view-home');
}
// Apply themes
function apply_theme(theme_name){
    let css_root = document.querySelector(':root')
    for ( parameters in themes[theme_name]){
        css_root.style.setProperty(parameters, themes[theme_name][parameters]);
    }
    (themes[theme_name]['is_Dark']) ? $("#app").addClass('dark') : $("#app").removeClass('dark');
    $('#theme_name').text(themes[theme_name]['zh_name']);
}
// Hide Toolbar after entering license page
$(document).on('page:afterin', '.page[data-name="license"]', function(){
    app.toolbar.hide('.toolbar');
});
// Show Toolbar when entering license page
$(document).on('page:afterout','.page[data-name="license"]', function(){
    app.toolbar.show('.toolbar');
});
// Hide Toolbar after entering license page
$(document).on('page:afterin', '.page[data-name="import"]', function(){
    $('textarea').focus();
    app.toolbar.hide('.toolbar');
    $('.import-submit').click(function(){
        console.log('clicked');// Add submit function
    });
});
// Show Toolbar when entering license page
$(document).on('page:afterout','.page[data-name="import"]', function(){
    app.toolbar.show('.toolbar');
});
// Dump logs before show log popup
$(document).on('popup:open', '.log-popup', function(){
    let append_log = ''
    $('.log-popup .log').remove();
    for(i = 0; i < game_log.length; i++){
        game_log[i].removed ? append_log += '<tr><td class="log align-text-center removed">' + game_log[i].timestamp + '</td><td class="log removed">' + game_log[i].message + '</td></tr>' :
        append_log += '<tr><td class="log align-text-center">' + game_log[i].timestamp + '</td><td class="log">' + game_log[i].message + '</td></tr>';
        $('#log_table').html(append_log);
    }
})
// Function for handling prompt of removal of data
function remove_data_prompt(){
    app.dialog.confirm('清除資料會影響現時設置及遊戲，確定要清除？', function(){
        // TODO: Add function for removal of data here
        console.log('Remove confirmed');
    })
}
