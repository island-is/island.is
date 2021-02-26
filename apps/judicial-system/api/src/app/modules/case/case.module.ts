import { Module } from '@nestjs/common'

import { AuditModule } from '../audit'
import { CaseResolver } from './case.resolver'

@Module({
  imports: [AuditModule],
  providers: [CaseResolver],
})
export class CaseModule {}
