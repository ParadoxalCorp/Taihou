'use strict';

const Base = require('../Base');
const constants = require('../constants');
const Collection = require('../Collection');

/** @typedef {import("../../index").TaihouOptions} TaihouOptions */

/**  
 * @typedef TamaOptions
 * @prop {Boolean} burst Whether to enable the request handler's burst mode, false by default
 * @prop {Number} requestsPerMinute - Only apply when instantiating the module, regardless of the mode, define how many requests can be done in a minute. 0 makes it limitless
 * @prop {Boolean} useCache - Defaults to true, this define whether to use the cache rather than always requesting to weeb.sh. The cache is updated whenever the setting is updated through Taihou
 */

/** 
 * @typedef {Object} TamaRequestOptions
 * @prop {Number} beforeNextRequest - Only apply per-request, time in milliseconds before the next request in the queue should be executed. Is ignored if burst mode is enabled
 * @prop {Boolean} useCache - Defaults to true, this define whether to use the cache rather than always requesting to weeb.sh. The cache is updated whenever the setting is updated through Taihou
 */

/** @typedef {TamaRequestOptions & TaihouOptions} RequestOptions */

/**  
 * @typedef CreateOrUpdateOptions
 * @prop {String} type - The type of the setting
 * @prop {String|Number} id - The id of the setting
 * @prop {Object} data - The data you want this setting to hold. Please note that existing data will be overriden by this, so in the case of an update, specify unchanged fields too
 */

/**  
 * @typedef ListSubSettingsOptions
 * @prop {String} type - The type of the setting
 * @prop {String|Number} id - The id of the setting
 * @prop {String} subType - The type of the sub-setting
 */

/**  
 * @typedef GetOrDeleteSubSettingOptions
 * @prop {String} type - The type of the setting
 * @prop {String|Number} id - The id of the setting
 * @prop {String} subType - The type of the sub-setting
 * @prop {String|Number} subId - The id of the sub-setting
 */

/**  
 * @typedef CreateOrUpdateSubSettingOptions
 * @prop {String} type - The type of the setting
 * @prop {String|Number} id - The id of the setting
 * @prop {String} subType - The type of the sub-setting
 * @prop {String|Number} subId - The id of the sub-setting
 * @prop {Object} data - The data you want this sub-setting to hold. Please note that existing data will be overriden by this, so in the case of an update, specify unchanged fields too
 */

 /** @typedef {Object} SubSetting
  * @prop {String} id The ID of the setting
  * @prop {String} type The type of the setting
  * @prop {String} accountId The ID of the account that created this sub-setting
  * @prop {Object} data The data contained by this sub-setting
  * @prop {String} subId The ID of the sub-setting
  * @prop {String} subType The type of the sub-setting
  */

  /** @typedef {Object} Setting
  * @prop {String} id The ID of the setting
  * @prop {String} type The type of the setting
  * @prop {String} accountId The ID of the account that created this setting
  * @prop {Object} data The data contained by this setting
  */

 /** 
  * @typedef {Object} DeletedSubSetting
  * @prop {String} status The HTTP status code of the request
  * @prop {String} message A message describing the action taken
  * @prop {SubSetting} subsetting The sub-setting object
  */

  /** 
  * @typedef {Object} DeleteSettingResponse
  * @prop {String} status The HTTP status code of the request
  * @prop {String} message A message describing the action taken
  * @prop {Setting} setting The setting object
  */

  /** 
  * @typedef {Object} SettingResponse
  * @prop {String} status The HTTP status code of the request
  * @prop {Setting} setting The setting object
  * @prop {Boolean} cached Whether this setting is returned from the cache
  */

  /** 
  * @typedef {Object} SubSettingResponse
  * @prop {String} status The HTTP status code of the request
  * @prop {SubSetting} subsetting The setting object
  * @prop {Boolean} cached Whether this sub-setting is returned from the cache
  */

  /** 
  * @typedef {Object} SubSettingsList
  * @prop {String} status The HTTP status code of the request
  * @prop {Array<SubSetting>} subsettings An array of sub-settings
  */

/**
 * 
 * 
 * @class Tama
 * @prop {String} token The token given in the constructor of Taihou, formatted according to whether it is a wolke token or not
 * @prop {TamaOptions & TaihouOptions} options The **effective** options; e.g, if you specified options specific to Tama, those override the base ones
 * @prop {Collection} settingsCache The settings cache
 * @prop {Collection} subSettingsCache The sub-settings cache
 */

class Tama extends Base {
    /**
     * 
     * @param {String} token - The token 
     * @param {TaihouOptions & TophOptions} options - The options for this instance
     * @param {Axios} axios - The axios instance
     */

    constructor(token, options, axios) {
        super(options);
        this.token = token;
        this.options = options.tama || options.images ? Object.assign({ ...options
        }, options.tama || options.images) : options;
        this.options.requestsPerMinute = this.options.requestsPerMinute || constants.tama.requestsPerMinute;
        if (typeof this.options.useCache === 'undefined') {
            this.options.useCache = true;
        }
        this.axios = axios;
        this.settingsCache = new Collection();
        this.subSettingsCache = new Collection();
        this.getStatus = this.getStatus.bind(this);
        this.getSetting = this.getSetting.bind(this);
        this.createSetting = this.createSetting.bind(this);
        this.updateSetting = this.updateSetting.bind(this);
        this.deleteSetting = this.deleteSetting.bind(this);
        this.listSubSettings = this.listSubSettings.bind(this);
        this.getSubSetting = this.getSubSetting.bind(this);
        this.createSubSetting = this.createSubSetting.bind(this);
        this.updateSubSetting = this.updateSubSetting.bind(this);
        this.deleteSubSetting = this.deleteSubSetting.bind(this);
    }

    /**
     * Make a simple request to check whether Tama is available or not, due to its nature, this method never rejects
     * 
     * @param {RequestOptions} [options={}] An optional object of options
     * @memberof Tama
     * @example
     * weebSH.tama.getStatus()
     *  .then(console.log)
     *  .catch(console.error)
     * @returns {Promise<Boolean>} Whether or not Tama is online 
     */
    async getStatus(options = {}) {
        options = Object.assign({ ...this.options
        }, options);
        return this._status(`${options.baseURL}${constants.endpoints.GET_TAMA_STATUS}`, options)
            .then(res => res.request.res.statusCode === 200 ? true : false);
    }

    /**
     * Get a setting by type and ID
     * 
     * @param {String} type - The type of the setting
     * @param {String|Number} id - The ID of the setting
     * @param {RequestOptions} [options={}] - An additional object of options
     * @example 
     * weebSH.tama.getSetting('guilds', '300407204987666432')
     *  .then(console.log)
     *  .catch(console.error)
     * @returns {Promise<SettingResponse>} The parsed response object, with a `cached` property representing whether the returned setting is from the cache, refer to https://docs.weeb.sh/#get-setting for its structure
     */
    async getSetting(type, id, options = {}) {
        options = Object.assign({ ...this.options
        }, options);
        if (typeof type !== 'string' || (typeof id !== 'string' && typeof id !== 'number')) {
            throw new Error('The type and id parameters are mandatory');
        }
        if (options.useCache) {
            const setting = this.settingsCache.get(`${type}/${id}`);
            if (setting) {
                setting.cached = true;
                return setting;
            }
        }
        return this.requestHandler.queueRequest(this._formatRequest(`${options.baseURL}${constants.endpoints.GET_SETTING(type, id)}`, 'get', options), options)
            .then(res => {
                res.data.cached = false;
                if (options.useCache) {
                    this.settingsCache.set(`${res.data.setting.type}/${res.data.setting.id}`, res.data);
                }
                return res.data;
            });
    }

    /**
     * Create a new setting
     * Technically you can update an existing setting with this method too, the only reason there is two different methods is to be clearer
     * @param {CreateOrUpdateOptions} createOptions - An object of parameters
     * @param {RequestOptions} [options={}] An additional object of options
     * @example 
     * weebSH.tama.createSetting({type: 'guilds', id: '300407204987666432', data: {prefix: 'poi', baguette: true}})
     *  .then(console.log)
     *  .catch(console.error)
     * @returns {Promise<SettingResponse>} The parsed response object, refer to https://docs.weeb.sh/#create-update-setting for its structure
     */
    createSetting(createOptions, options = {}) {
        options = Object.assign({ ...this.options
        }, options);
        if (typeof createOptions.type !== 'string' || (typeof createOptions.id !== 'string' && typeof createOptions.id !== 'number') || !createOptions.data) {
            throw new Error('The createOptions.type, createOptions.id and createOptions.data parameters are mandatory');
        }
        options.data = createOptions.data;
        return this.requestHandler.queueRequest(this._formatRequest(`${options.baseURL}${constants.endpoints.CREATE_OR_UPDATE_SETTING(createOptions.type, createOptions.id)}`, 'post', options), options)
            .then(res => {
                if (options.useCache) {
                    this.settingsCache.set(`${res.data.setting.type}/${res.data.setting.id}`, res.data);
                }
                return res.data;
            });
    }

    /**
     * Update a setting
     * Technically you can create a setting with this method too, the only reason there is two different methods is to be clearer
     * @param {CreateOrUpdateOptions} updateOptions - An object of parameters 
     * @param {RequestOptions} [options={}] An additional object of options
     * @example 
     * weebSH.tama.updateSetting({type: 'guilds', id: '300407204987666432', data: {prefix: 'poi', baguette: false}})
     *  .then(console.log)
     *  .catch(console.error)
     * @returns {Promise<SettingResponse>} The parsed response object, refer to https://docs.weeb.sh/#create-update-setting for its structure
     */
    updateSetting(updateOptions, options = {}) {
        return this.createSetting(updateOptions, options);
    }

    /**
     * Delete a setting by type and ID
     * If options.useCache is true, the setting will also be deleted from the cache. Note that this however won't delete the subsettings
     * @param {String} type - The type of the setting
     * @param {String|Number} id - The ID of the setting
     * @param {RequestOptions} [options={}] An additional object of options
     * @example 
     * weebSH.tama.deleteSetting('guilds', '300407204987666432')
     *  .then(console.log)
     *  .catch(console.error)
     * @returns {Promise<DeleteSettingResponse>} The parsed response object, refer to https://docs.weeb.sh/#delete-setting for its structure
     */
    deleteSetting(type, id, options = {}) {
        options = Object.assign({ ...this.options
        }, options);
        if (typeof type !== 'string' || (typeof id !== 'string' && typeof id !== 'number')) {
            throw new Error('The type and id parameters are mandatory');
        }
        return this.requestHandler.queueRequest(this._formatRequest(`${options.baseURL}${constants.endpoints.DELETE_SETTING(type, id)}`, 'delete', options), options)
            .then(res => {
                if (options.useCache) {
                    this.settingsCache.delete(`${type}/${id}`);
                }
                return res.data;
            });
    }

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
    listSubSettings(listOptions, options = {}) {
        options = Object.assign({ ...this.options
        }, options);
        if (typeof listOptions.type !== 'string' || (typeof listOptions.id !== 'string' && typeof listOptions.id !== 'number') || typeof listOptions.subType !== 'string') {
            throw new Error('The listOptions.type, listOptions.id and listOptions.subType parameters are mandatory');
        }
        return this.requestHandler.queueRequest(this._formatRequest(`${options.baseURL}${constants.endpoints.LIST_SUBSETTINGS(listOptions.type, listOptions.id, listOptions.subType)}`, 'get', options), options)
            .then(res => res.data);
    }

    /**
     * Get a sub-setting by type and id 
     * 
     * @param {getOrDeleteSubSettingOptions} getSubSettingOptions - An object of parameters
     * @param {RequestOptions} [options={}] An additional object of options
     * @example 
     * weebSH.tama.getSubSetting({type: 'guilds', id: '300407204987666432', subType: 'channels', subId: '439457506960605185'})
     *  .then(console.log)
     *  .catch(console.error)
     * @returns {Promise<SubSettingResponse>} The parsed response object, along with a `cached` property representing whether the returned sub-setting is from the cache, refer to https://docs.weeb.sh/#get-sub-settings for its structure
     */
    async getSubSetting(getSubSettingOptions, options = {}) {
        options = Object.assign({ ...this.options
        }, options);
        if (typeof getSubSettingOptions.type !== 'string' || (typeof getSubSettingOptions.id !== 'string' && typeof getSubSettingOptions.id !== 'number') || typeof getSubSettingOptions.subType !== 'string' || (typeof getSubSettingOptions.subId !== 'string' && typeof getSubSettingOptions.subId !== 'number')) {
            throw new Error('The getSubSettingOptions.type, getSubSettingOptions.id, getSubSettingOptions.subType and getSubSettingOptions.subId parameters are mandatory');
        }
        if (options.useCache) {
            const subSetting = this.subSettingsCache.get(`${getSubSettingOptions.type}/${getSubSettingOptions.id}/${getSubSettingOptions.subType}/${getSubSettingOptions.subId}`);
            if (subSetting) {
                subSetting.data.cached = true;
                return subSetting.data;
            }
        }
        return this.requestHandler.queueRequest(this._formatRequest(`${options.baseURL}${constants.endpoints.GET_SUBSETTING(getSubSettingOptions.type, getSubSettingOptions.id, getSubSettingOptions.subType, getSubSettingOptions.subId)}`, 'get', options), options)
            .then(res => {
                res.data.cached = false;
                if (options.useCache) {
                    const key = `${getSubSettingOptions.type}/${getSubSettingOptions.id}/${getSubSettingOptions.subType}/${getSubSettingOptions.subId}`;
                    this.subSettingsCache.set(key, {
                        key: key,
                        data: res.data
                    });
                }
                return res.data;
            });
    }

    /**
     * Create a sub-setting
     * Technically this method can be used to update a sub-setting too, the only reason there is two different methods is to be clearer
     * @param {CreateOrUpdateSubSettingOptions} createOptions - An object of parameters
     * @param {RequestOptions} [options={}] An additional object of options
     * @example 
     * weebSH.tama.createSubSetting({type: 'guilds', id: '300407204987666432', subType: 'channels', subId: '439457506960605185', data: {weeb: false}})
     *  .then(console.log)
     *  .catch(console.error)
     * @returns {Promise<SubSettingResponse>} The parsed response object, refer to https://docs.weeb.sh/#create-update-sub-setting for its structure
     */
    createSubSetting(createOptions, options = {}) {
        options = Object.assign({ ...this.options
        }, options);
        if (typeof createOptions.type !== 'string' || (typeof createOptions.id !== 'string' && typeof createOptions.id !== 'number') || typeof createOptions.subType !== 'string' || (typeof createOptions.subId !== 'string' && typeof createOptions.subId !== 'number') || !createOptions.data) {
            throw new Error('The createOptions.type, createOptions.id, createOptions.subType, createOptions.subId and createOptions.data parameters are mandatory');
        }
        options.data = createOptions.data;
        return this.requestHandler.queueRequest(this._formatRequest(`${options.baseURL}${constants.endpoints.CREATE_OR_UPDATE_SUBSETTING(createOptions.type, createOptions.id, createOptions.subType, createOptions.subId)}`, 'post', options), options)
            .then(res => {
                if (options.useCache) {
                    const key = `${createOptions.type}/${createOptions.id}/${createOptions.subType}/${createOptions.subId}`;
                    this.subSettingsCache.set(key, {
                        key: key,
                        data: res.data
                    });
                }
                return res.data;
            });
    }

    /**
     * Update a sub-setting
     * Technically this method can be used to create a sub-setting too, the only reason there is two different methods is to be clearer
     * @param {CreateOrUpdateSubSettingOptions} updateOptions - An object of parameters
     * @param {RequestOptions} [options={}] An additional object of options
     * @example 
     * weebSH.tama.updateSubSetting({type: 'guilds', id: '300407204987666432', subType: 'channels', subId: '439457506960605185', data: {weeb: true}})
     *  .then(console.log)
     *  .catch(console.error)
     * @returns {Promise<SubSettingResponse>} The parsed response object, refer to https://docs.weeb.sh/#create-update-sub-setting for its structure
     */
    updateSubSetting(updateOptions, options = {}) {
        return this.createSubSetting(updateOptions, options);
    }

    /**
     * Delete a sub-setting
     * 
     * @param {getOrDeleteSubSettingOptions} deleteOptions - An object of parameters
     * @param {RequestOptions} [options={}] An additional object of options
     * @example 
     * weebSH.tama.deleteSubSetting({type: 'guilds', id: '300407204987666432', subType: 'channels', subId: '439457506960605185'})
     *  .then(console.log)
     *  .catch(console.error)
     * @returns {Promise<DeletedSubSetting>} The parsed response object, refer to https://docs.weeb.sh/#delete-sub-setting for its structure
     */
    deleteSubSetting(deleteOptions, options = {}) {
        options = Object.assign({ ...this.options
        }, options);
        if (typeof deleteOptions.type !== 'string' || (typeof deleteOptions.id !== 'string' && typeof deleteOptions.id !== 'number') || typeof deleteOptions.subType !== 'string' || (typeof deleteOptions.subId !== 'string' && typeof deleteOptions.subId !== 'number')) {
            throw new Error('The deleteOptions.type, deleteOptions.id, deleteOptions.subType and deleteOptions.subId parameters are mandatory');
        }
        return this.requestHandler.queueRequest(this._formatRequest(`${options.baseURL}${constants.endpoints.DELETE_SUBSETTING(deleteOptions.type, deleteOptions.id, deleteOptions.subType, deleteOptions.subId)}`, 'delete', options), options)
            .then(res => {
                if (options.useCache) {
                    const key = `${deleteOptions.type}/${deleteOptions.id}/${deleteOptions.subType}/${deleteOptions.subId}`;
                    this.subSettingsCache.delete(key);
                }
                return res.data;
            });

    }
}

module.exports = Tama;