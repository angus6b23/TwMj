// Constant for theme_select
const theme = { //Object for themes
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
    Tomorrow_night:{
        '--p1-color': '#cc6666',
        '--p2-color': '#f0c674',
        '--p3-color': '#8abeb7',
        '--p4-color': '#b294bb',
        '--bg-nord': '#1d1f21',
        '--fg-nord': '#c5c8c6',
        '--highlight': '#969896'
    },
    Tomorrow:{
        '--p1-color': '#c82829',
        '--p2-color': '#eab700',
        '--p3-color': '#3e999f',
        '--p4-color': '#8959a8',
        '--bg-nord': '#ffffff',
        '--fg-nord': '#4d4d4c',
        '--highlight': '#8e908c'
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

// ------------------------------------------ //
// POPUP RELATED FUNCTIONS
// ------------------------------------------ //
// Starting Modal Functions
function set_money_multiplier(value){ //Check money multiplier input before setting it as value
    let check_value = parseFloat(value);
    console.log(check_value);
    if (isNaN(check_value) || check_value <= 0 || check_value == ''){
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
    console.log(check_value);
    if (isNaN(check_value) || check_value <= 0 || check_value == ''){
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
    start_obj.name_array.push(start_form.elements['east_name']);
    start_obj.name_array.push(start_form.elements['south_name']);
    start_obj.name_array.push(start_form.elements['west_name']);
    start_obj.name_array.push(start_form.elements['north_name']);
    start_obj.multiplier = start_form.elements['multiplier'];
    start_obj.break_streak = start_form.elements['break_streak'];
    console.log(start_obj);
    // Call function in main.js here
    app.popup.close('#start-popup')
}
// Function for positioning different player in deal popup
// Putting the index of selected_player into the top div
function set_deal_position(player_selected){
    $('#deal-form input').prop('disabled', false);
    let position = 'left';
    for (x=1; x<=4; x++){
        if (x == player_selected){ //Append selected player into specific position
            $('.deal_selected').append($('#p' + x + '_deal'));
            $('.deal_selected input').prop('disabled', true);
            $('.deal_selected .plus_or_minus').text('-');
        } else if (position == 'left'){ //Append other players into corresponding positions
            $('.deal_' + position).append($('#p' + x + '_deal'));
            $('.deal_' + position + ' .plus_or_minus').text('+');
            position = 'center';
        } else if (position == 'center'){
            $('.deal_' + position).append($('#p' + x + '_deal'));
            $('.deal_' + position + ' .plus_or_minus').text('+');
            position = 'right';
        } else {
            $('.deal_' + position).append($('#p' + x + '_deal'));
            $('.deal_' + position + ' .plus_or_minus').text('+');
        }
    }
}
// Fill in values automatically in deal popup
function deal_input_actions(){
    let total = 0 - $('.deal_left input').val() - $('.deal_center input').val() - $('.deal_right input').val();
    $('.deal_selected input').val(Math.abs(total));
}
// Clear all inputs upon popup close
$('#deal-popup').on('popup:closed', function(){
    $('#deal-form input').val('');
});

// ------------------------------------------ //
// Setting RELATED FUNCTIONS
// ------------------------------------------ //
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
        console.log('clicked');
    });
});
// Show Toolbar when entering license page
$(document).on('page:afterout','.page[data-name="import"]', function(){
    app.toolbar.show('.toolbar');
});
// Function for handling prompt of removal of data
function remove_data_prompt(){
    app.dialog.confirm('清除資料會影響現時設置及遊戲，確定要清除？', function(){
        // TODO: Add function for removal of data here
        console.log('Remove confirmed');
    })
}


function test(value){
    console.log('test');
    if(value){
        console.log(value);
    }
    $('.test').html('test');
}

app.popup.open('#start-popup');
