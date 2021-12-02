'use strict';

const Base = require('../Base');
const constants = require('../constants');

/** @typedef {import('../../index.js').TaihouOptions} TaihouOptions */

/**
 * @typedef KorraOptions
 * @prop {boolean} burst Whether to enable the request handler's burst mode, false by default
 * @prop {number} requestsPerMinute - Only apply when instantiating the module, regardless of the mode, define how many requests can be done in a minute. 0 makes it limitless
 */

/**
 * @typedef {Object} KorraRequestOptions
 * @prop {number} beforeNextRequest - Time in milliseconds before the next request in the queue should be executed. Is ignored if burst mode is enabled
 */

/** @typedef {TaihouOptions & KorraRequestOptions} RequestOptions */

/**
 * @typedef LicenseOptions
 * @prop {string} title - The title of the license
 * @prop {string} avatar - Direct URL to an image
 * @prop {Array<string>} [badges] - Array of http/s links directly pointing to images; to see how it renders, check https://docs.weeb.sh/#license-generation
 * @prop {Array<string>} [widgets] - An array of strings to fill the boxes
 */

/**
 * @typedef SimpleOptions
 * @prop {string} [face] - Only for awooo type; HEX color code of the face
 * @prop {string} [hair] - Only for awooo type; HEX color code of the hairs
 */

/**
 * @class Korra
 */
class Korra extends Base {
    /**
     * Creates an instance of Korra.
     * @param {string} token - The token
     * @param {TaihouOptions & KorraOptions} options - The options
     * @param {import("axios").AxiosInstance} axios - The axios instance
     * @memberof Korra
     */

    constructor(token, options, axios) {
        super(options);
        /**
         * The token given in the constructor of Taihou, formatted according to whether it is a wolke token or not
         * @type {string}
         */
        this.token = token;
        /**
         * The **effective** options; e.g, if you specified options specific to Korra, those override the base ones
         * @type {TaihouOptions & KorraOptions}
         */
        this.options = options.korra || options.imageGeneration ? Object.assign({ ...options
        }, options.korra || options.imageGeneration) : options;
        this.options.requestsPerMinute = this.options.requestsPerMinute || constants.korra.requestsPerMinute;
        this.axios = axios;
        //As we heavily rely on this, ensure it is always bound to all methods regardless of the context
        this.getStatus = this.getStatus.bind(this);
        this.generateSimple = this.generateSimple.bind(this);
        this.generateDiscordStatus = this.generateDiscordStatus.bind(this);
        this.generateLicense = this.generateLicense.bind(this);
        this.generateLoveShip = this.generateLoveShip.bind(this);
        this.generateWaifuInsult = this.generateWaifuInsult.bind(this);
    }

    /**
     * Make a simple request to check whether Korra is available or not, due to its nature, this method never rejects
     *
     * @param {RequestOptions} [options={}] An optional object of options
     * @memberof Korra
     * @example
     * weebSH.korra.getStatus()
     *  .then(console.log)
     *  .catch(console.error)
     * @returns {Promise<boolean>} Whether or not Korra is online
     */
    getStatus(options = {}) {
        options = Object.assign({ ...this.options
        }, options);
        return this._status(`${options.baseURL}${constants.endpoints.GET_KORRA_STATUS}`, options)
            .then(() => true)
            .catch(() => false);
    }

    /**
     * @param {string} type One of the available types, you can see them here: https://docs.weeb.sh/#generate-simple
     * @param {SimpleOptions} [simpleOptions] An object of options for this generation, for a complete list of options you can use, check: https://docs.weeb.sh/#generate-simple
     * @param {RequestOptions} [options={}] An additional object of options
     * @example
     * weebSH.korra.generateSimple('awooo')
     *  .then(console.log)
     *  .catch(console.error)
     * @returns {Promise<Buffer>} The image buffer, that you can directly pass to d.js/eris
     */
    generateSimple(type, simpleOptions = {}, options = {}) {
        if (typeof type !== 'string') {
            throw new Error('The type parameter is mandatory');
        }
        options = Object.assign({ ...this.options
        }, options);
        options.params = this._addURLParams({
            type: type
        }, simpleOptions, options);
        options.axios = {
            responseType: 'arraybuffer'
        };
        return this.requestHandler.queueRequest(this._formatRequest(`${options.baseURL}${constants.endpoints.GENERATE_SIMPLE}`, 'get', options), options)
            .then(res => res.data);
    }

    /**
     * @param {string} status - The status, can be either "online", "idle", "streaming", "dnd" or "offline"
     * @param {string} avatar - The direct URL to the image
     * @param {RequestOptions} [options={}] An additional object of options
     * @example
     * weebSH.korra.generateDiscordStatus('online', 'https://cdn.discordapp.com/avatars/140149699486154753/a_211d333073a63b3adfd13943268fc7a1.webp?size=1024')
     *  .then(console.log)
     *  .catch(console.error)
     * @returns {Promise<Buffer>} The image buffer, that you can directly pass to d.js/eris
     */
    generateDiscordStatus(status, avatar, options = {}) {
        if (typeof status !== 'string' || typeof avatar !== 'string') {
            throw new Error('Both the status and avatar parameters are required');
        }
        options = Object.assign({ ...this.options
        }, options);
        options.params = this._addURLParams({
            status: status,
            avatar: encodeURIComponent(avatar)
        }, [], options);
        options.axios = {
            responseType: 'arraybuffer'
        };
        return this.requestHandler.queueRequest(this._formatRequest(`${options.baseURL}${constants.endpoints.GENERATE_DISCORD_STATUS}`, 'get', options), options)
            .then(res => res.data);
    }

    /**
     * @param {string} avatar - The direct URL to the image
     * @param {RequestOptions} [options={}] An additional object of options
     * @example
     * weebSH.korra.generateWaifuInsult('https://cdn.discordapp.com/avatars/140149699486154753/a_211d333073a63b3adfd13943268fc7a1.webp?size=1024')
     *  .then(console.log)
     *  .catch(console.error)
     * @returns {Promise<Buffer>} The image buffer, that you can directly pass to d.js/eris
     */
    generateWaifuInsult(avatar, options = {}) {
        if (typeof avatar !== 'string') {
            throw new Error('The avatar parameter is required');
        }
        options = Object.assign({ ...this.options}, options);
        options.data = {
            "avatar": avatar
        };
        options.axios = {
            responseType: 'arraybuffer'
        };
        return this.requestHandler.queueRequest(this._formatRequest(`${options.baseURL}${constants.endpoints.GENERATE_WAIFU_INSULT}`, 'post', options), options)
            .then(res => res.data);
    }

    /**
     * @param {string} firstTarget - The direct URL to the image of the first target
     * @param {string} secondTarget - The direct URL to the image of the second target
     * @param {RequestOptions} [options={}] An additional object of options
     * @example
     * weebSH.korra.generateLoveShip('https://cdn.discordapp.com/avatars/128392910574977024/174c3436af3e4857accb4a32e2f9f220.webp?size=1024', 'https://cdn.discordapp.com/avatars/108638204629925888/e05fb8c7720c3618569828246e176fb4.webp?size=1024')
     *  .then(console.log)
     *  .catch(console.error)
     * @returns {Promise<Buffer>} The image buffer, that you can directly pass to d.js/eris
     */
    generateLoveShip(firstTarget, secondTarget, options = {}) {
        if (typeof firstTarget !== 'string' || typeof secondTarget !== 'string') {
            throw new Error('Both the firstTarget and secondTarget parameters are required');
        }
        options = Object.assign({ ...this.options
        }, options);
        options.data = {
            targetOne: firstTarget,
            targetTwo: secondTarget
        };
        options.axios = {
            responseType: 'arraybuffer'
        };
        return this.requestHandler.queueRequest(this._formatRequest(`${options.baseURL}${constants.endpoints.GENERATE_LOVE_SHIP}`, 'post', options), options)
            .then(res => res.data);
    }

    /**
     * @param {LicenseOptions} licenseOptions - The options for this license generation
     * @param {KorraOptions} [options={}] An additional object of options
     * @example
     * weebSH.korra.generateLicense({title: 'Baguette License', avatar: 'https://cdn.discordapp.com/avatars/128392910574977024/174c3436af3e4857accb4a32e2f9f220.webp?size=1024'})
     *  .then(console.log)
     *  .catch(console.error)
     * @returns {Promise<Buffer>} The image buffer, that you can directly pass to d.js/eris
     */
    generateLicense(licenseOptions, options) {
        if (typeof licenseOptions !== 'object') {
            throw new Error('The licenseOptions parameter is required');
        }
        options = Object.assign({ ...this.options
        }, options);
        options.data = licenseOptions;
        options.axios = {
            responseType: 'arraybuffer'
        };
        return this.requestHandler.queueRequest(this._formatRequest(`${options.baseURL}${constants.endpoints.GENERATE_LICENSE}`, 'post', options), options)
            .then(res => res.data);
    }
}

module.exports = Korra;
