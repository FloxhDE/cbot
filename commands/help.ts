import DiscordCommand, {sendInvalidArgsMessage} from './command';
import {Message} from 'discord.js';
import ContentBot, {log4js} from '../index';
import I18n from '../i18n';

export default class HelpCommand implements DiscordCommand {
    onCommand(msg: Message, args: string[]) {
        let logger = log4js.getLogger('HelpCommand');
        let i18n = I18n.getInstance();
        if (args.length === 0) {
            let help_text = [];
            help_text.push(i18n.getI18nString("command.help.textheader").toString());
            help_text.push('```\n');
            for (let key in ContentBot.commands) {
                help_text.push(key + ": " + i18n.getI18nString(`command.${key}.syntax`).toString() + "\n");
            }
            help_text.push('```');
            msg.channel.send(help_text.join('')).catch(logger.error);
        } else {
            sendInvalidArgsMessage(msg, 'help', logger);
        }
    }

}