var http = require('http');
var response = '';

//Your instagram data
var instagram = {
  "type": "instagram",
  "data": {
    "meta": {
      "code": 200
    },
    "data": {
      /* etc... */
    },
    "pagination": {
        "next_url": "...",
        "next_max_id": "13872296"
    }
  }
}

//Stringify data for post call
instagram = JSON.stringify(instagram);

//Set up request options
var options = {
  host: '<HOST>',
  path: '/instagrams.json',
  method: 'POST',
  headers: {
    'Content-Length': instagram.length,
    'Content-Type': 'application/json'
  }
}

var access_id = '<ACCESS_ID>';
var secret = '<SECRET>';
options = require('api_auth').auth(access_id, secret).sign_options(options, instagram);

//Make request
var req = http.request(options, function(res){
  res.setEncoding('utf8'); //Encode response as UTF8 string

  //Data will be sent back in chunks
  //Concatenate the strings until all chunks received
  res.on('data', function(chunk){
    response += chunk;
  });

  //Once data has finished streaming
  res.on('end', function(){
    //Now you have the response from the api call
    console.log(response);
  })

  //Error handling for request
  res.on('error', function(err){
    console.log("Error: " + JSON.stringify(err));
  });

});

//Write data to request body
req.write(instagram);

//Send request
req.end(); 
