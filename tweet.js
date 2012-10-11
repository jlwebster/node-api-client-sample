var http = require('http');
var fs = require('fs');

var utils = require('./utils.js');
var config = require('./config.js');

var response = '';

// Read in sample tweet data
fs.readFile('./sample_json/tweet.json', 'utf8', function(err, tweet) {
  if (err) return console.log(err);

  var payload = {
    type: "tweet",
    data: JSON.parse(tweet)
  };

  // Add additional custom properties to the tweet
  payload.data.guid = require('node-uuid').v1();
  
  // Stringify data for post call
  payload = JSON.stringify(payload);
  // The api requies that unicode chars are escaped
  payload = utils.escapeUnicode(payload);

  // Set up request options hash
  var options = {
    host: config.host,
    port: config.port,
    path: '/tweets.json',
    method: 'POST',
    headers: {
      'Content-Length': payload.length,
      'Content-Type': 'application/json'
    }
  }

  // Sign request options hash
  options = require('api_auth').auth(config.access_id, config.secret).sign_options(options, payload);

  // Make request
  var req = http.request(options, function(res){
    res.setEncoding('utf8'); //Encode response as UTF8 string

    // Data will be sent back in chunks
    // Concatenate the strings until all chunks received
    res.on('data', function(chunk){
      response += chunk;
    });

    // Once data has finished streaming
    res.on('end', function(){
      // Now you have the response from the api call
      console.log(response);
    })

    // Error handling for request
    res.on('error', function(err){
      console.log("Error: " + JSON.stringify(err));
    });

  });

  // Write data to request body
  req.write(payload);

  // Send request
  req.end();
});
