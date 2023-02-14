const express = require("express");
const app = express();
const fs = require('fs')
const request = require('request')
const express = require('express')

const port = process.env.PORT || 3001;
app.use(express.json())
  //refreshKeys : regarde s'il existe deja un refreshToken, si oui, génére une nouvelle paire de token, sinon exit.
  function refreshKeys(){
    rawdata=fs.readFileSync('token.json')
    jsonToken=JSON.parse(rawdata);
    refreshToken = jsonToken.refreshToken
    if(!refreshToken){
      console.error(" no refresh token ")
      return
    }
  var options = {
    'method': 'POST',
    'url': 'https://hotels.cloudbeds.com/api/v1.1/access_token',
    'headers': {
      'Cookie': 'acessa_session=cf6c3aa21587859cce8fc8f6fc3031e5c9c32f64; HotelLng=en',
      'host':'hotels.cloudbeds.com'
    },
    formData: {
      'grant_type': 'refresh_token',
      'client_id': 'live1_25713_n8xQ0kTslpOmSW4Zyt7dbj1P',
      'client_secret': 'r5JKaS7Tc6kOy9q2xIDEHpYjWvuXdBVl',
      'refresh_token': refreshToken
    }
  };
  request(options, function (error, response) {
    if (error) throw new Error(error);
    json = JSON.parse(response.body)
    accessToken = json.access_token;//TODO asynchronic task CRITICAL/!\
    refreshToken = json.refresh_token;
    console.log(refreshToken)
    gotoJson = {refreshToken:refreshToken}
    fs.writeFileSync('./token.json',JSON.stringify(gotoJson))
  });
  }
  refreshKeys()
  setInterval(refreshKeys,3500000);
app.all("/*", (req, res) => {
  const msg = {
    protocol: req.protocol,
    method: req.method,
    ip: req.ip,
    hostname: req.hostname,
    path: req.path,
    url: req.url,
    query: req.query,
    params: req.params,
    body: req.body,
  }
    res.send(msg);
    console.log(msg)
    const ReservationID = msg.body.reservationID
    console.log("ReservationID"+ReservationID)
  });




app.listen(port, () => console.log(`Example app listening on port ${port}!`));



  
  