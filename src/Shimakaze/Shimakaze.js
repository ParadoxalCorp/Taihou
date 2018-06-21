'use strict';

const Base = require('../Base');
const constants = require('../constants');

/**  
 * @typedef ShimakazeOptions
 * @prop {string} baseURL - The base URL
 * @prop {number} timeout - Time in milliseconds before the request should be aborted
 * @prop {any} headers - An object of additional headers following a {'header': 'value'} format, note that those must not be content-type, user-agent or authorization header
 * @prop {boolean} burst Whether to enable the request handler's burst mode, false by default
 * @prop {number} beforeNextRequest - Only apply per-request, time in milliseconds before the next request in the queue should be executed. Is ignored if burst mode is enabled
 * @prop {number} requestsPerMinute - Only apply when instantiating the module, regardless of the mode, define how many requests can be done in a minute. 0 makes it limitless
 * @prop {string} botID - - The ID of the bot reputation database to access, if you specify it here, you won't need to specify it in every methods. You can always override it by specifying it in the method, note that methods which don't take objects as argument (methods with 2 or fewer parameters) will take the passed arguments count; As in, if the method expect at least 2 arguments (the bot id and something else) and you pass only one argument, it will be assumed that you want to use the botID set in the constructor
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
 * @prop {boolean} [resetCooldown=false] - Whether to reset the user cooldown field too, false by default
 */

/**  
 * @typedef IncreaseUserReputationOptions
 * @prop {string} botID - The ID of the bot reputation database to use
 * @prop {string} targetID - The ID of the user to reset
 * @prop {number} increase - By how much should the user reputation be increased
 */

/**  
 * @typedef DecreaseUserReputationOptions
 * @prop {string} botID - The ID of the bot reputation database to use
 * @prop {string} targetID - The ID of the user to reset
 * @prop {number} decrease - By how much should the user reputation be decreased
 */

/**  
 * @typedef ReputationSettings
 * @prop {number} [reputationPerDay] - The maximum reputation a user can give per **reputationCooldown** (so per day by default)
 * @prop {number} [maximumReputation] - The maximum reputation a user can ever have (there is no maximum by default)
 * @prop {number} [maximumReputationReceivedDay] - How much reputation a user can receive per day (there is no maximum by default)
 * @prop {number} [reputationCooldown] - Cooldown per reputation, this is set to time in seconds (must be >= 300)
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
        this.getStatus = this.getStatus.bind(this);
        this.getUserReputation = this.getUserReputation.bind(this);
        this.giveReputation = this.giveReputation.bind(this);
        this.resetUserReputation = this.resetUserReputation.bind(this);
        this.increaseUserReputation = this.increaseUserReputation.bind(this);
        this.decreaseUserReputation = this.decreaseUserReputation.bind(this);
        this.getSettings = this.getSettings.bind(this);
        this.setSettings = this.setSettings.bind(this);

    }

    /**
     * Make a simple request to check whether Shimakaze is available or not, due to its nature, this method never rejects
     * 
     * @param {ShimakazeOptions} [options={}] An optional object of options
     * @memberof Shimakaze
     * @example 
     * weebSH.shimakaze.getStatus()
     * .then(console.log)
     * .catch(console.error)
     * @returns {boolean} Whether or not Shimakaze is online 
     */
    async getStatus(options = {}) {
        return new Promise(async(resolve) => {
            options = Object.assign({...this.options }, options);
            this.status(`${options.baseURL}${constants.endpoints.GET_SHIMAKAZE_STATUS}`, options)
                .then(res => {
                    return resolve(res.request.res.statusCode === 200 ? true : false);
                })
                .catch(() => {
                    return resolve(false);
                });
        });
    }

    /**
     * Get the reputation of a user
     * 
     * @param {string} botID - The ID of the bot reputation database to access
     * @param {string} targetID - The ID of the user to get reputation of
     * @param {ShimakazeOptions} [options={}] An additional object of options
     * @example 
     * weebSH.shimakaze.getUserReputation('327144735359762432', '184051394179891201')
     * .then(console.log)
     * .catch(console.error)
     * @returns {Promise<any>} The parsed response object, refer to https://docs.weeb.sh/#get-reputation-of-user for its structure
     */
    getUserReputation(botID, targetID, options = {}) {

        //Capture the stacktrace before it gets destroyed by the async operation
        let _stackTrace = {};
        Error.captureStackTrace(_stackTrace);

        return new Promise(async(resolve, reject) => {
            options = Object.assign({...this.options }, options);
            let actualBotID = botID;
            if (arguments.length === 1 || (arguments.length === 2 && typeof arguments[1] === 'object')) {
                actualBotID = this.options.botID;
            }
            if (typeof actualBotID !== 'string' || typeof targetID !== 'string') {
                return reject(new this.Error('Both the botID and targetID parameters are required', _stackTrace));
            }
            this.requestHandler.queueRequest(this.formatRequest(`${options.baseURL}${constants.endpoints.GET_USER_REPUTATION(actualBotID, targetID)}`, 'get', options), options)
                .then(res => {
                    if (res.request.res.statusCode !== 200) {
                        reject(new this.Error(res, _stackTrace));
                    } else {
                        resolve(res.data);
                    }
                })
                .catch(err => {
                    reject(new this.Error(err, _stackTrace));
                });
        });
    }

    /**
     * Give reputation to a user
     * 
     * @param {GiveReputationOptions} reputationOptions An object of options
     * @param {ShimakazeOptions} [options={}] An additional object of options
     * @example 
     * weebSH.shimakaze.postUserReputation({botID: '184051394179891201', targetID: '128392910574977024', sourceID: '140149699486154753'})
     * .then(console.log)
     * .catch(console.error)
     * @returns {Promise<any>} The parsed response object, refer to https://docs.weeb.sh/#get-reputation-of-user for its structure
     */
    giveReputation(reputationOptions, options = {}) {

        //Capture the stacktrace before it gets destroyed by the async operation
        let _stackTrace = {};
        Error.captureStackTrace(_stackTrace);

        return new Promise(async(resolve, reject) => {
            options = Object.assign({...this.options }, options);
            if (!reputationOptions.botID) {
                reputationOptions.botID = this.options.botID;
            }
            if (typeof reputationOptions.botID !== 'string' || typeof reputationOptions.targetID !== 'string' || typeof reputationOptions.sourceID !== 'string') {
                return reject(new this.Error('The reputationOptions.botID, reputationOptions.targetID and reputationOptions.sourceID parameters are required', _stackTrace));
            }
            options.data = {
                source_user: reputationOptions.sourceID
            };
            this.requestHandler.queueRequest(this.formatRequest(`${options.baseURL}${constants.endpoints.GIVE_REPUTATION(reputationOptions.botID, reputationOptions.targetID)}`, 'post', options), options)
                .then(res => {
                    if (res.request.res.statusCode !== 200) {
                        reject(new this.Error(res, _stackTrace));
                    } else {
                        resolve(res.data);
                    }
                })
                .catch(err => {
                    reject(new this.Error(err, _stackTrace));
                });
        });
    }

    /**
     * Reset the reputation of a user
     * 
     * @param {ResetUserReputationOptions} resetOptions An object of options
     * @param {ShimakazeOptions} [options={}] An additional object of options
     * @example 
     * weebSH.shimakaze.resetUserReputation({botID: '327144735359762432', targetID: '184051394179891201'})
     * .then(console.log)
     * .catch(console.error)
     * @returns {Promise<any>} The parsed response object, refer to https://docs.weeb.sh/#reset-user-reputation for its structure
     */
    resetUserReputation(resetOptions, options = {}) {

        //Capture the stacktrace before it gets destroyed by the async operation
        let _stackTrace = {};
        Error.captureStackTrace(_stackTrace);

        return new Promise(async(resolve, reject) => {
            options = Object.assign({...this.options }, options);
            if (!resetOptions.botID) {
                resetOptions.botID = this.options.botID;
            }
            if (typeof resetOptions.botID !== 'string' || typeof resetOptions.targetID !== 'string') {
                return reject(new this.Error('Both the resetOptions.botID and resetOptions.targetID parameters are required', _stackTrace));
            }
            if (resetOptions.resetCooldown && typeof resetOptions.resetCooldown === 'boolean') {
                options.params = this.addURLParams({ cooldown: resetOptions.resetCooldown }, [], options);
            }
            this.requestHandler.queueRequest(this.formatRequest(`${options.baseURL}${constants.endpoints.RESET_USER_REPUTATION(resetOptions.botID, resetOptions.targetID)}`, 'post', options), options)
                .then(res => {
                    if (res.request.res.statusCode !== 200) {
                        reject(new this.Error(res, _stackTrace));
                    } else {
                        resolve(res.data);
                    }
                })
                .catch(err => {
                    reject(new this.Error(err, _stackTrace));
                });
        });
    }

    /**
     * Increase the reputation of a user
     * 
     * @param {IncreaseUserReputationOptions} increaseOptions An object of options
     * @param {ShimakazeOptions} [options={}] An additional object of options
     * @example 
     * weebSH.shimakaze.increaseUserReputation({botID: '327144735359762432', targetID: '184051394179891201', increase: 1})
     * .then(console.log)
     * .catch(console.error)
     * @returns {Promise<any>} The parsed response object, refer to https://docs.weeb.sh/#increase-user-reputation for its structure
     */
    increaseUserReputation(increaseOptions, options = {}) {

        //Capture the stacktrace before it gets destroyed by the async operation
        let _stackTrace = {};
        Error.captureStackTrace(_stackTrace);

        return new Promise(async(resolve, reject) => {
            options = Object.assign({...this.options }, options);
            if (!increaseOptions.botID) {
                increaseOptions.botID = this.options.botID;
            }
            if (typeof increaseOptions.botID !== 'string' || typeof increaseOptions.targetID !== 'string' || typeof increaseOptions.increase !== 'number') {
                return reject(new this.Error('The increaseOptions.botID, increaseOptions.targetID and increaseOptions.increase parameters are required', _stackTrace));
            }
            options.data = {
                increase: increaseOptions.increase
            };
            this.requestHandler.queueRequest(this.formatRequest(`${options.baseURL}${constants.endpoints.INCREASE_USER_REPUTATION(increaseOptions.botID, increaseOptions.targetID)}`, 'post', options), options)
                .then(res => {
                    if (res.request.res.statusCode !== 200) {
                        reject(new this.Error(res, _stackTrace));
                    } else {
                        resolve(res.data);
                    }
                })
                .catch(err => {
                    reject(new this.Error(err, _stackTrace));
                });
        });
    }

    /**
     * Decrease the reputation of a user
     * 
     * @param {DecreaseUserReputationOptions} decreaseOptions An object of options
     * @param {ShimakazeOptions} [options={}] An additional object of options
     * @example 
     * weebSH.shimakaze.decreaseUserReputation({botID: '327144735359762432', targetID: '184051394179891201', decrease: 1})
     * .then(console.log)
     * .catch(console.error)
     * @returns {Promise<any>} The parsed response object, refer to https://docs.weeb.sh/#decrease-user-reputation for its structure
     */
    decreaseUserReputation(decreaseOptions, options = {}) {

        //Capture the stacktrace before it gets destroyed by the async operation
        let _stackTrace = {};
        Error.captureStackTrace(_stackTrace);

        return new Promise(async(resolve, reject) => {
            options = Object.assign({...this.options }, options);
            if (!decreaseOptions.botID) {
                decreaseOptions.botID = this.options.botID;
            }
            if (typeof decreaseOptions.botID !== 'string' || typeof decreaseOptions.targetID !== 'string' || typeof decreaseOptions.decrease !== 'number') {
                return reject(new this.Error('The decreaseOptions.botID, decreaseOptions.targetID and decreaseOptions.decrease parameters are required', _stackTrace));
            }
            options.data = {
                decrease: decreaseOptions.decrease
            };
            this.requestHandler.queueRequest(this.formatRequest(`${options.baseURL}${constants.endpoints.DECREASE_USER_REPUTATION(decreaseOptions.botID, decreaseOptions.targetID)}`, 'post', options), options)
                .then(res => {
                    if (res.request.res.statusCode !== 200) {
                        reject(new this.Error(res, _stackTrace));
                    } else {
                        resolve(res.data);
                    }
                })
                .catch(err => {
                    reject(new this.Error(err, _stackTrace));
                });
        });
    }

    /**
     * Get the current settings
     * 
     * @param {ShimakazeOptions} [options={}] An additional object of options
     * @example 
     * weebSH.shimakaze.getSettings()
     * .then(console.log)
     * .catch(console.error)
     * @returns {Promise<any>} The parsed response object, refer to https://docs.weeb.sh/#get-settings for its structure
     */
    getSettings(options = {}) {

        //Capture the stacktrace before it gets destroyed by the async operation
        let _stackTrace = {};
        Error.captureStackTrace(_stackTrace);

        return new Promise(async(resolve, reject) => {
            options = Object.assign({...this.options }, options);
            this.requestHandler.queueRequest(this.formatRequest(`${options.baseURL}${constants.endpoints.GET_SETTINGS}`, 'get', options), options)
                .then(res => {
                    if (res.request.res.statusCode !== 200) {
                        reject(new this.Error(res, _stackTrace));
                    } else {
                        resolve(res.data);
                    }
                })
                .catch(err => {
                    reject(new this.Error(err, _stackTrace));
                });
        });
    }

    /**
     * Update the current settings
     * 
     * @param {ReputationSettings} settings - The settings to update
     * @param {ShimakazeOptions} [options={}] An additional object of options
     * @example 
     * weebSH.shimakaze.setSettings({reputationPerDay: 3})
     * .then(console.log)
     * .catch(console.error)
     * @returns {Promise<any>} The parsed response object, refer to https://docs.weeb.sh/#set-settings for its structure
     */
    setSettings(settings, options = {}) {

        //Capture the stacktrace before it gets destroyed by the async operation
        let _stackTrace = {};
        Error.captureStackTrace(_stackTrace);

        return new Promise(async(resolve, reject) => {
            options = Object.assign({...this.options }, options);
            if (typeof settings !== 'object' || Array.isArray(settings)) {
                return reject(new this.Error('The settings objects is mandatory, you cannot update nothing', _stackTrace));
            }
            options.data = settings;
            this.requestHandler.queueRequest(this.formatRequest(`${options.baseURL}${constants.endpoints.SET_SETTINGS}`, 'post', options), options)
                .then(res => {
                    if (res.request.res.statusCode !== 200) {
                        reject(new this.Error(res, _stackTrace));
                    } else {
                        resolve(res.data);
                    }
                })
                .catch(err => {
                    reject(new this.Error(err, _stackTrace));
                });
        });
    }
}

module.exports = Shimakaze;