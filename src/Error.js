'use strict';

class TaihouError extends Error {
    constructor(err) {
        super(err);
        if (err.response && err.response.status) {
            if (err.code === "ECONNABORTED") {
                this.code = 408;
                this.message = 'timeout';
                this.data = 'timeout';
                this.originalRequest = err.request;
            } else {
                this.code = err.response.status;
                this.message = err.response.statusText;
                this.data = err.response.data;
                this.originalRequest = err.request;
            }
        }
    }
}

module.exports = TaihouError;