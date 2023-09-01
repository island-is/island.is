import { Module } from '@nestjs/common'
import { AuthModule } from '@island.is/auth-nest-tools'

import { RightsPortalClientModule } from '@island.is/clients/icelandic-health-insurance/rights-portal'
import { RightsPortalResolver } from './rightsPortal.resolver'
import { RightsPortalService } from './rightsPortal.service'
import { FeatureFlagModule } from '@island.is/nest/feature-flags'

@Module({
  imports: [RightsPortalClientModule, AuthModule, FeatureFlagModule],
  providers: [RightsPortalResolver, RightsPortalService],
  exports: [RightsPortalService],
})
export class RightsPortalModule {}
