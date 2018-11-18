import DiscordCommand, {sendInvalidArgsMessage} from './command';
import {Message} from 'discord.js';
import {log4js} from '../index';
import I18n from '../i18n';
import Config from "../config";

export default class LanguageCommand implements DiscordCommand {

    private logger = log4js.getLogger('LanguageCommand');
    private i18n;

    onCommand(msg: Message, args: string[]) {
        this.i18n = I18n.getInstance();
        console.log(args.length);
        switch (args.length) {
            case 0:
                let messageBuffer = [this.i18n.getI18nString('command.language.listtitle').toString(), '```'];
                for (let key in this.i18n.getLangStrings()) {
                    messageBuffer.push(`${key}: ${this.i18n.getI18nString('language.name', key)}`)
                }
                messageBuffer.push('```');
                this.reply(msg, messageBuffer.join('\n'));
                break;
            case 1:
                let new_langcode = args[0];
                if (this.i18n.getDefaultLangcode() != new_langcode) {
                    let success = this.i18n.setDefaultLangcode(args[0]);
                    if (success) {
                        this.reply(msg, this.i18n.getI18nString('command.language.success').toString());
                        Config.getInstance().setValue('language', new_langcode);
                    } else {
                        this.reply(msg, this.i18n.getI18nString('command.language.invalid').toString());
                    }
                } else {
                    this.reply(msg, this.i18n.getI18nString('command.language.alreadyset').toString());
                }
                break;
            default:
                sendInvalidArgsMessage(msg, 'language', this.logger);
                break;
        }
    }

    private reply(msg: Message, smsg: string) {
        msg.channel.send(smsg).catch(this.logger.error);
    }

}