import { DynamicModule } from '@nestjs/common'
import { SharedTemplateAPIModule } from '../../shared'
import { BaseTemplateAPIModuleConfig } from '../../../types'
import { PartyApplicationService } from './party-application.service'
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
      ],
      exports: [PartyApplicationService],
    }
  }
}
