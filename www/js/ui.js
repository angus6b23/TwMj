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
        var import_data = app.form.convertToData('import-form');
        alert(JSON.stringify(import_data));
    });
});
// Show Toolbar when entering license page
$(document).on('page:afterout','.page[data-name="import"]', function(){
    app.toolbar.show('.toolbar');
});


function test(value){
    console.log('test');
    if(value){
        console.log(value);
    }
    $('.test').html('test');
}
