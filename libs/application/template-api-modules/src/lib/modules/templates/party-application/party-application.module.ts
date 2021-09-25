import { DynamicModule } from '@nestjs/common'
import { SharedTemplateAPIModule } from '../../shared'
import { BaseTemplateAPIModuleConfig } from '../../../types'
import {
  APPLICATION_SYSTEM_CLIENT,
  PartyApplicationService,
  PARTY_APPLICATION_SERVICE_OPTIONS,
} from './party-application.service'
import {
  Configuration as endorsementConfig,
  EndorsementListApi,
} from './gen/fetch'

export class PartyApplicationModule {
  static register(config: BaseTemplateAPIModuleConfig): DynamicModule {
    return {
      module: PartyApplicationModule,
      imports: [SharedTemplateAPIModule.register(config)],
      providers: [
        PartyApplicationService,
        {
          provide: EndorsementListApi,
          useFactory: async () =>
            new EndorsementListApi(
              new endorsementConfig({
                fetchApi: fetch,
                basePath: config.partyApplication.endorsementsApiBasePath,
              }),
            ),
        },
        {
          provide: PARTY_APPLICATION_SERVICE_OPTIONS,
          useFactory: () => config.partyApplication.options,
        },
        {
          provide: APPLICATION_SYSTEM_CLIENT,
          useFactory: () => config.partyApplication.systemClient,
        },
      ],
      exports: [PartyApplicationService],
    }
  }
}
