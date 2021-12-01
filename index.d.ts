import Korra from './src/Korra/Korra';
import Shimakaze from './src/Shimakaze/Shimakaze';
import Tama from './src/Tama/Tama';
import Toph from './src/Toph/Toph';

declare class Taihou {
	public token: string;
	public toph: Toph;
	public korra: Korra;
	public shimakaze: Shimakaze;
	public tama: Tama;
	public images: Toph;
	public imageGeneration: Korra;
	public reputation: Shimakaze;
	public settings: Tama;
	public options: import('./src/types').TaihouOptions;
	public axios: import('axios').AxiosInstance;

	public constructor(token: string, wolken: boolean, options?: import('./src/types').ConstructorOptions);
}

export = Taihou;
