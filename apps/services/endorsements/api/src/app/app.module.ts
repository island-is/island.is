import {
  AuthConfig,
  AuthModule,
  IdsUserGuard,
} from '@island.is/auth-nest-tools'
import { AuditModule, AuditOptions } from '@island.is/nest/audit'
import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'
import { environment } from '../environments/environment'
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
  ],
  providers: [
    {
      provide: 'APP_GUARD',
      useExisting: IdsUserGuard,
    },
    IdsUserGuard, // allows test module to see this provider for mocking auth
  ],
})
export class AppModule {}
