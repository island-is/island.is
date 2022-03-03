import { DynamicModule, Global, Module } from '@nestjs/common'
import { APP_INTERCEPTOR } from '@nestjs/core'

import { AuditInterceptor } from './audit.interceptor'
import { AUDIT_OPTIONS, AuditOptions } from './audit.options'
import { AuditService } from './audit.service'

@Global()
@Module({
  controllers: [],
  providers: [AuditService],
  exports: [AuditService],
})
export class AuditModule {
  static forRoot(options: AuditOptions): DynamicModule {
    return {
      module: AuditModule,
      providers: [
        {
          provide: APP_INTERCEPTOR,
          useClass: AuditInterceptor,
        },
        {
          provide: AUDIT_OPTIONS,
          useValue: options,
        },
      ],
    }
  }
}
