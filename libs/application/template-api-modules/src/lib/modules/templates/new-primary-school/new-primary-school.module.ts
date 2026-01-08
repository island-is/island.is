import { Module } from '@nestjs/common'
import { SharedTemplateAPIModule } from '../../shared'
import { NewPrimarySchoolService } from './new-primary-school.service'
import { FriggClientModule } from '@island.is/clients/mms/frigg'
import { AwsModule } from '@island.is/nest/aws'
import { NationalRegistryV3Module } from '../../shared/api/national-registry-v3/national-registry-v3.module'
import { ApplicationsNotificationsModule } from '../../../notification/notifications.module'

@Module({
  imports: [
    SharedTemplateAPIModule,
    NationalRegistryV3Module,
    AwsModule,
    FriggClientModule,
    ApplicationsNotificationsModule,
  ],
  providers: [NewPrimarySchoolService],
  exports: [NewPrimarySchoolService],
})
export class NewPrimarySchoolModule {}
