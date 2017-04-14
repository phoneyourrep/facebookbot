const botBuilder = require('claudia-bot-builder');
const rp = require('minimal-request-promise');
const zipcodes = require('zipcodes');
const _ = require('lodash');


function getRepresentatives(zip) {
  const lookup = zipcodes.lookup(zip);

  const options = {
    method: 'GET',
    hostname: 'phone-your-rep.herokuapp.com',
    path: `/reps?&lat=${lookup.latitude}&long=${lookup.longitude}`
  };

  return rp(options).then(response => {

    const fbTemplate = botBuilder.fbTemplate;

    const reps = JSON.parse(response.body);

    return _.map(reps, (rep) => {
      return new fbTemplate.Button(rep.official_full)
        .addCallButton('N.Y.C', '+9292823681')
        .get();
    });

  }).catch(err => `API fail ${err}`);
}

module.exports = botBuilder((message, apiReq) => {
  apiReq.lambdaContext.callbackWaitsForEmptyEventLoop = false;

  try {
    return getRepresentatives(message.text)
  } catch(err) {
    return err;
  };
});
