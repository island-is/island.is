import { XRoadConfig } from '@island.is/nest/config'
import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { SequelizeModule } from '@nestjs/sequelize'
import { ApplicationEvent } from '../applications/models/applicationEvent.model'
import { NotifyService } from './notify.service'
import { ServiceManager } from './service.manager'
import { ValidationService } from './validation.service'
import { ZendeskService } from './zendesk.service'

@Module({
  imports: [
    SequelizeModule.forFeature([ApplicationEvent]),
    ConfigModule.forRoot({
      isGlobal: true,
      load: [XRoadConfig],
    }),
  ],
  providers: [ServiceManager, ZendeskService, NotifyService, ValidationService],
})
export class ServicesModule {}
