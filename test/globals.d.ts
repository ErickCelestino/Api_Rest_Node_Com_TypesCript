//Para adicionar tipos aos super tipos globais
declare global {
    
    var testRequest: import('supertest').SuperTest<import('supertest').Test>;
    
}
export {};