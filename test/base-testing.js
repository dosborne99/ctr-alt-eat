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
    console.info('Creating fake user');
    const userData = {
        fullName: "Fake Chef",
        email: "FakeChef@usemyrecipes.com",
        password: "password"
    };
    return User.create(userData);
};

function seedRecipeData() {
    console.info('Seeding recipe data');
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
                ingredients: faker.lorem.text(),
                directions: faker.lorem.text()
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

describe('My Recipes API resource', function() {

  before(function() {
    return runServer(TEST_DATABASE_URL);
  });

  beforeEach(function() {
    return createFakeUser()
    .then(seedRecipeData);
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
        
        it('Should return recipes with correct fields', function() {

        let resRecipe;
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
                    .then(res => {

                        expect(res).to.have.status(200);
                        expect(res).to.be.json;
                        expect(res.body).to.be.an('array');
                        expect(res.body).to.have.lengthOf.at.least(1);

                        res.body.forEach(function(recipe) {
                            expect(recipe).to.be.an('object');
                            expect(recipe).to.include.keys('user', 'title', 'description', 'ingredients', 'directions');
                        });
                        // just check one of the posts that its values match with those in db
                        // and we'll assume it's true for rest
                        resRecipe = res.body[0];
                        return Recipe.findById(resRecipe._id).exec();
                    })
                    .then(recipe => {
                        expect(resRecipe.title).to.equal(recipe.title);
                        expect(resRecipe.description).to.equal(recipe.description);
                        expect(resRecipe.ingredients).to.equal(recipe.ingredients);
                        expect(resRecipe.directions).to.equal(recipe.directions);
                    });
            });
        });
    });

    describe('POST recipe endpoint', function() {

        it('should add a new blog post', function() {

            const newRecipe = {
              title: faker.lorem.word(),
              description: faker.lorem.sentence(),
              ingredients: faker.lorem.text(),
              directions: faker.lorem.text()
            };

            return chai.request(app)
                .post('/recipes/create')
                .send(newRecipe)
                .then(function(res) {
                    expect(res).to.have.status(201);
                    expect(res).to.be.json;
                    expect(res.body).to.be.an('object');
                    expect(res.body).to.include.keys('_id', 'title', 'description', 'ingredients', 'directions');
                    expect(res.body.title).to.equal(newRecipe.title);
                    expect(res.body.description).to.equal(newRecipe.description);
                    expect(res.body.ingredients).to.equal(newRecipe.ingredients);
                    expect(res.body.directions).to.equal(newRecipe.directions);
                    return Recipe.findById(res.body._id).exec();
                })
                .then(function(recipe) {
                    expect(recipe.title).to.equal(newRecipe.title);
                    expect(recipe.description).to.equal(newRecipe.description);
                    expect(recipe.ingredients).to.equal(newRecipe.ingredients);
                    expect(recipe.directions).to.equal(newRecipe.directions);
                });
        });
    });

    describe('PUT recipe endpoint', function() {

        it('should update fields you send over', function() {
            const updateData = {
                title: 'Whole New Recipe',
                description: 'A change in the recipe description',
                ingredients: 'New item 1, and new item 2',
                directions: 'Brand new directions'
            };

            return Recipe
                .findOne()
                .exec()
                .then(recipe => {
                    updateData.id = recipe._id;

                    return chai.request(app)
                        .put(`/recipes/${recipe._id}`)
                        .send(updateData);
                })
                .then(() => {
                    return Recipe.findById(updateData.id).exec();
                })
                .then(recipe => {
                    expect(recipe.title).to.equal(updateData.title);
                    expect(recipe.description).to.equal(updateData.description);
                    expect(recipe.ingredients).to.equal(updateData.ingredients);
                    expect(recipe.directions).to.equal(updateData.directions);
                });
        });
    });

    describe('DELETE recipe endpoint', function() {

        it('Should delete a recipe by id', function() {

            let recipe;

            return Recipe
                .findOne()
                .exec()
                .then(_recipe => {
                    recipe = _recipe;
                    return chai.request(app).delete(`/recipes/${recipe._id}`);
                })
                .then(res => {
                    expect(res).to.have.status(204);
                    return Recipe.findById(recipe._id);
                })
                .then(_recipe => {
                    expect(null).to.be.null;
                });
        });
    });
});