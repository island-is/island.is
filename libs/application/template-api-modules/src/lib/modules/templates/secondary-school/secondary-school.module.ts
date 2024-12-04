import { Module } from '@nestjs/common'
import { SharedTemplateAPIModule } from '../../shared'
import { SecondarySchoolService } from './secondary-school.service'

@Module({
  imports: [SharedTemplateAPIModule],
  providers: [SecondarySchoolService],
  exports: [SecondarySchoolService],
})
export class SecondarySchoolModule {}
