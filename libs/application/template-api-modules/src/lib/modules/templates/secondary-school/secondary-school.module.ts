import { Module } from '@nestjs/common'
import { SharedTemplateAPIModule } from '../../shared'
import { SecondarySchoolService } from './secondary-school.service'
import { SecondarySchoolClientModule } from '@island.is/clients/secondary-school'

@Module({
  imports: [SharedTemplateAPIModule, SecondarySchoolClientModule],
  providers: [SecondarySchoolService],
  exports: [SecondarySchoolService],
})
export class SecondarySchoolModule {}
