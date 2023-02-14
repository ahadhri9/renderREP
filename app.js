const express = require("express");
const app = express();
const fs = require('fs');
import ('node-fetch')


const port = process.env.PORT || 3001;
app.use(express.json())

const clientId = 'live1_25713_n8xQ0kTslpOmSW4Zyt7dbj1P';
const clientSecret = 'r5JKaS7Tc6kOy9q2xIDEHpYjWvuXdBVl';
async function getNewAccessToken(refreshToken) {
  const options = {
    method: 'POST',
    headers: {
      'Cookie': 'acessa_session=cf6c3aa21587859cce8fc8f6fc3031e5c9c32f64; HotelLng=en',
      'host': 'hotels.cloudbeds.com',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      refresh_token: refreshToken
    }),
    credentials: 'include'
  };
  
  const response = await fetch('https://hotels.cloudbeds.com/api/v1.1/access_token', options);
  const data = await response.json();
  
  if (response.ok) {
    const tokenData = fs.readFileSync('token.json');
    const token = JSON.parse(tokenData);
    
    token.access_token = data.access_token;
    token.refresh_token = data.refresh_token;
    
    fs.writeFileSync('token.json', JSON.stringify(token));
    
    console.log('New access token generated');
  } else {
    console.error(data.error_description);
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
setInterval(checkAccessToken, 1000 * 60 * 30); // Check every 30 minutes


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



  
  