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
        '--p3-color': '#ff79c6',
        '--p4-color': '#f1fa8c',
        '--bg-nord': '#282a36',
        '--fg-nord': '#f8f8f2',
        '--f7-theme-color': '#bd93f9',
        '--f7-theme-color-rgb': '189, 147, 249',
        '--f7-theme-color-shade': '#a56cf7',
        '--f7-theme-color-tint': '#d5bafb',
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
let undo_count = 0;
let show_adjustment_form = false;
let balance_chart;
let summary_chart;
let isFirefox = typeof InstallTrigger !== 'undefined';
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
            (allplayer[i].unrealized == 0) ? $(`.p${i}_balance`).text(`$${display_balance}`):
            (allplayer[i].unrealized > 0) ? $(`.p${i}_balance`).text(`$${display_balance} (+$${unrealized_balance})`) :
            $(`.p${i}_balance`).text(`$${display_balance} ($${unrealized_balance})`);
            $('#setting_switch').text('切換為番');
        } else {
            (allplayer[i].unrealized == 0) ? $(`.p${i}_balance`).text(allplayer[i].balance):
            (allplayer[i].unrealized > 0) ? $(`.p${i}_balance`).text(`${allplayer[i].balance} (+${allplayer[i].unrealized})`) :
            $(`.p${i}_balance`).text(`${allplayer[i].balance} (${allplayer[i].unrealized})`);
            $('#setting_switch').text('切換為錢');
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
                    default: console.error('Error while applying streak warning sign: Unknown case');
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
                case 'E': $('#east').addClass('banker_block'); (gamestat.streak > 0) ? $('#east').html(`<h1>${gamestat.streak}</h1>`):null; break;
                case 'S': $('#south').addClass('banker_block'); (gamestat.streak > 0) ? $('#south').html(`<h1>${gamestat.streak}</h1>`):null; break;
                case 'W': $('#west').addClass('banker_block'); (gamestat.streak > 0) ? $('#west').html(`<h1>${gamestat.streak}</h1>`):null; break;
                case 'N': $('#north').addClass('banker_block'); (gamestat.streak > 0) ? $('#north').html(`<h1>${gamestat.streak}</h1>`):null; break;
                default: console.error('Error while adding banker animation: Unknown case');
            }
        }
        // Fill player statistics
        $(`.p${i}-win`).text(allplayer[i].win);
        $(`.p${i}-lose`).text(allplayer[i].lose);
        $(`.p${i}-tsumo`).text(allplayer[i].tsumo);
        $(`.p${i}-deal-lose`).text(allplayer[i].deal_lose);
        $(`.p${i}-instant-get`).text(allplayer[i].instant_get);
        $(`.p${i}-instant-pay`).text(allplayer[i].instant_pay);
        $(`.p${i}-max-yaku`).text(allplayer[i].max_yaku);
        $(`.p${i}-max-streak`).text(allplayer[i].max_streak);
        (parseInt(gamestat.round) > 1) ? $(`.p${i}-win-ratio`).text(round_to_1_dec(parseInt(allplayer[i].win) / parseInt(gamestat.round-1) * 100 )+ '%'): null;
        (parseInt(gamestat.round) > 1) ? $(`.p${i}-lose-ratio`).text(round_to_1_dec(parseInt(allplayer[i].lose) / parseInt(gamestat.round-1) * 100 )+ '%'): null;
        (parseInt(gamestat.tsumo) > 0) ? $(`.p${i}-tsumo-ratio`).text(round_to_1_dec(parseInt(allplayer[i].tsumo) / parseInt(gamestat.tsumo) * 100 )+ '%'): null;
        (parseInt(gamestat.deal) > 0) ? $(`.p${i}-deal-lose-ratio`).text(round_to_1_dec(parseInt(allplayer[i].deal_lose) / parseInt(gamestat.deal) * 100 )+ '%'): null;
        (parseInt(gamestat.instant_get) > 0) ? $(`.p${i}-instant-get-ratio`).text(round_to_1_dec(parseInt(allplayer[i].instant_get) / parseInt(gamestat.instant_get) * 100 )+ '%'): null;
        (parseInt(gamestat.instant_pay) > 0) ? $(`.p${i}-instant-pay-ratio`).text(round_to_1_dec(parseInt(allplayer[i].instant_pay) / parseInt(gamestat.instant_pay) * 100 )+ '%'): null;

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
        default: console.error('Error while applying round text: Unknown case');
    }
    switch (gamestat.round_prevailing % 4){
        case 0: round_prevailing_text += '北'; break;
        case 1: round_prevailing_text += '東'; break;
        case 2: round_prevailing_text += '南'; break;
        case 3: round_prevailing_text += '西'; break;
        default: console.error('Error while applying round text: Unknown case');
    }
    $('#round_counter').text(round_prevailing_text);
    // Add banker class to respective player cards;
    $('.p1_card, .p2_card, .p3_card, .p4_card').removeClass('banker');
    $('.p' + mapped[gamestat.banker] + '_card').addClass('banker');
    // Control undo, redo buttons;
    ( undo_count == 0 ) ? $('#redo').prop('disabled', true):$('#redo').prop('disabled', false);
    ( undo_count >= fulldata_JSON.length - 1) ? $('#undo').prop('disabled', true): $('#undo').prop('disabled', false);
    // Fill Game Record
    let game_record_append = ''
    for (i=game_record.length - 1; i>= 1; i--){
        if(game_record[i].length == 5){
            game_record_append += `<tr><td>${i}</td>
                                        <td>${game_record[i][1]}</td>
                                        <td>${game_record[i][2]}</td>
                                        <td>${game_record[i][3]}</td>
                                        <td>${game_record[i][4]}</td></tr>`
        } else {
            game_record_append += `<tr><td>${i}</td><td colspan="4">流局</td></tr>`;
        }
    }
    $('#game_record').html(game_record_append);
    // Fill tds in game stats
    $('.round_raw').text(gamestat.round - 1);
    $('.draw_raw').text(gamestat.tie);
    $('.deal_raw').text(gamestat.deal);
    $('.tsumo_raw').text(gamestat.tsumo);
    $('.instantGet_raw').text(gamestat.instant_get);
    $('.instantPay_raw').text(gamestat.instant_pay);
    $('.avg_yaku_raw').text(gamestat.avg_yaku);
    $('.max_yaku_raw').text(gamestat.max_yaku);
    $('.max_streak_raw').text(gamestat.max_streak);
    $('.total_yaku_raw').text(gamestat.total_change);
    $('.double_raw').text(gamestat.double_winner);
    $('.triple_raw').text(gamestat.triple_winner);
    // Only fill ratios when round > 1 to prevent NaN
    if (gamestat.round > 1){
        $('.draw_ratio').text(round_to_2_dec((gamestat.tie / (gamestat.round - 1)) * 100) + '%');
        $('.deal_ratio').text(round_to_2_dec((gamestat.deal / (gamestat.round - 1)) * 100 )+ '%');
        $('.tsumo_ratio').text(round_to_2_dec((gamestat.tsumo / (gamestat.round - 1)) * 100) + '%');
        $('.double_ratio').text(round_to_2_dec((gamestat.double_winner / (gamestat.round - 1)) * 100) + '%');
        $('.triple_ratio').text(round_to_2_dec((gamestat.triple_winner / (gamestat.round - 1)) * 100) + '%');
    }
    // Create or update chart
    try{
        let chart_canvas = $('#stat-chart')[0].getContext('2d');
        if (chart_created){
            balance_chart.data = new chart_config(true).data
            balance_chart.update('none'); //No animation with 'none'
        } else {
            chart_created = true;
            balance_chart = new Chart( chart_canvas, new chart_config(true));
        }
    } catch (err){
        (!isFirefox) ? catch_error(err): null;
    }
    // Show Summary popup if game is marked as ended
    if (gamestat.ended){
        app.popup.open('#summary-popup');
        fill_summary();
    }
});
function catch_error(message){
    app.toast.create({
        text: message,
        position: 'bottom',
        closeTimeout: 2500,
    }).open();
}
// ------------------------------------------ //
// Auto Run Functions
// ------------------------------------------ //
app.on('pageInit', function(){ // Add event listeners for all pages
    try{
        app.emit('ui_update')
    } catch {}
    $('.quick-actions .actions-button').on('click', function(){ //Event listeners for closing actions after click
        app.actions.close();
    });
})

$('.quick-actions .actions-button').on('click', function(){
    app.actions.close();
})
window.onload = () => {
    if(load()){
        let now = new Date();
        let days_since_last_save = Math.abs(now - Date.parse(gamestat.last_save)) / (1000 * 3600 * 24);
        if (days_since_last_save > 2){
            app.dialog.confirm(
                '上一次存取記錄已是' + Math.floor(days_since_last_save) + '日前<br>是否清除資料並開始開局？',
                '清除資料',
                function(){localStorage.removeItem('data');location.reload();});
        }
        map_players();
        fill_names();
        app.emit('ui_update');
        fulldata_JSON.unshift(JSON.stringify(data));
        apply_theme(default_setting.theme);
        app.preloader.hide();
    } else {
        app.popup.open('#start-popup');
        $('#start-popup input[name="multiplier"]').val(default_setting.money);
        $('#start-popup input[name="break_streak"]').val(default_setting.break);
        apply_theme(default_setting.theme);
        app.preloader.hide();
    }
}

// ------------------------------------------ //
// Starting RELATED FUNCTIONS
// ------------------------------------------ //
// Starting Modal Functions
function fill_names(){
    // Remove all Classes first
    $('#table h3').removeClass('p1_name');
    $('#table h3').removeClass('p2_name');
    $('#table h3').removeClass('p3_name');
    $('#table h3').removeClass('p4_name');
    $('#table h3').removeClass('p1_balance');
    $('#table h3').removeClass('p2_balance');
    $('#table h3').removeClass('p3_balance');
    $('#table h3').removeClass('p4_balance');
    $('#table div').removeClass('p1_bg');
    $('#table div').removeClass('p2_bg');
    $('#table div').removeClass('p3_bg');
    $('#table div').removeClass('p4_bg');
    $('#table div').removeClass('p1_action');
    $('#table div').removeClass('p2_action');
    $('#table div').removeClass('p3_action');
    $('#table div').removeClass('p4_action');
    // Add classes correspondingly
    $('#N-text').addClass(`p${mapped.N}_name`);
    $('#N-text2').addClass(`p${mapped.N}_balance`);
    $('#north').addClass(`p${mapped.N}_bg`);
    $('#E-text').addClass(`p${mapped.E}_name`);
    $('#E-text2').addClass(`p${mapped.E}_balance`);
    $('#east').addClass(`p${mapped.E}_bg`);
    $('#S-text').addClass(`p${mapped.S}_name`);
    $('#S-text2').addClass(`p${mapped.S}_balance`);
    $('#south').addClass(`p${mapped.S}_bg`);
    $('#W-text').addClass(`p${mapped.W}_name`);
    $('#W-text2').addClass(`p${mapped.W}_balance`);
    $('#west').addClass(`p${mapped.W}_bg`);
    $('.north-block').addClass(`p${mapped.N}_action`);
    $('.east-block').addClass(`p${mapped.E}_action`);
    $('.south-block').addClass(`p${mapped.S}_action`);
    $('.west-block').addClass(`p${mapped.W}_action`);
    let css_root = document.querySelector(':root');
    for (i=1; i<=4; i++){ //Set position in css for animations
        if (allplayer[i].position == 'E'){
            css_root.style.setProperty(`--p${i}-position-top`, 'calc(50% - 1vh)');
            css_root.style.setProperty(`--p${i}-position-left`, '-2vh');
        }
        else if (allplayer[i].position == 'S'){
            css_root.style.setProperty(`--p${i}-position-top`, 'calc(100% + 2vh)');
            css_root.style.setProperty(`--p${i}-position-left`, 'calc(50% - 1vh)');
        }
        else if (allplayer[i].position == 'W'){
            css_root.style.setProperty(`--p${i}-position-top`, 'calc(50% - 1vh)');
            css_root.style.setProperty(`--p${i}-position-left`, 'calc(100% + 2vh)');
        }
        else if (allplayer[i].position == 'N'){
            css_root.style.setProperty(`--p${i}-position-top`, '-2vh');
            css_root.style.setProperty(`--p${i}-position-left`, 'calc(50% - 1vh)');
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
        default: console.error('Error while opening player action sheet: Unknown case');
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
                    app.dialog.close();
                }
            },
            {
                text: '不連莊',
                onClick: function(){
                    tie('pass_banker');
                    app.dialog.close();
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
    let dialog_text = `${allplayer[player_index].name}：<br>`;
    let receiver_index;
    for(i = 1; i<=4; i++){
        if (allplayer[player_index]['sf' + i] > 0 && allplayer[player_index]['sf' + i] % default_setting.break == 0){
            dialog_text += `己被 ${allplayer[i].name} 拉了${allplayer[player_index]['sf' + i]}次；總計${allplayer[player_index]['loseto' + i]}番<br>`;
            receiver_index = i;
            break;
        }
    }
    dialog_text += '<br>是否終止此拉踢？'
    app.dialog.confirm(dialog_text, '中斷拉踢', function(){end_streak(player_index,receiver_index)}, function(){app.dialog.close()});
}

function mark_ended(boolean){
    msg = ''
    gamestat.ended = boolean;
    (boolean) ? msg = '遊戲被設定為已完結' : msg = '遊戲被設定為未完結';
    add_log(msg);
    app.emit('data_change');
}
// ------------------------------------------ //
// POPUP RELATED FUNCTIONS
// ------------------------------------------ //
// Starting Modal Functions
function set_money_multiplier(value){ //Check money multiplier input before setting it as value
    let check_value = parseFloat(value);
    if (isNaN(check_value) || check_value <= 0 || check_value == ''){ //Throw toast error if input is invalid
        catch_error('設定錯誤！必須為正數！');
    } else if (check_value > 1000){
        catch_error('最大數為1000，請重新設定');
    } else {
        $('#start-form input[name="multiplier"]').val(value);
    }
}
function set_break_streak(value){ //Check break streak input before setting it as value
    let check_value = parseInt(value);
    if (check_value == -1){
        $('#start-form input[name="break_streak"]').val(check_value);
    }else if (isNaN(check_value) || check_value <= 0 || check_value == ''){ //Throw toast error if input is invalid
        catch_error('設定錯誤！必須為正整數！');
    } else {
        $('#start-form input[name="break_streak"]').val(check_value);
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
    start_obj.break_streak = start_form.elements['break_streak'].value == -1 ? Infinity : parseInt(start_form.elements['break_streak'].value);
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
            $(`#p${i}_instantGet`).removeClass('none');
            $('.instantGet_selected').append($(`#p${i}_instantGet`));
        } else {
            $('#instantGet_cards').append($(`#p${i}_instantGet`));
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
        if($('.instantGet_selected div').hasClass(`p${i}_card`)){
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
        catch_error('尚未輸入即收的番數或輸入錯誤，即收番數必須為正整數');
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
    for (i=1; i<=4; i++){
        if (i == player_selected){ //Append selected player into specific position
            $(`#p${i}_instantPay`).removeClass('none');
            $('.instantPay_selected').append($(`#p${i}_instantPay`));
        } else {
            $('#instantPay_cards').append($(`#p${i}_instantPay`));
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
        if($('.instantPay_selected div').hasClass(`p${i}_card`)){
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
        catch_error('尚未輸入即付的番數或輸入錯誤，即收番數必須為正整數')
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
            $('.deal_selected').append($(`#p${i}_deal`));
            $('.deal_selected .plus_or_minus').text('-');
            $(`#p${i}_deal_input`).prop('disabled', true);
        } else if (position == 'left'){ //Append other players into corresponding positions
            $(`.deal_${position}`).append($(`#p${i}_deal`));
            $(`.deal_${position} .plus_or_minus`).text('+');
            $(`#p${i}_deal_input`).prop('disabled', false)
            position = 'center';
        } else if (position == 'center'){
            $(`.deal_${position}`).append($(`#p${i}_deal`));
            $(`.deal_${position} .plus_or_minus`).text('+');
            $(`#p${i}_deal_input`).prop('disabled', false)
            position = 'right';
        } else {
            $(`.deal_${position}`).append($(`#p${i}_deal`));
            $(`.deal_${position} .plus_or_minus`).text('+');
            $(`#p${i}_deal_input`).prop('disabled', false)
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
        if($('.deal_selected div').hasClass(`p${i}_card`)){
            deal_object.selected = i;
            break;
        }
    }
    for (i=1; i<=4; i++){
        if (i == deal_object.selected){ // When the player is selected player
            if($(`#p${i}_deal_input`).val() == '' || $(`#p${i}_deal_input`).val() == 0){ //Throw error if no input or input = 0
                catch_error('尚未輸入勝出玩家所贏的番數！');
                return;
            }
            else{
                let value = 0 - parseInt($(`#p${i}_deal_input`).val()); //Pass negative value to array for selected player
                deal_object.array.push(value);
            }
        } else {
            let value = parseInt($(`#p${i}_deal_input`).val()) || 0; //Pass 0 as empty value for other players
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
            $('.tsumo_selected').append($(`#p${i}_tsumo`));
            $('.tsumo_selected input').prop('disabled', true);
            $('.tsumo_selected .plus_or_minus').text('+');
        } else if (position == 'left'){ //Append other players into corresponding positions
            $(`.tsumo_${position}`).append($(`#p${i}_tsumo`));
            $(`.tsumo_${position} .plus_or_minus`).text('-');
            $(`#p${i}_tsumo_input`).prop('disabled', false);
            position = 'center';
        } else if (position == 'center'){
            $(`.tsumo_${position}`).append($(`#p${i}_tsumo`));
            $(`.tsumo_${position} .plus_or_minus`).text('-');
            $(`#p${i}_tsumo_input`).prop('disabled', false);
            position = 'right';
        } else {
            $(`.tsumo_${position}`).append($(`#p${i}_tsumo`));
            $(`.tsumo_${position} .plus_or_minus`).text('-');
            $(`#p${i}_tsumo_input`).prop('disabled', false);
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
        if($('.tsumo_selected div').hasClass(`p${i}_card`)){
            tsumo_object.selected = i;
            break;
        }
    }
    for (i=1; i<=4; i++){
        if (i != tsumo_object.selected){ // When the player is selected player
            if($(`#p${i}_tsumo_input`).val() == '' || $(`#p${i}_tsumo_input`).val() == 0){ //Throw error if no input or input = 0
                catch_error('尚未輸入所有非自摸玩家所輸的番數！');
                return;
            }
            else{
                let value = 0 - parseInt($(`#p${i}_tsumo_input`).val()); //Pass negative value to array for unselected player
                tsumo_object.array.push(value);
            }
        } else {
            let value = parseInt($(`#p${i}_tsumo_input`).val()); //Pass value for selected players
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
// Functions for Summary popup
// ------------------------------------------ //
function fill_summary(){
    let rank_html = '';
    let summary = {
        max_yaku: {},
        tsumo: {},
        defend: {},
        instantGet: {},
        instantPay: {},
        maxStreak: {},
        win: {},
        passerBy: {}
    };
    let summary_allplayer = JSON.parse(JSON.stringify(allplayer));// Use deep copy for nested array
    summary_allplayer.splice(0, 1);
    for (i = 0; i <=3 ; i++){ //Add unrealized into balance for all players
        summary_allplayer[i].balance += summary_allplayer[i].unrealized;
        summary_allplayer[i].money = round_to_2_dec(summary_allplayer[i].balance * default_setting.money);
    }
    summary_allplayer.sort((a, b) => b.balance - a.balance); // Sort all players by balance

    // Generate milestones for all players
    // Max_yaku first
    summary.max_yaku.map = summary_allplayer.map(x => x.max_yaku);
    summary.max_yaku.max = Math.max(...summary.max_yaku.map);
    summary.max_yaku.index = mapped[summary_allplayer[summary.max_yaku.map.indexOf(summary.max_yaku.max)].position];
    // Tsumo
    summary.tsumo.map = summary_allplayer.map(x => x.tsumo);
    summary.tsumo.max = Math.max(...summary.tsumo.map);
    summary.tsumo.index = mapped[summary_allplayer[summary.tsumo.map.indexOf(summary.tsumo.max)].position];
    // Defend
    summary.defend.map = summary_allplayer.map(x => x.deal_lose);
    summary.defend.max = Math.min(...summary.defend.map);
    summary.defend.index = mapped[summary_allplayer[summary.defend.map.indexOf(summary.defend.max)].position];
    // InstantGet
    summary.instantGet.map = summary_allplayer.map(x => x.instant_get);
    summary.instantGet.max = Math.max(...summary.instantGet.map);
    summary.instantGet.index = mapped[summary_allplayer[summary.instantGet.map.indexOf(summary.instantGet.max)].position];
    // InstantPay
    summary.instantPay.map = summary_allplayer.map(x => x.instant_pay);
    summary.instantPay.max = Math.max(...summary.instantPay.map);
    summary.instantPay.index = mapped[summary_allplayer[summary.instantPay.map.indexOf(summary.instantPay.max)].position];
    // Max_streak
    summary.maxStreak.map = summary_allplayer.map(x => x.max_streak);
    summary.maxStreak.max = Math.max(...summary.maxStreak.map);
    summary.maxStreak.index = mapped[summary_allplayer[summary.maxStreak.map.indexOf(summary.maxStreak.max)].position];
    // Win
    summary.win.map = summary_allplayer.map(x => x.win);
    summary.win.max = Math.max(...summary.win.map);
    summary.win.index = mapped[summary_allplayer[summary.win.map.indexOf(summary.win.max)].position];
    // PasserBy
    summary.passerBy.map = summary_allplayer.map(x => parseInt(x.deal_lose) + parseInt(x.win));
    summary.passerBy.max = Math.min(...summary.passerBy.map);
    summary.passerBy.index = mapped[summary_allplayer[summary.passerBy.map.indexOf(summary.passerBy.max)].position];
    for (i = 0; i <= 3; i++){
        rank_html += `<h2 class="col-40 text-align-center p${mapped[summary_allplayer[i]['position']]}_rank_name">${summary_allplayer[i].name}</h2>
                    <h2 class="col-20 p${mapped[summary_allplayer[i]['position']]}_rank">${summary_allplayer[i].balance}</h2>
                    <h2 class="col-40 p${mapped[summary_allplayer[i]['position']]}_rank">(＄${summary_allplayer[i].money})</h2>`;
    }

    $('#summary-rank').html(rank_html);
    $('.summary-max-yaku-name').text(allplayer[summary.max_yaku.index].name);
    $('.summary-max-yaku-value').text(summary.max_yaku.max);
    $('.summary-tsumo-name').text(allplayer[summary.tsumo.index].name);
    $('.summary-tsumo-value').text(summary.tsumo.max);
    $('.summary-defend-name').text(allplayer[summary.defend.index].name);
    $('.summary-defend-value').text(summary.defend.max);
    $('.summary-instantGet-name').text(allplayer[summary.instantGet.index].name);
    $('.summary-instantGet-value').text(summary.instantGet.max);
    $('.summary-instantPay-name').text(allplayer[summary.instantPay.index].name);
    $('.summary-instantPay-value').text(summary.instantPay.max);
    $('.summary-maxStreak-name').text(allplayer[summary.maxStreak.index].name);
    $('.summary-maxStreak-value').text(summary.maxStreak.max);
    $('.summary-win-name').text(allplayer[summary.win.index].name);
    $('.summary-win-value').text(summary.win.max);
    $('.summary-passerBy-name').text(allplayer[summary.passerBy.index].name);
    $('.summary-passerBy-value').text(summary.passerBy.max);
    // Create chart in summary
    try{
        let chart_canvas = $('#summary-chart')[0].getContext('2d');
        summary_chart = new Chart( chart_canvas, new chart_config(true));
    } catch(err){}
};
$('#summary-popup').on('popup:close', function(){
    try{
        summary_chart.destroy();
    } catch(err){}
});
// ------------------------------------------ //
// SETTINGS RELATED FUNCTIONS
// ------------------------------------------ //
// Function for undo
function undo(){
    undo_count += 1;
    let data = JSON.parse(fulldata_JSON[undo_count]);
    allplayer = data.allplayer;
    gamestat = data.gamestat;
    game_record = data.game_record;
    game_log[undo_count - 1].removed = true;
    app.emit('ui_update');
}
//  Function for redo
function redo(){
    undo_count -= 1;
    let data = JSON.parse(fulldata_JSON[undo_count]);
    allplayer = data.allplayer;
    gamestat = data.gamestat;
    game_record = data.game_record;
    game_log[undo_count].removed = false;
    app.emit('ui_update');
}
// Changing display between money and score
function display_as_money(){
    default_setting.display_as_money = !default_setting.display_as_money;
    app.emit('ui_update');
    app.tab.show('#view-home');
}
// Apply themes
function apply_theme(theme_name){
    default_setting.theme = theme_name; // Set default setting to theme name which will persists after refresh
    let css_root = document.querySelector(':root')
    for ( parameters in themes[theme_name]){
        css_root.style.setProperty(parameters, themes[theme_name][parameters]);
    }
    (themes[theme_name]['is_Dark']) ? $("#app").addClass('dark') : $("#app").removeClass('dark');
    $('#theme_name').text(themes[theme_name]['zh_name']);
    app.emit('setting_change');
}
// Fill names before entering rename page{
$(document).on('page:beforein', '.page[data-name="rename"]',function(){
    app.emit('ui_update');
});
// Functions for change seat pages
function display_custom(seat_boolean){ //Show seats when custom is selected
    if (seat_boolean){
        $('.custom-seat-east').removeClass('none');
        $('#seat-form button[type="submit"]').addClass('none');
        let append_html = '';
        for (i=1; i<=4; i++){
            append_html += `
            <li>
                <label class="item-radio item-radio-icon-start item-content">
                    <input type="radio" name="seat-east" value="${i}" onclick="east_trigger()"/>
                    <i class="icon icon-radio"></i>
                    <div class="item-inner">
                        <div class="item-title">${allplayer[i].name}</div>
                    </div>
                </label>
            </li>
            `
        }
        $('.radio-east').html(append_html);
    }
    else {
        $('.custom-seat-east, .custom-seat-south, .custom-seat-north').addClass('none')
        $('#seat-form button[type="submit"]').removeClass('none');
    }
}
function east_trigger(){
    $('.custom-seat-south').removeClass('none');
    $('.custom-seat-west, .custom-seat-north').addClass('none');
    $('#seat-form button[type="submit"]').addClass('none');
    let append_html = '';
    for (i=1; i<=4; i++){
        ( i != $('input[name="seat-east"]:checked').val()) ? append_html +=  `
        <li>
            <label class="item-radio item-radio-icon-start item-content">
                <input type="radio" name="seat-south" value="${i}" onclick="south_trigger()"/>
                <i class="icon icon-radio"></i>
                <div class="item-inner">
                    <div class="item-title">${allplayer[i].name}</div>
                </div>
            </label>
        </li>
        ` : null;
    }
    $('.radio-south').html(append_html);
}
function south_trigger(){
    $('.custom-seat-west').removeClass('none');
    $('.custom-seat-north').addClass('none');
    $('#seat-form button[type="submit"]').addClass('none');
    let append_html = '';
    for (i=1; i<=4; i++){
        ( i != $('input[name="seat-east"]:checked').val() && i != $('input[name="seat-south"]:checked').val()) ? append_html +=  `
        <li>
            <label class="item-radio item-radio-icon-start item-content">
                <input type="radio" name="seat-west" value="${i}" onclick="west_trigger()"/>
                <i class="icon icon-radio"></i>
                <div class="item-inner">
                    <div class="item-title">${allplayer[i].name}</div>
                </div>
            </label>
        </li>
        ` : null;
    }
    $('.radio-west').html(append_html);
}
function west_trigger(){
    $('.custom-seat-north').removeClass('none');
    $('#seat-form button[type="submit"]').addClass('none');
    let append_html = '';
    for (i=1; i<=4; i++){
        ( i != $('input[name="seat-east"]:checked').val() && i != $('input[name="seat-south"]:checked').val() && i != $('input[name="seat-west"]:checked').val()) ? append_html +=  `
        <li>
            <label class="item-radio item-radio-icon-start item-content">
                <input type="radio" name="seat-north" value="${i}" onclick="north_trigger()"/>
                <i class="icon icon-radio"></i>
                <div class="item-inner">
                    <div class="item-title">${allplayer[i].name}</div>
                </div>
            </label>
        </li>
        ` : null;
    }
    $('.radio-north').html(append_html);
}
function north_trigger(){
    $('#seat-form button[type="submit"]').removeClass('none');
}
// Hide Toolbar after entering license page
$(document).on('page:afterin', '.page[data-name="license"]', function(){
    app.toolbar.hide('.toolbar');
});
// Show Toolbar when entering license page
$(document).on('page:afterout','.page[data-name="license"]', function(){
    app.toolbar.show('.toolbar');
});
// Hide Toolbar after entering import page
$(document).on('page:afterin', '.page[data-name="import"]', function(){
    $('textarea').focus();
    app.toolbar.hide('.toolbar');
});
// Show Toolbar when exiting import page
$(document).on('page:afterout','.page[data-name="import"]', function(){
    app.toolbar.show('.toolbar');
});
// Function for Validating import
function validate_import(){
    try{
        temp_data = JSON.parse($('#import-json').val());
        let import_summary = '將匯入的資料如下：<br><br>'
        import_summary += '第' + temp_data.gamestat.round + '局：<br>';
        for (i=1; i<=4; i++){
            import_summary += temp_data.allplayer[i].name + ' ： ' + temp_data.allplayer[i].balance + '(' + temp_data.allplayer[i].unrealized + ')<br>';
        }
        import_summary += '<br>匯入資料後，現時的遊遊資料將會被覆蓋<br>確定要匯入嗎？'
        app.dialog.confirm(import_summary, '匯入資料', function(){import_data(temp_data)}, function(){null});
    }catch(err){
        catch_error(err);
    }
}
// Dump logs before show log popup
$(document).on('popup:open', '.log-popup', function(){
    let append_log = ''
    $('.log-popup .log').remove();
    for(i = 0; i < game_log.length; i++){
        game_log[i].removed ? append_log += '<tr><td class="log text-align-center removed">' + game_log[i].timestamp + '</td><td class="log removed">' + game_log[i].message + '</td></tr>' :
        append_log += '<tr><td class="log text-align-center">' + game_log[i].timestamp + '</td><td class="log">' + game_log[i].message + '</td></tr>';
        $('#log_table').html(append_log);
    }
})
// Function for creating elements for file_download
function download(filename, path){
    let element = document.createElement('a');
    element.setAttribute('href', path);
    element.setAttribute('download', filename);
    element.click();
}
// Function for export to clipboard
function export_to_clipboard(){
    navigator.clipboard.writeText(fulldata_JSON[0]);
    $('.export_tick.f7-icons').text('checkmark');
    $('.export_tick.material-icons').text('done');
    $('.export_text').text('已匯出至剪貼簿');
    setTimeout(function(){
        $('.export_tick.f7-icons').text('doc_on_clipboard_fill');
        $('.export_tick.material-icons').text('integration_instructions');
        $('.export_text').text('匯出：複制到剪貼簿');
    }, 2500);
}
// Function export to JSON
function export_to_json(){
    const data = fulldata_JSON[0];
    const blob = new Blob([data], {type: 'application/json'});
    const path = URL.createObjectURL(blob);
    let timestamp = new Date();
    let filename = 'Twmj-' + timestamp.getDate().toString().padStart(2, 0) + '-' + (timestamp.getMonth() + 1).toString().padStart(2, 0);
    download(filename, path);
}
// Functions for manual adjustment
$(document).on('popup:open', '#adjust-popup', function(){
    app.emit('adjust_change');
});
// Function for filling actions upon adjustment change
app.on('adjust_change', function(){
    let adjust_html = ''
    if ( manual_adjust_array.length == 0 ){
        adjust_html = '<li><div class="item-content"><div class="item-inner"><div class="item-title">尚未有行動</div></div></div></li>'
    } else {
        for (i = 0; i < manual_adjust_array.length; i++){
            let player_name = allplayer[manual_adjust_array[i]['player_index']].name;
            let action_text = ( manual_adjust_array[i]['action'] == 'add' ) ? ' 增加' : ( manual_adjust_array[i]['action'] == 'minus' ) ? ' 減少' : ( manual_adjust_array[i]['action'] == 'equal' ) ? ' 的番數設定為' : null;
            let adjust_message = player_name + action_text + manual_adjust_array[i].value + '番';
            adjust_html += '<li><div class="item-content"><div class="item-media"><button class="button" href="#"  onclick="remove_adjust(' + i + ')"><i class="f7-icons if-not-md">xmark</i><i class="material-icons md-only">close</i></button></div><div class="item-inner"><div class="item-title">' + adjust_message + '</div></div></div></li>';
        }
    }
    $('#adjust-actions').html(adjust_html);
});
// Function for removing actions from manual adjustment array
function remove_adjust(index){
    manual_adjust_array.splice(index, 1);
    app.emit('adjust_change');
}
// Handle UI for adjustment popup
function toggle_adjustment_form(){
    show_adjustment_form = !show_adjustment_form;
    if(show_adjustment_form){
        $('#adjust-add-buttons').addClass('none');
        $('#adjust-add-form').removeClass('none');
    } else{
        $('#adjust-add-buttons').removeClass('none');
        $('#adjust-add-form').addClass('none');
    }
}
// Function for handling the submit of adjustment format
function submit_adjust_form(){
    let adjust_obj = new Object;
    adjust_obj.player_index = $('input[name="adjust-player"]:checked').val();
    adjust_obj.action = $('input[name="adjust-action"]:checked').val();
    adjust_obj.value = $('input[name="adjust-value"]').val();
    manual_adjust_array.push(adjust_obj);
    app.emit('adjust_change');
    $('#adjust-popup form')[0].reset();
    toggle_adjustment_form();
}
