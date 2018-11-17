import {log4js} from './index';

export default class I18n {

    private static initialized = false;
    private static INSTANCE: I18n;
    private lang_strings: { [langcode: string]: any } = {};
    private logger = log4js.getLogger('i18n');

    constructor(file_contents: { [langcode: string]: string }, private default_langcode: string) {
        if (!I18n.initialized) {
            for (let key in file_contents) {
                try {
                    this.lang_strings[key] = JSON.parse(file_contents[key]);
                    this.logger.info(`Successfully loaded '${key}.json'`)
                } catch (err) {
                    this.logger.error(`Malformed JSON found (${key}): ' + ${err}`);
                }
            }
            I18n.initialized = true;
            I18n.INSTANCE = this;
        } else {
            throw new Error('Cannot instantiate i18n module twice.');
        }
    }

    public static getInstance(): I18n {
        return I18n.INSTANCE;
    }

    public getDefaultLangcode() {
        return this.default_langcode;
    }

    public setDefaultLangcode(langcode: string): boolean {
        let validated = false;
        for (let key in this.lang_strings) {
            if (key === langcode) validated = true;
        }
        if (validated) this.default_langcode = langcode;
        return validated;
    }

    public getI18nString(key: string, lang?: string): I18nString {
        return new I18nString(this.getString(key, lang));
    }

    private getString(key: string, lang?: string): string {
        if (lang == null) {
            if (this.lang_strings[this.default_langcode].hasOwnProperty(key)) {
                return this.lang_strings[this.default_langcode][key];
            } else {
                // If key does not exist, return key
                return key;
            }
        } else {
            if (this.lang_strings.hasOwnProperty(lang) && this.lang_strings[lang].hasOwnProperty(key)) {
                return this.lang_strings[lang][key];
            } else {
                // If key does not exist, return key
                return key;
            }
        }
    }

}

class I18nString {

    constructor(private i18n_string: string) {

    }

    public fillArguments(...args: string[]): string {
        let lang_string = this.i18n_string;
        for (let i = 0; i < args.length; i++) {
            lang_string = lang_string.replace(`{${i}}`, args[i]);
        }
        return lang_string;
    }

    public toString(): string {
        return this.i18n_string;
    }
}