import { DynamicModule } from '@nestjs/common'
import { SharedTemplateAPIModule } from '../../shared'
import { BaseTemplateAPIModuleConfig } from '../../../types'
import { EuropeanHealthInsuranceCardService } from './european-health-insurance-card.service'
import {
  ClientsEhicClientV1Client,
  EhicApi,
} from '@island.is/clients/ehic-client-v1'

const tempValue = 'temp'

export class EuropeanHealthInsuranceCardModule {
  static register(config: BaseTemplateAPIModuleConfig): DynamicModule {
    return {
      module: EuropeanHealthInsuranceCardModule,
      imports: [
        ClientsEhicClientV1Client.register({
          password: '',
          username: '',
          xRoadBaseUrl: '',
          xRoadClientId: '',
          xRoadProviderId: '',
        }),
        SharedTemplateAPIModule.register(config),
      ],
      providers: [EuropeanHealthInsuranceCardService],
      exports: [EuropeanHealthInsuranceCardService],
    }
  }
}
