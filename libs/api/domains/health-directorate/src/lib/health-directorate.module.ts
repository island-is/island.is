import { HealthDirectorateClientModule } from '@island.is/clients/health-directorate'
import { FeatureFlagModule } from '@island.is/nest/feature-flags'
import { Module } from '@nestjs/common'
import { HealthDirectorateService } from './health-directorate.service'
import { MedicineResolver } from './resolvers/medicine.resolver'
import { PatientDataResolver } from './resolvers/patientData.resolver'
import { BasicInformationResolver } from './resolvers/basicInformation.resolver'

@Module({
  imports: [HealthDirectorateClientModule, FeatureFlagModule],
  providers: [
    MedicineResolver,
    PatientDataResolver,
    BasicInformationResolver,
    HealthDirectorateService,
  ],
})
export class HealthDirectorateModule {}
