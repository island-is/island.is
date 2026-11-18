import { HealthDirectorateClientModule } from '@island.is/clients/health-directorate'
import { IdentityClientModule } from '@island.is/clients/identity'
import { CmsTranslationsModule } from '@island.is/cms-translations'
import { CibaClient } from '@island.is/auth/step-up'
import type { ConfigType } from '@island.is/nest/config'
import { FeatureFlagModule } from '@island.is/nest/feature-flags'
import { Module } from '@nestjs/common'
import { HealthDirectorateService } from './health-directorate.service'
import {
  MEDICINE_DELEGATION_CIBA_CLIENT,
  MedicineDelegationStepUpService,
} from './medicine-delegation-step-up.service'
import { MedicineDelegationStepUpConfig } from './medicineDelegationStepUp.config'
import {
  HealthConversationOrganizationResolver,
  HealthConversationsResolver,
} from './resolvers/healthConversations.resolver'
import { MedicineResolver } from './resolvers/medicine.resolver'
import { PatientDataResolver } from './resolvers/patientData.resolver'
import { BasicInformationResolver } from './resolvers/basicInformation.resolver'
import { CertificateResolver } from './resolvers/certificate.resolver'
import { PregnancyResolver } from './resolvers/pregnancy.resolver'
import { TreatmentsResolver } from './resolvers/treatments.resolver'

@Module({
  imports: [
    HealthDirectorateClientModule,
    IdentityClientModule,
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
    PregnancyResolver,
    TreatmentsResolver,
    HealthDirectorateService,
    MedicineDelegationStepUpService,
    {
      provide: MEDICINE_DELEGATION_CIBA_CLIENT,
      useFactory: (config: ConfigType<typeof MedicineDelegationStepUpConfig>) =>
        new CibaClient({
          issuer: config.issuer,
          clientId: config.clientId,
          clientSecret: config.clientSecret,
          scope: config.scope,
          requiredAcr: config.requiredAcr,
        }),
      inject: [MedicineDelegationStepUpConfig.KEY],
    },
  ],
})
export class HealthDirectorateModule {}
