declare const Constants: {
	productionBaseURL: string;
	stagingBaseURL: string;
	defaultUserAgent: string;
	timeout: number;
	toph: EndpointOptions;
	korra: EndpointOptions;
	tama: EndpointOptions;
	shimakaze: EndpointOptions;
	endpoints: {
		GET_SHIMAKAZE_STATUS: string;
		GET_USER_REPUTATION(botID: string, userID: string): string;
		GIVE_REPUTATION(botID: string, targetID: string): string;
		RESET_USER_REPUTATION(botID: string, targetID: string): string;
		INCREASE_USER_REPUTATION(botID: string, targetID: string): string;
		DECREASE_USER_REPUTATION(botID: string, targetID: string): string;
		GET_SETTINGS: string;
		SET_SETTINGS: string;
		GET_TOPH_STATUS: string;
		UPLOAD_IMAGE: string;
		GET_RANDOM_IMAGE: string;
		GET_IMAGE_TYPES: string;
		GET_IMAGE_TAGS: string;
		GET_IMAGE_INFO(imageID: string): string;
		ADD_TAGS_TO_IMAGE(imageID: string): string;
		REMOVE_TAGS_FROM_IMAGE(imageID: string): string;
		DELETE_IMAGE(imageID: string): string;
		GET_KORRA_STATUS: string;
		GENERATE_SIMPLE: string;
		GENERATE_DISCORD_STATUS: string;
		GENERATE_WAIFU_INSULT: string;
		GENERATE_LOVE_SHIP: string;
		GENERATE_LICENSE: string;
		GET_TAMA_STATUS: string;
		GET_SETTING(type: string, id: string): string;
		CREATE_OR_UPDATE_SETTING(type: string, id: string): string;
		DELETE_SETTING(type: string, id: string): string;
		LIST_SUBSETTINGS(type: string, id: string, subType: string): string;
		GET_SUBSETTING(type: string, id: string, subType: string, subId: string): string;
		CREATE_OR_UPDATE_SUBSETTING(type: string, id: string, subType: string, subId: string): string;
		DELETE_SUBSETTING(type: string, id: string, subType: string, subId: string): string;
	}
}

type EndpointOptions = {
	requestsPerMinute: number;
}

export = Constants;
