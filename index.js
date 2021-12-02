'use strict';

const Toph = require('./src/Toph/Toph.js');
const Korra = require('./src/Korra/Korra.js');
const Shimakaze = require('./src/Shimakaze/Shimakaze.js');
const Tama = require('./src/Tama/Tama.js');
const constants = require('./src/constants.js');

const axios = require('axios');

/**
 * @typedef {import('./src/Toph/Toph').TophOptions} TophOptions
 * @typedef {import('./src/Korra/Korra').KorraOptions} KorraOptions
 * @typedef {import('./src/Shimakaze/Shimakaze').ShimakazeOptions} ShimakazeOptions
 * @typedef {import('./src/Tama/Tama').TamaOptions} TamaOptions
 */

/**
 * @typedef {Object} TaihouOptions
 * @prop {string} baseURL The base URL to use for each request, you may change this if you want to use staging or if you run a local instance (like: 'https://api.weeb.sh')
 * @prop {string} userAgent Strongly recommended, this should follow a BotName/Version/Environment pattern, or at least the bot name
 * @prop {number} timeout Time in milliseconds before a request should be aborted
 * @prop {{ [header: string]: any }} headers An object of additional headers following a {'header': 'value'} format, note that those must not be content-type, user-agent or authorization header
 */

/**
 * @typedef {Object} PerServicesOptions
 * @prop {Partial<TophOptions & TaihouOptions>} toph Additional options to pass to Toph
 * @prop {Partial<TophOptions & TaihouOptions>} images Additional options to pass to Toph
 * @prop {Partial<KorraOptions & TaihouOptions>} korra Additional options to pass to Korra
 * @prop {Partial<KorraOptions & TaihouOptions>} imageGeneration Additional options to pass to Korra
 * @prop {Partial<ShimakazeOptions & TaihouOptions>} shimakaze Additional options to pass to Shimakaze
 * @prop {Partial<ShimakazeOptions & TaihouOptions>} reputation Additional options to pass to Shimakaze
 * @prop {Partial<TamaOptions & TaihouOptions>} tama Additional options to pass to Tama
 * @prop {Partial<TamaOptions & TaihouOptions>} settings Additional options to pass to Tama
 */

/** @typedef {Partial<TaihouOptions & PerServicesOptions>} ConstructorOptions */

/**
 * @class Taihou
 */
class Taihou {
    /**
     * Creates an instance of Taihou.
     * @param {string} token - The token, required to use weeb.sh
     * @param {boolean} wolken - A boolean representing whether the token is a wolke token or not, needed for taihou to work properly
     * @param {ConstructorOptions} [options] - An object of options
     * @memberof Taihou
     */
    constructor(token, wolken, options = {}) {
        /**
         * The token given in the constructor, formatted according to whether it is a wolke token or not
         * @type {string}
         */
        this.token = wolken ? `Wolke ${token}` : `Bearer ${token}`;
        if (!token || typeof wolken === 'undefined') {
            throw new Error('[Taihou] - The token and wolken parameters are mandatory');
        } else if (!options.userAgent) {
            console.warn('[Taihou] [WARN] - options.userAgent is optional but highly recommended, you should specify it');
        }
        /**
         * @type {import("axios").AxiosInstance}
         */
        this.axios = axios.create({
            headers: {
                common: {
                    'Authorization': this.token,
                    'Content-Type': 'application/json'
                }
            }
        });
        /**
         * - The options for this Taihou instance
         * @type {TaihouOptions}
         */
        this.options = Object.assign({
            baseURL: options.baseURL || constants.productionBaseURL,
            userAgent: options.userAgent || constants.defaultUserAgent,
            timeout: options.timeout || constants.timeout
        }, options);
        /**
         * The Toph class - gives access to toph methods
         */
        this.toph = new Toph(token, this.options, this.axios);
        /**
         * The Korra class - gives access to korra methods
         */
        this.korra = new Korra(token, this.options, this.axios);
        /**
         * The Shimakaze class - gives access to shimakaze methods
         */
        this.shimakaze = new Shimakaze(token, this.options, this.axios);
        /**
         * The Tama class - gives access to tama methods
         */
        this.tama = new Tama(token, this.options, this.axios);
        /**
         * - Equivalent for toph
         */
        this.images = this.toph;
        /**
         * - Equivalent for korra
         */
        this.imageGeneration = this.korra;
        /**
         * - Equivalent for shimakaze
         */
        this.reputation = this.shimakaze;
        /**
         * - Equivalent for tama
         */
        this.settings = this.tama;
    }
}

module.exports = Taihou;
