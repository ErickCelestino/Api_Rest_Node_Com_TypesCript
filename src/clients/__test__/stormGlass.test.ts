import { StormGlass } from '@src/clients/stormGlass';


describe('StormGlass client', () => {
    it('should return the normalized forecast from the StormGlass service', async() => {
        const lat = -23.46838;
        const lng = -51.90838;

        const stotmGlass = new StormGlass();
        const response = await stotmGlass.fetchPoints(lat, lng);
        expect(response).toEqual({});
    });
});