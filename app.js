var express = require('express');
var request = require('request');
var cors = require('cors');
var querystring = require('querystring');
var cookieParser = require('cookie-parser');
// const { type } = require('os');

var client_id = '463fc0969d9240fe8d9a987478380b76'; // Your client id
var client_secret = 'aa0d8021beeb4fda9066b177d902c698'; // Your secret
var redirect_uri = 'http://localhost:8888/callback';

var app = express();

var generate_state = function (length) {
  var text = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for (var i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};

app.use(express.static(__dirname + '/public'))
  .use(cors())
  .use(cookieParser());

app.get('/login', function (req, res) {
  var state = generate_state(16);
  var scope = 'playlist-read-private playlist-modify-public playlist-modify-private'; // Authorizations
  res.cookie("spotify_auth_state", state);
  res.redirect('https://accounts.spotify.com/authorize?' +
    querystring.stringify({
      response_type: 'code',
      client_id: client_id,
      scope: scope,
      redirect_uri: redirect_uri,
      state: state
    }));
});

app.get('/callback', function (req, res) {
  var code = req.query.code || null;
  var state = req.query.state || null;
  var stored_state = req.cookies ? req.cookies["spotify_auth_state"] : null;
  if (state === null || state !== stored_state) {
    res.redirect('/token.html#' +
      querystring.stringify({
        error: 'state_mismatch'
      }));
  } else {
    res.clearCookie("spotify_auth_state");
    var url_object = {
      url: 'https://accounts.spotify.com/api/token',
      form: {
        code: code,
        redirect_uri: redirect_uri,
        grant_type: 'authorization_code'
      },
      headers: {
        'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64'))
      },
      json: true
    };

    request.post(url_object, function (error, response, body) {
      if (!error && response.statusCode === 200) {
        console.log(body)
        var access_token = body.access_token,
          refresh_token = body.refresh_token;

        var url_object = {
          url: 'https://api.spotify.com/v1/me',
          headers: { 'Authorization': 'Bearer ' + access_token },
          json: true
        };
        request.get(url_object, function (error, response, body) {
          console.log(body);
        });

        res.redirect('/token.html#' +
          querystring.stringify({
            access_token: access_token,
            refresh_token: refresh_token
          }));
      } else {
        res.redirect('/token.html#' +
          querystring.stringify({
            error: 'invalid_token'
          }));
      }
    });
  }
});

app.get('/refresh_token', function (req, res) {
  var refresh_token = req.query.refresh_token;
  console.log("toto Authorization Basic : " + (new Buffer(client_id + ':' + client_secret).toString('base64')))
  console.log("toto refresh_token : " + refresh_token)
  var url_object = {
    url: 'https://accounts.spotify.com/api/token',
    headers: { 'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64')) },
    form: {
      grant_type: 'refresh_token',
      refresh_token: refresh_token
    },
    json: true
  };

  request.post(url_object, function (error, response, body) {
    if (!error && response.statusCode === 200) {
      console.log(body)
      var access_token = body.access_token;
      res.redirect('/refresh_token.html#' +
        querystring.stringify({
          token: access_token
        }));
    } else {
      res.redirect('/refresh_token.html#' +
        querystring.stringify({
          error: 'invalid_token'
        }));
    }
  });
});

console.log('Listening on port 8888');
app.listen(8888);
