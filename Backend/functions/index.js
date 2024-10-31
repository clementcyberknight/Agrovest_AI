const { onRequest } = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");
const admin = require("firebase-admin");
admin.initializeApp();

const axios = require("axios");
const functions = require("firebase-functions");
const cors = require("cors")({ origin: true });
const { getFirestore } = require("firebase-admin/firestore");
const db = getFirestore();

const soilapiKey = "AIzaSyDMTVmLr2EJsen0AFqB1ExQ1XkBXaxwUJc";
const depth = "0-20";

exports.getWeather = functions.https.onRequest(async (req, res) => {
  cors(req, res, async () => {
    try {
      const { lat, lon } = req.body.data; // Adjusted for Firebase functions syntax
      const apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=3b9e4f657643a8b9e3333c7a425afbf7`;
      const response = await axios.get(apiUrl);
      const weatherData = response.data;
      res.json({ data: weatherData });
    } catch (error) {
      logger.error("Error fetching weather data:", error);
      res.status(500).send({ error: "Failed to fetch weather data" });
    }
  });
});

// Soil API endpoint
exports.getSoilInformation = functions.https.onRequest((req, res) => {
  cors(req, res, async () => {
    if (req.method !== "POST") {
      return res.status(405).send("Method Not Allowed");
    }

    // Access `lat`, `lon`, and `property` from `req.body.data`
    const { lat, lon, property } = req.body.data || {}; // Updated to look for `req.body.data`

    if (!lat || !lon || !property) {
      return res
        .status(400)
        .send({ error: "Latitude, longitude, and property are required." });
    }

    const apiUrl = `https://api.isda-africa.com/v1/soilproperty?key=${soilapiKey}&lat=${lat}&lon=${lon}&property=${property}&depth=${depth}`;

    try {
      const response = await axios.get(apiUrl);
      const data = response.data;

      return res.status(200).send({
        success: true,
        message: "Soil data fetched successfully!",
        data: data,
      });
    } catch (error) {
      functions.logger.error("Error fetching soil data:", error);
      return res
        .status(500)
        .send({ error: "Something went wrong while fetching soil data." });
    }
  });
});
