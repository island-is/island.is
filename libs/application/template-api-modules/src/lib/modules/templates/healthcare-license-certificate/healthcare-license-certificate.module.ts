import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { SharedTemplateAPIModule } from '../../shared'
import { HealthcareLicenseCertificateService } from './healthcare-license-certificate.service'
import {
  HealthDirectorateClientModule,
  HealthDirectorateClientConfig,
  HealthDirectorateHealthClientConfig,
} from '@island.is/clients/health-directorate'

@Module({
  imports: [
    SharedTemplateAPIModule,
    HealthDirectorateClientModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [
        HealthDirectorateClientConfig,
        HealthDirectorateHealthClientConfig,
      ],
    }),
  ],
  providers: [HealthcareLicenseCertificateService],
  exports: [HealthcareLicenseCertificateService],
})
export class HealthcareLicenseCertificateModule {}
