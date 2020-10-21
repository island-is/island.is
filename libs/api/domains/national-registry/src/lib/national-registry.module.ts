import { Module } from '@nestjs/common'
import { NationalRegistryResolver } from './national-registry.resolver'
import { NationalRegistryService } from './national-registry.service'
import { NationalRegistryApi } from './soap/nationalRegistryApi'
import { SoapClient } from './soap/soapClient'

const baseSoapUrl = 'https://localhost:8443'
const host = 'soffiaprufa.skra.is'
const user = process.env.SOFFIA_USER ?? ''
const password = process.env.SOFFIA_PASS ?? ''

@Module({
  controllers: [],
  providers: [
    NationalRegistryService,
    NationalRegistryResolver,
    {
      provide: NationalRegistryApi,
      useFactory: async () =>
        new NationalRegistryApi(
          await SoapClient.generateClient(baseSoapUrl, host),
          password,
          user,
        ),
    },
  ],
  exports: [],
})
export class NationalRegistryModule {}
