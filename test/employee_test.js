//Require the dev-dependencies
const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../app');
const should = chai.should();
const expect = chai.expect;


chai.use(require('chai-json-schema'));
chai.use(chaiHttp);

//get all emp
describe('/GET all Employee:', () => {
    it('it expect to GET all the Employee', (done) => {
        chai.request(app)
            .get('/api/employees')
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res).to.be.json;
                expect(res.body).to.be.an('array');
                done();
            });
    });
});

//get emp by id
describe('/GET Employee by id:', () => {
    var empId = 1;
    it('it expect to GET all the Employee', (done) => {
        chai.request(app)
            .get('/api/employees/' + empId)
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res).to.be.json;
                expect(res.body).to.be.an('array');
                done();
            });
    });
});

//post an employee
describe('/POST Employee', () => {
    it('Adding an employee', (done) => {
        let employee = {
            "firstName": "test-chai",
            "address": "Atartica",
            "mobileNo": "9876543210",
            "designation": "Programmer",
            "location": "Atartica",
            "isDeleted": "false"
        }
        chai.request(app)
            .post('/api/employees')
            .send(employee)
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res).to.be.an('object');
                done();
            });
    });
});

//patch an employee
describe('/Patch Employee', () => {
    it('Adding an employee', (done) => {
        let empId = 1;
        let employee = {
            "firstName": "wertyu",
        }
        chai.request(app)
            .patch('/api/employees/' + empId)
            .send(employee)
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res).to.be.an('object');
                done();
            });
    });
});


