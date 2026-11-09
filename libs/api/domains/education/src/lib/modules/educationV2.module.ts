import { Module } from '@nestjs/common'
import { GradesClientModule } from '@island.is/clients/mms/grade'
import { PrimarySchoolClientModule } from '@island.is/clients/mms/primary-school'
import { FriggClientModule } from '@island.is/clients/mms/frigg'
import { GradesResolver } from '../resolvers/grades.resolver'
import { EducationServiceV2 } from '../services/educationV2.service'
import { PrimarySchoolAssessmentResolver } from '../resolvers/primarySchoolAssessment.resolver'
import { PrimarySchoolResolver } from '../resolvers/primarySchool.resolver'
import { PrimarySchoolKeyInfoResolver } from '../resolvers/primarySchoolKeyInfo.resolver'
import { PrimarySchoolKeyInfoOptionsResolver } from '../resolvers/primarySchoolKeyInfoOptions.resolver'
import { PrimarySchoolKeyInfoMutationsResolver } from '../resolvers/primarySchoolKeyInfoMutations.resolver'
import { PrimarySchoolKeyInfoService } from '../services/primarySchoolKeyInfo.service'
import { PrimarySchoolChildIdLoader } from '../loaders/primarySchoolChildId.loader'
import { FeatureFlagModule } from '@island.is/nest/feature-flags'

@Module({
  imports: [
    GradesClientModule,
    PrimarySchoolClientModule,
    FriggClientModule,
    FeatureFlagModule,
  ],
  providers: [
    GradesResolver,
    EducationServiceV2,
    PrimarySchoolAssessmentResolver,
    PrimarySchoolResolver,
    PrimarySchoolKeyInfoResolver,
    PrimarySchoolKeyInfoOptionsResolver,
    PrimarySchoolKeyInfoMutationsResolver,
    PrimarySchoolKeyInfoService,
    PrimarySchoolChildIdLoader,
  ],
})
export class EducationV2Module {}
