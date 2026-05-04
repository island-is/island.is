import { Module } from '@nestjs/common'
import { GradesClientModule } from '@island.is/clients/mms/grade'
import { PrimarySchoolClientModule } from '@island.is/clients/mms/primary-school'
import { GradesResolver } from '../resolvers/grades.resolver'
import { EducationServiceV2 } from '../services/educationV2.service'
import { PrimarySchoolAssessmentResolver } from '../resolvers/primarySchoolAssessment.resolver'
import { PrimarySchoolResolver } from '../resolvers/primarySchool.resolver'
import { FeatureFlagModule } from '@island.is/nest/feature-flags'

@Module({
  imports: [GradesClientModule, PrimarySchoolClientModule, FeatureFlagModule],
  providers: [
    GradesResolver,
    EducationServiceV2,
    PrimarySchoolAssessmentResolver,
    PrimarySchoolResolver,
  ],
})
export class EducationV2Module {}
