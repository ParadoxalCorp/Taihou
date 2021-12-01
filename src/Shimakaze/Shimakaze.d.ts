import Base from '../Base';

declare class Shimakaze extends Base {
	public token: string;
	public options: import('../types').TaihouOptions & import('../types').ShimakazeOptions;

	public constructor(token: string, options: import('../types').TaihouOptions & import('../types').ShimakazeOptions);

	public getStatus(options?: import('../types').RequestOptionsShimakaze): Promise<boolean>;
	public getUserReputation(botID: string, targetID: string, options?: import('../types').RequestOptionsShimakaze): Promise<import('../types').GetReputationResponse>;
	public giveReputation(reputationOptions: import('../types').GiveReputationOptions, options?: import('../types').RequestOptionsShimakaze): Promise<import('../types').GiveReputationOptions>;
	public resetUserReputation(resetOptions: import('../types').ResetUserReputationOptions, options?: import('../types').RequestOptionsShimakaze): Promise<import('../types').ReputationResponse>;
	public increaseUserReputation(increaseOptions: import('../types').IncreaseUserReputationOptions, options?: import('../types').RequestOptionsShimakaze): Promise<import('../types').ReputationResponse>;
	public decreaseUserReputation(decreaseOptions: import('../types').DecreaseUserReputationOptions, options?: import('../types').RequestOptionsShimakaze): Promise<import('../types').ReputationResponse>;
	public getSettings(options?: import('../types').RequestOptionsShimakaze): Promise<import('../types').SettingsResponse>;
	public setSettings(settings: import('../types').ReputationSettings, options?: import('../types').RequestOptionsShimakaze): Promise<import('../types').SettingsResponse>;
}

export = Shimakaze;
