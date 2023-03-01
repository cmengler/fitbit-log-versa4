import * as messaging from 'messaging';
import { settingsStorage } from 'settings';
import FitbitApi from './api/api';
import { getFitbitApiToken } from './oauth/fitbit_oauth';

const fbApi = new FitbitApi();

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
settingsStorage.onchange = async (evt) => {
  // Received new OAuth code
  if (evt.key === 'oauth_code' && evt.newValue) {
    // Fetch refresh token
    let token = await getFitbitApiToken(evt.newValue);
    settingsStorage.setItem('refresh_token', token.refresh_token);

    await initialize();
  }
};

// Message socket opens
messaging.peerSocket.onopen = async () => {
  await initialize();

  // Generate new access/refresh token every 6 hours (default expiry is 8 hours)
  setInterval(() => generateAccessToken(), 6 * 60 * 60 * 1000);
};

// Message socket receives data from app
messaging.peerSocket.onmessage = (evt) => {
  if (evt.data.weight != null) {
    fbApi.updateWeight(evt.data.weight).then(() => {
      fetchWeightData();
    });
  }
  if (evt.data.water != null) {
    fbApi.logWater(evt.data.water).then(() => {
      fetchWaterData();
    });
  }
};

// Generate access token from stored refresh token
const generateAccessToken = async () => {
  const refreshToken = settingsStorage.getItem('refresh_token');

  if (refreshToken == null) {
    // TODO: If no `refreshToken` exists, indicate to app that user is required to login
    return;
  }

  let token = await getFitbitApiToken(refreshToken, 'refresh_token');

  if (token.errors) {
    //console.log(`[Companion] Error while generating access token  ${JSON.stringify(token)}`);
    settingsStorage.setItem('refresh_token', '');

    // TODO: Indicate to app that user is required to login
    return;
  }

  //console.log(`[Companion] Generated access token  ${JSON.stringify(token)}`);

  settingsStorage.setItem('access_token', token.access_token);
  settingsStorage.setItem('refresh_token', token.refresh_token);

  fbApi.setAccessToken(token.access_token);
};

// Initialise app
const initialize = async () => {
  //console.log('Initializing app...');

  try {
    await generateAccessToken();
  } catch (error) {
    //console.log(`[Companion] Error while generating access token  ${error}`);

    // Re-try initialisation
    setTimeout(() => initialize(), 10 * 1000);
    return;
  }

  // Fetch current user
  fbApi.getUser().then((result) => {
    if (result.success) {
      // Store current user display name
      settingsStorage.setItem('current_user_name', result.display_name);

      // Fetch weight and water data
      fetchWeightData();
      fetchWaterData();
    }
  });
};
