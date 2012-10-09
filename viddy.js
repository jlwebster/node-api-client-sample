var http = require('http');
var response = '';

//Your viddy data
var viddy = {
  "type": "viddy",
  "data": {
    /* data goes here */ 
    "viddy_field": "viddy_value"
  }
}

//Stringify data for post call
viddy = JSON.stringify(viddy);

//Set up request options
var options = {
  host: '<HOST>',
  path: '/viddies.json',
  method: 'POST',
  headers: {
    'Content-Length': viddy.length,
    'Content-Type': 'application/json'
  }
}

var access_id = '<ACCESS_ID>';
var secret = '<SECRET>';
options = require('api_auth').auth(access_id, secret).sign_options(options, viddy);

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
req.write(viddy);

//Send request
req.end();
