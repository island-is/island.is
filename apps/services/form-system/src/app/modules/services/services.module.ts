import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'
import { ServiceManager } from './service.manager'
import { ZendeskService } from './zendesk.service'
import { NotifyService } from './notify.service'
import { ValidationService } from './validation.service'
import { ApplicationEvent } from '../applications/models/applicationEvent.model'
import { ConfigModule } from '@nestjs/config'
import { XRoadConfig } from '@island.is/nest/config'
import { SyslumennClientConfig } from '@island.is/clients/syslumenn'

@Module({
  imports: [
    SequelizeModule.forFeature([ApplicationEvent]),
    ConfigModule.forRoot({
      isGlobal: true,
      load: [XRoadConfig, SyslumennClientConfig],
    }),
  ],
  providers: [ServiceManager, ZendeskService, NotifyService, ValidationService],
})
export class ServicesModule {}
