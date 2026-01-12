import { Module } from '@nestjs/common'
import { Application } from './models/application.model'
import { SequelizeModule } from '@nestjs/sequelize'
import { ApplicationsService } from './applications.service'
import { ApplicationsController } from './applications.controller'
import { AdminController } from './admin.controller'
import { Form } from '../forms/models/form.model'
import { ApplicationMapper } from './models/application.mapper'
import { Value } from './models/value.model'
import { Organization } from '../organizations/models/organization.model'
import { ServiceManager } from '../services/service.manager'
import { ZendeskService } from '../services/zendesk.service'
import { NudgeService } from '../services/nudge.service'
import { ApplicationEvent } from './models/applicationEvent.model'
import { ValidationService } from '../services/validation.service'
import { Screen } from '../screens/models/screen.model'
import { Field } from '../fields/models/field.model'
import { Section } from '../sections/models/section.model'
import { FormCertificationType } from '../formCertificationTypes/models/formCertificationType.model'
import { OrganizationPermission } from '../organizationPermissions/models/organizationPermission.model'
import { ListItem } from '../listItems/models/listItem.model'

@Module({
  imports: [
    SequelizeModule.forFeature([
      Application,
      ApplicationEvent,
      Form,
      Value,
      Organization,
      Screen,
      Field,
      Section,
      FormCertificationType,
      OrganizationPermission,
      ListItem,
    ]),
  ],
  controllers: [ApplicationsController, AdminController],
  providers: [
    ApplicationsService,
    ApplicationMapper,
    ServiceManager,
    ZendeskService,
    NudgeService,
    ValidationService,
  ],
  exports: [ApplicationsService],
})
export class ApplicationsModule {}
