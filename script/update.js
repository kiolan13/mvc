$('.saveButton').on('click', onUpdate);

function onUpdate(objE) {
    var strData = '',
        intId = $("#id").val(),
        strName = $("#name").val(),
        strPrice = $("#price").val(),
        objEditor = document.querySelector('trix-editor').editor,
        strDescription = objEditor.getDocument().toString();

    strData += 'id=' + intId + '&' +
        'name=' + strName + '&' +
        'price=' + strPrice + '&' +
        'description=' + strDescription;

    $.ajax({
        type: 'POST',
        url: '/admin/updateProduct',
        data: strData,
        success: function(result) {
            document.getElementById("info").innerHTML = "Product has been updated";
        },
        error: function(result) {
            console.log(result.responseText);
        }
    });
}