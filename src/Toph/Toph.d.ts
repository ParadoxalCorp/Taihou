import Base from '../Base';

declare class Toph extends Base {
	public token: string;
	public options: import('../types').TophOptions & import('../types').TaihouOptions;

	public constructor(token: string, options: import('../types').TophOptions & import('../types').TaihouOptions, axios: import('axios').AxiosInstance);

	public getStatus(options?: import('../types').TophOptions): Promise<boolean>;
	public uploadImage(uploadOptions: import('../types').UploadOptions, options?: import('../types').TophOptions): Promise<import('../types').UploadResponse>;
	public getRandomImage(type: string, options?: import('../types').TophOptions): Promise<import('../types').ImageInfo>;
	public getImageTypes(options?: import('../types').TophOptions): Promise<import('../types').ImageTypesResponse>;
	public getImageTags(options?: import('../types').TophOptions): Promise<import('../types').ImageTagsResponse>;
	public getImageInfo(id: string, options?: import('../types').TophOptions): Promise<import('../types').ImageInfo>;
	public addTagsToImage(id: string, tags: Array<string | { name: string }>, options?: import('../types').TophOptions): Promise<any>;
	public removeTagsFromImage(id: string, tags: Array<string | { name: string }>, options?: import('../types').TophOptions): Promise<any>;
	public deleteImage(id: string, options?: import('../types').TophOptions): Promise<any>;
}

export = Toph;
