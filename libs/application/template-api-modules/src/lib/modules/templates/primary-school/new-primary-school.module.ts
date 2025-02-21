import { Module } from '@nestjs/common'
import { SharedTemplateAPIModule } from '../../shared'
import { NationalRegistryXRoadModule } from '@island.is/api/domains/national-registry-x-road'
import { PrimarySchoolService } from './new-primary-school.service'
import { FriggClientModule } from '@island.is/clients/mms/frigg'

@Module({
  imports: [
    SharedTemplateAPIModule,
    NationalRegistryXRoadModule,
    FriggClientModule,
  ],
  providers: [PrimarySchoolService],
  exports: [PrimarySchoolService],
})
export class PrimarySchoolModule {}
