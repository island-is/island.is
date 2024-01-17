import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'
import { LoggingModule } from '@island.is/logging'
// import { SequelizeConfigService } from '../sequelizeConfig.service'
import { UserNotificationCleanupWorkerService } from './worker.service'
import { Notification } from '../notifications/notification.model'

@Module({
  imports: [
    LoggingModule,
    // SequelizeModule.forRootAsync({
    //   useClass: SequelizeConfigService,
    // }),
    SequelizeModule.forFeature([Notification]),
  ],
  providers: [UserNotificationCleanupWorkerService],
})
export class UserNotificationCleanupWorkerModule {}
