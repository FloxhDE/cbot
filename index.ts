import {Client, TextChannel} from 'discord.js';
import MessageReceivedEvent from './events/message_received';
import TestCommand from './commands/test';
import RausCommand from './commands/raus';
import I18n from './i18n';
import LanguageCommand from "./commands/language";
import HelpCommand from "./commands/help";
import Config from "./config";
import NameHistoryCommand from "./commands/name_history";

export const log4js = require('log4js');

function main(args: string[]) {
    // Load and configure Log4js Logger
    log4js.configure({
        appenders: {
            out: {type: 'file', filename: 'cbot.log', flags: 'w'},
            console: {type: 'console'}
        },
        categories: {
            default: {appenders: ['out', 'console'], level: 'info'}
        }
    });

    let fs = require('fs');
    let logger = log4js.getLogger('BotInitializer');

    // Synchronously load config file
    let config = new Config(args[0]);

    // Load langfiles and configure i18n module
    fs.access('./lang', (err) => {
        if (err) {
            logger.error(`Lang folder not found, running without string messages! ${err}`);
            return;
        }
        fs.readdir('./lang', ['utf-8', true], (err, files) => {
            if (err) {
                logger.error(`Error while reading langfiles, running without string messages! ${err}`);
                return;
            }
            let langfiles: string[] = [];
            for (let i = 0; i < files.length; i++) {
                langfiles.push(files[i]);
            }

            let langfilecontents: { [langfile: string]: string } = {};
            for (let i in langfiles) {
                let data = fs.readFileSync('./lang/' + langfiles[i]);
                langfilecontents[langfiles[i].split('.')[0]] = data.toString('utf-8');
            }

            new I18n(langfilecontents, config.getValue('language'));
            logger.info('Successfully initialized i18n module');
        });
    });

    // Load Discord Bot Token and boot Discord Bot
    fs.readFile('./token.txt', (err, data) => {
        if (err) throw err;
        new CBot(data.toString('UTF-8'));
    });

}

main(process.argv.slice(2));

export default class CBot {
    private readonly discord = require('discord.js');
    private readonly discord_client: Client = new this.discord.Client();
    private readonly logger = log4js.getLogger('CBot');
    public static readonly delimiter: string = '!';
    public static readonly commands = {
        'test': new TestCommand(),
        'raus': new RausCommand(),
        'language': new LanguageCommand(),
        'help': new HelpCommand(),
        'namehistory': new NameHistoryCommand()
    };
    public static readonly events = {
        'message': new MessageReceivedEvent()
    };

    constructor(private bot_token: string) {
        this.discord_client.on('ready', () => {
            this.logger.info(`Successfully logged in as ${this.discord_client.user.tag}`);
            /* temp */
            let readline = require('readline');
            let rl = readline.createInterface(process.stdin, process.stdout);
            rl.on('line', (line) => {
                let message = line.trim();
                if (message != "") {
                    (this.discord_client.channels.find((channel) => (channel as TextChannel).name == "general") as TextChannel).send(message).catch(this.logger.error);
                }
            });
            this.registerEvents();
        });
        this.discord_client.login(bot_token).catch((err) => {
            throw err;
        });
    }

    private registerEvents(): void {
        for (let e_key in CBot.events) {
            let e_val = CBot.events[e_key];
            this.discord_client.on(e_key, e_val.onEvent);
            this.logger.info(`Successfully registered event for '${e_key}': ${e_val.constructor.name}`)
        }
    }
}