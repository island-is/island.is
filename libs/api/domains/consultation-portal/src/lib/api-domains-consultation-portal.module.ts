import { Module } from '@nestjs/common'
import { AuthModule } from '@island.is/auth-nest-tools'
import { ConsultationPortalClientModule } from '@island.is/clients/consultation-portal'

import { CaseResultResolver } from './cases/cases.resolver'
import { CaseResultService } from './cases/cases.service'
import { DocumentService } from './documents/documents.service'
import { DocumentResolver } from './documents/documents.resolver'

@Module({
  providers: [
    CaseResultResolver,
    CaseResultService,
    DocumentService,
    DocumentResolver,
  ],
  imports: [ConsultationPortalClientModule, AuthModule],
  exports: [],
})
export class ConsultationPortalModule {}
