'use strict';

const axios = require('axios');
const Base = require('../Base');
const constants = require('../constants');

/**  
 * @typedef TamaOptions
 * @prop {string} baseURL - The base URL
 * @prop {number} timeout - Time in milliseconds before the request should be aborted
 */

/**
 * 
 * 
 * @class Tama
 * @prop {any} token The token given in the constructor of Taihou, formatted according to whether it is a wolke token or not
 * @prop {any} options The **effective** options; e.g, if you specified options specific to Tama, those override the base ones
 */
class Tama extends Base {
    constructor(token, options) {
        super(options);
        this.token = token;
        this.options = options.tama || options.images ? Object.assign({...options }, options.tama || options.images) : options;
        this.options.requestsPerMinute = this.options.requestsPerMinute || constants.tama.requestsPerMinute;
        this.axios = axios;
    }

    /**
     * Make a simple request to check whether Tama is available or not, due to its nature, this method never rejects
     * 
     * @param {TamaOptions} [options={}] An optional object of options
     * @memberof Tama
     * @returns {boolean} Whether or not Tama is online 
     */
    async getStatus(options = {}) {
        options = Object.assign({...this.options }, options);
        this.status(this.baseURL, axios, options)
            .then(res => {
                return res.data.status === 200 ? true : false;
            })
            .catch(() => {
                return false;
            });
    }
}

module.exports = Tama;