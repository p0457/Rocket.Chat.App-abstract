import {
  IConfigurationExtend, IEnvironmentRead, ILogger,
} from '@rocket.chat/apps-engine/definition/accessors';
import { App } from '@rocket.chat/apps-engine/definition/App';
import { IAppInfo } from '@rocket.chat/apps-engine/definition/metadata';
import { SettingType } from '@rocket.chat/apps-engine/definition/settings';

import { AbstractCommand } from './commands/AbstractCommand';
import { AbstractGetter } from './helper/AbstractGetter';

export class AbstractApp extends App {
  private readonly abstractGetter: AbstractGetter;

  constructor(info: IAppInfo, logger: ILogger) {
    super(info, logger);
    this.abstractGetter = new AbstractGetter();
  }

  protected async extendConfiguration(configuration: IConfigurationExtend, environmentRead: IEnvironmentRead): Promise<void> {
    await configuration.settings.provideSetting({
      id: 'abstract_name',
      type: SettingType.STRING,
      packageValue: 'abstract',
      required: true,
      public: false,
      i18nLabel: 'Customize_Name',
      i18nDescription: 'Customize_Name_Description',
    });

    await configuration.settings.provideSetting({
      id: 'abstract_icon',
      type: SettingType.STRING,
      packageValue: 'https://raw.githubusercontent.com/tgardner851/Rocket.Chat.App-abstract/master/icon.png',
      required: true,
      public: false,
      i18nLabel: 'Customize_Icon',
      i18nDescription: 'Customize_Icon_Description',
    });

    configuration.http.provideDefaultHeader('Accept', 'text/plain');

    await configuration.slashCommands.provideSlashCommand(new AbstractCommand(this.abstractGetter));
  }
}
