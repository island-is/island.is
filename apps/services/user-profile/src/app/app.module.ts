import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'
import { SequelizeConfigService } from './sequelizeConfig.service'
import { UserNotificationsModule } from './user-notifications/user-notifications.module'
import { UserProfileModule } from './user-profile/userProfile.module'

@Module({
  imports: [
    SequelizeModule.forRootAsync({
      useClass: SequelizeConfigService,
    }),
    UserProfileModule,
    UserNotificationsModule,
  ],
})
export class AppModule {}
