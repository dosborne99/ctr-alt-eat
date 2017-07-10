exports.DATABASE_URL = process.env.DATABASE_URL ||
                       global.DATABASE_URL ||
                       'mongodb://localhost/ctr-alt-eat-app';
exports.TEST_DATABASE_URL = (
    process.env.TEST_DATABASE_URL ||
    'mongodb://localhost/ctr-alt-eat-app');
exports.PORT = process.env.PORT || 3000;