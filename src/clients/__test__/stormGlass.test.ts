import { StormGlass } from '@src/clients/stormGlass';
import * as stormglassWeatherPointFixture from '@test/fixtures/stormGlass_weather_3_hours.json';
import stormglassNormalizedResponseFixture from '@test/fixtures/stormGlass_normalize_response_3_hours.json';
import axios from 'axios';

jest.mock('axios');

describe('StormGlass client', () => {
  const mockedAxios = axios as jest.Mocked<typeof axios>;

  it('should return the normalized forecast from the StormGlass service', async () => {
    const lat = -23.46838;
    const lng = -51.90838;

    mockedAxios.get.mockResolvedValue({ data: stormglassWeatherPointFixture });

    const stormGlass = new StormGlass(mockedAxios);
    const response = await stormGlass.fetchPoints(lat, lng);
    expect(response).toEqual(stormglassNormalizedResponseFixture);
  });

  it('should excçide incomplete data points', async() => {
    const lat = -23.46838;
    const lng = -51.90838;
    const incompleteResponse = {
      hours: [
        {
          windDirections: {
            noaa: 300,
          },
          time: '2020-04-26T00:00:00+00:00',
        },
      ],
    };
    mockedAxios.get.mockResolvedValue({ data: incompleteResponse });

    const stormGlass = new StormGlass(mockedAxios);
    const response = await stormGlass.fetchPoints(lat, lng);
    expect(response).toEqual([]);
  })

  it('should get a generic error from StormGlass service when the request fail before reaching the service', async () => {
    const lat = -23.46838;
    const lng = -51.90838;

    mockedAxios.get.mockRejectedValue({ message: 'Network error'});

    const stormGlass = new StormGlass(mockedAxios);

    await expect(stormGlass.fetchPoints(lat, lng)).rejects.toThrow(
      'Unexpected error when trying to communicate to StormGlass: Network error'
    );
  });

  it('should get an StormGlassReponseError when the StormGlass  service responds with erro', async () => {
    const lat = -23.46838;
    const lng = -51.90838;

    class FakeAxiosError extends Error {
      constructor(public response: object){
        super();
      }
    }
    mockedAxios.get.mockRejectedValue(
      new FakeAxiosError({
        status:429,
        data:{ errors: ['Rate limit reached'] },
      })
    );

    const stormGlass = new StormGlass(mockedAxios);

    await expect(stormGlass.fetchPoints(lat, lng)).rejects.toThrow(
    'Unexpected error returned by the StormGlass service: Error: {"errors":["Rate limit reached"]} Code: 429'
    );
  });
});