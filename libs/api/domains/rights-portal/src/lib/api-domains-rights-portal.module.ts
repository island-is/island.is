import { Module } from '@nestjs/common'
import { AuthModule } from '@island.is/auth-nest-tools'

import { RightsPortalClientModule } from '@island.is/clients/icelandic-health-insurance/rights-portal'
import { RightsPortalResolver } from './api-domains-rights-portal.resolver'
import { RightsPortalService } from './api-domains-rights-portal.service'

@Module({
  providers: [RightsPortalResolver, RightsPortalService],
  imports: [RightsPortalClientModule, AuthModule],
  exports: [RightsPortalService],
})
export class RightsPortalModule {}
