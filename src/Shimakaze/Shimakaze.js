'use strict';

const Base = require('../Base');
const constants = require('../constants');

/**  
 * @typedef ShimakazeOptions
 * @prop {string} baseURL - The base URL
 * @prop {number} timeout - Time in milliseconds before the request should be aborted
 * @prop {any} headers - An object of additional headers following a {'header': 'value'} format, note that those must not be content-type, user-agent or authorization header
 * @prop {number} beforeNextRequest - Only apply per-request, time in milliseconds before the next request in the queue should be executed. Is ignored if burst mode is enabled
 * @prop {number} requestsPerMinute - Only apply when instantiating the module, regardless of the mode, define how many requests can be done in a minute. 60000 effectively disable the cooldown
 */

/**  
 * @typedef GiveReputationOptions
 * @prop {string} botID - The ID of the bot reputation database to use
 * @prop {string} targetID - The ID of the user to give reputation to 
 * @prop {string} sourceID - The ID of the user who is giving reputation
 */

 /**  
 * @typedef ResetUserReputationOptions
 * @prop {string} botID - The ID of the bot reputation database to use
 * @prop {string} targetID - The ID of the user to reset
 * @prop {boolean} resetCooldown - Whether to reset the user cooldown field too, false by default
 */

/**
 * 
 * 
 * @class Shimakaze
 * @prop {any} token The token given in the constructor of Taihou, formatted according to whether it is a wolke token or not
 * @prop {any} options The **effective** options; e.g, if you specified options specific to Shimakaze, those override the base ones
 */
class Shimakaze extends Base {
    constructor(token, options, axios) {
        super(options);
        this.token = token;
        this.options = options.shimakaze || options.images ? Object.assign({...options }, options.shimakaze || options.images) : options;
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
        options = Object.assign({...this.options }, options);
        this.status(`${this.baseURL}${constants.endpoints.GET_SHIMAKAZE_STATUS}`, axios, options)
            .then(res => {
                return res.data.status === 200 ? true : false;
            })
            .catch(() => {
                return false;
            });
    }

    /**
     * Get the reputation of a user
     * 
     * @param {string} botID - The ID of the bot reputation database to access
     * @param {userID} targetID - The ID of the user to get reputation of
     * @param {ShimakazeOptions} [options={}] 
     * @example 
     * getUserReputation('327144735359762432', '184051394179891201')
     * .then(console.log)
     * .catch(console.error)
     * @returns {Promise<any>} The parsed response object, refer to https://docs.weeb.sh/#get-reputation-of-user for its structure
     */
    getUserReputation(botID, targetID, options = {}) {
        return new Promise(async(resolve, reject) => {
            options = Object.assign({...this.options }, options);
            if (typeof botID !== 'string' || typeof targetID !== 'string') {
                return reject(new this.Error('Both the botID and targetID parameters are required'));
            }
            this.requestHandler.queueRequest(this.formatRequest(`${options.baseURL}${constants.endpoints.GET_USER_REPUTATION(botID, userID)}`, 'get', options), options)
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
     * Give reputation to a user
     * 
     * @param {GiveReputationOptions} reputationOptions An object of options
     * @param {ShimakazeOptions} [options={}]
     * @example 
     * postUserReputation({botID: '184051394179891201', targetID: '128392910574977024', sourceID: '140149699486154753'})
     * .then(console.log)
     * .catch(console.error)
     * @returns {Promise<any>} The parsed response object, refer to https://docs.weeb.sh/#get-reputation-of-user for its structure
     */
    giveReputation(reputationOptions, options = {}) {
        return new Promise(async(resolve, reject) => {
            options = Object.assign({...this.options }, options);
            if (typeof reputationOptions.botID !== 'string' || typeof reputationOptions.targetID !== 'string' || typeof reputationOptions.sourceID !== 'string') {
                return reject(new this.Error('The reputationOptions.botID, reputationOptions.targetID and reputationOptions.sourceID parameters are required'));
            }
            options.data = {
                source_user: reputationOptions.sourceID
            };
            this.requestHandler.queueRequest(this.formatRequest(`${options.baseURL}${constants.endpoints.GIVE_REPUTATION(reputationOptions.botID, reputationOptions.targetID)}`, 'post', options), options)
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
     * Reset the reputation of a user
     * 
     * @param {ResetUserReputationOptions} resetOptions - The ID of the bot reputation database to access
     * @param {ShimakazeOptions} [options={}] 
     * @example 
     * resetUserReputation({botID: '327144735359762432', targetID: '184051394179891201'})
     * .then(console.log)
     * .catch(console.error)
     * @returns {Promise<any>} The parsed response object, refer to https://docs.weeb.sh/#reset-user-reputation for its structure
     */
    resetUserReputation(resetOptions, options = {}) {
        return new Promise(async(resolve, reject) => {
            options = Object.assign({...this.options }, options);
            if (typeof resetOptions.botID !== 'string' || typeof resetOptions.targetID !== 'string') {
                return reject(new this.Error('Both the botID and userID parameters are required'));
            }
            if (resetOptions.resetCooldown && typeof resetOptions.resetCooldown === 'boolean') {
                options.params = this.addURLParams({ cooldown: resetOptions.resetCooldown }, [], options);
            }
            this.requestHandler.queueRequest(this.formatRequest(`${options.baseURL}${constants.endpoints.RESET_USER_REPUTATION(botID, userID)}`, 'get', options), options)
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
     * Reset the reputation of a user
     * 
     * @param {ResetUserReputationOptions} resetOptions - The ID of the bot reputation database to access
     * @param {ShimakazeOptions} [options={}] 
     * @example 
     * resetUserReputation({botID: '327144735359762432', targetID: '184051394179891201'})
     * .then(console.log)
     * .catch(console.error)
     * @returns {Promise<any>} The parsed response object, refer to https://docs.weeb.sh/#reset-user-reputation for its structure
     */
    resetUserReputation(resetOptions, options = {}) {
        return new Promise(async(resolve, reject) => {
            options = Object.assign({...this.options }, options);
            if (typeof resetOptions.botID !== 'string' || typeof resetOptions.targetID !== 'string') {
                return reject(new this.Error('Both the botID and userID parameters are required'));
            }
            if (resetOptions.resetCooldown && typeof resetOptions.resetCooldown === 'boolean') {
                options.params = this.addURLParams({ cooldown: resetOptions.resetCooldown }, [], options);
            }
            this.requestHandler.queueRequest(this.formatRequest(`${options.baseURL}${constants.endpoints.RESET_USER_REPUTATION(botID, userID)}`, 'get', options), options)
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

module.exports = Shimakaze;