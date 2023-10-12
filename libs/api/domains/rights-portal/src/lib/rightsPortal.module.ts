import { Module } from '@nestjs/common'
import { AuthModule } from '@island.is/auth-nest-tools'
import { RightsPortalClientModule } from '@island.is/clients/icelandic-health-insurance/rights-portal'
import { AidAndNutritionResolver } from './aidAndNutrition/aidAndNutrition.resolver'
import { AidAndNutritionService } from './aidAndNutrition/aidAndNutrition.service'
import { DentistResolver } from './dentist/dentist.resolver'
import { DentistService } from './dentist/dentist.service'
import { DrugResolver } from './drug/drug.resolver'
import { DrugService } from './drug/drug.service'
import { HealthCenterResolver } from './healthCenter/healthCenter.resolver'
import { HealthCenterService } from './healthCenter/healthCenter.service'
import { TherapyService } from './therapy/therapy.service'
import { TherapyResolver } from './therapy/therapy.resolver'
import { FeatureFlagModule } from '@island.is/nest/feature-flags'
import { OverviewService } from './overview/overview.service'
import { OverviewResolver } from './overview/overview.resolver'

@Module({
  imports: [RightsPortalClientModule, AuthModule, FeatureFlagModule],
  providers: [
    AidAndNutritionResolver,
    AidAndNutritionService,
    DentistResolver,
    DentistService,
    DrugResolver,
    DrugService,
    HealthCenterResolver,
    HealthCenterService,
    TherapyService,
    TherapyResolver,
    OverviewService,
    OverviewResolver,
  ],
  exports: [],
})
export class RightsPortalModule {}
