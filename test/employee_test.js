
//Require the dev-dependencies
const chai           = require('chai');
const chaiHttp       = require('chai-http');
const app         = require('../app');
const should         = chai.should();
const expect         = chai.expect;


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


describe('/POST Employee', () => {
    // with error, pages is required
    it('Adding an employee', (done) => {
      let employee = { 
        "firstName": "sp12321",
        "address": "mumbai",
        "mobileNo": "9876543210",
        "designation": "Software Eng.",
        "location": "India",
        "isDeleted": "false"
    }
      chai.request(app)
        .post('/api/employees')
        .send( employee )
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res).to.be.an('object');
          done();
        });
    });
});