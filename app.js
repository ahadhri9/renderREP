const express = require("express");
const app = express();
const fs = require('fs');
import ('node-fetch')


const port = process.env.PORT || 3001;
app.use(express.json())

const clientId = 'live1_25713_n8xQ0kTslpOmSW4Zyt7dbj1P';
const clientSecret = 'r5JKaS7Tc6kOy9q2xIDEHpYjWvuXdBVl';
//refreshKeys : regarde s'il existe deja un refreshToken, si oui, génére une nouvelle paire de token, sinon exit.
const getNewRefreshToken = async (clientId, clientSecret) => {
  const response = await fetch(`https://api.cloudbeds.com/oauth/token?client_id=${clientId}&client_secret=${clientSecret}&grant_type=refresh_token`);
  const data = await response.json();
  console.log(data)
  return data;
  
}

const checkRefreshToken = async (clientId, clientSecret) => {
  try {
    const tokenData = fs.readFileSync('token.json');
    const token = JSON.parse(tokenData);
    if (!token.refresh_token) {
      const newTokens = await getNewRefreshToken(clientId, clientSecret);
      token.refresh_token = newTokens.refresh_token;
      token.access_token = newTokens.access_token;
      fs.writeFileSync('token.json', JSON.stringify(newTokens));
      console.log('tokens: '+ newTokens)
    }
  } catch (error) {
    console.error(error);
  }
}
checkRefreshToken(clientId, clientSecret)
setInterval(()=>checkRefreshToken(clientId, clientSecret),3500000);


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



  
  