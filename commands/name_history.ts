import DiscordCommand, {sendInvalidArgsMessage} from "./command";
import {Message} from "discord.js";
import {log4js} from "../index";
import I18n from "../i18n";

export default class NameHistoryCommand implements DiscordCommand {

    private logger = log4js.getLogger("NameHistoryCommand");
    private readonly fetch = require('node-fetch');
    private i18n;

    onCommand(msg: Message, args: string[]) {
        this.i18n = I18n.getInstance();
        if (args.length == 1) {
            this.getUUID(args[0]).catch((reason) => {
                this.sendFailMessage(msg);
                this.logger.error(reason);
                return;
            }).then((response) => {
                response.json().then((value) => {
                    this.createNameHistory(value[0]["id"]).then((message) => {
                        msg.channel.send(this.i18n.getI18nString('command.namehistory.title').fillArguments(args[0]) + message).catch(this.logger.error);
                    });
                });
            });
        } else {
            sendInvalidArgsMessage(msg, "namehistory", this.logger);
        }
    }

    private sendFailMessage(msg: Message): void {
        msg.channel.send(this.i18n.getI18nString('command.namehistory.fail').toString()).catch(this.logger.error);
    }

    private createNameHistory(uuid: string): Promise<string> {
        let builder = ['```'];
        return new Promise<string>((resolve) => {
            this.getNameHistory(uuid).then((response) => {
                response.json().then((value) => {
                    for (let i = 0; i < value.length; i++) {
                        let changeDate = new Date(value[i]["changedToAt"]);
                        let langCode = this.i18n.getDefaultLangcode().replace('_', '-');
                        let formatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
                        builder.push((i == 0 ? this.i18n.getI18nString('command.namehistory.originalname').toString() :
                            `${changeDate.toLocaleDateString(langCode, formatOptions)} ${changeDate.toLocaleTimeString(langCode)}`) + ` — ${value[i].name}`);
                    }
                    builder.push('```');
                    resolve(builder.join('\n'));
                });
            });
        });
    }

    private getUUID(player_name: string): Promise<any> {
        return this.fetch('https://api.mojang.com/profiles/minecraft', {
            method: 'POST',
            body: `["${player_name}"]`,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }

    private getNameHistory(uuid: string): Promise<any> {
        return this.fetch(`https://api.mojang.com/user/profiles/${uuid}/names`);
    }


}