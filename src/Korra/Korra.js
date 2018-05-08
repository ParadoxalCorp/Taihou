'use strict';

const axios = require('axios');
const Base = require('../Base');
const constants = require('../constants');

/**  
 * @typedef KorraOptions
 * @prop {string} [baseURL] - The base URL
 * @prop {number} [timeout] - Time in milliseconds before the request should be aborted
 */

/**
 * 
 * 
 * @class Korra
 * @prop {any} token The token given in the constructor of Taihou, formatted according to whether it is a wolke token or not
 * @prop {any} options The **effective** options; e.g, if you specified options specific to Korra, those override the base ones
 */
class Korra extends Base {
    constructor(token, options) {
        super(options);
        this.token = token;
        this.options = options.korra || options.images ? Object.assign(options, options.korra || options.images) : options;
        this.options.requestsPerMinute = this.options.requestsPerMinute || constants.korra.requestsPerMinute;
        this.axios = axios;
    }

    /**
     * Make a simple request to check whether Korra is available or not, due to its nature, this method never rejects
     * 
     * @param {KorraOptions} [options={}] An optional object of options
     * @memberof Korra
     * @returns {boolean} Whether or not Korra is online 
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

module.exports = Korra;