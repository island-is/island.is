import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'
import { ServiceManager } from './service.manager'
import { ZendeskService } from './zendesk.service'
import { NotifyService } from './notify.service'
import { ValidationService } from './validation.service'
import { ApplicationEvent } from '../applications/models/applicationEvent.model'
import { ConfigModule } from '@nestjs/config'
import { XRoadConfig } from '@island.is/nest/config'
import { ZendeskListService } from './dataFromUrl/zendeskList.service'
import { DataFromUrlService } from './dataFromUrl/dataFromUrl.service'
import { AuthService } from './auth.service'

@Module({
  imports: [
    SequelizeModule.forFeature([ApplicationEvent]),
    ConfigModule.forRoot({
      isGlobal: true,
      load: [XRoadConfig],
    }),
  ],
  providers: [
    ServiceManager,
    AuthService,
    ZendeskService,
    NotifyService,
    ValidationService,
    ZendeskListService,
    DataFromUrlService,
  ],
})
export class ServicesModule {}
