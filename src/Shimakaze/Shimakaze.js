'use strict';

const Base = require('../Base');
const constants = require('../constants');

/** @typedef {import('../../index.js').TaihouOptions} TaihouOptions */

/**
 * @typedef ShimakazeOptions
 * @prop {Boolean} burst Whether to enable the request handler's burst mode, false by default
 * @prop {Number} requestsPerMinute - Only apply when instantiating the module, regardless of the mode, define how many requests can be done in a minute. 0 makes it limitless
 * @prop {String} botID - The ID of the bot reputation database to access, if you specify it here, you won't need to specify it in every methods. You can always override it by specifying it in the method, note that methods which don't take objects as argument (methods with 2 or fewer parameters) will take the passed arguments count; As in, if the method expect at least 2 arguments (the bot id and something else) and you pass only one argument, it will be assumed that you want to use the botID set in the constructor
 */

/**
 * @typedef {Object} KorraRequestOptions
 * @prop {Number} beforeNextRequest - Time in milliseconds before the next request in the queue should be executed. Is ignored if burst mode is enabled
 */

/** @typedef {TaihouOptions & KorraRequestOptions} RequestOptions */

/**
 * @typedef GiveReputationOptions
 * @prop {String} botID - The ID of the bot reputation database to use
 * @prop {String} targetID - The ID of the user to give reputation to
 * @prop {String} sourceID - The ID of the user who is giving reputation
 */

/**
 * @typedef ResetUserReputationOptions
 * @prop {String} botID - The ID of the bot reputation database to use
 * @prop {String} targetID - The ID of the user to reset
 * @prop {Boolean} [resetCooldown=false] - Whether to reset the user cooldown field too, false by default
 */

/**
 * @typedef IncreaseUserReputationOptions
 * @prop {String} botID - The ID of the bot reputation database to use
 * @prop {String} targetID - The ID of the user who should get their reputation increased
 * @prop {Number} increase - By how much should the user reputation be increased
 */

/**
 * @typedef DecreaseUserReputationOptions
 * @prop {String} botID - The ID of the bot reputation database to use
 * @prop {String} targetID - The ID of the user from who's reputation should be decreased
 * @prop {Number} decrease - By how much should the user reputation be decreased
 */

/**
 * @typedef ReputationSettings
 * @prop {Number} [reputationPerDay] - The maximum reputation a user can give per **reputationCooldown** (so per day by default)
 * @prop {Number} [maximumReputation] - The maximum reputation a user can ever have (there is no maximum by default)
 * @prop {Number} [maximumReputationReceivedDay] - How much reputation a user can receive per day (there is no maximum by default)
 * @prop {Number} [reputationCooldown] - Cooldown per reputation, this is set to time in seconds (must be >= 300)
 */

 /** @typedef {Object} UserReputationObject
  * @prop {Number} reputation The amount of reputation this user has
  * @prop {Array<String>} cooldown Array of timestamps referring to the last time(s) this user has given reputation to another user
  * @prop {Array<String>} givenReputation Array of timestamps referring to the last time(s) this user has received reputation from another user
  * @prop {String} userId The ID of the user
  * @prop {String} botId ID of the bot that was passed in the first call to take or give reputation to the user
  * @prop {String} accountId Internal id associated with the token calling the API
  * @prop {Number} [availableReputations] How many reputations the user may give out, this field is optional and may not always be present
  * @prop {Array<Number>} [nextAvailableReputations] Array of timestamps referring to the remaining cooldown time until the user can give out reputation from now, this field is optional and may not always be present
  */

/**
 * @typedef {Object} GetReputationResponse
 * @prop {String} date Current server time in UTC
 * @prop {Number} status The HTTP status code of the request
 * @prop {UserReputationObject} user The user's reputation object with all optional fields
 */

 /**
 * @typedef {Object} ReputationResponse
 * @prop {UserReputationObject} user The user's reputation object without the optional fields
 * @prop {Number} status The HTTP status code of the request
 */

 /**
 * @typedef {Object} GiveReputationResponse
 * @prop {Number} status The HTTP status code of the request
 * @prop {String} date Current server time in UTC
 * @prop {String} message Informational message
 * @prop {Number} code The status code of the request, anything else than 0 represent a failed request, refer to https://docs.weeb.sh/#give-reputation-to-user for a list of the error codes
 * @prop {UserReputationObject} sourceUser The reputation object of the user who gave the reputation, without the optional fields
 * @prop {UserReputationObject} targetUser The reputation object of the user who received the reputation, without the optional fields
 */

 /**
 * @typedef {Object} ReputationSettingsResponse
 * @prop {Number} reputationPerDay The maximum reputation a user can give per **reputationCooldown** (so per day by default)
 * @prop {Number} maximumReputation The maximum reputation a user can ever have (there is no maximum by default)
 * @prop {Number} maximumReputationReceivedDay How much reputation a user can receive per day (there is no maximum by default)
 * @prop {Number} reputationCooldown Cooldown per reputation, this is set to time in seconds (must be >= 300)
 * @prop {String} accountId Internal id associated with the token calling the API
 */

 /**
  * @typedef {Object} SettingsResponse
  * @prop {Number} status The HTTP status code of the request
  * @prop {ReputationSettingsResponse} settings The settings
  */

/**
 *
 *
 * @class Shimakaze
 * @prop {String} token The token given in the constructor of Taihou, formatted according to whether it is a wolke token or not
 * @prop {TaihouOptions & ShimakazeOptions} options The **effective** options; e.g, if you specified options specific to Shimakaze, those override the base ones
 */

class Shimakaze extends Base {
    constructor(token, options, axios) {
        super(options);
        this.token = token;
        this.options = options.shimakaze || options.images ? Object.assign({ ...options }, options.shimakaze || options.images) : options;
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
     * @param {RequestOptions} [options={}] An optional object of options
     * @memberof Shimakaze
     * @example
     * weebSH.shimakaze.getStatus()
     *  .then(console.log)
     *  .catch(console.error)
     * @returns {Promise<Boolean>} Whether or not Shimakaze is online
     */
    async getStatus(options = {}) {
        options = Object.assign({ ...this.options
        }, options);
        return this._status(`${options.baseURL}${constants.endpoints.GET_SHIMAKAZE_STATUS}`, options)
            .then(() => true)
            .catch(() => false);
    }

    /**
     * Get the reputation of a user
     *
     * @param {String} botID - The ID of the bot reputation database to access
     * @param {String} targetID - The ID of the user to get reputation of
     * @param {RequestOptions} [options={}] An additional object of options
     * @example
     * weebSH.shimakaze.getUserReputation('327144735359762432', '184051394179891201')
     *  .then(console.log)
     *  .catch(console.error)
     * @returns {Promise<GetReputationResponse>} The parsed response object, refer to https://docs.weeb.sh/#get-reputation-of-user for its structure
     */
    getUserReputation(botID, targetID, options = {}) {
        options = Object.assign({ ...this.options
        }, options);
        let actualBotID = botID;
        if (arguments.length === 1 || (arguments.length === 2 && typeof arguments[1] === 'object')) {
            actualBotID = this.options.botID;
        }
        if (typeof actualBotID !== 'string' || typeof targetID !== 'string') {
            throw new Error('Both the botID and targetID parameters are required');
        }
        return this.requestHandler.queueRequest(this._formatRequest(`${options.baseURL}${constants.endpoints.GET_USER_REPUTATION(actualBotID, targetID)}`, 'get', options), options)
            .then(res => res.data);
    }

    /**
     * Give reputation to a user.
     * Note that you should catch the rejection of this request and inspect the error.response.data.code property of the response to determine the exact reason why it failed
     * @param {GiveReputationOptions} reputationOptions An object of options
     * @param {RequestOptions} [options={}] An additional object of options
     * @example
     * weebSH.shimakaze.postUserReputation({botID: '184051394179891201', targetID: '128392910574977024', sourceID: '140149699486154753'})
     *  .then(console.log)
     *  .catch(console.error)
     * @returns {Promise<GiveReputationResponse>} The parsed response object, refer to https://docs.weeb.sh/#get-reputation-of-user for its structure
     */
    giveReputation(reputationOptions, options = {}) {
        options = Object.assign({ ...this.options
        }, options);
        if (!reputationOptions.botID) {
            reputationOptions.botID = this.options.botID;
        }
        if (typeof reputationOptions.botID !== 'string' || typeof reputationOptions.targetID !== 'string' || typeof reputationOptions.sourceID !== 'string') {
            throw new Error('The reputationOptions.botID, reputationOptions.targetID and reputationOptions.sourceID parameters are required');
        }
        options.data = {
            source_user: reputationOptions.sourceID
        };
        return this.requestHandler.queueRequest(this._formatRequest(`${options.baseURL}${constants.endpoints.GIVE_REPUTATION(reputationOptions.botID, reputationOptions.targetID)}`, 'post', options), options)
            .then(res => res.data);
    }

    /**
     * Reset the reputation of a user
     *
     * @param {ResetUserReputationOptions} resetOptions An object of options
     * @param {RequestOptions} [options={}] An additional object of options
     * @example
     * weebSH.shimakaze.resetUserReputation({botID: '327144735359762432', targetID: '184051394179891201'})
     *  .then(console.log)
     *  .catch(console.error)
     * @returns {Promise<ReputationResponse>} The parsed response object, refer to https://docs.weeb.sh/#reset-user-reputation for its structure
     */
    resetUserReputation(resetOptions, options = {}) {
        options = Object.assign({ ...this.options
        }, options);
        if (!resetOptions.botID) {
            resetOptions.botID = this.options.botID;
        }
        if (typeof resetOptions.botID !== 'string' || typeof resetOptions.targetID !== 'string') {
            throw new Error('Both the resetOptions.botID and resetOptions.targetID parameters are required');
        }
        if (resetOptions.resetCooldown && typeof resetOptions.resetCooldown === 'boolean') {
            options.params = this._addURLParams({
                cooldown: resetOptions.resetCooldown
            }, [], options);
        }
        return this.requestHandler.queueRequest(this._formatRequest(`${options.baseURL}${constants.endpoints.RESET_USER_REPUTATION(resetOptions.botID, resetOptions.targetID)}`, 'post', options), options)
            .then(res => res.data);
    }

    /**
     * Increase the reputation of a user
     *
     * @param {IncreaseUserReputationOptions} increaseOptions An object of options
     * @param {RequestOptions} [options={}] An additional object of options
     * @example
     * weebSH.shimakaze.increaseUserReputation({botID: '327144735359762432', targetID: '184051394179891201', increase: 1})
     *  .then(console.log)
     *  .catch(console.error)
     * @returns {Promise<ReputationResponse>} The parsed response object, refer to https://docs.weeb.sh/#increase-user-reputation for its structure
     */
    increaseUserReputation(increaseOptions, options = {}) {
        options = Object.assign({ ...this.options
        }, options);
        if (!increaseOptions.botID) {
            increaseOptions.botID = this.options.botID;
        }
        if (typeof increaseOptions.botID !== 'string' || typeof increaseOptions.targetID !== 'string' || typeof increaseOptions.increase !== 'number') {
            throw new Error('The increaseOptions.botID, increaseOptions.targetID and increaseOptions.increase parameters are required');
        }
        options.data = {
            increase: increaseOptions.increase
        };
        return this.requestHandler.queueRequest(this._formatRequest(`${options.baseURL}${constants.endpoints.INCREASE_USER_REPUTATION(increaseOptions.botID, increaseOptions.targetID)}`, 'post', options), options)
            .then(res => res.data);
    }

    /**
     * Decrease the reputation of a user
     *
     * @param {DecreaseUserReputationOptions} decreaseOptions An object of options
     * @param {RequestOptions} [options={}] An additional object of options
     * @example
     * weebSH.shimakaze.decreaseUserReputation({botID: '327144735359762432', targetID: '184051394179891201', decrease: 1})
     *  .then(console.log)
     *  .catch(console.error)
     * @returns {Promise<ReputationResponse>} The parsed response object, refer to https://docs.weeb.sh/#decrease-user-reputation for its structure
     */
    decreaseUserReputation(decreaseOptions, options = {}) {
        options = Object.assign({ ...this.options
        }, options);
        if (!decreaseOptions.botID) {
            decreaseOptions.botID = this.options.botID;
        }
        if (typeof decreaseOptions.botID !== 'string' || typeof decreaseOptions.targetID !== 'string' || typeof decreaseOptions.decrease !== 'number') {
            throw new Error('The decreaseOptions.botID, decreaseOptions.targetID and decreaseOptions.decrease parameters are required');
        }
        options.data = {
            decrease: decreaseOptions.decrease
        };
        return this.requestHandler.queueRequest(this._formatRequest(`${options.baseURL}${constants.endpoints.DECREASE_USER_REPUTATION(decreaseOptions.botID, decreaseOptions.targetID)}`, 'post', options), options)
            .then(res => res.data);
    }

    /**
     * Get the current settings
     *
     * @param {RequestOptions} [options={}] An additional object of options
     * @example
     * weebSH.shimakaze.getSettings()
     *  .then(console.log)
     *  .catch(console.error)
     * @returns {Promise<SettingsResponse>} The parsed response object, refer to https://docs.weeb.sh/#get-settings for its structure
     */
    getSettings(options = {}) {
        options = Object.assign({ ...this.options
        }, options);
        return this.requestHandler.queueRequest(this._formatRequest(`${options.baseURL}${constants.endpoints.GET_SETTINGS}`, 'get', options), options)
            .then(res => res.data);
    }

    /**
     * Update the current settings
     *
     * @param {ReputationSettings} settings - The settings to update
     * @param {RequestOptions} [options={}] An additional object of options
     * @example
     * weebSH.shimakaze.setSettings({reputationPerDay: 3})
     *  .then(console.log)
     *  .catch(console.error)
     * @returns {Promise<SettingsResponse>} The parsed response object, refer to https://docs.weeb.sh/#set-settings for its structure
     */
    setSettings(settings, options = {}) {
        options = Object.assign({ ...this.options
        }, options);
        if (typeof settings !== 'object' || Array.isArray(settings)) {
            throw new Error('The settings objects is mandatory, you cannot update nothing');
        }
        options.data = settings;
        return this.requestHandler.queueRequest(this._formatRequest(`${options.baseURL}${constants.endpoints.SET_SETTINGS}`, 'post', options), options)
            .then(res => res.data);
    }
}

module.exports = Shimakaze;
