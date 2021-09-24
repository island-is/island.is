import { DynamicModule } from '@nestjs/common'
import { SharedTemplateAPIModule } from '../../shared'
import { BaseTemplateAPIModuleConfig } from '../../../types'
import { PartyLetterService } from './party-letter.service'
import {
  Configuration as endorsementConfig,
  EndorsementListApi,
} from './gen/fetch/endorsements'
import {
  Configuration as partyLetterConfig,
  PartyLetterRegistryApi,
} from './gen/fetch/party-letter'

export class PartyLetterModule {
  static register(config: BaseTemplateAPIModuleConfig): DynamicModule {
    return {
      module: PartyLetterModule,
      imports: [SharedTemplateAPIModule.register(config)],
      providers: [
        PartyLetterService,
        {
          provide: EndorsementListApi,
          useFactory: async () =>
            new EndorsementListApi(
              new endorsementConfig({
                fetchApi: fetch,
                basePath: config.partyLetter.endorsementsApiBasePath,
              }),
            ),
        },
        {
          provide: PartyLetterRegistryApi,
          useFactory: async () =>
            new PartyLetterRegistryApi(
              new partyLetterConfig({
                fetchApi: fetch,
                basePath: config.partyLetter.partyLetterRegistryApiBasePath,
              }),
            ),
        },
      ],
      exports: [PartyLetterService],
    }
  }
}
// TODO: Add client to config here?
