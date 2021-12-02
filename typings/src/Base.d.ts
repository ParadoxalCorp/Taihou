export = Base;
/**
 * @abstract
 */
declare class Base {
    /**
     * @param {{ requestPerMinutes?: number; burst?: boolean }} [options]
     */
    constructor(options?: {
        requestPerMinutes?: number;
        burst?: boolean;
    });
    requestHandler: RequestHandler;
    /**
     * @type {import("axios").AxiosInstance}
     */
    axios: import("axios").AxiosInstance;
    /**
     * @param {string} url - The URL
     * @param {any} options - The options
     * @memberof Base
     * @private
     * @returns {void}
     */
    private _status;
    /**
     * @param {string} url - The URL
     * @param {string} method - The method
     * @param {any} options - The options
     * @returns {Promise<import("axios").AxiosResponse<any>>} - The function created to execute the request
     * @memberof Base
     * @private
     */
    private _formatRequest;
    /**
     * @param {any} baseParams - The base params
     * @param {any} paramsToAdd - The params to add
     * @param {any} options - The options
     * @returns {any} - The baseParams object with the parameters added
     * @memberof Base
     * @private
     */
    private _addURLParams;
    /**
     * @param {string} path - The path
     * @returns {Promise<Buffer>} The file
     * @private
     * @memberof Base
     */
    private _readFileAsync;
}
import RequestHandler = require("./RequestHandler");
