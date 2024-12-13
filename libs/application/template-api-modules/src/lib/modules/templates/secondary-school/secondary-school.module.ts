import { Module } from '@nestjs/common'
import { SharedTemplateAPIModule } from '../../shared'
import { SecondarySchoolService } from './secondary-school.service'
import { SecondarySchoolClientModule } from '@island.is/clients/secondary-school'
import { AwsModule } from '@island.is/nest/aws'

@Module({
  imports: [SharedTemplateAPIModule, SecondarySchoolClientModule, AwsModule],
  providers: [SecondarySchoolService],
  exports: [SecondarySchoolService],
})
export class SecondarySchoolModule {}
