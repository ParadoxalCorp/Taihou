export = Base;
declare class Base {
    constructor(options: any);
    requestHandler: RequestHandler;
    /**
     *
     *
     * @param {any} url - The URL
     * @param {any} options - The options
     * @memberof Base
     * @private
     * @returns {void}
     */
    private _status;
    /**
     *
     *
     * @param {any} url - The URL
     * @param {any} method - The method
     * @param {any} options - The options
     * @returns {function} - The function created to execute the request
     * @memberof Base
     * @private
     */
    private _formatRequest;
    /**
     *
     *
     * @param {any} baseParams - The base params
     * @param {any} paramsToAdd - The params to add
     * @param {any} options - The options
     * @returns {object} - The baseParams object with the parameters added
     * @memberof Base
     * @private
     */
    private _addURLParams;
    /**
     *
     *
     * @param {string} path - The path
     * @returns {Promise<any>} The file
     * @private
     * @memberof Base
     */
    private _readFileAsync;
}
import RequestHandler = require("./RequestHandler");
