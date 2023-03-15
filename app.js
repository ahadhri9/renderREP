const express = require("express");
const app = express();
const fs = require("fs");
import("node-fetch");
var accessToken;
var refreshToken;
const port = process.env.PORT || 3001;
app.use(express.json());
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
// Call this function periodically to check if the access token has expired and generate a new one if needed
getNewAccessToken();
setInterval(getNewAccessToken, 1000 * 60 * 31); // Check every 30 minutes
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
  console.log(msg);
  const ReservationID = msg.body.reservationID;
  console.log("ReservationID" + ReservationID);
  //function to get the reservationID
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
    console.log("Reservation: " + resul);
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
        status: status,
        hotel_id: hotel_id,
        room_id: room_id,
        guest_lastname: guest_lastname,
        guest_language: guest_language,
        guest_title: guestgender,
      };
      console.log(guestInfo);
      var myHeaders2 = new Headers();
      myHeaders2.append("Authorization", "Bearer " + accessToken);
      myHeaders2.append(
        "Cookie",
        "acessa_session=a5de10117e01531cc0fb1c73c6308150080aa6ef; acessa_session_enabled=1; csrf_accessa_cookie=aa03c1f2b14d99081cb6cab7518a5e80; HotelLng=en"
      );

      var requestOptions2 = {
        method: "GET",
        headers: myHeaders2,
        redirect: "follow",
      };

      const hotel = await fetch(
        "https://hotels.cloudbeds.com/api/v1.1//getHotels?propertyID=" +
          hotel_id,
        requestOptions2
      )
        .then((result) => console.log(result))
        .catch((error) => console.log("error", error));
      const hotelName = JSON.parse(hotel);
      const Hotell = hotelName.data.propertyName;
      console.log(Hotell);

      console.log(hotel);
      // switch (guestInfo.status) {
      //   case "checked_out":
      //     console.log(guestInfo);
      //     break;
      //   case "checkin":
      //     console.log(guestInfo)
      // }
    }
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
.catch(error => {
  console.error(error);
});

});
app.listen(port, () => console.log(`Example app listening on port ${port}!`));
  