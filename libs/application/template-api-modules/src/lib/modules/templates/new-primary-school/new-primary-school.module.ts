import { NationalRegistryXRoadModule } from '@island.is/api/domains/national-registry-x-road'
import { FriggClientModule } from '@island.is/clients/mms/frigg'
import { AwsModule } from '@island.is/nest/aws'
import { Module } from '@nestjs/common'
import { ApplicationsNotificationsModule } from '../../../notification/notifications.module'
import { SharedTemplateAPIModule } from '../../shared'
import { NewPrimarySchoolService } from './new-primary-school.service'

@Module({
  imports: [
    SharedTemplateAPIModule,
    NationalRegistryXRoadModule,
    AwsModule,
    FriggClientModule,
    ApplicationsNotificationsModule,
  ],
  providers: [NewPrimarySchoolService],
  exports: [NewPrimarySchoolService],
})
export class NewPrimarySchoolModule {}
