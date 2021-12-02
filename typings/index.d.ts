export = Taihou;
/**
 * @typedef {import('./src/Toph/Toph').TophOptions} TophOptions
 * @typedef {import('./src/Korra/Korra').KorraOptions} KorraOptions
 * @typedef {import('./src/Shimakaze/Shimakaze').ShimakazeOptions} ShimakazeOptions
 * @typedef {import('./src/Tama/Tama').TamaOptions} TamaOptions
 */
/**
 * @typedef {Object} TaihouOptions
 * @prop {String} baseURL The base URL to use for each request, you may change this if you want to use staging or if you run a local instance (like: 'https://api.weeb.sh')
 * @prop {String} userAgent Strongly recommended, this should follow a BotName/Version/Environment pattern, or at least the bot name
 * @prop {Number} timeout Time in milliseconds before a request should be aborted
 * @prop {Object} headers An object of additional headers following a {'header': 'value'} format, note that those must not be content-type, user-agent or authorization header
 */
/** @typedef {Object} PerServicesOptions
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
 *
 *
 * @class Taihou
 * @prop {String} token The token given in the constructor, formatted according to whether it is a wolke token or not
 * @prop {Toph} toph The Toph class - gives access to toph methods
 * @prop {Korra} korra The Korra class - gives access to korra methods
 * @prop {Shimakaze} shimakaze The Shimakaze class - gives access to shimakaze methods
 * @prop {Tama} tama The Tama class - gives access to tama methods
 * @prop {Toph} images - Equivalent for toph
 * @prop {Korra} imageGeneration - Equivalent for korra
 * @prop {Shimakaze} reputation - Equivalent for reputation
 * @prop {Tama} settings - Equivalent for tama
 * @prop {TaihouOptions} options - The options for this Taihou instance
 */
declare class Taihou {
    /**
     * Creates an instance of Taihou.
     * @param {String} token - The token, required to use weeb.sh
     * @param {Boolean} wolken - A boolean representing whether the token is a wolke token or not, needed for taihou to work properly
     * @param {ConstructorOptions} [options] - An object of options
     * @memberof Taihou
     */
    constructor(token: string, wolken: boolean, options?: ConstructorOptions);
    token: string;
    axios: any;
    options: any;
    toph: Toph;
    korra: Korra;
    shimakaze: Shimakaze;
    tama: Tama;
    images: Toph;
    imageGeneration: Korra;
    reputation: Shimakaze;
    settings: Tama;
}
declare namespace Taihou {
    export { TophOptions, KorraOptions, ShimakazeOptions, TamaOptions, TaihouOptions, PerServicesOptions, ConstructorOptions };
}
import Toph = require("./src/Toph/Toph.js");
import Korra = require("./src/Korra/Korra.js");
import Shimakaze = require("./src/Shimakaze/Shimakaze.js");
import Tama = require("./src/Tama/Tama.js");
type ConstructorOptions = Partial<TaihouOptions & PerServicesOptions>;
type TophOptions = import('./src/Toph/Toph').TophOptions;
type KorraOptions = import('./src/Korra/Korra').KorraOptions;
type ShimakazeOptions = import('./src/Shimakaze/Shimakaze').ShimakazeOptions;
type TamaOptions = import('./src/Tama/Tama').TamaOptions;
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
    headers: any;
};
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
