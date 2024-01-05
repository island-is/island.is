import { Global, Module } from '@nestjs/common'

import { AuditTrailService } from './auditTrail.service'

@Global()
@Module({ providers: [AuditTrailService], exports: [AuditTrailService] })
export class AuditTrailModule {}
