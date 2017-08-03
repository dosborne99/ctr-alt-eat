const chai = require('chai');
const chaiHttp = require('chai-http');
const faker = require('faker');
const mongoose = require('mongoose');

const expect = chai.expect;

const Recipe = require('../models/recipe');
const User = require('../models/user');

const {closeServer, runServer, app} = require('../app');
const {TEST_DATABASE_URL} = require('../config');

chai.use(chaiHttp);

function createFakeUser() {
    console.info('creating fake user');
    const userData = {
        fullName: "Fake Chef",
        email: "FakeChef@usemyrecipes.com",
        password: "password"
    };
    return User.create(userData)
};

function seedRecipeData() {
  console.info('seeding recipe data');
  const seedData = [];
  let user;
  return User
    .findOne()
    .exec()
    .then(_user => {
        user = _user._id;
          for (let i=1; i<=10; i++) {
            seedData.push({
              user: user,
              title: faker.lorem.word(),
              description: faker.lorem.sentence(),
              ingredients: faker.lorem.text()
            });
          }
        return Recipe.insertMany(seedData);
    });  
};

function tearDownDb() {
  return new Promise((resolve, reject) => {
    console.warn('Deleting database');
    mongoose.connection.dropDatabase()
      .then(result => resolve(result))
      .catch(err => reject(err))
  });
};

describe('recipe API resource', function() {

  before(function() {
    return runServer(TEST_DATABASE_URL);
  });

  before(function() {
    return createFakeUser();
  })

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

        it('should return all existing recipes for specific user', function() {
        let res;
        let agent = chai.request.agent(app);
        
        return User
            .findOne()
            .exec()
            .then(user => {
                return agent
                    .post('/users/login')
                    .send({email: user.email, password: "password"})
            })
            .then(() => {
                return agent
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
});