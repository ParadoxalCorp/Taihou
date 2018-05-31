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
 * @prop {boolean} burst Whether to enable the request handler's burst mode, false by default
 * @prop {number} beforeNextRequest Only apply per-request, time in milliseconds before the next request in the queue should be executed. Is ignored if burst mode is enabled
 * @prop {number} requestsPerMinute Only apply when instantiating the module, regardless of the mode, define how many requests can be done in a minute. 0 makes it limitless
 */

/**  
 * @typedef UploadOptions
 * @prop {string} file Absolute path to a file, takes priority over url argument
 * @prop {string} url Url pointing directly at the image you want to upload, you may only use file or url
 * @prop {string} baseType The type of the image; e.g, the category (pat, cuddle and such)
 * @prop {boolean} hidden Whether the uploaded image should be private or not
 * @prop {boolean} nsfw Whether this image has content that could be considered NSFW (not safe for work)
 * @prop {string} tags Comma-separated list of tags to add to the image, they will inherit the hidden property of the image
 * @prop {string} source Url pointing to the original source of the image
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
        this.options = options.toph || options.images ? Object.assign({...options }, options.toph || options.images) : options;
        this.options.requestsPerMinute = this.options.requestsPerMinute || constants.toph.requestsPerMinute;
        this.axios = axios;
        //As we heavily rely on this, ensure it is always bound to all methods regardless of the context
        this.getStatus = this.getStatus.bind(this);
        this.uploadImage = this.uploadImage.bind(this);
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
     * @example 
     * weebSH.toph.getStatus()
     * .then(console.log) //true
     * @returns {Promise<boolean>} Whether or not Toph is online 
     */
    getStatus(options = {}) {
        return new Promise(async(resolve, reject) => {
            options = Object.assign({...this.options }, options);
            this.status(`${options.baseURL}${constants.endpoints.GET_TOPH_STATUS}`, options)
                .then(res => {
                    return resolve(res.request.res.statusCode === 200 ? true : false);
                })
                .catch((err) => {
                    return resolve(false);
                });
        });
    }

    /**
     * Upload an image to Toph
     * 
     * @param {UploadOptions} uploadOptions An object of options 
     * @param {TophOptions} [options={}] 
     * @example 
     * weebSH.toph.uploadImage({url: 'https://wew.png', type: 'wew', hidden: true, nsfw: false})
     * .then(console.log)
     * .catch(console.error)
     * @returns {Promise<any>} An image object with a file key
     * @memberof Toph
     */
    uploadImage(uploadOptions = {}, options = {}) {
        return new Promise(async(resolve, reject) => {
            options = Object.assign({...this.options }, options);
            if ((typeof uploadOptions.file !== 'string' && typeof uploadOptions.url !== 'string') || typeof uploadOptions.baseType !== 'string') {
                return reject(new this.Error('At least either the uploadOptions.file or the uploadOptions.url and the uploadOptions.baseType parameters are required'));
            }
            if (uploadOptions.file) {
                await this._readFileAsync(uploadOptions.file)
                    .then(buffer => {
                        uploadOptions.file = buffer;
                        if (typeof options.headers === 'object') {
                            options.headers['Content-Type'] = 'multipart/form-data';
                        } else {
                            options.headers = { 'Content-Type': 'multipart/form-data' };
                        }
                    })
                    .catch(err => {
                        return reject(new this.Error(err));
                    });
            }
            options.data = uploadOptions;
            this.requestHandler.queueRequest(this.formatRequest(`${options.baseURL}${constants.endpoints.UPLOAD_IMAGE}`, 'post', options), options)
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
     * Get a random image from weeb.sh, you can specify both type and options.tags. You can also set the type to null and only specify options.tags
     * 
     * @param {string} type - The type, either this or options.tags is mandatory. To get a list of types, use getImageTypes, as well as getImageTags for a list of tags
     * @param {TophOptions} [options={}] 
     * @memberof Toph
     * @example 
     * weebSH.toph.getRandomImage('pat')
     * .then(console.log)
     * .catch(console.error)
     * @returns {Promise<any>} The parsed image object, refer to https://docs.weeb.sh/#random-image for its structure
     */
    getRandomImage(type, options = {}) {
        return new Promise(async(resolve, reject) => {
            options = Object.assign({...this.options }, options);
            if (!type && !options.tags) {
                return Promise.reject(new this.Error('Either the type or tags parameter is mandatory'));
            }
            if (options.tags) {
                options.tags = options.tags.replace(/\s+/gi, '');
            }
            options.params = this.addURLParams({ type: type }, ['nsfw', 'tags', 'hidden', 'filetype'], options);
            this.requestHandler.queueRequest(this.formatRequest(`${options.baseURL}${constants.endpoints.GET_RANDOM_IMAGE}`, 'get', options), options)
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
     * Get a list of image types and a preview image for each if you want
     * 
     * @param {TophOptions} [options={}] 
     * @returns {Promise<any>} The parsed response object that you can see here https://docs.weeb.sh/#image-types
     * @example
     * weebSH.toph.getImageTypes()
     * .then(console.log)
     * .catch(console.error)
     * @memberof Toph
     */
    getImageTypes(options = {}) {
        return new Promise(async(resolve, reject) => {
            options = Object.assign({...this.options }, options);
            options.params = this.addURLParams({}, ['nsfw', 'hidden', 'preview'], options);
            this.requestHandler.queueRequest(this.formatRequest(`${options.baseURL}${constants.endpoints.GET_IMAGE_TYPES}`, 'get', options), options)
                .then(res => {
                    if (res.request.res.statusCode !== 200) {
                        reject(new this.Error(res));
                    } else {
                        return resolve(res.data);
                    }
                })
                .catch(err => {
                    reject(new this.Error(err));
                });
        })
    }

    /**
     * Get a list of image tags
     * 
     * @param {TophOptions} [options={}] 
     * @example 
     * weebSH.toph.getImageTags()
     * .then(console.log)
     * .catch(console.error)
     * @returns {Promise<any>} The parsed response object that you can see here https://docs.weeb.sh/#image-tags
     * @memberof Toph
     */
    getImageTags(options = {}) {
        return new Promise(async(resolve, reject) => {
            options = Object.assign({...this.options }, options);
            options.params = this.addURLParams({}, ['hidden', 'nsfw'], options);
            this.requestHandler.queueRequest(this.formatRequest(`${options.baseURL}${constants.endpoints.GET_IMAGE_TAGS}`, 'get', options), options)
                .then(res => {
                    if (res.request.res.statusCode !== 200) {
                        reject(new this.Error(res));
                    } else {
                        return resolve(res.data);
                    }
                })
                .catch(err => {
                    reject(new this.Error(err));
                });
        })
    }

    /**
     * Get info about an image using its ID
     * 
     * @param {string} id - The ID of the image to get info from
     * @param {TophOptions} [options={}] 
     * @example 
     * weebSH.toph.getImageInfo('6d875e')
     * .then(console.log)
     * .catch(console.error)
     * @returns {Promise<any>} The parsed response object that you can see here https://docs.weeb.sh/#image-info
     * @memberof Toph
     */
    getImageInfo(id, options = {}) {
        return new Promise(async(resolve, reject) => {
            if (!id) {
                return reject(new this.Error('The ID is mandatory'));
            }
            options = Object.assign({...this.options }, options);
            this.requestHandler.queueRequest(this.formatRequest(`${options.baseURL}${constants.endpoints.GET_IMAGE_INFO(id)}`, 'get', options), options)
                .then(res => {
                    if (res.request.res.statusCode !== 200) {
                        reject(new this.Error(res));
                    } else {
                        return resolve(res.data);
                    }
                })
                .catch(err => {
                    reject(new this.Error(err));
                });
        });
    }

    /**
     * Add tags to an image
     * 
     * @param {string} id - The ID of the image to add tags to
     * @param {array} tags - An array of tags, either strings or {name: 'tag_name'} objects 
     * @param {TophOptions} [options={}]
     * @example 
     * weebSH.toph.addTagsToImage('6d875e', ['baguette'])
     * .then(console.log)
     * .catch(console.error)
     * @returns {Promise<any>} An object detailing added and skipped tags
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
            options.data = {
                tags: tags
            }
            this.requestHandler.queueRequest(this.formatRequest(`${options.baseURL}${constants.endpoints.ADD_TAGS_TO_IMAGE(id)}`, 'post', options), options)
                .then(res => {
                    if (res.request.res.statusCode !== 200) {
                        reject(new this.Error(res));
                    } else {
                        return resolve(res.data);
                    }
                })
                .catch(err => {
                    reject(new this.Error(err));
                });
        })
    }

    /**
     * Remove tags from an image
     * 
     * @param {string} id - The ID of the image to remove tags from
     * @param {array} tags - An array of tags, either strings or {name: 'tag_name'} objects 
     * @param {TophOptions} [options={}]
     * @example 
     * weebSH.toph.removeTagsFromImage('6d875e')
     * .then(console.log)
     * .catch(console.error)
     * @returns {Promise<any>} 
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
            options.data = {
                tags: tags
            }
            this.requestHandler.queueRequest(this.formatRequest(`${options.baseURL}${constants.endpoints.REMOVE_TAGS_FROM_IMAGE(id)}`, 'delete', options), options)
                .then(res => {
                    if (res.request.res.statusCode !== 200) {
                        reject(new this.Error(res));
                    } else {
                        return resolve(res.data);
                    }
                })
                .catch(err => {
                    reject(new this.Error(err));
                });
        })
    }

    /**
     * Delete an image
     * 
     * @param {string} id - The ID of the image to remove tags from
     * @param {TophOptions} [options={}]
     * @example 
     * weebSH.toph.deleteImage('6d875e')
     * .then(console.log)
     * .catch(console.error)
     * @returns {Promise<any>} An object containing a success confirmation
     * @memberof Toph
     */
    deleteImage(id, options = {}) {
        return new Promise(async(resolve, reject) => {
            if (!id) {
                return reject('The image ID is mandatory');
            }
            options = Object.assign({...this.options }, options);
            this.requestHandler.queueRequest(this.formatRequest(`${options.baseURL}${constants.endpoints.DELETE_IMAGE(id)}`, 'delete', options), options)
                .then(res => {
                    if (res.request.res.statusCode !== 200) {
                        reject(new this.Error(res));
                    } else {
                        return resolve(res.data);
                    }
                })
                .catch(err => {
                    reject(new this.Error(err));
                });
        })
    }
}

module.exports = Toph;