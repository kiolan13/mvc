/*
var f = document.querySelector('.loadImageButton');
f.addEventListener("change", onChange, false);
function onChange(e) {
    alert(e.target.files[0].name);
}
*/


var f = $('.loadImageButton');
f.on('change', onChange);


$('.saveButton').on('click', onSave);

function onChange(objE) {
    /*
    var fileType = e.target.files[0].type,
        fileName = e.target.files[0].name,
        validTypes = ["image/gif", "image/jpeg", "image/png"];
    if ($.inArray(fileType, validTypes) < 0) {
        return;
    }
    */
    var objReader = new FileReader();
    reader.onload = function() {
        var charDataUrl = objReader.result;
        var objOutput = document.querySelector('.image');
        localStorage.setItem('imgData', charDataUrl);

        output.src = localStorage.getItem('imgData');
    }
    objReader.readAsDataURL(objE.target.files[0]);

}

function onSave(objE) {
    var strData = '',
        strName = $("#name").val(),
        strPrice = $("#price").val(),
        objEditor = document.querySelector('trix-editor').editor,
        strDescription = objEditor.getDocument().toString();
    
    strData += 'name=' + strName + '&';
    strData += 'price=' + strPrice + '&';
    strData += 'description=' + strDescription;

    $.ajax({
        type: 'POST',
        url: '/admin/addProduct',
        data: strData,
        success: function(result) {
            document.getElementById("info").innerHTML = "Product has been added";
        },
        error: function(result) {
            console.log(result.responseText);
        }
    });
}
