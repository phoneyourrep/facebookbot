const botBuilder = require('claudia-bot-builder');

module.exports = botBuilder(function (message) {
  return 'Hello World';
});
