import DiscordCommand, {sendInvalidArgsMessage} from './command';
import {Message} from 'discord.js';
import {log4js} from '../index';
import I18n from '../i18n';
import Config from "../config";

export default class LanguageCommand implements DiscordCommand {
    private logger = log4js.getLogger('LanguageCommand');

    onCommand(msg: Message, args: string[]) {
        let i18n = I18n.getInstance();
        if (args.length === 1) {
            let new_langcode = args[0];
            if (i18n.getDefaultLangcode() != new_langcode) {
                let success = i18n.setDefaultLangcode(args[0]);
                if (success) {
                    this.reply(msg, i18n.getI18nString('command.language.success').toString());
                    Config.getInstance().setValue('language', new_langcode);
                } else {
                    this.reply(msg, i18n.getI18nString('command.language.invalid').toString());
                }
            } else {
                this.reply(msg, i18n.getI18nString('command.language.alreadyset').toString());
            }
        } else {
            sendInvalidArgsMessage(msg, 'language', this.logger);
        }
    }

    private reply(msg: Message, smsg: string) {
        msg.channel.send(smsg).catch(this.logger.error);
    }

}