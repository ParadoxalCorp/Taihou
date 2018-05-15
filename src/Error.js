'use strict';

class TaihouError extends Error {
    constructor(err) {
        super(err);
        if (err.response && err.response.status) {
            this.code = err.code === "ECONNABORTED" ? 408 : err.response.status;
            this.message = err.code === "ECONNABORTED" ? 'timeout' : err.response.statusText;
            this.data = err.code === "ECONNABORTED" ? 'Request timed out' : err.response.data;
            this.originalRequest = err.request;
            this.config = err.config;
        }
        this.message = `[Taihou] ${this.message}`;
    }
}

module.exports = TaihouError;