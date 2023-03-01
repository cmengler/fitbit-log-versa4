import { UserResult, WaterResult, WeightResult } from './result';

export default class FitbitApi {
  static baseUrl: string = 'https://api.fitbit.com/1/user/-';

  private accessToken: string;

  constructor(accessToken?: string) {
    this.setAccessToken(accessToken);
  }

  private request = async (method: string, query: string[]): Promise<Response> => {
    return fetch(query.join(''), {
      method: method,
      headers: {
        Authorization: `Bearer ${this.accessToken}`,
      },
    });
  };

  setAccessToken(accessToken: string) {
    this.accessToken = accessToken;
  }

  getUser = async (): Promise<UserResult> => {
    try {
      const response = await this.request('GET', [`${FitbitApi.baseUrl}/profile.json`]);

      const data = await response.json();

      return {
        success: true,
        display_name: data.user.displayName,
      };
    } catch (e) {
      return { success: false };
    }
  };

  getWeight = async (): Promise<WeightResult> => {
    let now = new Date();
    let todayDate = `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`; //YYYY-MM-DD
    let todayTime = `${now.getHours()}:${now.getMinutes() + 1}:${now.getSeconds()}`; // HH:mm:ss

    try {
      const response = await this.request('GET', [
        `${FitbitApi.baseUrl}/body/log/weight/list.json`,
        `?beforeDate=${todayDate}T${todayTime}`,
        '&offset=0',
        '&limit=1',
        '&sort=desc',
      ]);

      const data = await response.json();

      return {
        success: true,
        weight: data.weight[0].weight,
      };
    } catch (e) {
      return { success: false };
    }
  };

  updateWeight = async (weight: number): Promise<void> => {
    let now = new Date();
    let todayDate = `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`; // yyyy-MM-dd
    let todayTime = `${now.getHours()}:${now.getMinutes() + 1}:${now.getSeconds()}`; // HH:mm:ss

    try {
      const response = await this.request('POST', [
        `${FitbitApi.baseUrl}/body/log/weight.json`,
        `?weight=${weight}`,
        `&date=${todayDate}`,
        `&time=${todayTime}`,
      ]);

      const data = await response.json();

      // TODO: Handle response
    } catch (e) {
      // TODO: Handle exceptions
    }
  };

  getWater = async (): Promise<WaterResult> => {
    let now = new Date();
    let todayDate = `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`; //YYYY-MM-DD

    try {
      const response = await this.request('GET', [`${FitbitApi.baseUrl}/foods/log/water/date/${todayDate}.json`]);

      const data = await response.json();

      return {
        success: true,
        water: data.summary.water,
      };
    } catch (e) {
      return { success: false };
    }
  };

  logWater = async (water: number): Promise<void> => {
    let now = new Date();
    let todayDate = `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`; // yyyy-MM-dd

    try {
      const response = await this.request('POST', [
        `${FitbitApi.baseUrl}/foods/log/water.json`,
        `?amount=${water}`,
        `&date=${todayDate}`,
        `&unit=ml`,
      ]);

      const data = await response.json();

      // TODO: Handle response
    } catch (e) {
      // TODO: Handle exceptions
    }
  };
}
