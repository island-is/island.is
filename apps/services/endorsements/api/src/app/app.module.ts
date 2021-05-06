import { AuthModule, IdsUserGuard } from '@island.is/auth-nest-tools'
import { AuditModule } from '@island.is/nest/audit'
import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'
import { environment } from '../environments/environment'
import { EndorsementModule } from './modules/endorsement/endorsement.module'
import { EndorsementListModule } from './modules/endorsementList/endorsementList.module'
import { SequelizeConfigService } from './sequelizeConfig.service'

@Module({
  imports: [
    AuditModule.forRoot(environment.audit),
    AuthModule.register(environment.auth),
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
