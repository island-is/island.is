import { Module } from '@nestjs/common'
import { PrimarySchoolClientModule } from '@island.is/clients/mms/primary-school'
import { PrimarySchoolAssessmentTypeResolver } from '../resolvers/primarySchoolAssessmentType.resolver'
import { PrimarySchoolResolver } from '../resolvers/primarySchool.resolver'

@Module({
  imports: [PrimarySchoolClientModule],
  providers: [PrimarySchoolAssessmentTypeResolver, PrimarySchoolResolver],
})
export class PrimarySchoolModule {}
