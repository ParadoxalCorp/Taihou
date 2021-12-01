import Base from '../Base';

declare class Tama extends Base {
	public token: string;
	public options: import('../types').TamaOptions & import('../types').TaihouOptions;
	public axios: import('axios').AxiosInstance;
	public settingsCache: import('@discordjs/collection').Collection<string, import('../types').Setting>;
	public subSettingsCache: import('@discordjs/collection').Collection<string, import('../types').SubSetting>;

	public constructor(token: string, options: import('../types').TamaOptions & import('../types').TaihouOptions, axios: import('axios').AxiosInstance);

	public getStatus(options?: import('../types').RequestOptionsTama): Promise<boolean>;
	public getSetting(type: string, id: string | number, options?: import('../types').RequestOptionsTama): Promise<import('../types').SettingResponse>;
	public createSetting(createOptions: import('../types').CreateOrUpdateOptions, options?: import('../types').RequestOptionsTama): Promise<import('../types').SettingResponse>;
	public updateSetting(updateOptions: import('../types').CreateOrUpdateOptions, options?: import('../types').RequestOptionsTama): Promise<import('../types').SettingResponse>;
	public deleteSetting(type: string, id: string | number, options?: import('../types').RequestOptionsTama): Promise<import('../types').DeleteSettingResponse>;
	public listSubSettings(listOptions: import('../types').ListSubSettingsOptions, options?: import('../types').RequestOptionsTama): Promise<import('../types').SubSettingsList>;
	public getSubSetting(getSubSettingOptions: import('../types').GetOrDeleteSubSettingOptions, options?: import('../types').RequestOptionsTama): Promise<import('../types').SubSettingResponse>;
	public createSubSetting(createOptions: import('../types').CreateOrUpdateSubSettingOptions, options?: import('../types').RequestOptionsTama): Promise<import('../types').SubSettingResponse>;
	public updateSubSetting(updateOptions: import('../types').CreateOrUpdateSubSettingOptions, options?: import('../types').RequestOptionsTama): Promise<import('../types').SubSettingResponse>;
	public deleteSubSetting(deleteOptions: import('../types').GetOrDeleteSubSettingOptions, options?: import('../types').RequestOptionsTama): Promise<import('../types').DeletedSubSetting>;
}

export = Tama;
