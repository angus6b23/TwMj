// Function for handling prompt of removal of data
function remove_data_prompt(){
    app.dialog.confirm('清除資料會影響現時設置及遊戲，確定要清除？', function(){
        // TODO: Add function for removal of data here
        console.log('Remove confirmed');
    })
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
        console.log('clicked');
    });
});
// Show Toolbar when entering license page
$(document).on('page:afterout','.page[data-name="import"]', function(){
    app.toolbar.show('.toolbar');
});

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

// Fill in values automatically in deal modal
function deal_input_actions(){
    let total = 0 - $('.deal_left input').val() - $('.deal_center input').val() - $('.deal_right input').val();
    $('.deal_selected input').val(Math.abs(total));
}

function test(value){
    console.log('test');
    if(value){
        console.log(value);
    }
    $('.test').html('test');
}
