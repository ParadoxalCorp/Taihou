'use strict';

const Base = require('../Base');
const constants = require('../constants');

/**  
 * @typedef KorraOptions
 * @prop {string} baseURL - The base URL
 * @prop {number} timeout - Time in milliseconds before the request should be aborted. Default is 15000
 * @prop {any} headers - An object of additional headers following a {'header': 'value'} format, note that those must not be content-type, user-agent or authorization header
 * @prop {number} beforeNextRequest - Only apply per-request, time in milliseconds before the next request in the queue should be executed. Is ignored if burst mode is enabled
 * @prop {number} requestsPerMinute - Only apply when instantiating the module, regardless of the mode, define how many requests can be done in a minute. 60000 effectively disable the cooldown
 */

/**  
 * @typedef LicenseOptions
 * @prop {string} title - The base URL
 * @prop {string} avatar - Direct URL to an image
 * @prop {array} badges - Array of http/s links directly pointing to images; to see how it renders, check https://docs.weeb.sh/#license-generation
 * @prop {array} widgets - An array of strings to fill the boxes
 */

/**  
 * @typedef SimpleOptions
 * @prop {string} face - Only for awooo type; HEX color code of the face
 * @prop {string} hair - Only for awooo type; HEX color code of the hairs 
 */

/**
 * 
 * 
 * @class Korra
 * @prop {any} token The token given in the constructor of Taihou, formatted according to whether it is a wolke token or not
 * @prop {any} options The **effective** options; e.g, if you specified options specific to Korra, those override the base ones
 */
class Korra extends Base {
    constructor(token, options, axios) {
        super(options);
        this.token = token;
        this.options = options.korra || options.imageGeneration ? Object.assign({...options }, options.korra || options.imageGeneration) : options;
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
     * @param {KorraOptions} [options={}] An optional object of options
     * @memberof Korra
     * @returns {Promise<boolean>} Whether or not Korra is online 
     */
    getStatus(options = {}) {
        return new Promise(async(resolve, reject) => {
            options = Object.assign({...this.options }, options);
            this.status(`${options.baseURL}${constants.endpoints.GET_KORRA_STATUS}`, options)
                .then(res => {
                    return resolve(res.data.status === 200 ? true : false);
                })
                .catch((err) => {
                    return resolve(false);
                });
        });
    }

    /**
     * 
     * @param {string} type One of the available types, you can see them here: https://docs.weeb.sh/#generate-simple
     * @param {SimpleOptions} simpleOptions An object of options for this generation, for a complete list of options you can use, check: https://docs.weeb.sh/#generate-simple
     * @param {KorraOptions} options 
     * @returns {Promise<any>} The image buffer
     */
    generateSimple(type, simpleOptions = {}, options = {}) {
        return new Promise(async(resolve, reject) => {
            if (typeof type !== 'string') {
                return reject(new this.Error('The type parameter is mandatory'));
            }
            options = Object.assign({...this.options }, options);
            options.params = this.addURLParams({ type: type }, simpleOptions, options);
            this.requestHandler.queueRequest(this.formatRequest(`${options.baseURL}${constants.endpoints.GENERATE_SIMPLE}`, 'get', options), options)
                .then(res => {
                    if (res.request.res.statusCode !== 200) {
                        reject(new this.Error(res));
                    } else {
                        resolve(res.data);
                    }
                })
                .catch(err => {
                    reject(new this.Error(err));
                });
        });
    }

    /**
     * 
     * @param {string} status - The status, can be either "online", "idle", "streaming", "dnd" or "offline"
     * @param {string} avatar - The direct URL to the image
     * @param {KorraOptions} options 
     * @returns {Promise<any>} The image buffer
     */
    generateDiscordStatus(status, avatar, options = {}) {
        return new Promise(async(resolve, reject) => {
            if (typeof status !== 'string' || typeof avatar !== 'string') {
                return reject(new this.Error('Both the status and avatar parameters are required'));
            }
            options = Object.assign({...this.options }, options);
            options.params = this.addURLParams({ status: status, avatar: encodeURIComponent(avatar) }, [], options);
            this.requestHandler.queueRequest(this.formatRequest(`${options.baseURL}${constants.endpoints.GENERATE_DISCORD_STATUS}`, 'get', options), options)
                .then(res => {
                    if (res.request.res.statusCode !== 200) {
                        reject(new this.Error(res));
                    } else {
                        resolve(res.data);
                    }
                })
                .catch(err => {
                    reject(new this.Error(err));
                });
        })
    }

    /**
     * 
     * @param {string} avatar - The direct URL to the image
     * @param {KorraOptions} options 
     * @returns {Promise<any>} The image buffer
     */
    generateWaifuInsult(avatar, options = {}) {
        return new Promise(async(resolve, reject) => {
            if (typeof avatar !== 'string') {
                return reject(new this.Error('The avatar parameter is required'));
            }
            options = Object.assign({...this.options }, options);
            options.data = {
                "avatar": avatar
            }
            this.requestHandler.queueRequest(this.formatRequest(`${options.baseURL}${constants.endpoints.GENERATE_WAIFU_INSULT}`, 'post', options), options)
                .then(res => {
                    if (res.request.res.statusCode !== 200) {
                        reject(new this.Error(res));
                    } else {
                        resolve(res.data);
                    }
                })
                .catch(err => {
                    reject(new this.Error(err));
                });
        })
    }

    /**
     * 
     * @param {string} firstTarget - The direct URL to the image of the first target
     * @param {string} secondTarget - The direct URL to the image of the second target
     * @param {KorraOptions} options 
     * @returns {Promise<any>} The image buffer
     */
    generateLoveShip(firstTarget, secondTarget, options = {}) {
        return new Promise(async(resolve, reject) => {
            if (typeof firstTarget !== 'string' || typeof secondTarget !== 'string') {
                return reject(new this.Error('Both the firstTarget and secondTarget parameters are required'));
            }
            options = Object.assign({...this.options }, options);
            options.data = {
                targetOne: firstTarget,
                targetTwo: secondTarget
            }
            this.requestHandler.queueRequest(this.formatRequest(`${options.baseURL}${constants.endpoints.GENERATE_LOVE_SHIP}`, 'post', options), options)
                .then(res => {
                    if (res.request.res.statusCode !== 200) {
                        reject(new this.Error(res));
                    } else {
                        resolve(res.data);
                    }
                })
                .catch(err => {
                    reject(new this.Error(err));
                });
        });
    }

    /**
     * 
     * @param {LicenseOptions} licenseOptions 
     * @param {KorraOptions} options 
     * @returns {Promise<any>} The image buffer
     */
    generateLicense(licenseOptions, options) {
        return new Promise(async(resolve, reject) => {
            if (typeof licenseOptions !== 'object') {
                return reject(new this.Error('The licenseOptions parameter is required'));
            }
            options = Object.assign({...this.options }, options);
            options.data = licenseOptions;
            this.requestHandler.queueRequest(this.formatRequest(`${options.baseURL}${constants.endpoints.GENERATE_LICENSE}`, 'post', options), options)
                .then(res => {
                    if (res.request.res.statusCode !== 200) {
                        reject(new this.Error(res));
                    } else {
                        resolve(res.data);
                    }
                })
                .catch(err => {
                    reject(new this.Error(err));
                });
        });
    }
}

module.exports = Korra;