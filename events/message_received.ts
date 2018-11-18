import DiscordEvent from './event';
import {Message} from 'discord.js';
import ContentBot, {log4js} from '../index';
import I18n from '../i18n';

export default class MessageReceivedEvent implements DiscordEvent {
    onEvent(e: Message): void {
        let logger = log4js.getLogger('MessageReceivedEvent');
        let i18n = I18n.getInstance();
        let msg_contents = e.content.split('\n').join('\\n');
        logger.info(`${e.author.tag} (${e.channel}): ${msg_contents}`);

        if (e.content == '<@504730507825905676>') {
            e.reply(i18n.getI18nString('event.mre.delimiter').fillArguments(ContentBot.delimiter)).catch(logger.error);
        }

        if (e.content.charAt(0) === ContentBot.delimiter) {
            let parts = e.content.split(' ');
            let commands = ContentBot.commands;
            for (let c_key in commands) {
                if (c_key === parts[0].substring(1, parts[0].length)) {
                    commands[c_key].onCommand(e, parts.slice(1, parts.length))
                }
            }
        }
    }
}