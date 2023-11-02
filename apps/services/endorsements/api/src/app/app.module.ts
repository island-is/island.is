import {
  AuthConfig,
  AuthModule,
  IdsUserGuard,
  ScopesGuard,
} from '@island.is/auth-nest-tools'
import { APP_GUARD } from '@nestjs/core'
import { AuditModule, AuditOptions } from '@island.is/nest/audit'
import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'
import { environment } from '../environments'
import { EndorsementModule } from './modules/endorsement/endorsement.module'
import { EndorsementListModule } from './modules/endorsementList/endorsementList.module'
import { SequelizeConfigService } from './sequelizeConfig.service'
import { AccessGuard } from './guards/accessGuard/access.guard'
import { LoggingModule } from '@island.is/logging'
import { NationalRegistryClientConfig } from '@island.is/clients/national-registry-v2'
import {
  ConfigModule,
  IdsClientConfig,
  XRoadConfig,
} from '@island.is/nest/config'

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
    ConfigModule.forRoot({
      isGlobal: true,
      load: [NationalRegistryClientConfig, IdsClientConfig, XRoadConfig],
    }),
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
