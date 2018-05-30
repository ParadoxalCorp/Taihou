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
        //Shimakaze
        GET_SHIMAKAZE_STATUS: '/reputation',
        GET_USER_REPUTATION: (botID, userID) => `/reputation/${botID}/${userID}`,
        GIVE_REPUTATION: (botID, targetID) => `/reputation/${botID}/${targetID}`,
        RESET_USER_REPUTATION: (botID, targetID) => `/reputation/${botID}/${targetID}/reset`,
        //Toph
        GET_TOPH_STATUS: '/images',
        UPLOAD_IMAGE: '/images/upload',
        GET_RANDOM_IMAGE: '/images/random',
        GET_IMAGE_TYPES: '/images/types',
        GET_IMAGE_TAGS: '/images/tags',
        GET_IMAGE_INFO: (imageID) => `/images/info/${imageID}`,
        ADD_TAGS_TO_IMAGE: (imageID) => `/images/info/${imageID}/tags`,
        REMOVE_TAGS_FROM_IMAGE: (imageID) => `/images/info/${imageID}/tags`,
        DELETE_IMAGE: (imageID) => `/images/info/${imageID}`,
        //Korra
        GET_KORRA_STATUS: '/auto-image',
        GENERATE_SIMPLE: '/auto-image/generate',
        GENERATE_DISCORD_STATUS: '/auto-image/discord-status',
        GENERATE_WAIFU_INSULT: '/auto-image/waifu-insult',
        GENERATE_LOVE_SHIP: '/auto-image/love-ship',
        GENERATE_LICENSE: '/auto-image/license'
    }
};

module.exports = constants;