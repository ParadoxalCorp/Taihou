'use strict';

const RequestHandler = require('./RequestHandler');
const fs = require('fs');

/**
 * @abstract
 */
class Base {
    /**
     * @param {{ requestPerMinutes?: number; burst?: boolean }} [options]
     */
    constructor(options) {
        this.requestHandler = new RequestHandler(options);
        /**
         * @type {import("axios").AxiosInstance}
         */
        this.axios;
    }

    /**
     * @param {string} url - The URL
     * @param {any} options - The options
     * @memberof Base
     * @private
     * @returns {void}
     */
    _status(url, options) {
        return this.requestHandler.queueRequest(this._formatRequest(url, 'get', options), { beforeNextRequest: options.beforeNextRequest || 60 });
    }

    /**
     * @param {string} url - The URL
     * @param {string} method - The method
     * @param {any} options - The options
     * @returns {Promise<import("axios").AxiosResponse<any>>} - The function created to execute the request
     * @memberof Base
     * @private
     */
    _formatRequest(url, method, options) {
        return async() => {
            const config = {
                timeout: options.timeout,
                data: ['post', 'put', 'patch', 'delete'].includes(method) ? options.data : undefined,
                headers: options.headers ? { 'User-Agent': options.userAgent, ...options.headers } : { 'User-Agent': options.userAgent },
                params: options.params
            };

            if (options.axios) {
                Object.assign(config, options.axios);
            }

            return this.axios({
                method,
                url,
                ...config
            });
        };
    }

    /**
     * @param {any} baseParams - The base params
     * @param {any} paramsToAdd - The params to add
     * @param {any} options - The options
     * @returns {any} - The baseParams object with the parameters added
     * @memberof Base
     * @private
     */
    _addURLParams(baseParams, paramsToAdd, options) {
        if (!Array.isArray(paramsToAdd)) {
            baseParams = Object.assign(baseParams, paramsToAdd);
        } else {
            for (const param of paramsToAdd) {
                if (typeof options[param] !== 'undefined') {
                    baseParams[param] = options[param];
                }
            }
        }
        return baseParams;
    }

    /**
     * @param {string} path - The path
     * @returns {Promise<Buffer>} The file
     * @private
     * @memberof Base
     */
    _readFileAsync(path) {
        return new Promise((resolve, reject) => {
            fs.readFile(path, (err, data) => {
                if (err) {
                    return reject(err);
                }
                resolve(data);
            });
        });
    }
}

module.exports = Base;
