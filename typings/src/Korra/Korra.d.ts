export = Korra;
/** @typedef {import('../../index.js').TaihouOptions} TaihouOptions */
/**
 * @typedef KorraOptions
 * @prop {Boolean} burst Whether to enable the request handler's burst mode, false by default
 * @prop {Number} requestsPerMinute - Only apply when instantiating the module, regardless of the mode, define how many requests can be done in a minute. 0 makes it limitless
 */
/**
 * @typedef {Object} KorraRequestOptions
 * @prop {Number} beforeNextRequest - Time in milliseconds before the next request in the queue should be executed. Is ignored if burst mode is enabled
 */
/** @typedef {TaihouOptions & KorraRequestOptions} RequestOptions */
/**
 * @typedef LicenseOptions
 * @prop {String} title - The title of the license
 * @prop {String} avatar - Direct URL to an image
 * @prop {Array<String>} [badges] - Array of http/s links directly pointing to images; to see how it renders, check https://docs.weeb.sh/#license-generation
 * @prop {Array<String>} [widgets] - An array of strings to fill the boxes
 */
/**
 * @typedef SimpleOptions
 * @prop {String} [face] - Only for awooo type; HEX color code of the face
 * @prop {String} [hair] - Only for awooo type; HEX color code of the hairs
 */
/**
 *
 *
 * @class Korra
 * @prop {String} token The token given in the constructor of Taihou, formatted according to whether it is a wolke token or not
 * @prop {TaihouOptions & KorraOptions} options The **effective** options; e.g, if you specified options specific to Korra, those override the base ones
 */
declare class Korra extends Base {
    /**
     * Creates an instance of Korra.
     * @param {String} token - The token
     * @param {TaihouOptions & KorraOptions} options - The options
     * @param {any} axios - The axios instance
     * @memberof Korra
     */
    constructor(token: string, options: TaihouOptions & KorraOptions, axios: any);
    token: string;
    options: any;
    axios: any;
    /**
     * Make a simple request to check whether Korra is available or not, due to its nature, this method never rejects
     *
     * @param {RequestOptions} [options={}] An optional object of options
     * @memberof Korra
     * @example
     * weebSH.korra.getStatus()
     *  .then(console.log)
     *  .catch(console.error)
     * @returns {Promise<Boolean>} Whether or not Korra is online
     */
    getStatus(options?: RequestOptions): Promise<boolean>;
    /**
     *
     * @param {String} type One of the available types, you can see them here: https://docs.weeb.sh/#generate-simple
     * @param {SimpleOptions} [simpleOptions] An object of options for this generation, for a complete list of options you can use, check: https://docs.weeb.sh/#generate-simple
     * @param {RequestOptions} [options={}] An additional object of options
     * @example
     * weebSH.korra.generateSimple('awooo')
     *  .then(console.log)
     *  .catch(console.error)
     * @returns {Promise<Buffer>} The image buffer, that you can directly pass to d.js/eris
     */
    generateSimple(type: string, simpleOptions?: SimpleOptions, options?: RequestOptions): Promise<Buffer>;
    /**
     *
     * @param {String} status - The status, can be either "online", "idle", "streaming", "dnd" or "offline"
     * @param {String} avatar - The direct URL to the image
     * @param {RequestOptions} [options={}] An additional object of options
     * @example
     * weebSH.korra.generateDiscordStatus('online', 'https://cdn.discordapp.com/avatars/140149699486154753/a_211d333073a63b3adfd13943268fc7a1.webp?size=1024')
     *  .then(console.log)
     *  .catch(console.error)
     * @returns {Promise<Buffer>} The image buffer, that you can directly pass to d.js/eris
     */
    generateDiscordStatus(status: string, avatar: string, options?: RequestOptions): Promise<Buffer>;
    /**
     *
     * @param {LicenseOptions} licenseOptions - The options for this license generation
     * @param {KorraOptions} [options={}] An additional object of options
     * @example
     * weebSH.korra.generateLicense({title: 'Baguette License', avatar: 'https://cdn.discordapp.com/avatars/128392910574977024/174c3436af3e4857accb4a32e2f9f220.webp?size=1024'})
     *  .then(console.log)
     *  .catch(console.error)
     * @returns {Promise<Buffer>} The image buffer, that you can directly pass to d.js/eris
     */
    generateLicense(licenseOptions: LicenseOptions, options?: KorraOptions): Promise<Buffer>;
    /**
     *
     * @param {String} firstTarget - The direct URL to the image of the first target
     * @param {String} secondTarget - The direct URL to the image of the second target
     * @param {RequestOptions} [options={}] An additional object of options
     * @example
     * weebSH.korra.generateLoveShip('https://cdn.discordapp.com/avatars/128392910574977024/174c3436af3e4857accb4a32e2f9f220.webp?size=1024', 'https://cdn.discordapp.com/avatars/108638204629925888/e05fb8c7720c3618569828246e176fb4.webp?size=1024')
     *  .then(console.log)
     *  .catch(console.error)
     * @returns {Promise<Buffer>} The image buffer, that you can directly pass to d.js/eris
     */
    generateLoveShip(firstTarget: string, secondTarget: string, options?: RequestOptions): Promise<Buffer>;
    /**
     *
     * @param {String} avatar - The direct URL to the image
     * @param {RequestOptions} [options={}] An additional object of options
     * @example
     * weebSH.korra.generateWaifuInsult('https://cdn.discordapp.com/avatars/140149699486154753/a_211d333073a63b3adfd13943268fc7a1.webp?size=1024')
     *  .then(console.log)
     *  .catch(console.error)
     * @returns {Promise<Buffer>} The image buffer, that you can directly pass to d.js/eris
     */
    generateWaifuInsult(avatar: string, options?: RequestOptions): Promise<Buffer>;
}
declare namespace Korra {
    export { TaihouOptions, KorraOptions, KorraRequestOptions, RequestOptions, LicenseOptions, SimpleOptions };
}
import Base = require("../Base");
type RequestOptions = TaihouOptions & KorraRequestOptions;
type SimpleOptions = {
    /**
     * - Only for awooo type; HEX color code of the face
     */
    face?: string;
    /**
     * - Only for awooo type; HEX color code of the hairs
     */
    hair?: string;
};
type LicenseOptions = {
    /**
     * - The title of the license
     */
    title: string;
    /**
     * - Direct URL to an image
     */
    avatar: string;
    /**
     * - Array of http/s links directly pointing to images; to see how it renders, check https://docs.weeb.sh/#license-generation
     */
    badges?: Array<string>;
    /**
     * - An array of strings to fill the boxes
     */
    widgets?: Array<string>;
};
type KorraOptions = {
    /**
     * Whether to enable the request handler's burst mode, false by default
     */
    burst: boolean;
    /**
     * - Only apply when instantiating the module, regardless of the mode, define how many requests can be done in a minute. 0 makes it limitless
     */
    requestsPerMinute: number;
};
type TaihouOptions = import('../../index.js').TaihouOptions;
type KorraRequestOptions = {
    /**
     * - Time in milliseconds before the next request in the queue should be executed. Is ignored if burst mode is enabled
     */
    beforeNextRequest: number;
};
