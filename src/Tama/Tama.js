'use strict';

const Base = require('../Base');
const constants = require('../constants');
const Collection = require('../Collection');

/**  
 * @typedef TamaOptions
 * @prop {string} baseURL - The base URL
 * @prop {number} timeout - Time in milliseconds before the request should be aborted
 * @prop {any} headers - An object of additional headers following a {'header': 'value'} format, note that those must not be content-type, user-agent or authorization header
 * @prop {boolean} burst Whether to enable the request handler's burst mode, false by default
 * @prop {number} beforeNextRequest - Only apply per-request, time in milliseconds before the next request in the queue should be executed. Is ignored if burst mode is enabled
 * @prop {number} requestsPerMinute - Only apply when instantiating the module, regardless of the mode, define how many requests can be done in a minute. 0 makes it limitless
 * @prop {boolean} useCache - Defaults to true, this define whether to use the cache rather than always requesting to weeb.sh. The cache is updated whenever the setting is updated through Taihou
 */

/**  
 * @typedef CreateOrUpdateOptions
 * @prop {string} type - The type of the setting
 * @prop {string|number} id - The id of the setting
 * @prop {any} data - The data you want this setting to hold. Please note that existing data will be overriden by this, so in the case of an update, specify unchanged fields too
 */

/**  
 * @typedef listSubSettingsOptions
 * @prop {string} type - The type of the setting
 * @prop {string|number} id - The id of the setting
 * @prop {string} subType - The type of the sub-setting
 */

/**  
 * @typedef getSubSettingOptions
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
 * @prop {any} data - The data you want this sub-setting to hold. Please note that existing data will be overriden by this, so in the case of an update, specify unchanged fields too
 */


/**
 * 
 * 
 * @class Tama
 * @prop {any} token The token given in the constructor of Taihou, formatted according to whether it is a wolke token or not
 * @prop {any} options The **effective** options; e.g, if you specified options specific to Tama, those override the base ones
 * @prop {Collection} settingsCache The settings cache
 * @prop {Collection} subSettingsCache The sub-settings cache
 */
class Tama extends Base {
    constructor(token, options, axios) {
        super(options);
        this.token = token;
        this.options = options.tama || options.images ? Object.assign({...options }, options.tama || options.images) : options;
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
     * @param {TamaOptions} [options={}] An optional object of options
     * @memberof Tama
     * @example
     * weebSH.tama.getStatus()
     * .then(console.log)
     * .catch(console.error)
     * @returns {boolean} Whether or not Tama is online 
     */
    async getStatus(options = {}) {
        return new Promise(async(resolve, reject) => {
            options = Object.assign({...this.options }, options);
            this.status(`${options.baseURL}${constants.endpoints.GET_TAMA_STATUS}`, options)
                .then(res => {
                    return resolve(res.request.res.statusCode === 200 ? true : false);
                })
                .catch(() => {
                    return resolve(false);
                });
        });
    }

    /**
     * Get a setting by type and ID
     * 
     * @param {string} type - The type of the setting
     * @param {string|number} id - The ID of the setting
     * @param {TamaOptions} [options={}] 
     * @example 
     * weebSH.tama.getSetting('guilds', '300407204987666432')
     * .then(console.log)
     * .catch(console.error)
     * @returns {Promise<any>} The parsed response object, with a `cached` property representing whether the returned setting is from the cache, refer to https://docs.weeb.sh/#get-setting for its structure
     */
    getSetting(type, id, options = {}) {

        //Capture the stacktrace before it gets destroyed by the async operation
        let _stackTrace = {};
        Error.captureStackTrace(_stackTrace);

        return new Promise(async(resolve, reject) => {
            options = Object.assign({...this.options }, options);
            if (typeof type !== 'string' || (typeof id !== 'string' && typeof id !== 'number')) {
                return reject(new this.Error('The type and id parameters are mandatory', _stackTrace));
            }
            if (options.useCache) {
                const setting = this.settingsCache.get(`${type}/${id}`);
                if (setting) {
                    setting.cached = true;
                    return resolve(setting);
                }
            }
            this.requestHandler.queueRequest(this.formatRequest(`${options.baseURL}${constants.endpoints.GET_SETTING(type, id)}`, 'get', options), options)
                .then(res => {
                    if (res.request.res.statusCode !== 200) {
                        reject(new this.Error(res, _stackTrace));
                    } else {
                        res.data.cached = false;
                        if (options.useCache) {
                            this.settingsCache.set(`${res.data.setting.type}/${res.data.setting.id}`, res.data);
                        }
                        resolve(res.data);
                    }
                })
                .catch(err => {
                    reject(new this.Error(err, _stackTrace));
                });
        });
    }

    /**
     * Create a new setting
     * Technically you can update an existing setting with this method too, the only reason there is two different methods is to be clearer
     * @param {CreateOrUpdateOptions} createOptions - An object of parameters
     * @param {TamaOptions} [options={}] 
     * @example 
     * weebSH.tama.createSetting({type: 'guilds', id: '300407204987666432', data: {prefix: 'poi', baguette: true}})
     * .then(console.log)
     * .catch(console.error)
     * @returns {Promise<any>} The parsed response object, refer to https://docs.weeb.sh/#create-update-setting for its structure
     */
    createSetting(createOptions, options = {}) {

        //Capture the stacktrace before it gets destroyed by the async operation
        let _stackTrace = {};
        Error.captureStackTrace(_stackTrace);

        return new Promise(async(resolve, reject) => {
            options = Object.assign({...this.options }, options);
            if (typeof createOptions.type !== 'string' || (typeof createOptions.id !== 'string' && typeof createOptions.id !== 'number') || !createOptions.data) {
                return reject(new this.Error('The createOptions.type, createOptions.id and createOptions.data parameters are mandatory', _stackTrace));
            }
            options.data = createOptions.data;
            this.requestHandler.queueRequest(this.formatRequest(`${options.baseURL}${constants.endpoints.CREATE_OR_UPDATE_SETTING(createOptions.type, createOptions.id)}`, 'post', options), options)
                .then(res => {
                    if (res.request.res.statusCode !== 200) {
                        reject(new this.Error(res, _stackTrace));
                    } else {
                        if (options.useCache) {
                            this.settingsCache.set(`${res.data.setting.type}/${res.data.setting.id}`, res.data);
                        }
                        resolve(res.data);
                    }
                })
                .catch(err => {
                    reject(new this.Error(err, _stackTrace));
                });
        });
    }

    /**
     * Update a setting
     * Technically you can create a setting with this method too, the only reason there is two different methods is to be clearer
     * @param {CreateOrUpdateOptions} updateOptions - An object of parameters 
     * @param {TamaOptions} [options={}] 
     * @example 
     * weebSH.tama.updateSetting({type: 'guilds', id: '300407204987666432', data: {prefix: 'poi', baguette: false}})
     * .then(console.log)
     * .catch(console.error)
     * @returns {Promise<any>} The parsed response object, refer to https://docs.weeb.sh/#create-update-setting for its structure
     */
    updateSetting(updateOptions, options = {}) {

        //Capture the stacktrace before it gets destroyed by the async operation
        let _stackTrace = {};
        Error.captureStackTrace(_stackTrace);

        return new Promise(async(resolve, reject) => {
            options = Object.assign({...this.options }, options);
            if (typeof updateOptions.type !== 'string' || (typeof updateOptions.id !== 'string' && typeof updateOptions.id !== 'number') || !updateOptions.data) {
                return reject(new this.Error('The updateOptions.type, updateOptions.id and updateOptions.data parameters are mandatory', _stackTrace));
            }
            options.data = updateOptions.data;
            this.requestHandler.queueRequest(this.formatRequest(`${options.baseURL}${constants.endpoints.CREATE_OR_UPDATE_SETTING(updateOptions.type, updateOptions.id)}`, 'post', options), options)
                .then(res => {
                    if (res.request.res.statusCode !== 200) {
                        reject(new this.Error(res, _stackTrace));
                    } else {
                        if (options.useCache) {
                            this.settingsCache.set(`${res.data.setting.type}/${res.data.setting.id}`, res.data);
                        }
                        resolve(res.data);
                    }
                })
                .catch(err => {
                    reject(new this.Error(err, _stackTrace));
                });
        });
    }

    /**
     * Delete a setting by type and ID
     * If options.useCache is true, the setting will also be deleted from the cache. Note that this however won't delete the subsettings
     * @param {string} type - The type of the setting
     * @param {string|number} id - The ID of the setting
     * @param {TamaOptions} [options={}] 
     * @example 
     * weebSH.tama.deleteSetting('guilds', '300407204987666432')
     * .then(console.log)
     * .catch(console.error)
     * @returns {Promise<any>} The parsed response object, refer to https://docs.weeb.sh/#delete-setting for its structure
     */
    deleteSetting(type, id, options = {}) {

        //Capture the stacktrace before it gets destroyed by the async operation
        let _stackTrace = {};
        Error.captureStackTrace(_stackTrace);

        return new Promise(async(resolve, reject) => {
            options = Object.assign({...this.options }, options);
            if (typeof type !== 'string' || (typeof id !== 'string' && typeof id !== 'number')) {
                return reject(new this.Error('The type and id parameters are mandatory', _stackTrace));
            }
            this.requestHandler.queueRequest(this.formatRequest(`${options.baseURL}${constants.endpoints.DELETE_SETTING(type, id)}`, 'delete', options), options)
                .then(res => {
                    if (res.request.res.statusCode !== 200) {
                        reject(new this.Error(res, _stackTrace));
                    } else {
                        if (options.useCache) {
                            this.settingsCache.delete(`${type}/${id}`);
                        }
                        resolve(res.data);
                    }
                })
                .catch(err => {
                    reject(new this.Error(err, _stackTrace));
                });
        });
    }

    /**
     * Get a list of sub-settings for a sub-setting type.
     * 
     * @param {listSubSettingsOptions} listOptions - An object of parameters
     * @param {TamaOptions} [options={}] 
     * @example 
     * weebSH.tama.listSubSettings({type: 'guilds', id: '300407204987666432', subType: 'channels'})
     * .then(console.log)
     * .catch(console.error)
     * @returns {Promise<any>} The parsed response object, refer to https://docs.weeb.sh/#list-sub-settings for its structure
     */
    listSubSettings(listOptions, options = {}) {

        //Capture the stacktrace before it gets destroyed by the async operation
        let _stackTrace = {};
        Error.captureStackTrace(_stackTrace);

        return new Promise(async(resolve, reject) => {
            options = Object.assign({...this.options }, options);
            if (typeof listOptions.type !== 'string' || (typeof listOptions.id !== 'string' && typeof listOptions.id !== 'number') || typeof listOptions.subType !== 'string') {
                return reject(new this.Error('The listOptions.type, listOptions.id and listOptions.subType parameters are mandatory', _stackTrace));
            }
            this.requestHandler.queueRequest(this.formatRequest(`${options.baseURL}${constants.endpoints.LIST_SUBSETTINGS(listOptions.type, listOptions.id, listOptions.subType)}`, 'get', options), options)
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
     * Get a sub-setting by type and id 
     * 
     * @param {GetSubSettingOptions} getSubSettingOptions - An object of parameters
     * @param {TamaOptions} [options={}] 
     * @example 
     * weebSH.tama.getSubSetting({type: 'guilds', id: '300407204987666432', subType: 'channels', subId: '439457506960605185'})
     * .then(console.log)
     * .catch(console.error)
     * @returns {Promise<any>} The parsed response object, along with a `cached` property representing whether the returned sub-setting is from the cache, refer to https://docs.weeb.sh/#get-sub-settings for its structure
     */
    getSubSetting(getSubSettingOptions, options = {}) {

        //Capture the stacktrace before it gets destroyed by the async operation
        let _stackTrace = {};
        Error.captureStackTrace(_stackTrace);

        return new Promise(async(resolve, reject) => {
            options = Object.assign({...this.options }, options);
            if (typeof getSubSettingOptions.type !== 'string' || (typeof getSubSettingOptions.id !== 'string' && typeof getSubSettingOptions.id !== 'number') || typeof getSubSettingOptions.subType !== 'string' || (typeof getSubSettingOptions.subId !== 'string' && typeof getSubSettingOptions.subId !== 'number')) {
                return reject(new this.Error('The getSubSettingOptions.type, getSubSettingOptions.id, getSubSettingOptions.subType and getSubSettingOptions.subId parameters are mandatory', _stackTrace));
            }
            if (options.useCache) {
                const subSetting = this.subSettingsCache.get(`${getSubSettingOptions.type}/${getSubSettingOptions.id}/${getSubSettingOptions.subType}/${getSubSettingOptions.subId}`);
                if (subSetting) {
                    subSetting.data.cached = true;
                    return resolve(subSetting.data);
                }
            }
            this.requestHandler.queueRequest(this.formatRequest(`${options.baseURL}${constants.endpoints.GET_SUBSETTING(getSubSettingOptions.type, getSubSettingOptions.id, getSubSettingOptions.subType, getSubSettingOptions.subId)}`, 'get', options), options)
                .then(res => {
                    if (res.request.res.statusCode !== 200) {
                        reject(new this.Error(res, _stackTrace));
                    } else {
                        res.data.cached = false;
                        if (options.useCache) {
                            const key = `${createOptions.type}/${createOptions.id}/${createOptions.subType}/${createOptions.subId}`;
                            this.subSettingsCache.set(key, { key: key, data: res.data });
                        }
                        resolve(res.data);
                    }
                })
                .catch(err => {
                    reject(new this.Error(err, _stackTrace));
                });
        });
    }

    /**
     * Create a sub-setting
     * Technically this method can be used to update a sub-setting too, the only reason there is two different methods is to be clearer
     * @param {CreateOrUpdateSubSettingOptions} createOptions - An object of parameters
     * @param {TamaOptions} [options={}] 
     * @example 
     * weebSH.tama.createSubSetting({type: 'guilds', id: '300407204987666432', subType: 'channels', subId: '439457506960605185', data: {weeb: false}})
     * .then(console.log)
     * .catch(console.error)
     * @returns {Promise<any>} The parsed response object, refer to https://docs.weeb.sh/#create-update-sub-setting for its structure
     */
    createSubSetting(createOptions, options = {}) {

        //Capture the stacktrace before it gets destroyed by the async operation
        let _stackTrace = {};
        Error.captureStackTrace(_stackTrace);

        return new Promise(async(resolve, reject) => {
            options = Object.assign({...this.options }, options);
            if (typeof createOptions.type !== 'string' || (typeof createOptions.id !== 'string' && typeof createOptions.id !== 'number') || typeof createOptions.subType !== 'string' || (typeof createOptions.subId !== 'string' && typeof createOptions.subId !== 'number') || !createOptions.data) {
                return reject(new this.Error('The createOptions.type, createOptions.id, createOptions.subType, createOptions.subId and createOptions.data parameters are mandatory', _stackTrace));
            }
            options.data = createOptions.data;
            this.requestHandler.queueRequest(this.formatRequest(`${options.baseURL}${constants.endpoints.CREATE_OR_UPDATE_SUBSETTING(createOptions.type, createOptions.id, createOptions.subType, createOptions.subId)}`, 'post', options), options)
                .then(res => {
                    if (res.request.res.statusCode !== 200) {
                        reject(new this.Error(res, _stackTrace));
                    } else {
                        if (options.useCache) {
                            const key = `${createOptions.type}/${createOptions.id}/${createOptions.subType}/${createOptions.subId}`;
                            this.subSettingsCache.set(key, { key: key, data: res.data });
                        }
                        resolve(res.data);
                    }
                })
                .catch(err => {
                    reject(new this.Error(err, _stackTrace));
                });
        });
    }

    /**
     * Update a sub-setting
     * Technically this method can be used to create a sub-setting too, the only reason there is two different methods is to be clearer
     * @param {CreateOrUpdateSubSettingOptions} updateOptions - An object of parameters
     * @param {TamaOptions} [options={}] 
     * @example 
     * weebSH.tama.createSubSetting({type: 'guilds', id: '300407204987666432', subType: 'channels', subId: '439457506960605185', data: {weeb: true}})
     * .then(console.log)
     * .catch(console.error)
     * @returns {Promise<any>} The parsed response object, refer to https://docs.weeb.sh/#create-update-sub-setting for its structure
     */
    updateSubSetting(updateOptions, options = {}) {

        //Capture the stacktrace before it gets destroyed by the async operation
        let _stackTrace = {};
        Error.captureStackTrace(_stackTrace);

        return new Promise(async(resolve, reject) => {
            options = Object.assign({...this.options }, options);
            if (typeof updateOptions.type !== 'string' || (typeof updateOptions.id !== 'string' && typeof updateOptions.id !== 'number') || typeof updateOptions.subType !== 'string' || (typeof updateOptions.subId !== 'string' && typeof updateOptions.subId !== 'number') || !updateOptions.data) {
                return reject(new this.Error('The updateOptions.type, updateOptions.id, updateOptions.subType, updateOptions.subId and updateOptions.data parameters are mandatory', _stackTrace));
            }
            options.data = updateOptions.data;
            this.requestHandler.queueRequest(this.formatRequest(`${options.baseURL}${constants.endpoints.CREATE_OR_UPDATE_SUBSETTING(updateOptions.type, updateOptions.id, updateOptions.subType, updateOptions.subId)}`, 'post', options), options)
                .then(res => {
                    if (res.request.res.statusCode !== 200) {
                        reject(new this.Error(res, _stackTrace));
                    } else {
                        if (options.useCache) {
                            const key = `${updateOptions.type}/${updateOptions.id}/${updateOptions.subType}/${updateOptions.subId}`;
                            this.subSettingsCache.set(key, { key: key, data: res.data });
                        }
                        resolve(res.data);
                    }
                })
                .catch(err => {
                    reject(new this.Error(err, _stackTrace));
                });
        });
    }

    /**
     * Delete a sub-setting
     * 
     * @param {DeleteSubSettingOptions} deleteOptions - An object of parameters
     * @param {TamaOptions} [options={}] 
     * @example 
     * weebSH.tama.deleteSubSetting({type: 'guilds', id: '300407204987666432', subType: 'channels', subId: '439457506960605185'})
     * .then(console.log)
     * .catch(console.error)
     * @returns {Promise<any>} The parsed response object, refer to https://docs.weeb.sh/#delete-sub-setting for its structure
     */
    deleteSubSetting(deleteOptions, options = {}) {

        //Capture the stacktrace before it gets destroyed by the async operation
        let _stackTrace = {};
        Error.captureStackTrace(_stackTrace);

        return new Promise(async(resolve, reject) => {
            options = Object.assign({...this.options }, options);
            if (typeof deleteOptions.type !== 'string' || (typeof deleteOptions.id !== 'string' && typeof deleteOptions.id !== 'number') || typeof deleteOptions.subType !== 'string' || (typeof deleteOptions.subId !== 'string' && typeof deleteOptions.subId !== 'number') || !deleteOptions.data) {
                return reject(new this.Error('The deleteOptions.type, deleteOptions.id, deleteOptions.subType, deleteOptions.subId and deleteOptions.data parameters are mandatory', _stackTrace));
            }
            this.requestHandler.queueRequest(this.formatRequest(`${options.baseURL}${constants.endpoints.DELETE_SUBSETTING(deleteOptions.type, deleteOptions.id, deleteOptions.subType, deleteOptions.subId)}`, 'delete', options), options)
                .then(res => {
                    if (res.request.res.statusCode !== 200) {
                        reject(new this.Error(res, _stackTrace));
                    } else {
                        if (options.useCache) {
                            const key = `${deleteOptions.type}/${deleteOptions.id}/${deleteOptions.subType}/${deleteOptions.subId}`;
                            this.subSettingsCache.delete(key);
                        }
                        resolve(res.data);
                    }
                })
                .catch(err => {
                    reject(new this.Error(err, _stackTrace));
                });
        });
    }
}

module.exports = Tama;