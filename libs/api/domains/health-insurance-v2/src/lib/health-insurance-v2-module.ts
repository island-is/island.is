import { DynamicModule, Module } from '@nestjs/common'
import {
  HealthInsuranceV2Client,
  HealthInsuranceV2Options as HealthInsuranceServiceOptions,
} from '@island.is/clients/health-insurance-v2'
import { HealthInsuranceResolver } from './graphql/health-insurance-v2.resolver'
import { HealthInsuranceService } from './graphql/health-insurance-v2.service'

@Module({})
export class HealthInsuranceV2Module {
  static register(options: HealthInsuranceServiceOptions): DynamicModule {
    return {
      module: HealthInsuranceV2Module,
      imports: [HealthInsuranceV2Client.register(options)],
      providers: [HealthInsuranceResolver, HealthInsuranceService],
    }
  }
}
