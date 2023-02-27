import * as messaging from 'messaging';
import { settingsStorage } from 'settings';
import FitbitApi from './api/api';

const fbApi = new FitbitApi(getAccessToken());

// Fetch weight data from Fitbit Web API
function fetchWeightData() {
  fbApi.getWeight().then((result) => {
    if (messaging.peerSocket.readyState === messaging.peerSocket.OPEN) {
      messaging.peerSocket.send({
        type: 'weight',
        value: result.weight,
      });
    }
  });
}

// Fetch water data from Fitbit Web API
function fetchWaterData() {
  fbApi.getWater().then((result) => {
    if (messaging.peerSocket.readyState === messaging.peerSocket.OPEN) {
      messaging.peerSocket.send({
        type: 'water',
        value: result.water,
      });
    }
  });
}

// User changes settings
settingsStorage.onchange = (evt) => {
  // Handle oAuth response from settings
  if (evt.key === 'oauth') {
    let data = JSON.parse(evt.newValue);
    fbApi.setAccessToken(data.access_token);
    fetchWeightData();
    fetchWaterData();
  }
};

function restoreSettings() {
  const accessToken = getAccessToken();
  if (accessToken !== null) {
    fetchWeightData();
    fetchWaterData();
  }
}

function getAccessToken() {
  for (let index = 0; index < settingsStorage.length; index++) {
    let key = settingsStorage.key(index);
    if (key && key === 'oauth') {
      return JSON.parse(settingsStorage.getItem(key)).access_token;
    }
  }
}

// Message socket opens
messaging.peerSocket.onopen = () => {
  restoreSettings();
};

// Message socket receives data from app
messaging.peerSocket.onmessage = (event) => {
  if (event.data.weight != null) {
    fbApi.updateWeight(event.data.weight).then(() => {
      fetchWeightData();
    });
  }
  if (event.data.water != null) {
    fbApi.logWater(event.data.water).then(() => {
      fetchWaterData();
    });
  }
};
