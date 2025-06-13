import { Module } from '@nestjs/common'
import { FeatureFlagModule } from '@island.is/nest/feature-flags'
import { AuthModule } from '@island.is/auth-nest-tools'
import { RightsPortalClientModule } from '@island.is/clients/icelandic-health-insurance/rights-portal'
import { AidOrNutritionResolver } from './aidOrNutrition/aidOrNutrition.resolver'
import { AidOrNutritionService } from './aidOrNutrition/aidOrNutrition.service'
import { DentistResolver } from './dentist/dentist.resolver'
import { DentistService } from './dentist/dentist.service'
import { DrugResolver } from './drug/drug.resolver'
import { DrugService } from './drug/drug.service'
import { HealthCenterResolver } from './healthCenter/healthCenter.resolver'
import { HealthCenterService } from './healthCenter/healthCenter.service'
import { TherapyService } from './therapy/therapy.service'
import { TherapyResolver } from './therapy/therapy.resolver'
import { OverviewService } from './overview/overview.service'
import { OverviewResolver } from './overview/overview.resolver'
import { PaymentResolver } from './payment/payment.resolver'
import { PaymentService } from './payment/payment.service'
import { BloodResolver } from './blood/blood.resolver'
import { BloodService } from './blood/blood.service'
import { BloodClientModule } from '@island.is/clients/blood'

@Module({
  imports: [
    RightsPortalClientModule,
    BloodClientModule,
    AuthModule,
    FeatureFlagModule,
  ],
  providers: [
    AidOrNutritionResolver,
    AidOrNutritionService,
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
    PaymentService,
    PaymentResolver,
    BloodService,
    BloodResolver,
  ],
  exports: [],
})
export class RightsPortalModule {}
