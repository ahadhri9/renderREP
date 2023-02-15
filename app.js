const { response } = require("express");
const express = require("express");
const app = express();
const fs = require('fs');
import ('node-fetch')
var accessToken;
var refreshToken;

const port = process.env.PORT || 3001;
app.use(express.json())
async function getNewAccessToken() {
  const tokenData=fs.readFileSync('token.json').toString();
  const token = JSON.parse(tokenData);
  accessToken = token.access_token;
  refreshToken = token.refresh_token;

  var myHeaders = new Headers();
  myHeaders.append("Cookie", "acessa_session=a5de10117e01531cc0fb1c73c6308150080aa6ef; acessa_session_enabled=1; HotelLng=en");

  var formdata = new FormData();
  formdata.append("grant_type", "refresh_token");
  formdata.append("client_id", "live1_25713_n8xQ0kTslpOmSW4Zyt7dbj1P");
  formdata.append("client_secret", "r5JKaS7Tc6kOy9q2xIDEHpYjWvuXdBVl");
  formdata.append("refresh_token", refreshToken);

  var requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: formdata,
    redirect: 'follow'
  };

  resulut = await fetch("https://hotels.cloudbeds.com/api/v1.1/access_token", requestOptions)
    .then(response => response.text())
    .catch(error => console.log('error', error));
    
    
  if (resulut) {
    fs.writeFileSync('token.json', resulut);   
    //console.log("resulut:  "+resulut)
    console.log('New access token generated');
    const resultat = resulut.json()
    accessToken = resultat.access_token;
    refreshToken = resultat.refresh_token;
    console.log("accessToken Try"+accessToken)
  }
  
}
// Call this function periodically to check if the access token has expired and generate a new one if needed
getNewAccessToken()
setInterval(getNewAccessToken, 1000 * 20 * 1); // Check every 30 minutes


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
    res.send(msg);
    console.log(msg)
    const ReservationID = msg.body.reservationID
    console.log("ReservationID"+ReservationID)
    //function to get the reservationID
    var myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer "+accessToken);
    myHeaders.append("Cookie", "acessa_session=a5de10117e01531cc0fb1c73c6308150080aa6ef; acessa_session_enabled=1; csrf_accessa_cookie=0ac0bba0bffb21019b3ee6bfc978303c; HotelLng=en");

    var requestOptions = {
      method: 'GET',
      headers: myHeaders,
      redirect: 'follow'
    };

    ResID= await fetch("https://hotels.cloudbeds.com/api/v1.1/getReservation?reservationID="+ReservationID, requestOptions)
      .then(response => response.text())
      .catch(error => console.log('error', error));
      if (ResID) { 
        console.log("Reservation ID de la mort" + ResID);
      }
    
  });




app.listen(port, () => console.log(`Example app listening on port ${port}!`));



  
  