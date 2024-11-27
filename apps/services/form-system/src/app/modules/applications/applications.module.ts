import { Module } from '@nestjs/common'
import { Application } from './models/application.model'
import { SequelizeModule } from '@nestjs/sequelize'
import { ApplicationsService } from './applications.service'
import { ApplicationsController } from './applications.controller'
import { Form } from '../forms/models/form.model'
import { ApplicationMapper } from './models/application.mapper'
import { Value } from '../values/models/value.model'
import { Organization } from '../organizations/models/organization.model'
import { FormUrl } from '../formUrls/models/formUrl.model'
import { OrganizationUrl } from '../organizationUrls/models/organizationUrl.model'
import { ServiceManager } from '../services/service.manager'
import { ZendeskService } from '../services/submits/zendesk.service'
import { NudgeService } from '../services/submits/nudge.service'
import { ApplicationEvent } from './models/applicationEvent.model'

@Module({
  imports: [
    SequelizeModule.forFeature([
      Application,
      ApplicationEvent,
      Form,
      Value,
      Organization,
      FormUrl,
      OrganizationUrl,
    ]),
  ],
  controllers: [ApplicationsController],
  providers: [
    ApplicationsService,
    ApplicationMapper,
    ServiceManager,
    ZendeskService,
    NudgeService,
  ],
  exports: [ApplicationsService],
})
export class ApplicationsModule {}
