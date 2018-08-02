$('.editButton').on('click', onEdit);
$('.deleteButton').on('click', onDelete);

function onDelete(objE) {

    var intId = objE.target.parentNode.parentNode.id,
        strData = 'id=' + intId;

    $.post(
        "/admin/deleteById",
        strData,
        function(strResult) {
            document.documentElement.innerHTML = strResult;
            document.getElementById('info').innerHTML = 'Product has been deleted';
            getScript('/script/list.js');
        }
    );
}


function onEdit(objE) {
    var intId = objE.target.parentNode.parentNode.id,
        strData = 'id=' + intId;
    $.post(
        "/admin/editById",
        strData,
        function(strResult) {
            document.documentElement.innerHTML = strResult;
            //$.getScript('/script/trix.js');
            //$.getScript('/script/update.js');
            getScript('/script/trix.js');
            getScript('/script/update.js');
        }
    );
}

function getScript(strPath) {
    var script = document.createElement("script");
    script.src = strPath;
    document.head.appendChild(script);
}