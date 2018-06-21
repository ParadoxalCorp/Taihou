'use strict';

const RequestHandler = require('./RequestHandler');
const Error = require('./Error');
const fs = require('fs');

class Base {
    constructor(options) {
        this.requestHandler = new RequestHandler(options);
        this.Error = Error;
    }

    /**
     * 
     * 
     * @param {any} url - The URL
     * @param {any} options - The options
     * @memberof Base
     * @private
     * @returns {void}
     */
    status(url, options) {
        return this.requestHandler.queueRequest(this.formatRequest(url, 'get', options), { beforeNextRequest: options.beforeNextRequest || 60 });
    }

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
    formatRequest(url, method, options) {
        return async() => {
            const config = {
                timeout: options.timeout,
                data: ['post', 'put', 'patch'].includes(method) ? options.data : undefined,
                headers: options.headers ? { 'User-Agent': options.userAgent, ...options.headers } : { 'User-Agent': options.userAgent },
                params: options.params
            };
            if (options.axios) {
                Object.assign(config, options.axios);
            }
            return this.axios[method](url, ['post', 'put', 'patch'].includes(method) ? null : config, ['post', 'put', 'patch'].includes(method) ? config : null);
        };
    }

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
    addURLParams(baseParams, paramsToAdd, options) {
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
     * 
     * 
     * @param {string} path - The path
     * @returns {Promise<any>} The file
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