export const productionBaseURL: string;
export const stagingBaseURL: string;
export const defaultUserAgent: string;
export const timeout: number;
export namespace toph {
    const requestsPerMinute: number;
}
export namespace korra {
    const requestsPerMinute_1: number;
    export { requestsPerMinute_1 as requestsPerMinute };
}
export namespace tama {
    const requestsPerMinute_2: number;
    export { requestsPerMinute_2 as requestsPerMinute };
}
export namespace shimakaze {
    const requestsPerMinute_3: number;
    export { requestsPerMinute_3 as requestsPerMinute };
}
export namespace endpoints {
    const GET_SHIMAKAZE_STATUS: string;
    function GET_USER_REPUTATION(botID: any, userID: any): string;
    function GIVE_REPUTATION(botID: any, targetID: any): string;
    function RESET_USER_REPUTATION(botID: any, targetID: any): string;
    function INCREASE_USER_REPUTATION(botID: any, targetID: any): string;
    function DECREASE_USER_REPUTATION(botID: any, targetID: any): string;
    const GET_SETTINGS: string;
    const SET_SETTINGS: string;
    const GET_TOPH_STATUS: string;
    const UPLOAD_IMAGE: string;
    const GET_RANDOM_IMAGE: string;
    const GET_IMAGE_TYPES: string;
    const GET_IMAGE_TAGS: string;
    function GET_IMAGE_INFO(imageID: any): string;
    function ADD_TAGS_TO_IMAGE(imageID: any): string;
    function REMOVE_TAGS_FROM_IMAGE(imageID: any): string;
    function DELETE_IMAGE(imageID: any): string;
    const GET_KORRA_STATUS: string;
    const GENERATE_SIMPLE: string;
    const GENERATE_DISCORD_STATUS: string;
    const GENERATE_WAIFU_INSULT: string;
    const GENERATE_LOVE_SHIP: string;
    const GENERATE_LICENSE: string;
    const GET_TAMA_STATUS: string;
    function GET_SETTING(type: any, id: any): string;
    function CREATE_OR_UPDATE_SETTING(type: any, id: any): string;
    function DELETE_SETTING(type: any, id: any): string;
    function LIST_SUBSETTINGS(type: any, id: any, subType: any): string;
    function GET_SUBSETTING(type: any, id: any, subType: any, subId: any): string;
    function CREATE_OR_UPDATE_SUBSETTING(type: any, id: any, subType: any, subId: any): string;
    function DELETE_SUBSETTING(type: any, id: any, subType: any, subId: any): string;
}
