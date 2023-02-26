// import supertest from "supertest";
// import { SetupServer } from "@src/server";
const supertest = require("supertest");
const SetupServer = require("@src/server");

beforeAll(() => {
    const server = new SetupServer();
    server.init();
    global.testRequest = supertest(server.getApp());
});