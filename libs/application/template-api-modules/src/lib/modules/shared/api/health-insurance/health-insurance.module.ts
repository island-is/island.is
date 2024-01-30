import { DynamicModule } from '@nestjs/common'
import { HealthInsuranceService } from './health-insurance.service'
import {
  RightsPortalClientConfig,
  RightsPortalClientModule,
} from '@island.is/clients/icelandic-health-insurance/rights-portal'
import { ConfigModule } from '@nestjs/config'

export class HealthInsuranceModule {
  static register(): DynamicModule {
    return {
      module: HealthInsuranceModule,
      imports: [
        RightsPortalClientModule,
        ConfigModule.forRoot({
          isGlobal: true,
          load: [RightsPortalClientConfig],
        }),
      ],
      providers: [HealthInsuranceService],
      exports: [HealthInsuranceService],
    }
  }
}
