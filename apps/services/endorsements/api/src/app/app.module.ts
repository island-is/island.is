import {
  AuthConfig,
  AuthModule,
  IdsUserGuard,
  ScopesGuard,
} from '@island.is/auth-nest-tools'
import { APP_GUARD } from '@nestjs/core'
import { AuditModule, AuditOptions } from '@island.is/nest/audit'
import { Module, OnModuleInit } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'
import { environment } from '../environments'
import { EndorsementModule } from './modules/endorsement/endorsement.module'
import { EndorsementListModule } from './modules/endorsement-list/endorsement-list.module'
import { SequelizeConfigService } from './sequelizeConfig.service'
import { AccessGuard } from './guards/accessGuard/access.guard'
import { LoggingModule } from '@island.is/logging'
import { NationalRegistryV3ClientConfig } from '@island.is/clients/national-registry-v3'
import {
  ConfigModule,
  IdsClientConfig,
  XRoadConfig,
} from '@island.is/nest/config'
import { emailModuleConfig } from '@island.is/email-service'
import { EndorsementListService } from './modules/endorsement-list/endorsement-list.service'

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
      load: [
        NationalRegistryV3ClientConfig,
        IdsClientConfig,
        XRoadConfig,
        emailModuleConfig,
      ],
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
export class AppModule implements OnModuleInit {
  constructor(private readonly endorsementListService: EndorsementListService) {}

  async onModuleInit() {
    // spit out some counts of tables - basic data overview
    
    // Populate owner names for existing lists if they are missing
    await this.endorsementListService.populateOwnerNamesForExistingLists();
  }
}
