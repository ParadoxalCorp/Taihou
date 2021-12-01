declare class RequestHandler {
	public requestsPerMinutes: number;
	public interval: number;
	public burst: boolean;
	public queue: Array<{ request: import('axios').AxiosPromise; resolve: typeof Promise.resolve; reject: typeof Promise.reject; beforeNextRequest: number; }>;
	public requestsDone: number;
	public resume: typeof Promise.resolve;
	public sweepInterval: NodeJS.Timeout | false;
	public cooldownLift: Promise<void>;

	public constructor(options?: { requestPerMinutes?: number; burst?: boolean; });

	public queueRequest(request: import('axios').AxiosPromise, options?: { beforeNextRequest: number; }): Promise<any>;
	public execute(): Promise<void>;
	public sleep(ms: number): Promise<void>;
	public sweep(): void;
}

export = RequestHandler;
