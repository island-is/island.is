import { Module } from '@nestjs/common'
import { SharedTemplateAPIModule } from '../../shared'
import { NationalRegistryXRoadModule } from '@island.is/api/domains/national-registry-x-road'
import { NewPrimarySchoolService } from './new-primary-school.service'
import { FriggClientModule } from '@island.is/clients/mms/frigg'
import { AwsModule } from '@island.is/nest/aws'

@Module({
  imports: [
    SharedTemplateAPIModule,
    NationalRegistryXRoadModule,
    AwsModule,
    FriggClientModule,
  ],
  providers: [NewPrimarySchoolService],
  exports: [NewPrimarySchoolService],
})
export class NewPrimarySchoolModule {}
