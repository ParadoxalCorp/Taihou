const nodePackage = require('../package.json');

const constants = {
    productionBaseURL: 'https://api.weeb.sh',
    stagingBaseURL: 'https://staging.weeb.sh',
    defaultUserAgent: `Taihou/${nodePackage.version}`,
    timeout: 15000,
    toph: {
        requestsPerMinute: 1000
    },
    korra: {
        requestsPerMinute: 60
    },
    tama: {
        requestsPerMinute: 500
    },
    shimakaze: {
        requestsPerMinute: 500
    },
    endpoints: {
        GET_USER_REPUTATION: (botID, userID) => `/reputation/${botID}/${userID}`,
        GIVE_REPUTATION: (botID, targetID) => `/reputation/${botID}/${targetID}`
    }
};

module.exports = constants;