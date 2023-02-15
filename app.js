const express = require("express");
const app = express();
const fs = require('fs');
import ('node-fetch')

let accessToken;
let refreshToken;

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
    fs.writeFileSync('./token.json', resulut);   
    console.log('New access token generated');
  }
}
async function checkAccessToken() {
  try {
   //  = fs.readFileSync('./token.json');
   const tokenData=fs.readFileSync('token.json').toString();
    const token = JSON.parse(tokenData);
    
    accessToken = token.access_token;
    refreshToken = token.refresh_token;
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
checkAccessToken()
setInterval(checkAccessToken, 1000 * 60 * 30); // Check every 30 minutes


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
myHeaders.append("Authorization", "Bearer eyJraWQiOiJDWXRkeEVrS0FId0Rob3hCZ05qSlNNeHR4b3RwaEFVX1VBUnNLTlZlemNRIiwiYWxnIjoiUlMyNTYifQ.eyJ2ZXIiOjEsImp0aSI6IkFULlhoQmJXNE5sWXRCX1ZuakpsZnFXQXh6LXZETmZHOTBCY0tueFRyZXVHWDgub2Fyd2p5amQxZnJtU1h5UVY1ZDYiLCJpc3MiOiJodHRwczovL2lkcC5jbG91ZGJlZHMuY29tL29hdXRoMi9hdXNkNWcydTY5QmxKNFdBYzVkNiIsImF1ZCI6Imh0dHBzOi8vaG90ZWxzLmNsb3VkYmVkcy5jb20vYXBpIiwiaWF0IjoxNjc2NDY2ODI5LCJleHAiOjE2NzY0NzA0MjksImNpZCI6ImxpdmUxXzI1NzEzX244eFEwa1RzbHBPbVNXNFp5dDdkYmoxUCIsInVpZCI6IjAwdTZjZmY5d2cyc085UmJQNWQ3Iiwic2NwIjpbIm9mZmxpbmVfYWNjZXNzIl0sImF1dGhfdGltZSI6MTY3NjQ1NDA3Miwic3ViIjoib2JlbHRyYUBhbnNldGVjaC5jb20iLCJhc3NvY2lhdGlvbklkcyI6W10sInByb3BlcnR5SWRzIjpbMjU3MTNdLCJtZmRVc2VySWQiOjM1ODc5OCwidHlwZSI6InByb3BlcnR5In0.SeFwPJNKeggRdFTPwKDAXmIfnO0MbjTUaVzqROcy9YWHvaQcADf7osSKHd_WThlh45vkc_Rx1yr2LmWZKLus0mnTg8rAqseuhAjQUmFDy6s0ZnTSFGLtXDS0j0kp0NlWqtCd0MDEcUwwUbajtahGzXp8mA8iLKgFrP9z3d1POhptYFXrN_tahIASDEtiMo9yPmo1CuZrL7BirsHMpJS_oGYNtH8s4mVmRaJo1rivWlh2rI75d-7QPpRG3iQcR7MpVuUieDDT45PdVKcdjubVBoB95jVdf-GpqvCmyhnNq2lO3oRuKK4WSNPZaiVTcfH1D7iYzy-a1W16DywD0kfoEQ");
myHeaders.append("Cookie", "acessa_session=a5de10117e01531cc0fb1c73c6308150080aa6ef; acessa_session_enabled=1; csrf_accessa_cookie=0ac0bba0bffb21019b3ee6bfc978303c; HotelLng=en");

var requestOptions = {
  method: 'GET',
  headers: myHeaders,
  redirect: 'follow'
};

ResID= await fetch("https://hotels.cloudbeds.com/api/v1.1/getReservation?reservationID=2603367249555", requestOptions)
  .then(response => response.text())
  .catch(error => console.log('error', error));
      if (ResID) { 
        console.log("Reservation ID de la mort" + ResID);
      }
    
  });




app.listen(port, () => console.log(`Example app listening on port ${port}!`));



  
  