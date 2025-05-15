import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'
import { ServiceManager } from './service.manager'
import { FormUrl } from '../formUrls/models/formUrl.model'
import { OrganizationUrl } from '../organizationUrls/models/organizationUrl.model'
import { ZendeskService } from './zendesk.service'
import { NudgeService } from './nudge.service'
import { FileService } from './file.service'
import { ValidationService } from './validation.service'
import { ApplicationEvent } from '../applications/models/applicationEvent.model'

@Module({
  imports: [
    SequelizeModule.forFeature([FormUrl, OrganizationUrl, ApplicationEvent]),
  ],
  providers: [
    ServiceManager,
    ZendeskService,
    NudgeService,
    FileService,
    ValidationService,
  ],
})
export class ServicesModule {}
