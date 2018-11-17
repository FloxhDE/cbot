import DiscordCommand, {sendInvalidArgsMessage} from './command';
import {Message} from 'discord.js';
import {log4js} from '../index';
import I18n from '../i18n';

export default class RausCommand implements DiscordCommand {
    onCommand(msg: Message, args: string[]) {
        let logger = log4js.getLogger('RausCommand');
        if (args.length === 0) {
            msg.channel.send(I18n.getInstance().getI18nString('command.raus.text').toString()).catch(logger.error);
            msg.delete().catch(logger.error);
        } else {
            sendInvalidArgsMessage(msg, 'raus', logger);
        }
    }

}