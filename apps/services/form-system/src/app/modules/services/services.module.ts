import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'
import { ServiceManager } from './service.manager'
import { ZendeskService } from './zendesk.service'
import { NotifyService } from './notify.service'
import { FileService } from './file.service'
import { ValidationService } from './validation.service'
import { ApplicationEvent } from '../applications/models/applicationEvent.model'
import { ConfigModule } from '@nestjs/config'
import { XRoadConfig } from '@island.is/nest/config'

@Module({
  imports: [
    SequelizeModule.forFeature([ApplicationEvent]),
    ConfigModule.forRoot({ isGlobal: true, load: [XRoadConfig] }),
  ],
  providers: [
    ServiceManager,
    ZendeskService,
    NotifyService,
    FileService,
    ValidationService,
  ],
})
export class ServicesModule {}
