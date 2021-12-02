export = Taihou;
/**
 * @typedef {import('./src/Toph/Toph').TophOptions} TophOptions
 * @typedef {import('./src/Korra/Korra').KorraOptions} KorraOptions
 * @typedef {import('./src/Shimakaze/Shimakaze').ShimakazeOptions} ShimakazeOptions
 * @typedef {import('./src/Tama/Tama').TamaOptions} TamaOptions
 */
/**
 * @typedef {Object} TaihouOptions
 * @prop {string} baseURL The base URL to use for each request, you may change this if you want to use staging or if you run a local instance (like: 'https://api.weeb.sh')
 * @prop {string} userAgent Strongly recommended, this should follow a BotName/Version/Environment pattern, or at least the bot name
 * @prop {number} timeout Time in milliseconds before a request should be aborted
 * @prop {{ [header: string]: any }} headers An object of additional headers following a {'header': 'value'} format, note that those must not be content-type, user-agent or authorization header
 */
/**
 * @typedef {Object} PerServicesOptions
 * @prop {Partial<TophOptions & TaihouOptions>} toph Additional options to pass to Toph
 * @prop {Partial<TophOptions & TaihouOptions>} images Additional options to pass to Toph
 * @prop {Partial<KorraOptions & TaihouOptions>} korra Additional options to pass to Korra
 * @prop {Partial<KorraOptions & TaihouOptions>} imageGeneration Additional options to pass to Korra
 * @prop {Partial<ShimakazeOptions & TaihouOptions>} shimakaze Additional options to pass to Shimakaze
 * @prop {Partial<ShimakazeOptions & TaihouOptions>} reputation Additional options to pass to Shimakaze
 * @prop {Partial<TamaOptions & TaihouOptions>} tama Additional options to pass to Tama
 * @prop {Partial<TamaOptions & TaihouOptions>} settings Additional options to pass to Tama
 */
/** @typedef {Partial<TaihouOptions & PerServicesOptions>} ConstructorOptions */
/**
 * @class Taihou
 */
declare class Taihou {
    /**
     * Creates an instance of Taihou.
     * @param {string} token - The token, required to use weeb.sh
     * @param {boolean} wolken - A boolean representing whether the token is a wolke token or not, needed for taihou to work properly
     * @param {ConstructorOptions} [options] - An object of options
     * @memberof Taihou
     */
    constructor(token: string, wolken: boolean, options?: ConstructorOptions);
    /**
     * The token given in the constructor, formatted according to whether it is a wolke token or not
     * @type {string}
     */
    token: string;
    /**
     * @type {import("axios").AxiosInstance}
     */
    axios: import("axios").AxiosInstance;
    /**
     * - The options for this Taihou instance
     * @type {TaihouOptions}
     */
    options: TaihouOptions;
    /**
     * The Toph class - gives access to toph methods
     */
    toph: Toph;
    /**
     * The Korra class - gives access to korra methods
     */
    korra: Korra;
    /**
     * The Shimakaze class - gives access to shimakaze methods
     */
    shimakaze: Shimakaze;
    /**
     * The Tama class - gives access to tama methods
     */
    tama: Tama;
    /**
     * - Equivalent for toph
     */
    images: Toph;
    /**
     * - Equivalent for korra
     */
    imageGeneration: Korra;
    /**
     * - Equivalent for shimakaze
     */
    reputation: Shimakaze;
    /**
     * - Equivalent for tama
     */
    settings: Tama;
}
declare namespace Taihou {
    export { TophOptions, KorraOptions, ShimakazeOptions, TamaOptions, TaihouOptions, PerServicesOptions, ConstructorOptions };
}
type TaihouOptions = {
    /**
     * The base URL to use for each request, you may change this if you want to use staging or if you run a local instance (like: 'https://api.weeb.sh')
     */
    baseURL: string;
    /**
     * Strongly recommended, this should follow a BotName/Version/Environment pattern, or at least the bot name
     */
    userAgent: string;
    /**
     * Time in milliseconds before a request should be aborted
     */
    timeout: number;
    /**
     * An object of additional headers following a {'header': 'value'} format, note that those must not be content-type, user-agent or authorization header
     */
    headers: {
        [header: string]: any;
    };
};
import Toph = require("./src/Toph/Toph.js");
import Korra = require("./src/Korra/Korra.js");
import Shimakaze = require("./src/Shimakaze/Shimakaze.js");
import Tama = require("./src/Tama/Tama.js");
type ConstructorOptions = Partial<TaihouOptions & PerServicesOptions>;
type TophOptions = import('./src/Toph/Toph').TophOptions;
type KorraOptions = import('./src/Korra/Korra').KorraOptions;
type ShimakazeOptions = import('./src/Shimakaze/Shimakaze').ShimakazeOptions;
type TamaOptions = import('./src/Tama/Tama').TamaOptions;
type PerServicesOptions = {
    /**
     * Additional options to pass to Toph
     */
    toph: Partial<TophOptions & TaihouOptions>;
    /**
     * Additional options to pass to Toph
     */
    images: Partial<TophOptions & TaihouOptions>;
    /**
     * Additional options to pass to Korra
     */
    korra: Partial<KorraOptions & TaihouOptions>;
    /**
     * Additional options to pass to Korra
     */
    imageGeneration: Partial<KorraOptions & TaihouOptions>;
    /**
     * Additional options to pass to Shimakaze
     */
    shimakaze: Partial<ShimakazeOptions & TaihouOptions>;
    /**
     * Additional options to pass to Shimakaze
     */
    reputation: Partial<ShimakazeOptions & TaihouOptions>;
    /**
     * Additional options to pass to Tama
     */
    tama: Partial<TamaOptions & TaihouOptions>;
    /**
     * Additional options to pass to Tama
     */
    settings: Partial<TamaOptions & TaihouOptions>;
};
