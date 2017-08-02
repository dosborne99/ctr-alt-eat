const chai = require('chai');
const chaiHttp = require('chai-http');
const faker = require('faker');
const mongoose = require('mongoose');

const expect = chai.expect;

const {DATABASE_URL} = require('../config');
const Recipe = require('../models/recipe');
const {closeServer, runServer, app} = require('../app');
const {TEST_DATABASE_URL} = require('../config');

chai.use(chaiHttp);

describe('Mocha Connection', function() {
    it('sanity check to make sure all is well', function() {
        expect(true).to.be.true;
    });
});

function seedRecipeData() {
  console.info('seeding recipe data');
  const seedData = [];
  for (let i=1; i<=10; i++) {
    seedData.push({
      title: faker.lorem.word(),
      description: faker.lorem.sentence(),
      ingredients: faker.lorem.text()
    });
  }
  // this will return a promise
  return Recipe.insertMany(seedData);
}

function tearDownDb() {
  return new Promise((resolve, reject) => {
    console.warn('Deleting database');
    mongoose.connection.dropDatabase()
      .then(result => resolve(result))
      .catch(err => reject(err))
  });
}

describe('recipe API resource', function() {

  before(function() {
    return runServer(TEST_DATABASE_URL);
  });

  beforeEach(function() {
    return seedRecipeData();
  });

  afterEach(function() {
    return tearDownDb();
  });

  after(function() {
    return closeServer();
  });

    describe('GET recipes endpoint', function() {

        it('should return all existing recipes', function() {
        let res;
        return chai.request(app)
            .get('/recipes/myrecipes')
            .then(_res => {
                res = _res;
                expect(res).to.have.status(200);
                expect(res.body).to.have.lengthOf.at.least(1);

                return Recipe.count();
            })
            .then(count => {
                expect(res.body).to.have.lengthOf(count);
            });
        });
    });
});