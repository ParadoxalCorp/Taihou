export = Shimakaze;
/** @typedef {import('../../index.js').TaihouOptions} TaihouOptions */
/**
 * @typedef ShimakazeOptions
 * @prop {boolean} burst Whether to enable the request handler's burst mode, false by default
 * @prop {number} requestsPerMinute - Only apply when instantiating the module, regardless of the mode, define how many requests can be done in a minute. 0 makes it limitless
 * @prop {string} botID - The ID of the bot reputation database to access, if you specify it here, you won't need to specify it in every methods. You can always override it by specifying it in the method, note that methods which don't take objects as argument (methods with 2 or fewer parameters) will take the passed arguments count; As in, if the method expect at least 2 arguments (the bot id and something else) and you pass only one argument, it will be assumed that you want to use the botID set in the constructor
 */
/**
 * @typedef {Object} ShimakazeRequestOptions
 * @prop {number} beforeNextRequest - Time in milliseconds before the next request in the queue should be executed. Is ignored if burst mode is enabled
 */
/** @typedef {TaihouOptions & ShimakazeRequestOptions} RequestOptions */
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
 * @prop {string} targetID - The ID of the user who should get their reputation increased
 * @prop {number} increase - By how much should the user reputation be increased
 */
/**
 * @typedef DecreaseUserReputationOptions
 * @prop {string} botID - The ID of the bot reputation database to use
 * @prop {string} targetID - The ID of the user from who's reputation should be decreased
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
 * @typedef {Object} UserReputationObject
 * @prop {number} reputation The amount of reputation this user has
 * @prop {Array<string>} cooldown Array of timestamps referring to the last time(s) this user has given reputation to another user
 * @prop {Array<string>} givenReputation Array of timestamps referring to the last time(s) this user has received reputation from another user
 * @prop {string} userId The ID of the user
 * @prop {string} botId ID of the bot that was passed in the first call to take or give reputation to the user
 * @prop {string} accountId Internal id associated with the token calling the API
 * @prop {number} [availableReputations] How many reputations the user may give out, this field is optional and may not always be present
 * @prop {Array<number>} [nextAvailableReputations] Array of timestamps referring to the remaining cooldown time until the user can give out reputation from now, this field is optional and may not always be present
 */
/**
 * @typedef {Object} GetReputationResponse
 * @prop {string} date Current server time in UTC
 * @prop {number} status The HTTP status code of the request
 * @prop {UserReputationObject} user The user's reputation object with all optional fields
 */
/**
 * @typedef {Object} ReputationResponse
 * @prop {UserReputationObject} user The user's reputation object without the optional fields
 * @prop {number} status The HTTP status code of the request
 */
/**
 * @typedef {Object} GiveReputationResponse
 * @prop {number} status The HTTP status code of the request
 * @prop {string} date Current server time in UTC
 * @prop {string} message Informational message
 * @prop {number} code The status code of the request, anything else than 0 represent a failed request, refer to https://docs.weeb.sh/#give-reputation-to-user for a list of the error codes
 * @prop {UserReputationObject} sourceUser The reputation object of the user who gave the reputation, without the optional fields
 * @prop {UserReputationObject} targetUser The reputation object of the user who received the reputation, without the optional fields
 */
/**
 * @typedef {Object} ReputationSettingsResponse
 * @prop {number} reputationPerDay The maximum reputation a user can give per **reputationCooldown** (so per day by default)
 * @prop {number} maximumReputation The maximum reputation a user can ever have (there is no maximum by default)
 * @prop {number} maximumReputationReceivedDay How much reputation a user can receive per day (there is no maximum by default)
 * @prop {number} reputationCooldown Cooldown per reputation, this is set to time in seconds (must be >= 300)
 * @prop {string} accountId Internal id associated with the token calling the API
 */
/**
 * @typedef {Object} SettingsResponse
 * @prop {number} status The HTTP status code of the request
 * @prop {ReputationSettingsResponse} settings The settings
 */
/**
 * @class Shimakaze
 */
declare class Shimakaze extends Base {
    /**
     * @param {string} token
     * @param {ShimakazeOptions & TaihouOptions} options
     * @param {import("axios").AxiosInstance} axios
     */
    constructor(token: string, options: ShimakazeOptions & TaihouOptions, axios: import("axios").AxiosInstance);
    /**
     * The token given in the constructor of Taihou, formatted according to whether it is a wolke token or not
     * @type {string}
     */
    token: string;
    /**
     * The **effective** options; e.g, if you specified options specific to Shimakaze, those override the base ones
     * @type {ShimakazeOptions & TaihouOptions}
     */
    options: ShimakazeOptions & TaihouOptions;
    /**
     * Make a simple request to check whether Shimakaze is available or not, due to its nature, this method never rejects
     *
     * @param {RequestOptions} [options={}] An optional object of options
     * @memberof Shimakaze
     * @example
     * weebSH.shimakaze.getStatus()
     *  .then(console.log)
     *  .catch(console.error)
     * @returns {Promise<boolean>} Whether or not Shimakaze is online
     */
    getStatus(options?: RequestOptions): Promise<boolean>;
    /**
     * Get the reputation of a user
     *
     * @param {string} botID - The ID of the bot reputation database to access
     * @param {string} targetID - The ID of the user to get reputation of
     * @param {RequestOptions} [options={}] An additional object of options
     * @example
     * weebSH.shimakaze.getUserReputation('327144735359762432', '184051394179891201')
     *  .then(console.log)
     *  .catch(console.error)
     * @returns {Promise<GetReputationResponse>} The parsed response object, refer to https://docs.weeb.sh/#get-reputation-of-user for its structure
     */
    getUserReputation(botID: string, targetID: string, options?: RequestOptions, ...args: any[]): Promise<GetReputationResponse>;
    /**
     * Give reputation to a user.
     * Note that you should catch the rejection of this request and inspect the error.response.data.code property of the response to determine the exact reason why it failed
     *
     * @param {GiveReputationOptions} reputationOptions An object of options
     * @param {RequestOptions} [options={}] An additional object of options
     * @example
     * weebSH.shimakaze.postUserReputation({botID: '184051394179891201', targetID: '128392910574977024', sourceID: '140149699486154753'})
     *  .then(console.log)
     *  .catch(console.error)
     * @returns {Promise<GiveReputationResponse>} The parsed response object, refer to https://docs.weeb.sh/#get-reputation-of-user for its structure
     */
    giveReputation(reputationOptions: GiveReputationOptions, options?: RequestOptions): Promise<GiveReputationResponse>;
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
    resetUserReputation(resetOptions: ResetUserReputationOptions, options?: RequestOptions): Promise<ReputationResponse>;
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
    increaseUserReputation(increaseOptions: IncreaseUserReputationOptions, options?: RequestOptions): Promise<ReputationResponse>;
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
    decreaseUserReputation(decreaseOptions: DecreaseUserReputationOptions, options?: RequestOptions): Promise<ReputationResponse>;
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
    getSettings(options?: RequestOptions): Promise<SettingsResponse>;
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
    setSettings(settings: ReputationSettings, options?: RequestOptions): Promise<SettingsResponse>;
}
declare namespace Shimakaze {
    export { TaihouOptions, ShimakazeOptions, ShimakazeRequestOptions, RequestOptions, GiveReputationOptions, ResetUserReputationOptions, IncreaseUserReputationOptions, DecreaseUserReputationOptions, ReputationSettings, UserReputationObject, GetReputationResponse, ReputationResponse, GiveReputationResponse, ReputationSettingsResponse, SettingsResponse };
}
import Base = require("../Base");
type ShimakazeOptions = {
    /**
     * Whether to enable the request handler's burst mode, false by default
     */
    burst: boolean;
    /**
     * - Only apply when instantiating the module, regardless of the mode, define how many requests can be done in a minute. 0 makes it limitless
     */
    requestsPerMinute: number;
    /**
     * - The ID of the bot reputation database to access, if you specify it here, you won't need to specify it in every methods. You can always override it by specifying it in the method, note that methods which don't take objects as argument (methods with 2 or fewer parameters) will take the passed arguments count; As in, if the method expect at least 2 arguments (the bot id and something else) and you pass only one argument, it will be assumed that you want to use the botID set in the constructor
     */
    botID: string;
};
type TaihouOptions = import('../../index.js').TaihouOptions;
type RequestOptions = TaihouOptions & ShimakazeRequestOptions;
type GetReputationResponse = {
    /**
     * Current server time in UTC
     */
    date: string;
    /**
     * The HTTP status code of the request
     */
    status: number;
    /**
     * The user's reputation object with all optional fields
     */
    user: UserReputationObject;
};
type GiveReputationOptions = {
    /**
     * - The ID of the bot reputation database to use
     */
    botID: string;
    /**
     * - The ID of the user to give reputation to
     */
    targetID: string;
    /**
     * - The ID of the user who is giving reputation
     */
    sourceID: string;
};
type GiveReputationResponse = {
    /**
     * The HTTP status code of the request
     */
    status: number;
    /**
     * Current server time in UTC
     */
    date: string;
    /**
     * Informational message
     */
    message: string;
    /**
     * The status code of the request, anything else than 0 represent a failed request, refer to https://docs.weeb.sh/#give-reputation-to-user for a list of the error codes
     */
    code: number;
    /**
     * The reputation object of the user who gave the reputation, without the optional fields
     */
    sourceUser: UserReputationObject;
    /**
     * The reputation object of the user who received the reputation, without the optional fields
     */
    targetUser: UserReputationObject;
};
type ResetUserReputationOptions = {
    /**
     * - The ID of the bot reputation database to use
     */
    botID: string;
    /**
     * - The ID of the user to reset
     */
    targetID: string;
    /**
     * - Whether to reset the user cooldown field too, false by default
     */
    resetCooldown?: boolean;
};
type ReputationResponse = {
    /**
     * The user's reputation object without the optional fields
     */
    user: UserReputationObject;
    /**
     * The HTTP status code of the request
     */
    status: number;
};
type IncreaseUserReputationOptions = {
    /**
     * - The ID of the bot reputation database to use
     */
    botID: string;
    /**
     * - The ID of the user who should get their reputation increased
     */
    targetID: string;
    /**
     * - By how much should the user reputation be increased
     */
    increase: number;
};
type DecreaseUserReputationOptions = {
    /**
     * - The ID of the bot reputation database to use
     */
    botID: string;
    /**
     * - The ID of the user from who's reputation should be decreased
     */
    targetID: string;
    /**
     * - By how much should the user reputation be decreased
     */
    decrease: number;
};
type SettingsResponse = {
    /**
     * The HTTP status code of the request
     */
    status: number;
    /**
     * The settings
     */
    settings: ReputationSettingsResponse;
};
type ReputationSettings = {
    /**
     * - The maximum reputation a user can give per **reputationCooldown** (so per day by default)
     */
    reputationPerDay?: number;
    /**
     * - The maximum reputation a user can ever have (there is no maximum by default)
     */
    maximumReputation?: number;
    /**
     * - How much reputation a user can receive per day (there is no maximum by default)
     */
    maximumReputationReceivedDay?: number;
    /**
     * - Cooldown per reputation, this is set to time in seconds (must be >= 300)
     */
    reputationCooldown?: number;
};
type ShimakazeRequestOptions = {
    /**
     * - Time in milliseconds before the next request in the queue should be executed. Is ignored if burst mode is enabled
     */
    beforeNextRequest: number;
};
type UserReputationObject = {
    /**
     * The amount of reputation this user has
     */
    reputation: number;
    /**
     * Array of timestamps referring to the last time(s) this user has given reputation to another user
     */
    cooldown: Array<string>;
    /**
     * Array of timestamps referring to the last time(s) this user has received reputation from another user
     */
    givenReputation: Array<string>;
    /**
     * The ID of the user
     */
    userId: string;
    /**
     * ID of the bot that was passed in the first call to take or give reputation to the user
     */
    botId: string;
    /**
     * Internal id associated with the token calling the API
     */
    accountId: string;
    /**
     * How many reputations the user may give out, this field is optional and may not always be present
     */
    availableReputations?: number;
    /**
     * Array of timestamps referring to the remaining cooldown time until the user can give out reputation from now, this field is optional and may not always be present
     */
    nextAvailableReputations?: Array<number>;
};
type ReputationSettingsResponse = {
    /**
     * The maximum reputation a user can give per **reputationCooldown** (so per day by default)
     */
    reputationPerDay: number;
    /**
     * The maximum reputation a user can ever have (there is no maximum by default)
     */
    maximumReputation: number;
    /**
     * How much reputation a user can receive per day (there is no maximum by default)
     */
    maximumReputationReceivedDay: number;
    /**
     * Cooldown per reputation, this is set to time in seconds (must be >= 300)
     */
    reputationCooldown: number;
    /**
     * Internal id associated with the token calling the API
     */
    accountId: string;
};
