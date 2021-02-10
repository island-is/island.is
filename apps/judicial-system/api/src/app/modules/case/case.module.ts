import { Module } from '@nestjs/common'

import { AuthModule } from '../auth'
import { AuditModule } from '../audit'
import { CaseResolver } from './case.resolver'

@Module({
  imports: [AuthModule, AuditModule],
  providers: [CaseResolver],
})
export class CaseModule {}
