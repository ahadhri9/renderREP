const https = require('https');
const fs = require('fs');
const path = require('path');

const tokensFile = path.resolve(__dirname, 'tokens.json');

let accessToken;
let refreshToken;

// Get the initial tokens
getTokens((err, tokens) => {
  if (err) {
    console.error(err);
    return;
  }
  accessToken = tokens.access_token;
  refreshToken = tokens.refresh_token;
  saveTokens(tokens);
});

// Refresh the tokens every hour
setInterval(() => {
  refreshTokens((err, tokens) => {
    if (err) {
      console.error(err);
      return;
    }
    accessToken = tokens.access_token;
    refreshToken = tokens.refresh_token;
    saveTokens(tokens);
  });
}, 1000 * 60 * 60);

// Function to get the initial tokens
function getTokens(callback) {
  // Make a request to the Cloudbeds API to get the initial tokens
  const options = {
    method: 'POST',
    hostname: 'api.cloudbeds.com',
    path: '/v1.1/oauth/token',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  };
  const req = https.request(options, res => {
    let data = '';
    res.on('data', chunk => {
      data += chunk;
    });
    res.on('end', () => {
      try {
        const tokens = JSON.parse(data);
        callback(null, tokens);
      } catch (err) {
        callback(err);
      }
    });
  });
  req.on('error', callback);
  req.write('grant_type=client_credentials&client_id=YOUR_CLIENT_ID&client_secret=YOUR_CLIENT_SECRET');
  req.end();
}

// Function to refresh the tokens
function refreshTokens(callback) {
  // Make a request to the Cloudbeds API to refresh the tokens
  const options = {
    method: 'POST',
    hostname: 'api.cloudbeds.com',
    path: '/v1.1/oauth/token',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  };
  const req = https.request(options, res => {
    let data = '';
    res.on('data', chunk => {
      data += chunk;
    });
    res.on('end', () => {
      try {
        const tokens = JSON.parse(data);
        callback(null, tokens);
      } catch (err) {
        callback(err);
      }
    });
  });
  req.on('error', callback);
  req.write(grant_type=refresh_token&client_id&client_secret&refreshToken);
req.end();
}

// Function to save the tokens to a JSON file
function saveTokens(tokens) {
fs.writeFileSync(tokensFile, JSON.stringify(tokens));
}