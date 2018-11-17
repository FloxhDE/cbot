import DiscordCommand, {sendInvalidArgsMessage} from './command';
import {Message} from 'discord.js';
import {log4js} from '../index';
import I18n from '../i18n';

export default class TestCommand implements DiscordCommand {
    onCommand(msg: Message, args: string[]) {
        let i18n = I18n.getInstance();
        if (args.length == 0) {
            msg.reply(i18n.getI18nString('command.test.text').toString()).catch(log4js.getLogger('TestCommand').error);
        } else {
            sendInvalidArgsMessage(msg, 'test', log4js.getLogger('TestCommand'));
        }

    }
}