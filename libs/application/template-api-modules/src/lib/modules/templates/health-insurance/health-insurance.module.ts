import { DynamicModule } from '@nestjs/common'
import { HealthInsuranceModule as HealthInsuranceMod } from '@island.is/health-insurance'

// This is a shared module that gives you access to common methods
import { SharedTemplateAPIModule } from '../../shared'

// The base config that template api modules are registered with by default
// (configurable inside `template-api.module.ts`)
import { BaseTemplateAPIModuleConfig } from '../../../types'

// Here you import your module service
import { HealthInsuranceService } from './health-insurance.service'

const XROAD_HEALTH_INSURANCE_WSDL_URL = process.env.healthInsurancewsdlUrl ?? ''
const XROAD_HEALTH_INSURANCE_BASE_URL = process.env.baseUrl ?? 'http://localhost:8080'
const XROAD_HEALTH_INSURANCE_USERNAME = process.env.healthInsuranceUsername ?? ''
const XROAD_HEALTH_INSURANCE_PASSWORD = process.env.healthInsurancePassword ?? ''

export class HealthInsuranceModule {
  static register(config: BaseTemplateAPIModuleConfig): DynamicModule {
    return {
      module: HealthInsuranceModule,
      imports: [
        HealthInsuranceMod.register({
          wsdlUrl: XROAD_HEALTH_INSURANCE_WSDL_URL,
          baseUrl: XROAD_HEALTH_INSURANCE_BASE_URL,
          username: XROAD_HEALTH_INSURANCE_USERNAME,
          password: XROAD_HEALTH_INSURANCE_PASSWORD,
        }),
        SharedTemplateAPIModule.register(config)
      ],
      providers: [HealthInsuranceService],
      exports: [HealthInsuranceService],
    }
  }
}
