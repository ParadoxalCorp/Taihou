export = Toph;
/**
 * @typedef {import('../../index.js').TaihouOptions} TaihouOptions
 * @typedef {import('axios').AxiosInstance} Axios
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
declare class Toph extends Base {
    /**
     *
     * @param {String} token - The token
     * @param {TaihouOptions & TophOptions} options - The options for this instance
     * @param {Axios} axios - The axios instance
     */
    constructor(token: string, options: TaihouOptions & TophOptions, axios: Axios);
    token: string;
    options: any;
    axios: import("axios").AxiosInstance;
    /**
     * Make a simple request to check whether Toph is available or not, due to its nature, this method never rejects
     *
     * @param {TophOptions} [options={}] An optional object of options
     * @memberof Toph
     * @example
     * weebSH.toph.getStatus()
     *  .then(console.log)
     * @returns {Promise<Boolean>} Whether or not Toph is online
     */
    getStatus(options?: TophOptions): Promise<boolean>;
    /**
     * Upload an image to Toph
     *
     * @param {UploadOptions} uploadOptions An object of options
     * @param {TophOptions} [options={}] - An object of additional options
     * @example
     * weebSH.toph.uploadImage({url: 'https://wew.png', type: 'wew', hidden: true, nsfw: false})
     *  .then(console.log)
     *  .catch(console.error)
     * @returns {Promise<UploadResponse>} An image object with a file key
     * @memberof Toph
     */
    uploadImage(uploadOptions?: UploadOptions, options?: TophOptions): Promise<UploadResponse>;
    /**
     * Get a random image from weeb.sh, you can specify both type and options.tags. You can also set the type to null and only specify options.tags
     *
     * @param {string} type - The type, either this or options.tags is mandatory. To get a list of types, use getImageTypes, as well as getImageTags for a list of tags
     * @param {TophOptions} [options={}] - An object of additional options
     * @memberof Toph
     * @example
     * weebSH.toph.getRandomImage('pat')
     *  .then(console.log)
     *  .catch(console.error)
     * @returns {Promise<ImageInfo>} The parsed image object, refer to https://docs.weeb.sh/#random-image for its structure
     */
    getRandomImage(type: string, options?: TophOptions): Promise<ImageInfo>;
    /**
     * Get a list of image types and a preview image for each if you want
     *
     * @param {TophOptions} [options={}] - An object of additional options
     * @returns {Promise<ImageTypesResponse>} The parsed response object that you can see here https://docs.weeb.sh/#image-types
     * @example
     * weebSH.toph.getImageTypes()
     *  .then(console.log)
     *  .catch(console.error)
     * @memberof Toph
     */
    getImageTypes(options?: TophOptions): Promise<ImageTypesResponse>;
    /**
     * Get a list of image tags
     *
     * @param {TophOptions} [options={}] - An object of additional options
     * @example
     * weebSH.toph.getImageTags()
     *  .then(console.log)
     *  .catch(console.error)
     * @returns {Promise<ImageTagsResponse>} The parsed response object that you can see here https://docs.weeb.sh/#image-tags
     * @memberof Toph
     */
    getImageTags(options?: TophOptions): Promise<ImageTagsResponse>;
    /**
     * Get info about an image using its ID
     *
     * @param {string} id - The ID of the image to get info from
     * @param {TophOptions} [options={}] - An object of additional options
     * @example
     * weebSH.toph.getImageInfo('6d875e')
     *  .then(console.log)
     *  .catch(console.error)
     * @returns {Promise<ImageInfo>} The parsed response object that you can see here https://docs.weeb.sh/#image-info
     * @memberof Toph
     */
    getImageInfo(id: string, options?: TophOptions): Promise<ImageInfo>;
    /**
     * Add tags to an image
     * @deprecated This endpoint isn't (yet) publicly implemented in weeb.sh
     * @param {string} id - The ID of the image to add tags to
     * @param {array} tags - An array of tags, either strings or {name: 'tag_name'} objects
     * @param {TophOptions} [options={}] - An object of additional options
     * @example
     * weebSH.toph.addTagsToImage('6d875e', ['baguette'])
     *  .then(console.log)
     *  .catch(console.error)
     * @returns {Promise<any>} An object detailing added and skipped tags
     * @memberof Toph
     */
    addTagsToImage(id: string, tags: any[], options?: TophOptions): Promise<any>;
    /**
     * Remove tags from an image
     * @deprecated This endpoint isn't (yet) publicly implemented in weeb.sh
     * @param {String} id - The ID of the image to remove tags from
     * @param {Array<String>} tags - An array of tags, either strings or {name: 'tag_name'} objects
     * @param {TophOptions} [options={}] - An object of additional options
     * @example
     * weebSH.toph.removeTagsFromImage('6d875e', ['baguette'])
     *  .then(console.log)
     *  .catch(console.error)
     * @returns {Promise<any>} The returned data
     * @memberof Toph
     */
    removeTagsFromImage(id: string, tags: Array<string>, options?: TophOptions): Promise<any>;
    /**
     * Delete an image
     * @deprecated This endpoint isn't (yet) publicly implemented in weeb.sh
     * @param {string} id - The ID of the image to remove tags from
     * @param {TophOptions} [options={}] - An object of additional options
     * @example
     * weebSH.toph.deleteImage('6d875e')
     *  .then(console.log)
     *  .catch(console.error)
     * @returns {Promise<any>} An object containing a success confirmation
     * @memberof Toph
     */
    deleteImage(id: string, options?: TophOptions): Promise<any>;
}
declare namespace Toph {
    export { TaihouOptions, Axios, TophOptions, UploadOptions, ImageInfo, PreviewImageInfo, UploadResponse, ImageTypesResponse, ImageTagsResponse };
}
import Base = require("../Base");
type TophOptions = {
    /**
     * Either a boolean or "only", false entirely filters nsfw, true gets both nsfw and non-nsfw, and "only" gets only nsfw. False by default
     */
    nsfw: boolean;
    /**
     * If true, you only get back hidden images you uploaded. Defaults to false
     */
    hidden: boolean;
    /**
     * Only apply to getImageTypes(), if true, a preview image image is sent along. Defaults to false
     */
    preview: boolean;
    /**
     * Only apply to getRandomImage(), can be "jpeg", "gif" or "png"
     */
    fileType: string;
    /**
     * Only apply to getRandomImage(), a comma-separated list of tags the image should have
     */
    tags: string;
    /**
     * Whether to enable the request handler's burst mode, false by default
     */
    burst: boolean;
    /**
     * Only apply per-request, time in milliseconds before the next request in the queue should be executed. Is ignored if burst mode is enabled
     */
    beforeNextRequest: number;
    /**
     * Only apply when instantiating the module, regardless of the mode, define how many requests can be done in a minute. 0 makes it limitless
     */
    requestsPerMinute: number;
};
type UploadOptions = {
    /**
     * Absolute path to a file, takes priority over url argument
     */
    file: string;
    /**
     * Url pointing directly at the image you want to upload, you may only use file or url
     */
    url: string;
    /**
     * The type of the image; e.g, the category (pat, cuddle and such)
     */
    baseType: string;
    /**
     * Whether the uploaded image should be private or not
     */
    hidden: boolean;
    /**
     * Whether this image has content that could be considered NSFW (not safe for work)
     */
    nsfw: boolean;
    /**
     * Comma-separated list of tags to add to the image, they will inherit the hidden property of the image
     */
    tags: string;
    /**
     * Url pointing to the original source of the image
     */
    source: string;
};
type UploadResponse = {
    /**
     * The HTTP status code of the request
     */
    status: number;
    /**
     * The uploaded image info
     */
    file: ImageInfo;
};
type ImageInfo = {
    /**
     * The ID of the image
     */
    id: string;
    /**
     * The type of the image
     */
    type: string;
    /**
     * The base type of the image
     */
    baseType: string;
    /**
     * Whether the image is NSFW (Not Safe For Work)
     */
    nsfw: boolean;
    /**
     * The type of the file ("gif", "png"...)
     */
    fileType: string;
    /**
     * The mime type of the file
     */
    mimeType: string;
    /**
     * An array of tags associated to this image
     */
    tags: Array<string>;
    /**
     * The direct URL to the image
     */
    url: string;
    /**
     * Whether the image is hidden
     */
    hidden: boolean;
    /**
     * The ID of the account that uploaded this image
     */
    account: string;
    /**
     * The source url of the image, if any
     */
    source?: string;
};
type ImageTypesResponse = {
    /**
     * The HTTP status code of the request
     */
    status: string;
    /**
     * An array listing all the existing types
     */
    types: Array<string>;
    /**
     * An array containing previews for each types, unless preview wasn't requested
     */
    preview?: Array<PreviewImageInfo>;
};
type ImageTagsResponse = {
    /**
     * The HTTP status code of the request
     */
    status: string;
    /**
     * An array listing all the existing tags
     */
    tags: Array<string>;
};
type TaihouOptions = import('../../index.js').TaihouOptions;
type Axios = import('axios').AxiosInstance;
type PreviewImageInfo = {
    /**
     * The direct URL to the image
     */
    url: string;
    /**
     * The ID of the image
     */
    id: string;
    /**
     * The type of the file ("gif", "png"...)
     */
    fileType: string;
    /**
     * The base type of the image
     */
    baseType: string;
    /**
     * The type of the image
     */
    type: string;
};
