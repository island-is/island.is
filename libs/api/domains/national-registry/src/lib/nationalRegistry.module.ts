import { DynamicModule } from '@nestjs/common'

import { UserResolver } from './user.resolver'
import { FamilyMemberResolver } from './familyMember.resolver'
import { NationalRegistryService } from './nationalRegistry.service'
import { NationalRegistryApi } from './soap/nationalRegistryApi'
import { SoapClient } from './soap/soapClient'

export interface Config {
  baseSoapUrl: string
  host: string
  user: string
  password: string
}

export class NationalRegistryModule {
  static register(config: Config): DynamicModule {
    return {
      module: NationalRegistryModule,
      providers: [
        NationalRegistryService,
        UserResolver,
        FamilyMemberResolver,
        {
          provide: NationalRegistryApi,
          useFactory: async () =>
            new NationalRegistryApi(
              await SoapClient.generateClient(config.baseSoapUrl, config.host),
              config.password,
              config.user,
            ),
        },
      ],
      exports: [],
    }
  }
}
