import {log4js} from "./index";

export default class Config {

    private static initialized = false;
    private static INSTANCE: Config;
    private logger = log4js.getLogger('Config');

    private loaded_config = {};

    private default_config = {
        "language": "de_DE"
    };

    constructor(private path: string) {
        if (!Config.initialized) {
            this.reloadConfig();
            Config.initialized = true;
            Config.INSTANCE = this;
        } else {
            throw new Error('Cannot instantiate config module twice.');
        }
    }

    public static getInstance(): Config {
        return Config.INSTANCE;
    }

    public setValue(key: string, value: string) {
        this.reloadConfig();
        if (this.loaded_config.hasOwnProperty(key)) {
            this.loaded_config[key] = value;
        }
        require('fs').writeFileSync(this.path, JSON.stringify(this.loaded_config));
    }

    public getValue(key: string): string {
        if (this.loaded_config.hasOwnProperty(key)) {
            return this.loaded_config[key];
        } else {
            return this.default_config.hasOwnProperty(key) ? this.default_config[key] : null;
        }
    }

    public reloadConfig() {
        let fs = require('fs');
        try {
            fs.accessSync(this.path, fs.constants.F_OK);
            let data = fs.readFileSync(this.path);
            try {
                this.loaded_config = JSON.parse(data);
            } catch (err) {
                this.logger.error(`Malformed JSON found: ' + ${err}`);
            }
        } catch (err) {
            fs.writeFileSync(this.path, JSON.stringify(this.default_config));
            this.logger.debug('Created new config file');
        }

    }

}