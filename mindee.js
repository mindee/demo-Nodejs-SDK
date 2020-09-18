// works for NODE > v10
const axios = require('axios');
const fs = require("fs");
const FormData = require('form-data')

async function makeRequest() {
    let data = new FormData()
    data.append('file', fs.createReadStream('/Users/dougsillars/Documents/Github/mindee_node_receipt/receipts/IMG_20200301_073427'))
	
	console.log("form data ", data);
	
    const config = {
        method: 'POST',
        url: 'https://api.mindee.net/products/expense_receipts/v2/predict',
        headers: { 
          'X-Inferuser-Token':'c3c492ff6308790bc62dcad0378f82e5',
          ...data.getHeaders()
           },
        data
    }
	console.log("config" ,config);
    try {
      let response = await axios(config)
      console.log(response.data);
    } catch (error) {
      console.log(error)
    }

}

makeRequest()