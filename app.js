const express = require("express");
const app = express();
const fs = require("fs");
const { get } = require("http");
import("node-fetch");
var accessToken;
var refreshToken;
const port = process.env.PORT || 3001;
app.use(express.json());
//call the function periodically
getNewAccessToken();
setInterval(getNewAccessToken, 1000 * 60 * 31);
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
  };
  res.send(msg);
  const ReservationID = msg.body.reservationID;
  console.log("ReservationID" + ReservationID);
  order(ReservationID)
});

//function to call the functions in order
async function order(ReservationID){
  var guestInfo = await getReservation(ReservationID);
  sendData(guestInfo)
}
//function to get the reservation details
async function getReservation(ReservationID){
  var myHeaders = new Headers();
  myHeaders.append("Authorization", "Bearer " + accessToken);
  myHeaders.append(
    "Cookie",
    "acessa_session=a5de10117e01531cc0fb1c73c6308150080aa6ef; acessa_session_enabled=1; csrf_accessa_cookie=0ac0bba0bffb21019b3ee6bfc978303c; HotelLng=en"
  );
  var requestOptions = {
    method: "GET",
    headers: myHeaders,
    redirect: "follow",
  };
  const resul = await fetch(
    "https://hotels.cloudbeds.com/api/v1.1/getReservation?reservationID=" +
      ReservationID,
    requestOptions
  )
    .then((response) => response.text())
    .catch((error) => console.log("error", error));
  if (resul) {
    const reservation = JSON.parse(resul);
    if (reservation.success == true) {
      const guest = Object.values(reservation.data.guestList)[0];
      const guest_language = guest.guestCountry;
      const room_id = guest.roomName;
      const guest_lastname = reservation.data.guestName;
      const status = reservation.data.status;
      const guestgender = guest.guestGender;
      const hotel_id = reservation.data.propertyID;
      const guestInfo = {
        RI: status,
        SI: hotel_id,
        RN: room_id,
        GN: guest_lastname,
        GL: guest_language,
        GQ: guestgender,
      };
      console.log(guestInfo);
      return guestInfo;
    }
  }
}
//function to send the data to interface.js
async function sendData(guestInfo){
  switch(guestInfo.RI) {
  case 'checked_in':
    guestInfo.RI = "GI";
    guestInfo.SI = "Marianne"
    break;
  case 'checked_out':
    guestInfo.RI = "GO";
    guestInfo.SI = "Marianne"
    break;
  }
  fetch('https://hospitality.dev.ansetech.com:7001/api/interface', {
  method: 'POST',
  body: JSON.stringify(guest_info),
  headers: {
    'Content-Type': 'application/json'
  }
})
.then(response => {
  console.log(response);
})
}
//function to get the new accesstoken and refreshtoken
async function getNewAccessToken() {
  const tokenData = fs.readFileSync("token.json").toString();
  const token = JSON.parse(tokenData);
  accessToken = token.access_token;
  refreshToken = token.refresh_token;
  var myHeaders = new Headers();
  myHeaders.append(
    "Cookie",
    "acessa_session=a5de10117e01531cc0fb1c73c6308150080aa6ef; acessa_session_enabled=1; HotelLng=en"
  );
  var formdata = new FormData();
  formdata.append("grant_type", "refresh_token");
  formdata.append("client_id", "live1_25713_n8xQ0kTslpOmSW4Zyt7dbj1P");
  formdata.append("client_secret", "r5JKaS7Tc6kOy9q2xIDEHpYjWvuXdBVl");
  formdata.append("refresh_token", refreshToken);
  var requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: formdata,
    redirect: "follow",
  };
  resulut = await fetch(
    "https://hotels.cloudbeds.com/api/v1.1/access_token",
    requestOptions
  )
    .then((response) => response.text())
    .catch((error) => console.log("error", error));
  const resultat1 = JSON.parse(resulut);
  accessToken = resultat1.access_token;
  if (resulut) {
    fs.writeFileSync("token.json", resulut);
    //console.log("resulut:  "+resulut)
    console.log("New access token generated");
  }
}
app.listen(port, () => console.log(`Example app listening on port ${port}!`));
  