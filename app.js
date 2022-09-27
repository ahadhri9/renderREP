const fs = require('fs')
const request = require('request')
const express = require('express')
const app = express()
const requestp = require('request-promise')
const { info } = require('console')
var accessToken
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

async function getReservationInfo(reservationID){
  var request = require('request');
var options = {
  'method': 'GET',
  'url': 'https://hotels.cloudbeds.com/api/v1.1/getReservation?reservationID='+reservationID,
  'headers': {
    'Authorization': 'Bearer '+accessToken,
    'Cookie': 'acessa_session=ef1febf0805c53e7deaee8104775218f169efe33; HotelLng=en',
    'host':'hotels.cloudbeds.com'
  },
  formData: {

  }
};
result = await requestp(options);
data =JSON.parse(result.body)
return data
}





  app.all("/*", async (req, res) => {
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
      console.log(msg.body.status,":")
      const reservationID = msg.body.reservationID
      data = await getReservationInfo(reservationID)
      switch (msg.body.status) {
        case 'checked_out':
          console.log(data)
          break;
        case 'confirmed':
          
          break;
        case 'canceled':
          
          break;
        case 'checked_in':
          
          break;
        case 'no_show':
                    
          break;
      
        default:
          console.warn("unsupported type,",msg.body.status);
          break;
      }
    });
    
    
    app.listen(3000, () => console.log("Listening on port 3000"));

