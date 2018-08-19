'use strict';

const Base = require('../Base');
const constants = require('../constants');
/** @typedef {import("../../index.js").TaihouOptions} TaihouOptions 
 * @typedef {import("axios")} Axios
 */

/**  
 * @typedef {Object} TophOptions
 * @prop {Boolean} nsfw Either a boolean or "only", false entirely filters nsfw, true gets both nsfw and non-nsfw, and "only" gets only nsfw. False by default
 * @prop {Boolean} hidden If true, you only get back hidden images you uploaded. Defaults to false
 * @prop {Boolean} preview Only apply to getImageTypes(), if true, a preview image image is sent along. Defaults to false
 * @prop {String} fileType Only apply to getRandomImage(), can be "jpeg", "gif" or "png"
 * @prop {String} tags Only apply to getRandomImage(), a comma-separated list of tags the image should have
 * @prop {Boolean} burst Whether to enable the request handler's burst mode, false by default
 * @prop {Number} beforeNextRequest Only apply per-request, time in milliseconds before the next request in the queue should be executed. Is ignored if burst mode is enabled
 * @prop {Number} requestsPerMinute Only apply when instantiating the module, regardless of the mode, define how many requests can be done in a minute. 0 makes it limitless
 */

/**  
 * @typedef {Object} UploadOptions
 * @prop {String} file Absolute path to a file, takes priority over url argument
 * @prop {String} url Url pointing directly at the image you want to upload, you may only use file or url
 * @prop {String} baseType The type of the image; e.g, the category (pat, cuddle and such)
 * @prop {Boolean} hidden Whether the uploaded image should be private or not
 * @prop {Boolean} nsfw Whether this image has content that could be considered NSFW (not safe for work)
 * @prop {String} tags Comma-separated list of tags to add to the image, they will inherit the hidden property of the image
 * @prop {String} source Url pointing to the original source of the image
 */

/** @typedef {Object} ImageInfo 
 * @prop {String} id The ID of the image
 * @prop {String} type The type of the image
 * @prop {String} baseType The base type of the image
 * @prop {Boolean} nsfw Whether the image is NSFW (Not Safe For Work)
 * @prop {String} fileType The type of the file ("gif", "png"...)
 * @prop {String} mimeType The mime type of the file
 * @prop {Array<String>} tags An array of tags associated to this image
 * @prop {String} url The direct URL to the image
 * @prop {Boolean} hidden Whether the image is hidden
 * @prop {String} account The ID of the account that uploaded this image
 * @prop {String} [source] The source url of the image, if any
 */

/** @typedef {Object} PreviewImageInfo
 * @prop {String} url The direct URL to the image
 * @prop {String} id The ID of the image
 * @prop {String} fileType The type of the file ("gif", "png"...)
 * @prop {String} baseType The base type of the image
 * @prop {String} type The type of the image
 */

/**  
 * @typedef {Object} UploadResponse
 * @prop {Number} status The HTTP status code of the request
 * @prop {ImageInfo} file The uploaded image info
 */

/** @typedef {Object} ImageTypesResponse
 * @prop {String} status The HTTP status code of the request
 * @prop {Array<String>} types An array listing all the existing types
 * @prop {Array<PreviewImageInfo>} [preview] An array containing previews for each types, unless preview wasn't requested
 */

 /** @typedef {Object} ImageTagsResponse
 * @prop {String} status The HTTP status code of the request
 * @prop {Array<String>} tags An array listing all the existing tags
 */

/**
 * 
 * 
 * @class Toph
 * @prop {String} token The token given in the constructor of Taihou, formatted according to whether it is a wolke token or not
 * @prop {TaihouOptions & TophOptions} options The **effective** options; e.g, if you specified options specific to Toph, those override the base ones
 */

class Toph extends Base {
    /**
     * 
     * @param {String} token - The token 
     * @param {TaihouOptions & TophOptions} options - The options for this instance
     * @param {Axios} axios - The axios instance
     */

    constructor(token, options, axios) {
        super(options);
        this.token = token;
        this.options = options.toph || options.images ? Object.assign({ ...options
        }, options.toph || options.images) : options;
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
     * .then(console.log) 
     * @returns {Promise<Boolean>} Whether or not Toph is online 
     */
    getStatus(options = {}) {
            options = Object.assign({ ...this.options
            }, options);
            return this._status(`${options.baseURL}${constants.endpoints.GET_TOPH_STATUS}`, options)
                .then(res => res.request.res.statusCode === 200 ? true : false)
                .catch(() => false);
    
    }
    /**
     * Upload an image to Toph
     * 
     * @param {UploadOptions} uploadOptions An object of options 
     * @param {TophOptions} [options={}] - An object of additional options
     * @example 
     * weebSH.toph.uploadImage({url: 'https://wew.png', type: 'wew', hidden: true, nsfw: false})
     * .then(console.log)
     * .catch(console.error)
     * @returns {Promise<UploadResponse>} An image object with a file key
     * @memberof Toph
     */
    async uploadImage(uploadOptions = {}, options = {}) {
            options = Object.assign({ ...this.options
            }, options);
            if ((typeof uploadOptions.file !== 'string' && typeof uploadOptions.url !== 'string') || typeof uploadOptions.baseType !== 'string') {
                return Promise.reject(new Error('At least either the uploadOptions.file or the uploadOptions.url and the uploadOptions.baseType parameters are required'));
            }
            if (uploadOptions.file) {
                await this._readFileAsync(uploadOptions.file)
                    .then(buffer => {
                        uploadOptions.file = buffer;
                        if (typeof options.headers === 'object') {
                            options.headers['Content-Type'] = 'multipart/form-data';
                        } else {
                            options.headers = {
                                'Content-Type': 'multipart/form-data'
                            };
                        }
                    })
                    .catch(err => {
                        return Promise.reject(err);
                    });
            }
            options.data = uploadOptions;
            this.requestHandler.queueRequest(this._formatRequest(`${options.baseURL}${constants.endpoints.UPLOAD_IMAGE}`, 'post', options), options)
                .then(res => res.data);
    }

    /**
     * Get a random image from weeb.sh, you can specify both type and options.tags. You can also set the type to null and only specify options.tags
     * 
     * @param {string} type - The type, either this or options.tags is mandatory. To get a list of types, use getImageTypes, as well as getImageTags for a list of tags
     * @param {TophOptions} [options={}] - An object of additional options
     * @memberof Toph
     * @example 
     * weebSH.toph.getRandomImage('pat')
     * .then(console.log)
     * .catch(console.error)
     * @returns {Promise<ImageInfo>} The parsed image object, refer to https://docs.weeb.sh/#random-image for its structure
     */
    getRandomImage(type, options = {}) {
        options = Object.assign({ ...this.options
        }, options);
        if (!type && !options.tags) {
            throw new Error('Either the type or options.tags parameter is mandatory');
        }
        if (options.tags) {
            options.tags = options.tags.replace(/\s+/gi, '');
        }
        options.params = this._addURLParams({
            type
        }, ['nsfw', 'tags', 'hidden', 'filetype'], options);
        return this.requestHandler.queueRequest(this._formatRequest(`${options.baseURL}${constants.endpoints.GET_RANDOM_IMAGE}`, 'get', options), options)
            .then(res => res.data);
    }

    /**
     * Get a list of image types and a preview image for each if you want
     * 
     * @param {TophOptions} [options={}] - An object of additional options
     * @returns {Promise<ImageTypesResponse>} The parsed response object that you can see here https://docs.weeb.sh/#image-types
     * @example
     * weebSH.toph.getImageTypes()
     * .then(console.log)
     * .catch(console.error)
     * @memberof Toph
     */
    getImageTypes(options = {}) {
            options = Object.assign({ ...this.options
            }, options);
            options.params = this._addURLParams({}, ['nsfw', 'hidden', 'preview'], options);
            return this.requestHandler.queueRequest(this._formatRequest(`${options.baseURL}${constants.endpoints.GET_IMAGE_TYPES}`, 'get', options), options)
                .then(res => res.data);
    }

    /**
     * Get a list of image tags
     * 
     * @param {TophOptions} [options={}] - An object of additional options
     * @example 
     * weebSH.toph.getImageTags()
     * .then(console.log)
     * .catch(console.error)
     * @returns {Promise<ImageTagsResponse>} The parsed response object that you can see here https://docs.weeb.sh/#image-tags
     * @memberof Toph
     */
    getImageTags(options = {}) {
            options = Object.assign({ ...this.options
            }, options);
            options.params = this._addURLParams({}, ['hidden', 'nsfw'], options);
            return this.requestHandler.queueRequest(this._formatRequest(`${options.baseURL}${constants.endpoints.GET_IMAGE_TAGS}`, 'get', options), options)
                .then(res => res.data);
    }

    /**
     * Get info about an image using its ID
     * 
     * @param {string} id - The ID of the image to get info from
     * @param {TophOptions} [options={}] - An object of additional options
     * @example 
     * weebSH.toph.getImageInfo('6d875e')
     * .then(console.log)
     * .catch(console.error)
     * @returns {Promise<ImageInfo>} The parsed response object that you can see here https://docs.weeb.sh/#image-info
     * @memberof Toph
     */
    getImageInfo(id, options = {}) {
            if (!id) {
                throw new Error('The ID is mandatory');
            }
            options = Object.assign({ ...this.options
            }, options);
            return this.requestHandler.queueRequest(this._formatRequest(`${options.baseURL}${constants.endpoints.GET_IMAGE_INFO(id)}`, 'get', options), options)
                .then(res => res.data);
    }

    /**
     * Add tags to an image
     * @deprecated This endpoint isn't (yet) publicly implemented in weeb.sh 
     * @param {string} id - The ID of the image to add tags to
     * @param {array} tags - An array of tags, either strings or {name: 'tag_name'} objects 
     * @param {TophOptions} [options={}] - An object of additional options
     * @example 
     * weebSH.toph.addTagsToImage('6d875e', ['baguette'])
     * .then(console.log)
     * .catch(console.error)
     * @returns {Promise<any>} An object detailing added and skipped tags
     * @memberof Toph
     */
    addTagsToImage(id, tags, options = {}) {
            if (!id) {
                throw new Error('The image ID is mandatory');
            } else if (!tags || !Array.isArray(tags)) {
                throw new Error('The tags to add must be an array of strings');
            }
            options = Object.assign({ ...this.options
            }, options);
            options.data = {
                tags: tags
            };
            return this.requestHandler.queueRequest(this._formatRequest(`${options.baseURL}${constants.endpoints.ADD_TAGS_TO_IMAGE(id)}`, 'post', options), options)
                .then(res => res.data);
    }

    /**
     * Remove tags from an image
     * @deprecated This endpoint isn't (yet) publicly implemented in weeb.sh 
     * @param {String} id - The ID of the image to remove tags from
     * @param {Array<String>} tags - An array of tags, either strings or {name: 'tag_name'} objects 
     * @param {TophOptions} [options={}] - An object of additional options
     * @example 
     * weebSH.toph.removeTagsFromImage('6d875e', ['baguette'])
     * .then(console.log)
     * .catch(console.error)
     * @returns {Promise<any>} The returned data
     * @memberof Toph
     */
    removeTagsFromImage(id, tags, options = {}) {
            if (!id) {
                throw new Error('The image ID is mandatory');
            } else if (!tags || !Array.isArray(tags)) {
                throw new Error('The tags to add must be an array of strings');
            }
            options = Object.assign({ ...this.options
            }, options);
            options.data = {
                tags: tags
            };
            return this.requestHandler.queueRequest(this._formatRequest(`${options.baseURL}${constants.endpoints.REMOVE_TAGS_FROM_IMAGE(id)}`, 'delete', options), options)
                .then(res => res.data);
    }

    /**
     * Delete an image
     * @deprecated This endpoint isn't (yet) publicly implemented in weeb.sh 
     * @param {string} id - The ID of the image to remove tags from
     * @param {TophOptions} [options={}] - An object of additional options
     * @example 
     * weebSH.toph.deleteImage('6d875e')
     * .then(console.log)
     * .catch(console.error)
     * @returns {Promise<any>} An object containing a success confirmation
     * @memberof Toph
     */
    deleteImage(id, options = {}) {
            if (!id) {
                throw new Error('The image ID is mandatory');
            }
            options = Object.assign({ ...this.options
            }, options);
            return this.requestHandler.queueRequest(this._formatRequest(`${options.baseURL}${constants.endpoints.DELETE_IMAGE(id)}`, 'delete', options), options)
                .then(res => res.data);
    }
}

module.exports = Toph;