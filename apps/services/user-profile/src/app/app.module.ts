import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'

import { AuthModule } from '@island.is/auth-nest-tools'
import { LoggingModule } from '@island.is/logging'
import { AuditModule } from '@island.is/nest/audit'
import { ProblemModule } from '@island.is/nest/problem'
import { ConfigModule } from '@island.is/nest/config'

import environment from '../environments/environment'
import { SequelizeConfigService } from './sequelizeConfig.service'
import { UserProfileModule } from './user-profile/userProfile.module'
import { UserProfileModule as UserProfileV2Module } from './v2/user-profile.module'
import { UserProfileConfig } from '../config'

@Module({
  imports: [
    AuditModule.forRoot(environment.audit),
    AuthModule.register(environment.auth),
    ConfigModule.forRoot({
      isGlobal: true,
      load: [UserProfileConfig],
    }),
    SequelizeModule.forRootAsync({
      useClass: SequelizeConfigService,
    }),
    ProblemModule,
    LoggingModule,
    UserProfileModule,
    UserProfileV2Module,
  ],
})
export class AppModule {}
