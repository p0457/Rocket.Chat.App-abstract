import { IHttp, IModify, IRead } from '@rocket.chat/apps-engine/definition/accessors';
import { ISlashCommand, SlashCommandContext } from '@rocket.chat/apps-engine/definition/slashcommands';

import { AbstractGetter } from '../helper/AbstractGetter';
import { AbstractResult } from '../helper/AbstractResult';

export class AbstractCommand implements ISlashCommand {
    public command: string = 'abstract';
    public i18nParamsExample: string = 'Slash_Command_Params_Example';
    public i18nDescription: string = 'Slash_Command_Description';
    public providesPreview: boolean = false;

    constructor(private readonly abstractGetter: AbstractGetter) { }

    public async executor(context: SlashCommandContext, read: IRead, modify: IModify, http: IHttp): Promise<void> {
        const icon = await read.getEnvironmentReader().getSettings().getValueById('abstract_icon');
        const username = await read.getEnvironmentReader().getSettings().getValueById('abstract_name');

        let result = new AbstractResult();

        if (context.getArguments().length !== 0) {
          result = await this.abstractGetter.search(http, context.getArguments().slice().join(' '));
        } else {
          result = await this.abstractGetter.empty();
        }

        const builder = modify.getCreator().startMessage()
            .setSender(context.getSender()).setRoom(context.getRoom())
            .setText(result.content).setUsernameAlias(username).setAvatarUrl(icon);

        // Respond back to user directly
        await modify.getNotifier().notifyUser(context.getSender(), builder.getMessage());

        return;
    }
}
