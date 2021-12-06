import { Module } from '@nestjs/common'
import { UserNotificationsService } from './user-notifications.service'
import { UserNotificationsController } from './user-notifications.controller'
import { AuthModule } from '@island.is/auth-nest-tools'
import { environment } from '../../environments'
import { AuditModule } from '@island.is/nest/audit'
import { SequelizeModule } from '@nestjs/sequelize'
import { UserNotifications } from './user-notifications.model'

@Module({
  imports: [
    AuditModule.forRoot(environment.audit),
    AuthModule.register(environment.auth),
    SequelizeModule.forFeature([UserNotifications]),
  ],
  controllers: [UserNotificationsController],
  providers: [UserNotificationsService],
  exports: [UserNotificationsService],
})
export class UserNotificationsModule {}
