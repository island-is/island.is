import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { SharedTemplateAPIModule } from '../../shared'
import { HealthcareLicenseCertificateService } from './healthcare-license-certificate.service'
import {
  HealthDirectorateClientModule,
  HealthDirectorateClientConfig,
} from '@island.is/clients/health-directorate'

@Module({
  imports: [
    SharedTemplateAPIModule,
    HealthDirectorateClientModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [HealthDirectorateClientConfig],
    }),
  ],
  providers: [HealthcareLicenseCertificateService],
  exports: [HealthcareLicenseCertificateService],
})
export class HealthcareLicenseCertificateModule {}
