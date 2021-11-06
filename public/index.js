


window.onload= function(){
    var receiptimg = document.getElementById("receiptimg");
    var invoiceimg = document.getElementById('invoiceimg');
    var findocimg = document.getElementById('findocimg');
    var receiptForm = document.getElementById("receipt");
    var invoiceForm = document.getElementById('invoice');
    var resultsPage = document.getElementById('results');
    var jsonresults = document.getElementById('jsonresults');

    receiptimg.addEventListener('click', () => {
        receiptForm.className = "seen";
        invoiceForm.className = "hidden";
        findocForm.className = "hidden";
        resultsPage.className="hidden";
    
    });

    invoiceimg.addEventListener('click', () => {
        receiptForm.className = "hidden";
        invoiceForm.className = "seen";
        findocForm.className = "hidden";
        resultsPage.className="hidden";
    
    });


    //now handle the upload and hide the up;oad pages
    var receiptbutton = document.getElementById("receiptbutton");
    var invoicebutton = document.getElementById("invoicebutton");
    var findocbutton = document.getElementById("findocbutton");

    receiptbutton.addEventListener('change', () => {
        
        //hide receipts
        receiptForm.className = "hidden";
        resultsPage.className="seen";
        //upload the image
        const file = receiptbutton.files[0];
        const filename = file.name
        console.log("changed", file, filename);
        fileupload("re", file, filename);

    });
    invoicebutton.addEventListener('change', () => {
        
        //hide invoice
        invoiceForm.className = "hidden";
        resultsPage.className="seen";
        //upload the image
        const file = invoicebutton.files[0];
        const filename = file.name
        console.log("changed", file, filename);
        fileupload("in", file, filename);
        
    });


    function fileupload(endpoint, file, filename){
        console.log("file upload,", endpoint+ file);
        if(endpoint =="re"){
            endpoint = "/receipt";
            console.log("file upload,", endpoint+ file);
        }else if(endpoint =="in"){
            endpoint = "/invoice";
        }else{
            endpoint = "/findoc";
        }
        const fileForm = new FormData();
        fileForm.append('imageSource', file, filename);
        var req = new XMLHttpRequest();
        req.open("POST", endpoint);
        req.onload = function (oEvent){
            //uploaded, display results
            
            console.log(req.response);
        
            var resultsJSON = JSON.parse(req.response);
            console.log("resultsJSON",resultsJSON);
            var prettyPrint = JSON.stringify(resultsJSON,null,2);
            jsonresults.textContent = prettyPrint;
            

        }
        req.send(fileForm);

    }


}