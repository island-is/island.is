import { DynamicModule } from '@nestjs/common'
import { HealthInsuranceModule as HealthInsuranceMod } from '@island.is/health-insurance'

// This is a shared module that gives you access to common methods
import { SharedTemplateAPIModule } from '../../shared'

// The base config that template api modules are registered with by default
// (configurable inside `template-api.module.ts`)
import { BaseTemplateAPIModuleConfig } from '../../../types'

// Here you import your module service
import { HealthInsuranceService } from './health-insurance.service'

const XROAD_HEALTH_INSURANCE_WSDLURL =
  process.env.XROAD_HEALTH_INSURANCE_WSDLURL ??
  'https://test-huld.sjukra.is/islandrg?wsdl'
const HEALTH_INSURANCE_XROAD_BASEURL =
  process.env.XROAD_BASE_PATH ?? 'http://localhost:8080'
const XROAD_HEALTH_INSURANCE_USERNAME =
  process.env.XROAD_HEALTH_INSURANCE_USERNAME ?? ''
const XROAD_HEALTH_INSURANCE_PASSWORD =
  process.env.XROAD_HEALTH_INSURANCE_PASSWORD ?? ''
const HEALTH_INSURANCE_XROAD_CLIENT_ID = process.env.XROAD_CLIENT_ID ?? ''
const HEALTH_INSURANCE_XROAD_ID = process.env.XROAD_HEALTH_INSURANCE_ID ?? ''

export class HealthInsuranceModule {
  static register(config: BaseTemplateAPIModuleConfig): DynamicModule {
    return {
      module: HealthInsuranceModule,
      imports: [
        HealthInsuranceMod.register({
          wsdlUrl: XROAD_HEALTH_INSURANCE_WSDLURL,
          baseUrl: HEALTH_INSURANCE_XROAD_BASEURL,
          username: XROAD_HEALTH_INSURANCE_USERNAME,
          password: XROAD_HEALTH_INSURANCE_PASSWORD,
          clientID: HEALTH_INSURANCE_XROAD_CLIENT_ID,
          xroadID: HEALTH_INSURANCE_XROAD_ID,
        }),
        SharedTemplateAPIModule.register(config),
      ],
      providers: [HealthInsuranceService],
      exports: [HealthInsuranceService],
    }
  }
}
