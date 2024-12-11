import { Module } from '@nestjs/common'

import { SharedTemplateAPIModule } from '../../shared'
import { SyslumennClientModule } from '@island.is/clients/syslumenn'

import { EstateTemplateService } from './estate.service'
import { AwsModule } from '@island.is/nest/aws'

@Module({
  imports: [SharedTemplateAPIModule, SyslumennClientModule, AwsModule],
  providers: [EstateTemplateService],
  exports: [EstateTemplateService],
})
export class EstateTemplateModule {}
