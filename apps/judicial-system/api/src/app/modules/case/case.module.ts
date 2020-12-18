import { Module } from '@nestjs/common'

import { AuthModule } from '../auth'
import { CaseAuditService } from './case.audit'
import { CaseResolver } from './case.resolver'

@Module({
  imports: [AuthModule],
  providers: [CaseResolver, CaseAuditService],
})
export class CaseModule {}
