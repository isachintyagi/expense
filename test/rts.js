let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../testServer');
let should = chai.should();
var expect = chai.expect;
chai.use(chaiHttp);


describe('/Get AllCustomers', () => {
    it('it should return all Custmer', (done) => {
        chai.request(server)
            .get('/ok')
            .end((err, res) => {
                //console.log( new Date(), __filename, res.body);
                expect(res).to.have.status(200);
                expect(res.body).to.have.property('success')
                expect(res.body.success).to.be.true;
                done();
            })
    })
})