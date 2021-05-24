function copyText(str) {
    document.getElementById('inputCopy').value = str;
    document.getElementById('inputCopy').select();
    document.execCommand('copy');
    return true;
}
function upload() {

    //Reference the FileUpload element.
    var fileUpload = document.getElementById("inputFile");

    //Validate whether File is valid Excel file.
    var regex = /^([a-zA-Z0-9\s_\\.\-:])+(.xls|.xlsx)$/;
    if (regex.test(fileUpload.value.toLowerCase())) {
        if (typeof (FileReader) != "undefined") {
            var reader = new FileReader();

            //For Browsers other than IE.
            if (reader.readAsBinaryString) {
                reader.onload = function (e) {
                    processExcel(e.target.result);
                };
                reader.readAsBinaryString(fileUpload.files[0]);
            } else {
                //For IE Browser.
                reader.onload = function (e) {
                    var data = "";
                    var bytes = new Uint8Array(e.target.result);
                    for (var i = 0; i < bytes.byteLength; i++) {
                        data += String.fromCharCode(bytes[i]);
                    }
                    processExcel(data);
                };
                reader.readAsArrayBuffer(fileUpload.files[0]);
            }
        } else {
            alert("This browser does not support HTML5.");
        }
    } else {
        alert("Please upload a valid Excel file.");
    }
};

function processExcel(data) {
    //Read the Excel File data.
    let workbook = XLSX.read(data, {
        type: 'binary'
    });

    //Fetch the name of First Sheet.
    let firstSheet = workbook.SheetNames[0];
    //Read all rows from First Sheet into an JSON array.

    let excelRows = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[firstSheet]);

    //console.log(excelRows);

    let tableName = window.prompt("Tabela","");


    let useQuota = [];
    let qryStrBg = 'INSERT INTO ' + tableName + ' ('
    let fields = '';

    Object.keys(excelRows[0]).forEach(el=>{
        if (confirm("Ok para texto/data, cancel para numero ref col\n " + el)) {
            useQuota.push(true);
          } else {
            useQuota.push(false);
          }
          fields += el + ','        
    });

    qryStrBg += fields.substr(0,fields.length -1) + ') VALUES ('

    excelRows.forEach(e=>{
        console.log(e);
        
        let values = ''

        for(i=0;i<useQuota.length;i++){

            let strtemp = e[Object.keys(e)[i]];

            strtemp = useQuota[i]?'\''+strtemp+'\'':strtemp;
            values += strtemp + ','
        }   

        let qryStr = qryStrBg + values.substr(0,values.length -1) + ');'

        //console.log(qryStr);

        document.getElementById('outpuSQL').value += qryStr + '\n'; 

    })
};