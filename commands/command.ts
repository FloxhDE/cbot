import {Message} from 'discord.js';
import ContentBot from '../index';
import {Logger} from 'log4js';
import I18n from '../i18n';

export default interface DiscordCommand {
    onCommand(msg: Message, args: string[]);
}

export function sendInvalidArgsMessage(msg: Message, name: string, logger: Logger) {
    let i18n = I18n.getInstance();
    msg.channel.send(i18n.getI18nString('command.invalidsyntax').fillArguments(ContentBot.delimiter + i18n.getI18nString('command.' + name + '.syntax').toString())).catch(logger.error);
}