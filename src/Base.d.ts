import RequestHandler from './RequestHandler';

type UnpackArray<T> = T extends Array<infer R> ? R : T;

declare abstract class Base {
	public requestHandler: RequestHandler;
	public axios: import('axios').AxiosInstance;

	public constructor(options: any);

	private _status(url: string, options: import('axios').AxiosRequestConfig): Promise<any>;
	private _formatRequest(url: string, method: 'post' | 'put' | 'patch' | 'delete' | 'get', options: import('axios').AxiosRequestConfig): import('axios').AxiosPromise;

	private _addURLParams<B extends Record<string, any>, A extends Record<string, any>>(baseParams: B, paramsToAdd: A, options?: any): B & A;
	private _addURLParams<B extends Record<string, any>, A extends Array<any>>(baseParams: B, paramsToAdd: A, options: UnpackArray<A>): B & { [K in UnpackArray<A>]: any };
	private _addURLParams<B extends Record<string, any>, A extends Record<string, any> | Array<any>>(baseParams: B, paramsToAdd: A, options?: UnpackArray<A>): B & A;

	private _readFileAsync(path: string): Promise<Buffer>;
}

export = Base;
