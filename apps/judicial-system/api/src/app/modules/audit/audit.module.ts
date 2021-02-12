import { Module } from '@nestjs/common'

import { AuditService } from './audit.service'

@Module({
  providers: [AuditService],
  exports: [AuditService],
})
export class AuditModule {}
