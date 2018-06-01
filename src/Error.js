'use strict';

/**
 * Only the message and stack property are guaranteed, as all the other properties can appear only if the error originated from the request
 *
 * @extends Error
 * @prop {string} message A message describing the error
 * @prop {string} stack The stacktrace of the error
 * @prop {number} [code] If the error originated from the request made, the HTTP status code of the request
 * @prop {string|object} [data] The data returned by the weeb.sh servers
 * @prop {any} [originalRequest] The sent request  
 * @prop {any} [config] The config of the sent request
 */
class TaihouError extends Error {
    constructor(err, _stacktrace) {
        super(err);
        if (err.response && err.response.status) {
            this.code = err.code === "ECONNABORTED" ? 408 : err.response.status;
            this.message = err.code === "ECONNABORTED" ? 'timeout' : `${err.response.status} ${err.response.statusText}`;
            this.data = err.code === "ECONNABORTED" ? 'Request timed out' : err.response.data;
            this.originalRequest = err.request;
            this.config = err.config;
        }
        this.message = `[Taihou] ${this.message}`;
        this.stack = _stacktrace.stack;
    }
}

module.exports = TaihouError;