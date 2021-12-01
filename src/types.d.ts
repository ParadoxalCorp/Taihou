export type TaihouOptions = {
	baseURL: string;
	userAgent: string;
	timeout: number;
	headers: Record<string, any>;
}

export type PerServiceOptions = {
	toph: TophOptions & TaihouOptions;
	images: TophOptions & TaihouOptions;
	korra: KorraOptions & TaihouOptions;
	imageGeneration: KorraOptions & TaihouOptions;
	shimakaze: ShimakazeOptions & TaihouOptions;
	reputation: ShimakazeOptions & TaihouOptions;
	tama: TamaOptions & TaihouOptions;
	settings: TamaOptions & TaihouOptions;
}

export type ConstructorOptions = Partial<TaihouOptions & PerServiceOptions>;

export type KorraOptions = {
	burst: boolean;
	requestsPerMinute: number;
}

export type KorraRequestOptions = {
	beforeNextRequest: number;
}

export type RequestOptionsKorra = TaihouOptions & KorraRequestOptions;

export type LicenseOptions = {
	title: string;
	avatar: string;
	badges?: Array<string>;
	widgets?: Array<string>;
}

export type SimpleOptions = {
	face?: string;
	hair?: string;
}

export type ShimakazeOptions = {
	burst: boolean;
	requestsPerMinute: number;
	botID: string;
}

type RequestOptionsShimakaze = KorraRequestOptions & TaihouOptions;

export type GiveReputationOptions = {
	botID: string;
	targetID: string;
	sourceID: string;
}

export type ResetUserReputationOptions = {
	botID: string;
	targetID: string;
	resetCooldown?: boolean;
}

export type IncreaseUserReputationOptions = {
	botID: string;
	targetID: string;
	increase: number;
}

export type DecreaseUserReputationOptions = {
	botID: string;
	targetID: string;
	decrease: number;
}

export type ReputationSettings = {
	reputationPerDay?: number;
	maximumReputation?: number;
	maximumReputationReceivedDay?: number;
	reputationCooldown?: number;
}

export type UserReputationObject = {
	reputation: number;
	cooldown: Array<string>;
	givenReputation: Array<string>;
	userId: string;
	botId: string;
	accountId: string;
	availableReputations?: number;
	nextAvailableReputations?: Array<number>;
}

export type GetReputationResponse = {
	date: string;
	status: number;
	user: UserReputationObject;
}

export type ReputationResponse = {
	user: UserReputationObject;
	status: number;
}

export type GiveReputationResponse = {
	status: number;
	date: string;
	message: string;
	code: number;
	sourceUser: UserReputationObject;
	targetUser: UserReputationObject;
}

export type ReputationSettingsResponse = {
	reputationPerDay: number;
	maximumReputation: number;
	maximumReputationReceivedDay: number;
	reputationCooldown: number;
	accountId: string;
}

export type SettingsResponse = {
	status: number;
	settings: ReputationSettingsResponse;
}

export type TamaOptions = {
	burst: boolean;
	requestsPerMinute: number;
	useCache: boolean;
}

export type TamaRequestOptions = {
	beforeNextRequest: number;
	useCache: boolean;
}

type RequestOptionsTama = TamaRequestOptions & TaihouOptions;

export type CreateOrUpdateOptions = {
	type: string;
	id: string | number;
	data: any;
}

export type ListSubSettingsOptions = {
	type: string;
	id: string | number;
	subType: string;
}

export type GetOrDeleteSubSettingOptions = {
	type: string;
	id: string | number;
	subType: string;
	subId: string | number;
}

export type CreateOrUpdateSubSettingOptions = {
	type: string;
	id: string | number;
	subType: string;
	subId: string | number;
	data: any;
}

export type SubSetting = {
	id: string;
	type: string;
	accountId: string;
	data: any;
	subId: string;
	subType: string;
}

export type Setting = {
	id: string;
	type: string;
	accountId: string;
	data: any;
}

export type DeletedSubSetting = {
	status: string;
	message: string;
	setting: SubSetting;
}

export type DeleteSettingResponse = {
	status: string;
	message: string;
	setting: Setting;
}

export type SettingResponse = {
	status: string;
	setting: Setting;
	cached: boolean;
}

export type SubSettingResponse = {
	status: string;
	subsetting: SubSetting;
	cached: boolean;
}

export type SubSettingsList = {
	status: string;
	subsettings: Array<SubSetting>;
}

export type TophOptions = {
	nsfw: boolean;
	hidden: boolean;
	preview: boolean;
	fileType: string;
	tags: string;
	burst: boolean;
	beforeNextRequest: number;
	requestsPerMinute: number;
}

export type UploadOptions = {
	file: string;
	url: string;
	baseType: string;
	hidden: boolean;
	nsfw: boolean;
	tags: string;
	source: string;
}

export type ImageInfo = {
	id: string;
	type: string;
	baseType: string;
	nsfw: boolean;
	fileType: string;
	mimeType: string;
	tags: Array<string>;
	url: string;
	hidden: boolean;
	account: string;
	source?: string;
}

export type PreviewImageInfo = {
	url: string;
	id: string;
	fileType: string;
	baseType: string;
	type: string;
}

export type UploadResponse = {
	status: number;
	file: ImageInfo;
}

export type ImageTypesResponse = {
	status: string;
	types: Array<string>;
	preview?: Array<PreviewImageInfo>;
}

export type ImageTagsResponse = {
	status: string;
	tags: Array<string>;
}
