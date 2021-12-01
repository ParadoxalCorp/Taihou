import Base from '../Base';

declare class Korra extends Base {
	public token: string;
	public options: import('../types').TaihouOptions & import('../types').KorraRequestOptions;

	public constructor(token: string, options: import('../types').TaihouOptions & import('../types').KorraRequestOptions, axios: typeof import('axios'));

	public getStatus(options?: import('../types').RequestOptionsKorra): Promise<boolean>;
	public generateSimple(type: string, simpleOptions?: import('../types').SimpleOptions, options?: import('../types').RequestOptionsKorra): Promise<Buffer>;
	public generateDiscordStatus(status: string, avatar: string, options?: import('../types').RequestOptionsKorra): Promise<Buffer>;
	public generateWaifuInsult(avatar: string, options?: import('../types').RequestOptionsKorra): Promise<Buffer>;
	public generateLoveShip(firstTarget: string, secondTarget: string, options?: import('../types').RequestOptionsKorra): Promise<Buffer>;
	public generateLicense(LicenseOptions: import('../types').LicenseOptions, options?: import('../types').RequestOptionsKorra): Promise<Buffer>;
}

export = Korra
