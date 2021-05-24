document.addEventListener('DOMContentLoaded', function () {

    // let btnID = document.getElementById('btnID');
    // btnID.addEventListener('click', function () {
    //     //actions
    // }, false);

    let btnUploadXLSX = document.getElementById('btnUploadXLSX');
    btnUploadXLSX.addEventListener('click', function () {
        document.getElementById("inputFile").click();
    }, false);

    //on change do file para alterar nome do SPAN dentro do <a>
    document.getElementById("inputFile").addEventListener('change', (val) => {
        document.getElementById("spnUploadButton").innerHTML = val.target.files[0].name;
        upload();
    });

});
