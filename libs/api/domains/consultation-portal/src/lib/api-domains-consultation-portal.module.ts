import { Module } from '@nestjs/common'
import { AuthModule } from '@island.is/auth-nest-tools'
import { ConsultationPortalClientModule } from '@island.is/clients/consultation-portal'

import { CaseResolver } from './cases/cases.resolver'
import { CaseResultService } from './cases/cases.service'

@Module({
  providers: [CaseResolver, CaseResultService],
  imports: [ConsultationPortalClientModule, AuthModule],
  exports: [],
})
export class ConsultationPortalModule {}
