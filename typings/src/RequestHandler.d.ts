export = RequestHandler;
declare class RequestHandler {
    /**
     * @param {{ requestPerMinutes?: number; burst?: boolean; }} options
     */
    constructor(options?: {
        requestPerMinutes?: number;
        burst?: boolean;
    });
    /**
     * @type {number}
     */
    requestsPerMinutes: number;
    /**
     * @type {number}
     */
    interval: number;
    /**
     * @type {boolean}
     */
    burst: boolean;
    /**
     * @type {Array<any>}
     */
    queue: Array<any>;
    /**
     * @type {number}
     */
    requestsDone: number;
    sweepInterval: number | boolean;
    queueRequest(request: any, options?: {}): any;
    execute(): Promise<void>;
    cooldownLift: any;
    resume: any;
    /**
     * @param {number} ms
     * @returns {Promise<void>}
     */
    sleep(ms: number): Promise<void>;
    sweep(): void;
}
