import { DynamicModule, Global } from '@nestjs/common'

import {
  AUDIT_TRAIL_OPTIONS,
  AuditTrailOptions,
  AuditTrailService,
} from './auditTrail.service'

@Global()
export class AuditTrailModule {
  static register(options: AuditTrailOptions): DynamicModule {
    return {
      module: AuditTrailModule,
      providers: [
        {
          provide: AUDIT_TRAIL_OPTIONS,
          useFactory: () => options,
        },
        AuditTrailService,
      ],
      exports: [AuditTrailService],
    }
  }
}
