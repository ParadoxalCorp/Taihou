export = RequestHandler;
declare class RequestHandler {
    constructor(options?: {});
    requestsPerMinutes: any;
    interval: number;
    burst: boolean;
    queue: any[];
    requestsDone: number;
    sweepInterval: number | boolean;
    queueRequest(request: any, options?: {}): any;
    execute(): Promise<void>;
    cooldownLift: any;
    resume: any;
    sleep(ms: any): any;
    sweep(): void;
}
