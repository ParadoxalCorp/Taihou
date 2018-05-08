'use strict';

const axios = require('axios');
const Base = require('../Base');
const constants = require('../constants');

/**  
 * @typedef ShimakazeOptions
 * @prop {string} [baseURL] - The base URL
 * @prop {number} [timeout] - Time in milliseconds before the request should be aborted
 */

/**
 * 
 * 
 * @class Shimakaze
 * @prop {any} token The token given in the constructor of Taihou, formatted according to whether it is a wolke token or not
 * @prop {any} options The **effective** options; e.g, if you specified options specific to Shimakaze, those override the base ones
 */
class Shimakaze extends Base {
    constructor(token, options) {
        super(options);
        this.token = token;
        this.options = options.shimakaze || options.images ? Object.assign(options, options.shimakaze || options.images) : options;
        this.options.requestsPerMinute = this.options.requestsPerMinute || constants.shimakaze.requestsPerMinute;
        this.axios = axios;
    }

    /**
     * Make a simple request to check whether Shimakaze is available or not, due to its nature, this method never rejects
     * 
     * @param {ShimakazeOptions} [options={}] An optional object of options
     * @memberof Shimakaze
     * @returns {boolean} Whether or not Shimakaze is online 
     */
    async getStatus(options = {}) {
        options = Object.assign(this.options, options);
        this.status(this.baseURL, axios, options)
            .then(res => {
                return res.data.status === 200 ? true : false;
            })
            .catch(() => {
                return false;
            });
    }
}

module.exports = Shimakaze;