const Queue = require('bull');
const logger = require('winston');
const { setQueues } = require('bull-board');
const Config = require('../../../config');

const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';
const requestNamespace = `baseline:messenger:sendMessage:req`;
const responseNamespace = `baseline:messenger:sendMessage:res`;

let sendMessageReqQueue;
let sendMessageResQueue;

try {
  sendMessageReqQueue = new Queue(requestNamespace, redisUrl);
  logger.debug(`SUCCESS: connected to bull queue "${requestNamespace}" at ${redisUrl}`);
  sendMessageResQueue = new Queue(responseNamespace, redisUrl);
  logger.debug(`SUCCESS: connected to bull queue "${responseNamespace}" at ${redisUrl}`);
} catch (error) {
  logger.error(`ERROR: could not connect to bull queue "baseline:messenger:sendMessage" at ${redisUrl}`);
}

// Adding Queue to BullBoard Admin UI
setQueues([sendMessageReqQueue, sendMessageResQueue]);

sendMessageReqQueue.process(`${__dirname}/processSendMessage.js`);

module.exports = {
  sendMessageReqQueue,
  sendMessageResQueue,
};
