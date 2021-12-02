export = Tama;
/**
 * @typedef {import('../../index.js').TaihouOptions} TaihouOptions
 * @typedef {import('axios').AxiosInstance} Axios
 */
/**
 * @typedef TamaOptions
 * @prop {boolean} burst Whether to enable the request handler's burst mode, false by default
 * @prop {number} requestsPerMinute - Only apply when instantiating the module, regardless of the mode, define how many requests can be done in a minute. 0 makes it limitless
 * @prop {boolean} useCache - Defaults to true, this define whether to use the cache rather than always requesting to weeb.sh. The cache is updated whenever the setting is updated through Taihou
 */
/**
 * @typedef {Object} TamaRequestOptions
 * @prop {number} beforeNextRequest - Only apply per-request, time in milliseconds before the next request in the queue should be executed. Is ignored if burst mode is enabled
 * @prop {boolean} useCache - Defaults to true, this define whether to use the cache rather than always requesting to weeb.sh. The cache is updated whenever the setting is updated through Taihou
 */
/** @typedef {TamaRequestOptions & TaihouOptions} RequestOptions */
/**
 * @typedef CreateOrUpdateOptions
 * @prop {string} type - The type of the setting
 * @prop {string|number} id - The id of the setting
 * @prop {Object} data - The data you want this setting to hold. Please note that existing data will be overriden by this, so in the case of an update, specify unchanged fields too
 */
/**
 * @typedef ListSubSettingsOptions
 * @prop {string} type - The type of the setting
 * @prop {string|number} id - The id of the setting
 * @prop {string} subType - The type of the sub-setting
 */
/**
 * @typedef GetOrDeleteSubSettingOptions
 * @prop {string} type - The type of the setting
 * @prop {string|number} id - The id of the setting
 * @prop {string} subType - The type of the sub-setting
 * @prop {string|number} subId - The id of the sub-setting
 */
/**
 * @typedef CreateOrUpdateSubSettingOptions
 * @prop {string} type - The type of the setting
 * @prop {string|number} id - The id of the setting
 * @prop {string} subType - The type of the sub-setting
 * @prop {string|number} subId - The id of the sub-setting
 * @prop {Object} data - The data you want this sub-setting to hold. Please note that existing data will be overriden by this, so in the case of an update, specify unchanged fields too
 */
/**
 * @typedef {Object} SubSetting
 * @prop {string} id The ID of the setting
 * @prop {string} type The type of the setting
 * @prop {string} accountId The ID of the account that created this sub-setting
 * @prop {Object} data The data contained by this sub-setting
 * @prop {string} subId The ID of the sub-setting
 * @prop {string} subType The type of the sub-setting
 */
/**
 * @typedef {Object} Setting
 * @prop {string} id The ID of the setting
 * @prop {string} type The type of the setting
 * @prop {string} accountId The ID of the account that created this setting
 * @prop {Object} data The data contained by this setting
 */
/**
 * @typedef {Object} DeletedSubSetting
 * @prop {string} status The HTTP status code of the request
 * @prop {string} message A message describing the action taken
 * @prop {SubSetting} subsetting The sub-setting object
 */
/**
 * @typedef {Object} DeleteSettingResponse
 * @prop {string} status The HTTP status code of the request
 * @prop {string} message A message describing the action taken
 * @prop {Setting} setting The setting object
 */
/**
 * @typedef {Object} SettingResponse
 * @prop {string} status The HTTP status code of the request
 * @prop {Setting} setting The setting object
 * @prop {boolean} cached Whether this setting is returned from the cache
 */
/**
 * @typedef {Object} SubSettingResponse
 * @prop {string} status The HTTP status code of the request
 * @prop {SubSetting} subsetting The setting object
 * @prop {boolean} cached Whether this sub-setting is returned from the cache
 */
/**
 * @typedef {Object} SubSettingsList
 * @prop {string} status The HTTP status code of the request
 * @prop {Array<SubSetting>} subsettings An array of sub-settings
 */
/**
 * @class Tama
 */
declare class Tama extends Base {
    /**
     * @param {string} token - The token
     * @param {TaihouOptions & TamaOptions} options - The options for this instance
     * @param {Axios} axios - The axios instance
     */
    constructor(token: string, options: TaihouOptions & TamaOptions, axios: Axios);
    /**
     * The token given in the constructor of Taihou, formatted according to whether it is a wolke token or not
     * @type {string}
     */
    token: string;
    /**
     * The **effective** options; e.g, if you specified options specific to Tama, those override the base ones
     * @type {TamaOptions & TaihouOptions}
     */
    options: TamaOptions & TaihouOptions;
    /**
     * The settings cache
     * @type {Collection<string, SettingResponse>}
     */
    settingsCache: Collection<string, SettingResponse>;
    /**
     * The sub-settings cache
     * @type {Collection<string, SubSettingResponse>}
     */
    subSettingsCache: Collection<string, SubSettingResponse>;
    /**
     * Make a simple request to check whether Tama is available or not, due to its nature, this method never rejects
     *
     * @param {RequestOptions} [options={}] An optional object of options
     * @memberof Tama
     * @example
     * weebSH.tama.getStatus()
     *  .then(console.log)
     *  .catch(console.error)
     * @returns {Promise<boolean>} Whether or not Tama is online
     */
    getStatus(options?: RequestOptions): Promise<boolean>;
    /**
     * Get a setting by type and ID
     *
     * @param {string} type - The type of the setting
     * @param {string|number} id - The ID of the setting
     * @param {RequestOptions} [options={}] - An additional object of options
     * @example
     * weebSH.tama.getSetting('guilds', '300407204987666432')
     *  .then(console.log)
     *  .catch(console.error)
     * @returns {Promise<SettingResponse>} The parsed response object, with a `cached` property representing whether the returned setting is from the cache, refer to https://docs.weeb.sh/#get-setting for its structure
     */
    getSetting(type: string, id: string | number, options?: RequestOptions): Promise<SettingResponse>;
    /**
     * Create a new setting
     * Technically you can update an existing setting with this method too, the only reason there is two different methods is to be clearer
     *
     * @param {CreateOrUpdateOptions} createOptions - An object of parameters
     * @param {RequestOptions} [options={}] An additional object of options
     * @example
     * weebSH.tama.createSetting({type: 'guilds', id: '300407204987666432', data: {prefix: 'poi', baguette: true}})
     *  .then(console.log)
     *  .catch(console.error)
     * @returns {Promise<SettingResponse>} The parsed response object, refer to https://docs.weeb.sh/#create-update-setting for its structure
     */
    createSetting(createOptions: CreateOrUpdateOptions, options?: RequestOptions): Promise<SettingResponse>;
    /**
     * Update a setting
     * Technically you can create a setting with this method too, the only reason there is two different methods is to be clearer
     *
     * @param {CreateOrUpdateOptions} updateOptions - An object of parameters
     * @param {RequestOptions} [options={}] An additional object of options
     * @example
     * weebSH.tama.updateSetting({type: 'guilds', id: '300407204987666432', data: {prefix: 'poi', baguette: false}})
     *  .then(console.log)
     *  .catch(console.error)
     * @returns {Promise<SettingResponse>} The parsed response object, refer to https://docs.weeb.sh/#create-update-setting for its structure
     */
    updateSetting(updateOptions: CreateOrUpdateOptions, options?: RequestOptions): Promise<SettingResponse>;
    /**
     * Delete a setting by type and ID
     * If options.useCache is true, the setting will also be deleted from the cache. Note that this however won't delete the subsettings
     *
     * @param {string} type - The type of the setting
     * @param {string|number} id - The ID of the setting
     * @param {RequestOptions} [options={}] An additional object of options
     * @example
     * weebSH.tama.deleteSetting('guilds', '300407204987666432')
     *  .then(console.log)
     *  .catch(console.error)
     * @returns {Promise<DeleteSettingResponse>} The parsed response object, refer to https://docs.weeb.sh/#delete-setting for its structure
     */
    deleteSetting(type: string, id: string | number, options?: RequestOptions): Promise<DeleteSettingResponse>;
    /**
     * Get a list of sub-settings for a sub-setting type.
     *
     * @param {ListSubSettingsOptions} listOptions - An object of parameters
     * @param {RequestOptions} [options={}] An additional object of options
     * @example
     * weebSH.tama.listSubSettings({type: 'guilds', id: '300407204987666432', subType: 'channels'})
     *  .then(console.log)
     *  .catch(console.error)
     * @returns {Promise<SubSettingsList>} The parsed response object, refer to https://docs.weeb.sh/#list-sub-settings for its structure
     */
    listSubSettings(listOptions: ListSubSettingsOptions, options?: RequestOptions): Promise<SubSettingsList>;
    /**
     * Get a sub-setting by type and id
     *
     * @param {GetOrDeleteSubSettingOptions} getSubSettingOptions - An object of parameters
     * @param {RequestOptions} [options={}] An additional object of options
     * @example
     * weebSH.tama.getSubSetting({type: 'guilds', id: '300407204987666432', subType: 'channels', subId: '439457506960605185'})
     *  .then(console.log)
     *  .catch(console.error)
     * @returns {Promise<SubSettingResponse>} The parsed response object, along with a `cached` property representing whether the returned sub-setting is from the cache, refer to https://docs.weeb.sh/#get-sub-settings for its structure
     */
    getSubSetting(getSubSettingOptions: GetOrDeleteSubSettingOptions, options?: RequestOptions): Promise<SubSettingResponse>;
    /**
     * Create a sub-setting
     * Technically this method can be used to update a sub-setting too, the only reason there is two different methods is to be clearer
     *
     * @param {CreateOrUpdateSubSettingOptions} createOptions - An object of parameters
     * @param {RequestOptions} [options={}] An additional object of options
     * @example
     * weebSH.tama.createSubSetting({type: 'guilds', id: '300407204987666432', subType: 'channels', subId: '439457506960605185', data: {weeb: false}})
     *  .then(console.log)
     *  .catch(console.error)
     * @returns {Promise<SubSettingResponse>} The parsed response object, refer to https://docs.weeb.sh/#create-update-sub-setting for its structure
     */
    createSubSetting(createOptions: CreateOrUpdateSubSettingOptions, options?: RequestOptions): Promise<SubSettingResponse>;
    /**
     * Update a sub-setting
     * Technically this method can be used to create a sub-setting too, the only reason there is two different methods is to be clearer
     *
     * @param {CreateOrUpdateSubSettingOptions} updateOptions - An object of parameters
     * @param {RequestOptions} [options={}] An additional object of options
     * @example
     * weebSH.tama.updateSubSetting({type: 'guilds', id: '300407204987666432', subType: 'channels', subId: '439457506960605185', data: {weeb: true}})
     *  .then(console.log)
     *  .catch(console.error)
     * @returns {Promise<SubSettingResponse>} The parsed response object, refer to https://docs.weeb.sh/#create-update-sub-setting for its structure
     */
    updateSubSetting(updateOptions: CreateOrUpdateSubSettingOptions, options?: RequestOptions): Promise<SubSettingResponse>;
    /**
     * Delete a sub-setting
     *
     * @param {GetOrDeleteSubSettingOptions} deleteOptions - An object of parameters
     * @param {RequestOptions} [options={}] An additional object of options
     * @example
     * weebSH.tama.deleteSubSetting({type: 'guilds', id: '300407204987666432', subType: 'channels', subId: '439457506960605185'})
     *  .then(console.log)
     *  .catch(console.error)
     * @returns {Promise<DeletedSubSetting>} The parsed response object, refer to https://docs.weeb.sh/#delete-sub-setting for its structure
     */
    deleteSubSetting(deleteOptions: GetOrDeleteSubSettingOptions, options?: RequestOptions): Promise<DeletedSubSetting>;
}
declare namespace Tama {
    export { TaihouOptions, Axios, TamaOptions, TamaRequestOptions, RequestOptions, CreateOrUpdateOptions, ListSubSettingsOptions, GetOrDeleteSubSettingOptions, CreateOrUpdateSubSettingOptions, SubSetting, Setting, DeletedSubSetting, DeleteSettingResponse, SettingResponse, SubSettingResponse, SubSettingsList };
}
import Base = require("../Base");
type TamaOptions = {
    /**
     * Whether to enable the request handler's burst mode, false by default
     */
    burst: boolean;
    /**
     * - Only apply when instantiating the module, regardless of the mode, define how many requests can be done in a minute. 0 makes it limitless
     */
    requestsPerMinute: number;
    /**
     * - Defaults to true, this define whether to use the cache rather than always requesting to weeb.sh. The cache is updated whenever the setting is updated through Taihou
     */
    useCache: boolean;
};
type TaihouOptions = import('../../index.js').TaihouOptions;
import Collection = require("../Collection");
type SettingResponse = {
    /**
     * The HTTP status code of the request
     */
    status: string;
    /**
     * The setting object
     */
    setting: Setting;
    /**
     * Whether this setting is returned from the cache
     */
    cached: boolean;
};
type SubSettingResponse = {
    /**
     * The HTTP status code of the request
     */
    status: string;
    /**
     * The setting object
     */
    subsetting: SubSetting;
    /**
     * Whether this sub-setting is returned from the cache
     */
    cached: boolean;
};
type RequestOptions = TamaRequestOptions & TaihouOptions;
type CreateOrUpdateOptions = {
    /**
     * - The type of the setting
     */
    type: string;
    /**
     * - The id of the setting
     */
    id: string | number;
    /**
     * - The data you want this setting to hold. Please note that existing data will be overriden by this, so in the case of an update, specify unchanged fields too
     */
    data: any;
};
type DeleteSettingResponse = {
    /**
     * The HTTP status code of the request
     */
    status: string;
    /**
     * A message describing the action taken
     */
    message: string;
    /**
     * The setting object
     */
    setting: Setting;
};
type ListSubSettingsOptions = {
    /**
     * - The type of the setting
     */
    type: string;
    /**
     * - The id of the setting
     */
    id: string | number;
    /**
     * - The type of the sub-setting
     */
    subType: string;
};
type SubSettingsList = {
    /**
     * The HTTP status code of the request
     */
    status: string;
    /**
     * An array of sub-settings
     */
    subsettings: Array<SubSetting>;
};
type GetOrDeleteSubSettingOptions = {
    /**
     * - The type of the setting
     */
    type: string;
    /**
     * - The id of the setting
     */
    id: string | number;
    /**
     * - The type of the sub-setting
     */
    subType: string;
    /**
     * - The id of the sub-setting
     */
    subId: string | number;
};
type CreateOrUpdateSubSettingOptions = {
    /**
     * - The type of the setting
     */
    type: string;
    /**
     * - The id of the setting
     */
    id: string | number;
    /**
     * - The type of the sub-setting
     */
    subType: string;
    /**
     * - The id of the sub-setting
     */
    subId: string | number;
    /**
     * - The data you want this sub-setting to hold. Please note that existing data will be overriden by this, so in the case of an update, specify unchanged fields too
     */
    data: any;
};
type DeletedSubSetting = {
    /**
     * The HTTP status code of the request
     */
    status: string;
    /**
     * A message describing the action taken
     */
    message: string;
    /**
     * The sub-setting object
     */
    subsetting: SubSetting;
};
type Axios = import('axios').AxiosInstance;
type TamaRequestOptions = {
    /**
     * - Only apply per-request, time in milliseconds before the next request in the queue should be executed. Is ignored if burst mode is enabled
     */
    beforeNextRequest: number;
    /**
     * - Defaults to true, this define whether to use the cache rather than always requesting to weeb.sh. The cache is updated whenever the setting is updated through Taihou
     */
    useCache: boolean;
};
type SubSetting = {
    /**
     * The ID of the setting
     */
    id: string;
    /**
     * The type of the setting
     */
    type: string;
    /**
     * The ID of the account that created this sub-setting
     */
    accountId: string;
    /**
     * The data contained by this sub-setting
     */
    data: any;
    /**
     * The ID of the sub-setting
     */
    subId: string;
    /**
     * The type of the sub-setting
     */
    subType: string;
};
type Setting = {
    /**
     * The ID of the setting
     */
    id: string;
    /**
     * The type of the setting
     */
    type: string;
    /**
     * The ID of the account that created this setting
     */
    accountId: string;
    /**
     * The data contained by this setting
     */
    data: any;
};
