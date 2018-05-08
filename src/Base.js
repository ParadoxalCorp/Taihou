'use strict';

const RequestHandler = require('./RequestHandler');
const Error = require('./Error');

class Base {
    constructor(options) {
        this.requestHandler = new RequestHandler(options);
        this.error = Error;
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
            return this.axios[method](url, {
                timeout: options.timeout,
                data: ['post', 'put', 'patch', 'delete'].includes(method) ? options.data : undefined,
                headers: options.headers ? { 'User-Agent': options.userAgent, ...options.headers } : { 'User-Agent': options.userAgent },
                params: options.params
            });
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
        for (const param of paramsToAdd) {
            if (typeof options[param] !== 'undefined') {
                baseParams[param] = options[param];
            }
        }
        return baseParams;
    }
}

module.exports = Base;