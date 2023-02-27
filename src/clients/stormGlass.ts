import axios ,{ AxiosError, AxiosStatic } from "axios";
import { InternalError } from '@src/util/errors/internal-errors';

export interface stormGLassPointSource {
    [key:string]: number;
}

export interface stormGlassPoint {
    readonly time: string;
    readonly waveHeight: stormGLassPointSource;
    readonly waveDirection: stormGLassPointSource;
    readonly swellDirection:stormGLassPointSource;
    readonly swellHeight:stormGLassPointSource;
    readonly swellPeriod:stormGLassPointSource;
    readonly windDirection:stormGLassPointSource;
    readonly windSpeed:stormGLassPointSource;

}

export interface StormGlassForecastResponse {
    hours: stormGlassPoint[];
}

export interface ForecastPoint {
    time: string;
    waveHeight: number;
    waveDirection: number;
    swellDirection: number;
    swellHeight: number;
    swellPeriod: number;
    windDirection: number;
    windSpeed: number;
}

export class ClientRequestError extends InternalError {
    constructor(message: string) {
        const internalMessage = 
        'Unexpected error when trying to communicate to StormGlass';
        super(`${internalMessage}: ${message}`);
    }
}

export class StormGlassReponseError extends InternalError {
    constructor(message: string){
        const internalMessage = 
        'Unexpected error returned by the StormGlass service';
        super(`${internalMessage}: ${message}`);
    }
}

export class StormGlass {
    readonly stormGlassApiParams =  
    'swellDirection,swellHeight,swellPeriod,waveDirection,waveHeight,windDirection,windSpeed';
    readonly stormGlassApiSource = 'noaa'

    constructor(protected resquest: AxiosStatic ){}

    public async fetchPoints(lat: number, lng: number): Promise<ForecastPoint[]>{
        try{
        const response =  await this.resquest.get<StormGlassForecastResponse>(
            `https://api.stormglass.io/v2/weather/point?lat=${lat}&lng=${lng}&params=${this.stormGlassApiParams}&source=${this.stormGlassApiSource}`,
            {
                headers: {
                    Authorization: 'fake-token',
                }
            }
        );
        return this.normalizeResponse((await response).data);
        }catch(err){
            const axiosError = err as AxiosError;
            if(
                axiosError instanceof Error &&
                axiosError.response &&
                axiosError.response.status
            ){
                throw new StormGlassReponseError(
                    `Error: ${JSON.stringify(axiosError.response.data)} Code: ${axiosError.response.status}`
                );
            }
            throw new ClientRequestError((err as {message: any}).message);   
        }
    }

    private normalizeResponse(
        points: StormGlassForecastResponse
        ): ForecastPoint[] {
        return points.hours.filter(this.isValidPoint.bind(this)).map((point) => ({
            swellDirection: point.swellDirection[this.stormGlassApiSource],
            swellHeight: point.swellHeight[this.stormGlassApiSource],
            swellPeriod: point.swellPeriod[this.stormGlassApiSource],
            time: point.time,
            waveDirection: point.waveDirection[this.stormGlassApiSource],
            waveHeight: point.waveHeight[this.stormGlassApiSource],
            windDirection: point.windDirection[this.stormGlassApiSource],
            windSpeed: point.windSpeed[this.stormGlassApiSource],
        }));

    }

    private isValidPoint(point: Partial<stormGlassPoint>): boolean {
       return !!(
        point.time &&
        point.swellDirection?.[this.stormGlassApiSource] &&
        point.swellHeight?.[this.stormGlassApiSource] &&
        point.swellPeriod?.[this.stormGlassApiSource] &&
        point.waveDirection?.[this.stormGlassApiSource] &&
        point.waveHeight?.[this.stormGlassApiSource] &&
        point.windDirection?.[this.stormGlassApiSource] &&
        point.windSpeed?.[this.stormGlassApiSource]
       );
    }
}