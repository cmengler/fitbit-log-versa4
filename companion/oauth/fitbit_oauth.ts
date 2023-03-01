import { FITBIT_CLIENT_ID, FITBIT_CLIENT_SECRET, FITBIT_SCOPES } from '../../common/oauth.secret';
import { btoa } from './base64_polyfill';
import { urlEncode } from './url_encode';

export const getFitbitApiToken = async (exchangeCode: string, grantType = 'authorization_code') => {
  const tokenRequest: RequestInit = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: 'Basic ' + btoa(FITBIT_CLIENT_ID + ':' + FITBIT_CLIENT_SECRET),
    },
    body: urlEncode({
      grant_type: grantType,
      client_id: FITBIT_CLIENT_ID,
      client_secret: FITBIT_CLIENT_SECRET,
      scope: FITBIT_SCOPES,
      code: grantType === 'authorization_code' ? exchangeCode : null,
      refresh_token: grantType === 'refresh_token' ? exchangeCode : null,
      redirect_uri: 'https://app-settings.fitbitdevelopercontent.com/simple-redirect.html',
    }),
  };

  return await fetch('https://api.fitbit.com/oauth2/token', tokenRequest)
    .then((data) => {
      return data.json();
    })
    .catch((err) => {
      //console.log('Error on token generation ' + err);
    });
};
