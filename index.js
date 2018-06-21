'use strict';

const Toph = require('./src/Toph/Toph.js');
const Korra = require('./src/Korra/Korra.js');
const Shimakaze = require('./src/Shimakaze/Shimakaze.js');
const Tama = require('./src/Tama/Tama.js');
const constants = require('./src/constants.js');

const axios = require('axios');

/** 
 * @typedef TaihouOptions 
 * @prop {string} baseURL The base URL to use for each request, you may change this if you want to use staging or if you run a local instance (like: 'https://api.weeb.sh')
 * @prop {string} userAgent Strongly recommended, this should follow a BotName/Version/Environment pattern, or at least the bot name
 * @prop {number} timeout Time in milliseconds before a request should be aborted
 * @prop {any} headers An object of additional headers following a {'header': 'value'} format, note that those must not be content-type, user-agent or authorization header
 */

/**
 * 
 * 
 * @class Taihou
 * @prop {any} token The token given in the constructor, formatted according to whether it is a wolke token or not
 * @prop {Toph} toph The Toph class - gives access to toph methods
 * @prop {Korra} korra The Korra class - gives access to korra methods
 * @prop {Shimakaze} shimakaze The Shimakaze class - gives access to shimakaze methods
 * @prop {Tama} tama The Tama class - gives access to tama methods
 * @prop {Toph} images - Equivalent for toph
 * @prop {Korra} imageGeneration - Equivalent for korra
 * @prop {Shimakaze} reputation - Equivalent for reputation
 * @prop {Tama} settings - Equivalent for tama
 */
class Taihou {
    /**
     * Creates an instance of Taihou.
     * @param {string} token - The token, required to use weeb.sh
     * @param {boolean} wolken - A boolean representing whether the token is a wolke token or not, needed for taihou to work properly
     * @param {TaihouOptions} options - An object of options
     * @memberof Taihou
     */
    constructor(token, wolken, options = {}) {
        this.token = wolken ? `Wolke ${token}` : `Bearer ${token}`;
        if (!token || typeof wolken === 'undefined') {
            throw new Error('[Taihou] - The token and wolken parameters are mandatory');
        } else if (!options.userAgent) {
            console.warn('[Taihou] [WARN] - options.userAgent is optional but highly recommended, you should specify it');
        }
        this.axios = axios.create({
            headers: {
                common: {
                    'Authorization': this.token,
                    'Content-Type': 'application/json'
                }
            }
        });
        this.options = Object.assign({
            baseURL: options.baseURL || constants.productionBaseURL,
            userAgent: options.userAgent || constants.defaultUserAgent,
            timeout: options.timeout || constants.timeout
        }, options);
        this.toph = new Toph(token, this.options, this.axios);
        this.korra = new Korra(token, this.options, this.axios);
        this.shimakaze = new Shimakaze(token, this.options, this.axios);
        this.tama = new Tama(token, this.options, this.axios);
        this.images = this.toph;
        this.imageGeneration = this.korra;
        this.reputation = this.shimakaze;
        this.settings = this.tama;
    }
}

module.exports = Taihou;