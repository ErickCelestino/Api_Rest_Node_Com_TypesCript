// import { StormGlass } from '@src/clients/stormGlass';
// import * as stormGlassWather3HoursFixture from '@test/fixtures/stormGlass_weather_3_hours.json';
// import stormGlassNormalized3HoursFixture from '@test/fixtures/stormGlass_normalize_response_3_hours.json';
// import axios from 'axios';
// jest.mock('axios');

// describe('StormGlass client', () => {
//     const mockedAxios = axios as jest.Mocked<typeof axios>;
//     it('should return the normalized forecast from the StormGlass service', async() => {
//         const lat = -23.46838;
//         const lng = -51.90838;

//         mockedAxios.get.mockResolvedValue({ data: stormGlassWather3HoursFixture});

//         const stormGlass = new StormGlass(mockedAxios);
//         const response = await stormGlass.fetchPoints(lat, lng);
//         expect(response).toEqual(stormGlassNormalized3HoursFixture);
//     });
// });

import { StormGlass } from '@src/clients/stormGlass';
import * as stormglassWeatherPointFixture from '@test/fixtures/stormGlass_weather_3_hours.json';
import stormglassNormalizedResponseFixture from '@test/fixtures/stormGlass_normalize_response_3_hours.json';
import axios from 'axios';

jest.mock('axios');

describe('StormGlass client', () => {
  const mockedAxios = axios as jest.Mocked<typeof axios>;
  it('should return the normalized forecast from the StormGlass service', async () => {
    const lat = -33.792726;
    const lng = 151.289824;

    mockedAxios.get.mockResolvedValue({ data: stormglassWeatherPointFixture });

    const stormGlass = new StormGlass(mockedAxios);
    const response = await stormGlass.fetchPoints(lat, lng);
    expect(response).toEqual(stormglassNormalizedResponseFixture);
  });
});