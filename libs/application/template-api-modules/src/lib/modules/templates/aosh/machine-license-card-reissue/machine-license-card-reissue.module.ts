import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import {
  WorkMachinesClientConfig,
  WorkMachinesClientModule,
} from '@island.is/clients/work-machines'
import { SharedTemplateAPIModule } from '../../../shared'
import { MachineLicenseCardReissueTemplateService } from './machine-license-card-reissue.service'

@Module({
  imports: [
    SharedTemplateAPIModule,
    WorkMachinesClientModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [WorkMachinesClientConfig],
    }),
  ],
  providers: [MachineLicenseCardReissueTemplateService],
  exports: [MachineLicenseCardReissueTemplateService],
})
export class MachineLicenseCardReissueTemplateModule {}
