'use strict';

const RequestHandler = require('./RequestHandler');
const Error = require('./Error');

class Base {
    constructor(options) {
        this.requestHandler = new RequestHandler(options);
        this.Error = Error;
    }

    /**
     * 
     * 
     * @param {any} url 
     * @param {any} options 
     * @memberof Base
     * @private
     */
    status(url, options) {
        return this.requestHandler.queueRequest(this.formatRequest(url, 'get', options), { beforeNextRequest: options.beforeNextRequest || 60 });
    }

    /**
     * 
     * 
     * @param {any} url 
     * @param {any} method 
     * @param {any} options 
     * @returns 
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
        }
    }

    /**
     * 
     * 
     * @param {any} baseParams 
     * @param {any} paramsToAdd 
     * @param {any} options 
     * @returns 
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
     * @param {string} path 
     * @returns {Promise<any>}
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