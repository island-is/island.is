import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'
import { ApplicationEvent } from '../applications/models/applicationEvent.model'
import { NudgeService } from './nudge.service'
import { ServiceManager } from './service.manager'
import { ValidationService } from './validation.service'
import { ZendeskService } from './zendesk.service'

@Module({
  imports: [SequelizeModule.forFeature([ApplicationEvent])],
  providers: [ServiceManager, ZendeskService, NudgeService, ValidationService],
})
export class ServicesModule {}
