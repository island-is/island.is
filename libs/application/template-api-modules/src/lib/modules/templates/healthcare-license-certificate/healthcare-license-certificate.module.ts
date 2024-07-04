import { DynamicModule } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { SharedTemplateAPIModule } from '../../shared'
import { BaseTemplateAPIModuleConfig } from '../../../types'
import { HealthcareLicenseCertificateService } from './healthcare-license-certificate.service'
import {
  HealthDirectorateClientModule,
  HealthDirectorateClientConfig,
} from '@island.is/clients/health-directorate'

export class HealthcareLicenseCertificateModule {
  static register(baseConfig: BaseTemplateAPIModuleConfig): DynamicModule {
    return {
      module: HealthcareLicenseCertificateModule,
      imports: [
        SharedTemplateAPIModule.register(baseConfig),
        HealthDirectorateClientModule,
        ConfigModule.forRoot({
          isGlobal: true,
          load: [HealthDirectorateClientConfig],
        }),
      ],
      providers: [HealthcareLicenseCertificateService],
      exports: [HealthcareLicenseCertificateService],
    }
  }
}
