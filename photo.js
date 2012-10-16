var http = require('http');
var fs = require('fs');

var utils = require('./utils.js');
var config = require('./config.js');

var response = '';
var photo_guid = require('node-uuid').v1();

var photo_s3_path = '/uploads/photos/' + photo_guid + '.jpg';

// First upload the photo to S3
var client = require('knox').createClient({
  key: config.s3_key,
  secret: config.s3_secret,
  bucket: config.s3_bucket
});

client.putFile('sample.jpg', photo_s3_path, {'x-amz-acl': 'public-read'}, function(err, res) {
  if (err) console.log(err);

  if (200 == res.statusCode) {
    // Now that we have uploaded the photo, tell the API about it and meta data bout the photo
    var payload = {
      type: "photo",
      data: {
        temp_photo_path: photo_s3_path,
        for_website: true, // Flag indicating if this is from moderation or just for sharing from the user
        name: "Photo Name",
        author: "author_handle"
      }
    };

    // Stringify data for post call
    payload = JSON.stringify(payload);

    // Set up request options hash
    var options = {
      host: config.host,
      port: config.port,
      path: '/photos.json',
      method: 'POST',
      headers: {
        'Content-Length': payload.length,
        'Content-Type': 'application/json'
      }
    };

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

        // This is the url to the photo page:
        photo = JSON.parse(response);
        url = 'http://' + config.host;
        if (config.port) url += ':' + config.port;
        url += '/photos/' + photo['_id']
        console.log(url);
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
  }
});

