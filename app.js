import("node-fetch");

const express = require("express");
const app = express();
const fs = require("fs");

const port = process.env.PORT || 3001;

var accessToken;
var refreshToken;

//function to get a new access token using the refresh token
async function getNewAccessToken() {
  if (accessToken == undefined || refreshToken == undefined) {
    const tokenData = fs.readFileSync("token.json").toString();
    const token = JSON.parse(tokenData);

    accessToken = token.access_token;
    refreshToken = token.refresh_token;
  }

  const myHeaders = new Headers();
  myHeaders.append(
    "Cookie",
    "acessa_session=a5de10117e01531cc0fb1c73c6308150080aa6ef; acessa_session_enabled=1; HotelLng=en"
  );

  const formdata = new FormData();
  formdata.append("grant_type", "refresh_token");
  formdata.append("client_id", "live1_25713_n8xQ0kTslpOmSW4Zyt7dbj1P");
  formdata.append("client_secret", "r5JKaS7Tc6kOy9q2xIDEHpYjWvuXdBVl");
  formdata.append("refresh_token", refreshToken);

  const requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: formdata,
    redirect: "follow",
  };

  const result = await fetch(
    "https://hotels.cloudbeds.com/api/v1.1/access_token",
    requestOptions
  ).then((response) => response.text());

  if (!result) return;
  const resultat = JSON.parse(result);
  accessToken = resultat.access_token;
  refreshToken = resultat.refreshToken;

  fs.writeFileSync("token.json", result);
  console.log("New access token generated");
}

//function to use the access token to get all the info on the reservation and the hotel
async function getInfo(reservationID) {
  const guestInfo = await getGuestInfo(reservationID);
  getHotelName(guestInfo.hotel_id);
}

async function getGuestInfo(reservationID) {
  //function to get the reservation from ths reservationID
  const myHeaders = new Headers();
  myHeaders.append("Authorization", "Bearer " + accessToken);
  myHeaders.append(
    "Cookie",
    "acessa_session=a5de10117e01531cc0fb1c73c6308150080aa6ef; acessa_session_enabled=1; csrf_accessa_cookie=0ac0bba0bffb21019b3ee6bfc978303c; HotelLng=en"
  );

  const requestOptions = {
    method: "GET",
    headers: myHeaders,
    redirect: "follow",
  };

  const resul = await fetch(
    "https://hotels.cloudbeds.com/api/v1.1/getReservation?reservationID=" +
      reservationID,
    requestOptions
  );

  if (!resul) return; //TODO
  const reservation = JSON.parse(resul);
  if (reservation.success != true) return; //TODO
  //Future TODO class implementation
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
  return guestInfo;
}

async function getHotelName(hotelId) {
  const myHeaders = new Headers();
  myHeaders.append("Authorization", "Bearer " + accessToken);
  myHeaders.append(
    "Cookie",
    "acessa_session=a5de10117e01531cc0fb1c73c6308150080aa6ef; acessa_session_enabled=1; csrf_accessa_cookie=aa03c1f2b14d99081cb6cab7518a5e80; HotelLng=en"
  );

  const requestOptions = {
    method: "GET",
    headers: myHeaders,
    redirect: "follow",
  };

  const hotelinfo = await fetch(
    "https://hotels.cloudbeds.com/api/v1.1//getHotels?propertyID=" + hotelId,
    requestOptions
  );

  const hotel = JSON.parse(hotelinfo);
  const hotelname = hotel.data.propertyName;
  console.log(hotelname);
}

//function that defines the order of the functions getInfo() and getNewAccessToken()
async function order(reservationID) {
  await getNewAccessToken();
  getInfo(reservationID);
}

app.use(express.json());
//get a msg everytime a webhook is received
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
  res.status(200);
  const reservationID = msg.body.reservationID;
  order(reservationID);
});

setInterval(getNewAccessToken, 1000 * 60 * 31); // get a new access token every 31 minutes
