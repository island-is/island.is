import { Module } from '@nestjs/common'
import { PrimarySchoolClientModule } from '@island.is/clients/mms/primary-school'
import { PrimarySchoolAssessmentResolver } from '../resolvers/primarySchoolAssessment.resolver'
import { PrimarySchoolResolver } from '../resolvers/primarySchool.resolver'

@Module({
  imports: [PrimarySchoolClientModule],
  providers: [PrimarySchoolAssessmentResolver, PrimarySchoolResolver],
})
export class PrimarySchoolModule {}
