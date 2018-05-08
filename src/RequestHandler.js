'use strict';

class RequestHandler {
    constructor(options = {}) {
        this.requestsPerMinutes = options.requestPerMinutes || 500;
        this.interval = 60000 / options.requestPerMinutes;
        this.queue = [];
    }

    queueRequest(request, options = {}) {
        return new Promise(async(resolve, reject) => {
            let needExecution = this.queue.length === 0 ? true : false;
            this.queue.push({
                request: request,
                resolve: resolve,
                reject: reject,
                beforeNextRequest: options.beforeNextRequest || this.interval
            });

            if (needExecution) {
                this.execute();
            }
        });
    }

    execute() {
        const toExecute = this.queue[0];
        toExecute.request()
            .then(res => toExecute.resolve(res))
            .catch(err => toExecute.reject(err));
        setTimeout(() => {
            this.queue.shift();
            if (this.queue.length > 0) {
                this.execute();
            }
        }, toExecute.beforeNextRequest);
    }
}

module.exports = RequestHandler;