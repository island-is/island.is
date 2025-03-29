import { DynamicModule, Global, Module } from '@nestjs/common'
import { AuditService } from './audit.service'
import { AUDIT_OPTIONS, AuditOptions } from './audit.options'
import { AuditInterceptor } from './audit.interceptor'
import { APP_INTERCEPTOR } from '@nestjs/core'
import type { ConfigType } from '@island.is/nest/config'
import { AuditConfig } from './audit.config'
import defaults from 'lodash/defaults'

@Global()
@Module({
  providers: [
    AuditService,
    {
      provide: APP_INTERCEPTOR,
      useClass: AuditInterceptor,
    },
    {
      provide: AUDIT_OPTIONS,
      useFactory: (config: ConfigType<typeof AuditConfig>) => ({
        ...config,
      }),
      inject: [AuditConfig.KEY],
    },
  ],
  exports: [AuditService],
})
export class AuditModule {
  static forRoot(options: AuditOptions): DynamicModule {
    return {
      module: AuditModule,
      providers: [
        {
          provide: AUDIT_OPTIONS,
          useFactory: (config: ConfigType<typeof AuditConfig>) => {
            return defaults(options, config)
          },
          inject: [AuditConfig.KEY], // Injecting the config properly
        },
      ],
    }
  }
}
