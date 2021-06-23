import { SequelizeConfigService } from '@island.is/auth-api-lib'
import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'

import { AuthModule } from '@island.is/auth-nest-tools'
import { AuditModule } from '@island.is/nest/audit'

import { environment } from '../environments'
import { DelegationsModule } from './modules/delegations/delegations.module'
import { ResourcesModule } from './modules/resources/resources.module'
import { TranslationModule } from './modules/translation/translation.module'

@Module({
  imports: [
    AuditModule.forRoot(environment.audit),
    AuthModule.register(environment.auth),
    SequelizeModule.forRootAsync({
      useClass: SequelizeConfigService,
    }),
    DelegationsModule,
    ResourcesModule,
    TranslationModule,
  ],
})
export class AppModule {}
