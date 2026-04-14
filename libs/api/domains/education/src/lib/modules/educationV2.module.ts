import { Module } from '@nestjs/common'
import { GradesClientModule } from '@island.is/clients/mms/grade'
import { PrimarySchoolClientModule } from '@island.is/clients/mms/primary-school'
import { GradesResolver } from '../resolvers/grades.resolver'
import { EducationServiceV2 } from '../services/educationV2.service'
import { PrimarySchoolAssessmentResolver } from '../resolvers/primarySchoolAssessment.resolver'
import { PrimarySchoolResolver } from '../resolvers/primarySchool.resolver'

@Module({
  imports: [GradesClientModule, PrimarySchoolClientModule],
  providers: [
    GradesResolver,
    EducationServiceV2,
    PrimarySchoolAssessmentResolver,
    PrimarySchoolResolver,
  ],
})
export class EducationV2Module {}
