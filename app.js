const express = require("express");
const app = express();
const fs = require('fs');
import ('node-fetch')


const port = process.env.PORT || 3001;
app.use(express.json())
async function getNewAccessToken(refreshToken) {
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
    const tokenData = fs.readFileSync('token.json');
    const token = JSON.parse(tokenData);
    token.access_token = result.access_token;
    token.refresh_token = result.refresh_token;
    
    fs.writeFileSync('token.json', JSON.stringify(token));
    
    console.log('New access token generated');
  }
}
//azeaeazzeazeaeaea
async function checkAccessToken() {
  try {
    const tokenData = fs.readFileSync('token.json');
    const token = JSON.parse(tokenData);
    
    const accessToken = token.access_token;
    const refreshToken = token.refresh_token;
    const expiresIn = token.expires_in;
    const now = new Date();
    
    if (!accessToken || !refreshToken || !expiresIn || new Date(expiresIn) < now) {
      await getNewAccessToken(refreshToken);
    } else {
      console.log('Access token is still valid');
    }
  } catch (error) {
    console.error(error);
  }
}

// Call this function periodically to check if the access token has expired and generate a new one if needed
setInterval(checkAccessToken, 1000 * 60 * 1); // Check every 30 minutes


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



  
  