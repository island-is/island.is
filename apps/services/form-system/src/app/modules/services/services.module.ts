import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'
import { ServiceManager } from './service.manager'
import { ZendeskService } from './zendesk.service'
import { NudgeService } from './nudge.service'
import { FileService } from './file.service'
import { ValidationService } from './validation.service'
import { ApplicationEvent } from '../applications/models/applicationEvent.model'

@Module({
  imports: [SequelizeModule.forFeature([ApplicationEvent])],
  providers: [
    ServiceManager,
    ZendeskService,
    NudgeService,
    FileService,
    ValidationService,
  ],
})
export class ServicesModule {}
