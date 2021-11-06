// works for NODE > v10
const pug = require('pug');
const path = require('path');
require('dotenv').config()
const fs = require("fs");
var FormData = require('form-data');
//formidable takes the form data and saves the file, and parameterises the fields into JSON
const formidable = require('formidable')
const express = require('express');
const app = express();


//mindee
const { Client } = require("mindee");
var receiptkey = process.env.receiptToken;
var invoicekey = process.env.invoiceToken;
const mindeeClient = new Client({
	invoiceToken:invoicekey,
	receiptToken: receiptkey,
  });



// make all the files in 'public' available
// https://expressjs.com/en/starter/static-files.html
app.use(express.static("public"));
//set up pug as view engine
app.set('view engine','pug');
// https://expressjs.com/en/starter/basic-routing.html


//rate limiting code
//rate limiting to protect the demos
const rateLimit = require("express-rate-limit");
app.use(
	rateLimit({
	  windowMs:  60 * 60 * 1000, // 1 hour duration in milliseconds
	  max: 115,
	  message: "You exceeded 15 requests in 1 hour.",
	  headers: true,
	})
  );
  





app.get("/", (request, response) => {
    return response.render('index');
});

app.get("/receipt", (request, response) => {
    return response.render('receipt');
});

app.get("/invoice", (request, response) => {
    return response.render('invoice');
});

app.get("/findoc", (request, response) => {
    return response.render('findoc');
});

app.post("/receipt", (request, response) => {

	//this sends in a form with an image
    //formidable reads the form, saves the image
	var form = new formidable.IncomingForm({maxFileSize : 2000 * 1024 * 1024}); //2 Gb
	
	form.parse(request, (err, fields, files) => {
    if (err) {
		  console.error('Error', err);
		  throw err;
    }
	//PARSED FORM
 	console.log("files data", JSON.stringify(files) + JSON.stringify(files.imageSource));
    var imageName = path.parse(files.imageSource.name).name;
	console.log("imagename", imageName);
    var imagePath = files.imageSource.path;
    var imageType = files.imageSource.type;
	var indexofslash = imageType.indexOf("/");
	var imageExt = imageType.substr(indexofslash+1);
	var imageSize = files.imageSource.size;
	console.log("imagePath", imagePath);
	//FORMIDIABLE USES A RANDOM NAME ON UPLOAD.  RENAME
	var newPath = __dirname + "/../public/images/";
	var newImagePath  = imagePath+ imageName +"."+ imageExt;
	console.log("newimagePath", newImagePath);
    fs.copyFile(imagePath, newImagePath, function (err) {
 	   	if (err) throw err;
 		console.log('File uploaded and moved!');
		//FILE IS RENAMED
		//NOW UPLOAD IT TO MINDEE 
		// parsing receipt from picture
		mindeeClient.receipt
			.parse({ input: newImagePath })
			.then((res) => {
  				console.log("Success !");
  				console.log("receipts", res.receipts);
  				console.log("receipt", res.receipt);
				console.log("all response", res);
				//pull out the data I want to show on the page
				var predict = res.receipt;
				response.send(predict);
				//return response.render('receiptresult',{merchant, tax, merchantType, total});
			})
			.catch((err) => {
  				console.error(err);
			});
  		});
	 });
});



app.post("/invoice", (request, response) => {

	//this sends in a form with an image
    //formidable reads the form, saves the image
	var form = new formidable.IncomingForm({maxFileSize : 2000 * 1024 * 1024}); //2 Gb
	
	form.parse(request, (err, fields, files) => {
    if (err) {
		  console.error('Error', err);
		  throw err;
    }
	//PARSED FORM
 	console.log("files data", JSON.stringify(files.imageSource));
    var imageName = path.parse(files.imageSource.name).name;
	console.log("imagename", imageName);
    var imagePath = files.imageSource.path;
    var imageType = files.imageSource.type;
	var indexofslash = imageType.indexOf("/");
	var imageExt = imageType.substr(indexofslash+1);
	var imageSize = files.imageSource.size;
	console.log("imagePath", imagePath);
	//FORMIDIABLE USES A RANDOM NAME ON UPLOAD.  RENAME
	var newPath = __dirname + "/../public/images/";
	var newImagePath  = imagePath+ imageName +"."+ imageExt;
	console.log("newimagePath", newImagePath);
    fs.copyFile(imagePath, newImagePath, function (err) {
 	   	if (err) throw err;
 		console.log('File uploaded and moved!');
		//FILE IS RENAMED
		//NOW UPLOAD IT TO MINDEE 
		// parsing receipt from picture
		mindeeClient.invoice
			.parse({ input: newImagePath })
			.then((res) => {
  				console.log("Success !");
  			
  				console.log("invoice", res.invoice);
				console.log("all response", res);
				//pull out the data I want to show on the page
				var predict = res.invoice;
				response.send(predict);
			})
			.catch((err) => {
  				console.error(err);
			});
  		});
	 });
});

app.post("/findoc", (request, response) => {

	//this sends in a form with an image
    //formidable reads the form, saves the image
	var form = new formidable.IncomingForm({maxFileSize : 2000 * 1024 * 1024}); //2 Gb
	
	form.parse(request, (err, fields, files) => {
    if (err) {
		  console.error('Error', err);
		  throw err;
    }
	//PARSED FORM
 	console.log("files data", JSON.stringify(files.imageSource));
    var imageName = path.parse(files.imageSource.name).name;
	console.log("imagename", imageName);
    var imagePath = files.imageSource.path;
    var imageType = files.imageSource.type;
	var indexofslash = imageType.indexOf("/");
	var imageExt = imageType.substr(indexofslash+1);
	var imageSize = files.imageSource.size;
	console.log("imagePath", imagePath);
	//FORMIDIABLE USES A RANDOM NAME ON UPLOAD.  RENAME
	var newPath = __dirname + "/../public/images/";
	var newImagePath  = imagePath+ imageName +"."+ imageExt;
	console.log("newimagePath", newImagePath);
    fs.copyFile(imagePath, newImagePath, function (err) {
 	   	if (err) throw err;
 		console.log('File uploaded and moved!');
		//FILE IS RENAMED
		//NOW UPLOAD IT TO MINDEE 
		// parsing receipt from picture
		mindeeClient.financialDocument
			.parse({ input: newImagePath })
			.then((res) => {
  				console.log("Success !");
  				console.log("receipts", res.financialDocuments);
  				console.log("receipt", res.financialDocument);
				console.log("all response", res);
				//pull out the data I want to show on the page

				var merchant = res.invoice.merchant.name;
				var merchantType = res.invoice.category.value;
				var tax = res.invoice.taxes.amount;
				var total = res.invoice.totalIncl.value;
				console.log("predict", predict);
				console.log("merhcant" ,merchant);
				console.log("merhcanttype" , merchantType);
				console.log("tax" , tax);
				console.log("total" , total);
				console.log (merchant, merchantType, tax, total);
				return response.render('findocresult',{merchant, tax, merchantType, total});
			})
			.catch((err) => {
  				console.error(err);
			});
  		});
	 });
});



// listen for requests :)
const listener = app.listen(3003, () => {
  console.log("Your app is listening on port " + listener.address().port);
});