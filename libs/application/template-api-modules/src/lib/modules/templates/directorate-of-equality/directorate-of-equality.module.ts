import { Module } from '@nestjs/common'
import { SharedTemplateAPIModule } from '../../shared'
import { CompanyRegistryClientModule } from '@island.is/clients/rsk/company-registry'
import { DirectorateOfEqualityService } from './directorate-of-equality.service'

@Module({
  imports: [SharedTemplateAPIModule, CompanyRegistryClientModule],
  providers: [DirectorateOfEqualityService],
  exports: [DirectorateOfEqualityService],
})
export class DirectorateOfEqualityModule {}
