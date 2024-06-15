const chai = require('chai');
const supertest = require("supertest");
const chaiJsonSchema = require('chai-json-schema');
const readJsonSchma = require('../helper/helper');

const baseURL = "https://api.restful-api.dev";

chai.use(chaiJsonSchema)
const expect = chai.expect;

describe("restful-api.dev API Test", () => {
    var createdId;
    it("TC1 - GET Single Object", async () => {
        const schema = readJsonSchma('get_single_object_schema.json')
        const response = await supertest(baseURL)
            .get("/objects/7");

            
        expect(response.status).to.equal(200)
        expect(response.body.id).to.equal("7")
        expect(response.body.data.year).to.equal(2019)
        expect(response.body.data['CPU model']).to.contain("Intel")

        expect(response.body).to.be.jsonSchema(schema)
    });

    it("TC2 - POST object", async () => {
        const body = {
            "name": "Macbook Pro 2025",
            "data": {
                "year": 2024,
                "price": 1849.99,
                "CPU model": "Intel Core i9",
                "Hard disk size": "1 TB"
            }
        }

        const response = await supertest(baseURL)
            .post("/objects")
            .send(body);

        createdId = response.body.id
    });

    it("TC3 - DELETE Single Object", async () => {
        const response = await supertest(baseURL)
            .delete(`/objects/${createdId}`);
        expect(response.status).to.equal(200)
    });

    it("TC4 - GET Single Object With Invalid Id", async () => {
        const response = await supertest(baseURL)
            .get("/objects/999999999999999999999999999999999999999999999999999999999999");

        console.log(response.body)
        expect(response.status).to.equal(4046)
        expect(response.body.error).to.contain("was not found")
    });
});
