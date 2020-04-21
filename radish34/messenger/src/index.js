const logger = require('winston');
const { startServer } = require('./server');
const { connect: dbConnect } = require('./db/connect');
const Config = require('../config');

// Import bull queues so they create redis connections
require('./queues/sendMessage');
require('./queues/receiveMessage');

const main = async () => {
  try {
    await dbConnect(process.env.MONGO_URL);
    await startServer(process.env.API_PORT || 8001);
  } catch (err) {
    logger.error(`Initialization error: ${err}`);
  }
};

main();
