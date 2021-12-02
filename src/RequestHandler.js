'use strict';

class RequestHandler {
    /**
     * @param {{ requestPerMinutes?: number; burst?: boolean; }} options
     */
    constructor(options = {}) {
        /**
         * @type {number}
         */
        this.requestsPerMinutes = options.requestPerMinutes === 0 ? 0 : (options.requestPerMinutes || 500);
        /**
         * @type {number}
         */
        this.interval = options.requestsPerMinutes === 0 ? 0 : 60000 / options.requestPerMinutes;
        /**
         * @type {boolean}
         */
        this.burst = options.burst ? true : false;
        /**
         * @type {Array<any>}
         */
        this.queue = [];
        /**
         * @type {number}
         */
        this.requestsDone = 0;
        this.resume;
        this.sweepInterval = this.burst ? setInterval(this.sweep.bind(this), 60e3) : false;
        this.cooldownLift;
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

    async execute() {
        const toExecute = this.queue[0];
        if (!this.burst) {
            toExecute.request()
                .then(res => toExecute.resolve(res))
                .catch(err => toExecute.reject(err));
            setTimeout(() => {
                this.queue.shift();
                if (this.queue.length > 0) {
                    this.execute();
                }
            }, toExecute.beforeNextRequest);
        } else {
            if ((this.requestsDone >= this.requestsPerMinutes) && (this.requestsPerMinutes !== 0)) {
                this.cooldownLift = new Promise((resolve) => {
                    this.resume = resolve;
                });
                await this.cooldownLift;
            }
            toExecute.request()
                .then(res => toExecute.resolve(res))
                .catch(err => toExecute.reject(err));
            this.requestsDone++;
            this.queue.shift();
            if (this.queue.length > 0) {
                this.execute();
            }
        }
    }

    /**
     * @param {number} ms
     * @returns {Promise<void>}
     */
    sleep(ms) {
        return new Promise((resolve) => { setTimeout(resolve, ms); });
    }

    sweep() {
        this.requestsDone = 0;
        if (this.resume) {
            this.resume();
        }
    }
}

module.exports = RequestHandler;
