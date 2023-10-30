import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'

import { AuditModule } from '@island.is/nest/audit'
import { AuthModule } from '@island.is/auth-nest-tools'

import environment from '../environments/environment'
import { SequelizeConfigService } from './sequelizeConfig.service'
import { UserProfileModule } from './user-profile/userProfile.module'
import { UserProfileModule as UserProfileV2Module } from './v2/user-profile.module'

@Module({
  imports: [
    AuditModule.forRoot(environment.audit),
    AuthModule.register(environment.auth),
    SequelizeModule.forRootAsync({
      useClass: SequelizeConfigService,
    }),
    UserProfileModule,
    UserProfileV2Module,
  ],
})
export class AppModule {}
