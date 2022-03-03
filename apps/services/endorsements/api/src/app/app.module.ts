import { Module } from '@nestjs/common'
import { APP_GUARD } from '@nestjs/core'
import { SequelizeModule } from '@nestjs/sequelize'

import {
  AuthConfig,
  AuthModule,
  IdsUserGuard,
  ScopesGuard,
} from '@island.is/auth-nest-tools'
import { LoggingModule } from '@island.is/logging'
import { AuditModule, AuditOptions } from '@island.is/nest/audit'

import { environment } from '../environments'

import { AccessGuard } from './guards/accessGuard/access.guard'
import { EndorsementModule } from './modules/endorsement/endorsement.module'
import { EndorsementListModule } from './modules/endorsementList/endorsementList.module'
import { SequelizeConfigService } from './sequelizeConfig.service'

@Module({
  imports: [
    AuditModule.forRoot(environment.audit as AuditOptions),
    AuthModule.register(environment.auth as AuthConfig),
    SequelizeModule.forRootAsync({
      useClass: SequelizeConfigService,
    }),
    EndorsementModule,
    EndorsementListModule,
    LoggingModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useExisting: IdsUserGuard,
    },
    IdsUserGuard, // allows test module to see this provider for mocking auth
    {
      provide: APP_GUARD,
      useClass: ScopesGuard,
    },
    {
      provide: APP_GUARD,
      useClass: AccessGuard,
    },
  ],
})
export class AppModule {}
