'use strict';

const Base = require('../Base');
const constants = require('../constants');

/**  
 * @typedef TophOptions
 * @prop {string} baseURL - The base URL
 * @prop {number} timeout - Time in milliseconds before the request should be aborted. Default is 15000
 * @prop {any} headers An object of additional headers following a {'header': 'value'} format, note that those must not be content-type, user-agent or authorization header
 * @prop {boolean} nsfw Either a boolean or "only", false entirely filters nsfw, true gets both nsfw and non-nsfw, and "only" gets only nsfw. False by default
 * @prop {boolean} hidden If true, you only get back hidden images you uploaded. Defaults to false
 * @prop {boolean} preview Only apply to getImageTypes(), if true, a preview image image is sent along. Defaults to false
 * @prop {string} fileType Only apply to getRandomImage(), can be "jpeg", "gif" or "png"
 * @prop {string} tags Only apply to getRandomImage(), a comma-separated list of tags the image should have
 */

/**
 * 
 * 
 * @class Toph
 * @prop {any} token The token given in the constructor of Taihou, formatted according to whether it is a wolke token or not
 * @prop {any} options The **effective** options; e.g, if you specified options specific to Toph, those override the base ones
 */
class Toph extends Base {
    constructor(token, options, axios) {
        super(options);
        this.token = token;
        this.options = options.toph || options.images ? Object.assign(options, options.toph || options.images) : options;
        this.options.requestsPerMinute = this.options.requestsPerMinute || constants.toph.requestsPerMinute;
        this.axios = axios;
        //As we heavily rely on this, ensure it is always bound to all methods regardless of the context
        this.getStatus = this.getStatus.bind(this);
        this.getRandomImage = this.getRandomImage.bind(this);
        this.getImageTypes = this.getImageTypes.bind(this);
        this.getImageTags = this.getImageTags.bind(this);
        this.getImageInfo = this.getImageInfo.bind(this);
        this.addTagsToImage = this.addTagsToImage.bind(this);
        this.removeTagsFromImage = this.removeTagsFromImage.bind(this);
        this.deleteImage = this.deleteImage.bind(this);
    }

    /**
     * Make a simple request to check whether Toph is available or not, due to its nature, this method never rejects
     * 
     * @param {TophOptions} [options={}] An optional object of options
     * @memberof Toph
     * @returns {boolean} Whether or not Toph is online 
     */
    getStatus(options = {}) {
        return new Promise(async(resolve, reject) => {
            options = Object.assign({...this.options }, options);
            this.status(`${options.baseURL}/images`, options)
                .then(res => {
                    return resolve(res.data.status === 200 ? true : false);
                })
                .catch((err) => {
                    return resolve(false);
                });
        });
    }

    /**
     * Get a random image from weeb.sh, you can specify both type and options.tags. You can also set the type to null and only specify options.tags
     * 
     * @param {string} type - The type, either this or options.tags is mandatory. To get a list of types, use getImageTypes, as well as getImageTags for a list of tags
     * @param {TophOptions} [options={}] 
     * @memberof Toph
     * @returns {any} The parsed image object, refer to https://docs.weeb.sh/#random-image for its structure
     */
    getRandomImage(type, options = {}) {
        return new Promise(async(resolve, reject) => {
            options = Object.assign({...this.options }, options);
            if (!type && !options.tags) {
                Promise.reject(new this.error('Either the type or tags parameter is mandatory'));
            }
            if (options.tags) {
                options.tags = options.tags.replace(/\s+/gi, '');
            }
            options.params = this.addURLParams({ type: type }, ['nsfw', 'tags', 'hidden', 'filetype'], options);
            this.requestHandler.queueRequest(this.formatRequest(`${options.baseURL}/images/random`, 'get', options), options)
                .then(res => {
                    if (res.data.status !== 200) {
                        reject(new this.error(res));
                    } else {
                        resolve(res.data);
                    }
                })
                .catch(err => {
                    reject(new this.error(err));
                });
        });
    }

    /**
     * Get a list of image types and a preview image for each if you want
     * 
     * @param {TophOptions} [options={}] 
     * @returns {any} The parsed response object that you can see here https://docs.weeb.sh/#image-types
     * @memberof Toph
     */
    getImageTypes(options = {}) {
        return new Promise(async(resolve, reject) => {
            options = Object.assign({...this.options }, options);
            options.params = this.addURLParams({}, ['nsfw', 'hidden', 'preview'], options);
            this.requestHandler.queueRequest(this.formatRequest(`${options.baseURL}/images/types`, 'get', options), options)
                .then(res => {
                    if (res.data.status !== 200) {
                        reject(new this.error(res));
                    } else {
                        return resolve(res.data);
                    }
                })
                .catch(err => {
                    reject(new this.error(err));
                });
        })
    }

    /**
     * Get a list of image tags
     * 
     * @param {TophOptions} [options={}] 
     * @returns {any} The parsed response object that you can see here https://docs.weeb.sh/#image-tags
     * @memberof Toph
     */
    getImageTags(options = {}) {
        return new Promise(async(resolve, reject) => {
            options = Object.assign({...this.options }, options);
            options.params = this.addURLParams({}, ['hidden', 'nsfw'], options);
            this.requestHandler.queueRequest(this.formatRequest(`${options.baseURL}/images/tags`, 'get', options), options)
                .then(res => {
                    if (res.data.status !== 200) {
                        reject(new this.error(res));
                    } else {
                        return resolve(res.data);
                    }
                })
                .catch(err => {
                    reject(new this.error(err));
                });
        })
    }

    /**
     * Get info about an image using its ID
     * 
     * @param {string} id - The ID of the image to get info from
     * @param {TophOptions} [options={}] 
     * @returns {any} The parsed response object that you can see here https://docs.weeb.sh/#image-info
     * @memberof Toph
     */
    getImageInfo(id, options = {}) {
        return new Promise(async(resolve, reject) => {
            if (!id) {
                return reject(new this.error('The ID is mandatory'));
            }
            options = Object.assign({...this.options }, options);
            this.requestHandler.queueRequest(this.formatRequest(`${options.baseURL}/images/info/${id}`, 'get', options), options)
                .then(res => {
                    if (res.data.status !== 200) {
                        reject(new this.error(res));
                    } else {
                        return resolve(res.data);
                    }
                })
                .catch(err => {
                    reject(new this.error(err));
                });
        });
    }

    /**
     * Add tags to an image
     * 
     * @param {string} id - The ID of the image to add tags to
     * @param {array} tags - An array of tags, either strings or {name: 'tag_name'} objects 
     * @param {TophOptions} [options={}]
     * @returns {any} An object detailing added and skipped tags
     * @memberof Toph
     */
    addTagsToImage(id, tags, options = {}) {
        return new Promise(async(resolve, reject) => {
            if (!id) {
                return reject('The image ID is mandatory');
            } else if (!tags || !Array.isArray(tags)) {
                return reject('The tags to add must be an array of strings');
            }
            options = Object.assign({...this.options }, options);
            options.params = this.addURLParams({ id: id }, [], options);
            options.data = {
                tags: tags
            }
            this.requestHandler.queueRequest(this.formatRequest(`${options.baseURL}/images/info/${id}/tags`, 'post', options), options)
                .then(res => {
                    if (res.data.status !== 200) {
                        reject(new this.error(res));
                    } else {
                        return resolve(res.data);
                    }
                })
                .catch(err => {
                    reject(new this.error(err));
                });
        })
    }

    /**
     * Remove tags from an image
     * 
     * @param {string} id - The ID of the image to remove tags from
     * @param {array} tags - An array of tags, either strings or {name: 'tag_name'} objects 
     * @param {TophOptions} [options={}]
     * @returns {any} 
     * @memberof Toph
     */
    removeTagsFromImage(id, tags, options = {}) {
        return new Promise(async(resolve, reject) => {
            if (!id) {
                return reject('The image ID is mandatory');
            } else if (!tags || !Array.isArray(tags)) {
                return reject('The tags to add must be an array of strings');
            }
            options = Object.assign({...this.options }, options);
            options.params = this.addURLParams({ id: id }, [], options);
            options.data = {
                tags: tags
            }
            this.requestHandler.queueRequest(this.formatRequest(`${options.baseURL}/images/info/${id}/tags`, 'delete', options), options)
                .then(res => {
                    if (res.data.status !== 200) {
                        reject(new this.error(res));
                    } else {
                        return resolve(res.data);
                    }
                })
                .catch(err => {
                    reject(new this.error(err));
                });
        })
    }

    /**
     * Delete an image
     * 
     * @param {string} id - The ID of the image to remove tags from
     * @param {TophOptions} [options={}]
     * @returns {any} An object containing a success confirmation
     * @memberof Toph
     */
    deleteImage(id, options = {}) {
        return new Promise(async(resolve, reject) => {
            if (!id) {
                return reject('The image ID is mandatory');
            }
            options = Object.assign({...this.options }, options);
            options.params = this.addURLParams({ id: id }, [], options);
            this.requestHandler.queueRequest(this.formatRequest(`${options.baseURL}/images/info/${id}`, 'delete', options), options)
                .then(res => {
                    if (res.data.status !== 200) {
                        reject(new this.error(res));
                    } else {
                        return resolve(res.data);
                    }
                })
                .catch(err => {
                    reject(new this.error(err));
                });
        })
    }
}

module.exports = Toph;