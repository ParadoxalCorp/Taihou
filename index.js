'use strict';

const Toph = require('./src/Toph/Toph.js');
const Korra = require('./src/Korra/Korra.js');
const Shimakaze = require('./src/Shimakaze/Shimakaze.js');
const Tama = require('./src/Tama/Tama.js');
const constants = require('./src/constants.js');

const axios = require('axios');

/**
 * @typedef {import('./src/types').TophOptions} TophOptions
 * @typedef {import('./src/types').KorraOptions} KorraOptions
 * @typedef {import('./src/types').ShimakazeOptions} ShimakazeOptions
 * @typedef {import('./src/types').TamaOptions} TamaOptions
 */

/**
 * @typedef {Object} TaihouOptions
 * @prop {String} baseURL The base URL to use for each request, you may change this if you want to use staging or if you run a local instance (like: 'https://api.weeb.sh')
 * @prop {String} userAgent Strongly recommended, this should follow a BotName/Version/Environment pattern, or at least the bot name
 * @prop {Number} timeout Time in milliseconds before a request should be aborted
 * @prop {Object} headers An object of additional headers following a {'header': 'value'} format, note that those must not be content-type, user-agent or authorization header
 */

 /** @typedef {Object} PerServicesOptions
  * @prop {TophOptions & TaihouOptions} toph Additional options to pass to Toph
  * @prop {TophOptions & TaihouOptions} images Additional options to pass to Toph
  * @prop {KorraOptions & TaihouOptions} korra Additional options to pass to Korra
  * @prop {KorraOptions & TaihouOptions} imageGeneration Additional options to pass to Korra
  * @prop {ShimakazeOptions & TaihouOptions} shimakaze Additional options to pass to Shimakaze
  * @prop {ShimakazeOptions & TaihouOptions} reputation Additional options to pass to Shimakaze
  * @prop {TamaOptions & TaihouOptions} tama Additional options to pass to Tama
  * @prop {TamaOptions & TaihouOptions} settings Additional options to pass to Tama
  */

  /** @typedef {TaihouOptions & PerServicesOptions} ConstructorOptions */

/**
 *
 *
 * @class Taihou
 * @prop {String} token The token given in the constructor, formatted according to whether it is a wolke token or not
 * @prop {Toph} toph The Toph class - gives access to toph methods
 * @prop {Korra} korra The Korra class - gives access to korra methods
 * @prop {Shimakaze} shimakaze The Shimakaze class - gives access to shimakaze methods
 * @prop {Tama} tama The Tama class - gives access to tama methods
 * @prop {Toph} images - Equivalent for toph
 * @prop {Korra} imageGeneration - Equivalent for korra
 * @prop {Shimakaze} reputation - Equivalent for reputation
 * @prop {Tama} settings - Equivalent for tama
 * @prop {TaihouOptions} options - The options for this Taihou instance
 */
class Taihou {
    /**
     * Creates an instance of Taihou.
     * @param {String} token - The token, required to use weeb.sh
     * @param {Boolean} wolken - A boolean representing whether the token is a wolke token or not, needed for taihou to work properly
     * @param {ConstructorOptions} [options] - An object of options
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
