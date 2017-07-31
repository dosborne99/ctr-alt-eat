exports.DATABASE_URL = process.env.DATABASE_URL ||
                       global.DATABASE_URL ||
                       'mongodb://localhost/my-recipes';
exports.TEST_DATABASE_URL = (
    process.env.TEST_DATABASE_URL ||
    'mongodb://localhost/my-recipes-test');
exports.PORT = process.env.PORT || 3000;