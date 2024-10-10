import { Module } from '@nestjs/common'

import { SharedTemplateAPIModule } from '../../shared'
import { SyslumennClientModule } from '@island.is/clients/syslumenn'

import { EstateTemplateService } from './estate.service'

@Module({
  imports: [SharedTemplateAPIModule, SyslumennClientModule],
  providers: [EstateTemplateService],
  exports: [EstateTemplateService],
})
export class EstateTemplateModule {}
