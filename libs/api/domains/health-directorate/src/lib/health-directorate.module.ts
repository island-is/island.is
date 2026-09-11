import { HealthDirectorateClientModule } from '@island.is/clients/health-directorate'
import { CmsTranslationsModule } from '@island.is/cms-translations'
import { FeatureFlagModule } from '@island.is/nest/feature-flags'
import { Module } from '@nestjs/common'
import { HealthDirectorateService } from './health-directorate.service'
import {
  HealthConversationOrganizationResolver,
  HealthConversationsResolver,
} from './resolvers/healthConversations.resolver'
import { MedicineResolver } from './resolvers/medicine.resolver'
import { PatientDataResolver } from './resolvers/patientData.resolver'
import { BasicInformationResolver } from './resolvers/basicInformation.resolver'
import { CertificateResolver } from './resolvers/certificate.resolver'
import { TreatmentsResolver } from './resolvers/treatments.resolver'

@Module({
  imports: [
    HealthDirectorateClientModule,
    FeatureFlagModule,
    CmsTranslationsModule,
  ],
  providers: [
    HealthConversationsResolver,
    HealthConversationOrganizationResolver,
    MedicineResolver,
    PatientDataResolver,
    BasicInformationResolver,
    CertificateResolver,
    TreatmentsResolver,
    HealthDirectorateService,
  ],
})
export class HealthDirectorateModule {}
