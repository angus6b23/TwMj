// ------------------------------------------ //
// GLOBAL VARIABLES
// ------------------------------------------ //
const theme = { //Object for themes
    Nord:{
        '--p1-color': '#d08770',
        '--p2-color': '#ebcb8b',
        '--p3-color': '#a3be8c',
        '--p4-color': '#b48ead',
        '--bg-nord': '#2e3440',
        '--fg-nord': '#e5e9f0',
        '--highlight': '#81a1c1',
        'is_Dark': true
    },
    Nord_alt:{
        '--p1-color': '#8fbcbb',
        '--p2-color': '#88c0d0',
        '--p3-color': '#81a1c1',
        '--p4-color': '#5e81ac',
        '--bg-nord': '#2e3440',
        '--fg-nord': '#e5e9f0',
        '--highlight': '#a3be8c',
        'is_Dark': true
    },
    Dracula:{
        '--p1-color': '#8be9fd',
        '--p2-color': '#50fa7b',
        '--p3-color': '#bd93f9',
        '--p4-color': '#f1fa8c',
        '--bg-nord': '#282a36',
        '--fg-nord': '#f8f8f2',
        '--highlight': '#ff79c6',
        'is_Dark': true
    },
    Gruvbox_light:{
        '--p1-color': '#cc241d',
        '--p2-color': '#98971a',
        '--p3-color': '#d79921',
        '--p4-color': '#458588',
        '--bg-nord': '#fbf1c7',
        '--fg-nord': '#3c3836',
        '--highlight': '#689d6a',
        'is_Dark': false
    },
    Gruvbox_dark:{
        '--p1-color': '#fb4934',
        '--p2-color': '#b8bb26',
        '--p3-color': '#fabd2f',
        '--p4-color': '#83a598',
        '--bg-nord': '#3c3836',
        '--fg-nord': '#fbf1c7',
        '--highlight': '#8ec07c',
        'is_Dark': true
    },
    Tomorrow_night:{
        '--p1-color': '#cc6666',
        '--p2-color': '#f0c674',
        '--p3-color': '#8abeb7',
        '--p4-color': '#b294bb',
        '--bg-nord': '#1d1f21',
        '--fg-nord': '#c5c8c6',
        '--highlight': '#969896',
        'is_Dark': true
    },
    Tomorrow:{
        '--p1-color': '#c82829',
        '--p2-color': '#eab700',
        '--p3-color': '#3e999f',
        '--p4-color': '#8959a8',
        '--bg-nord': '#ffffff',
        '--fg-nord': '#4d4d4c',
        '--highlight': '#8e908c',
        'is_Dark': false
    },
    High_contrast:{
        '--p1-color': '#ff0000',
        '--p2-color': '#00ff00',
        '--p3-color': '#0000ff',
        '--p4-color': '#ffff00',
        '--bg-nord': '#ffffff',
        '--fg-nord': '#000000',
        '--highlight': '#ff00ff',
        'is_Dark': false
    },
};
//Declared for global variables
var p1_action
var p2_action
var p3_action
var p4_action
// ------------------------------------------ //
// GLOBAL FUNCTIONS
// ------------------------------------------ //
// Function when triggering ui_update
app.on('ui_update', function(){
    // Update table display
    for (i=1;i<5;i++){
        $('.p' + i + '_name').text(allplayer[i].name);
        if (allplayer[i].unrealized == 0){
            $('.p' + i + '_balance').html(allplayer[i].balance);
        } else if (allplayer[i].unrealized > 0){
            $('.p' + i + '_balance').html(allplayer[i].balance + ' (' + allplayer[i].unrealized + ')');
        } else {
            $('.p' + i + '_balance').html(allplayer[i].balance + ' (' + allplayer[i].unrealized + ')');
        }
    }
    console.log('ui updated called');
});
// ------------------------------------------ //
// MAIN PAGE RELATED FUNCTIONS
// ------------------------------------------ //
// Starting Modal Functions
function start_game_ui(){
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
    p1_action = app.actions.create({
        buttons: [
            {
                text: allplayer[1].name,
                label: true
            },
            {
                text: '即收',
                onClick: function(){
                    console.log('即收');
                    // Function for opening popup
                }
            },
            {
                text: '即付',
                onClick: function(){
                    console.log('即付');
                    // Function for opening popup
                }
            },
            {
                text: '出銃',
                onClick: function(){
                    set_deal_position(1);
                    app.popup.open('#deal-popup')
                    // Function for opening popup
                }
            },
            {
                text: '自摸',
                onClick: function(){
                    console.log('自摸');
                    // Function for opening popup
                }
            }
        ]
    });
    p2_action = app.actions.create({
        buttons: [
            {
                text: allplayer[2].name,
                label: true
            },
            {
                text: '即收',
                onClick: function(){
                    // Function for opening popup
                }
            },
            {
                text: '即付',
                onClick: function(){
                    // Function for opening popup
                }
            },
            {
                text: '出銃',
                onClick: function(){
                    set_deal_position(2);
                    app.popup.open('#deal-popup');
                    // Function for opening popup
                }
            },
            {
                text: '自摸',
                onClick: function(){
                    // Function for opening popup
                }
            }
        ]
    });
    p3_action = app.actions.create({
        buttons: [
            {
                text: allplayer[3].name,
                label: true,
            },
            {
                text: '即收',
                onClick: function(){
                    // Function for opening popup
                }
            },
            {
                text: '即付',
                onClick: function(){
                    // Function for opening popup
                }
            },
            {
                text: '出銃',
                onClick: function(){
                    set_deal_position(3);
                    app.popup.open('#deal-popup');
                    // Function for opening popup
                }
            },
            {
                text: '自摸',
                onClick: function(){
                    // Function for opening popup
                }
            }
        ]
    });
    p4_action = app.actions.create({
        buttons: [
            {
                text: allplayer[4].name,
                label: true
            },
            {
                text: '即收',
                onClick: function(){
                    // Function for opening popup
                }
            },
            {
                text: '即付',
                onClick: function(){
                    // Function for opening popup
                }
            },
            {
                text: '出銃',
                onClick: function(){
                    set_deal_position(4);
                    app.popup.open('#deal-popup')
                    // Function for opening popup
                }
            },
            {
                text: '自摸',
                onClick: function(){
                    // Function for opening popup
                }
            }
        ]
    });
}

// Adding event handlers for triggering action sheets
function open_action_sheet(player_index){
    switch(player_index){
        case 1: p1_action.open(); break;
        case 2: p2_action.open(); break;
        case 3: p3_action.open(); break;
        case 4: p4_action.open(); break;
    }
}
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
// ------------------------------------------ //
// POPUP RELATED FUNCTIONS
// ------------------------------------------ //
// Starting Modal Functions
function set_money_multiplier(value){ //Check money multiplier input before setting it as value
    let check_value = parseFloat(value);
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
    start_obj.name_array.push(start_form.elements['east_name'].value);
    start_obj.name_array.push(start_form.elements['south_name'].value);
    start_obj.name_array.push(start_form.elements['west_name'].value);
    start_obj.name_array.push(start_form.elements['north_name'].value);
    start_obj.multiplier = start_form.elements['multiplier'].value;
    start_obj.break_streak = start_form.elements['break_streak'].value;
    start_game(start_obj);
    // Call function in main.js here
    app.popup.close('#start-popup');
}
// Function for positioning different player in deal popup
// Putting the index of selected_player into the top div
function set_deal_position(player_selected){
    $('#deal-form input').prop('disabled', false);
    $('#deal-form input').val('');
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
// SETTINGS RELATED FUNCTIONS
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
        console.log('clicked');// Add submit function
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

app.popup.open('#start-popup');
