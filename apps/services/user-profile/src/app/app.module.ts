import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'
import { SequelizeConfigService } from './sequelizeConfig.service'
import { UserProfileModule } from './user-profile/userProfile.module'
import { UserProfileModule as UserProfileV2Module } from './v2/user-profile.module'
import { AuditModule } from '@island.is/nest/audit'
import environment from '../environments/environment'
import { AuthModule } from '@island.is/auth-nest-tools'

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
