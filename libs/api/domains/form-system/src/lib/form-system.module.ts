import { Module } from '@nestjs/common'
import { FormSystemClientModule } from '@island.is/clients/form-system'
import { FormsService } from './forms/forms.service'
import { FormsResolver } from './forms/forms.resolver'
import { ApplicationsService } from './applications/applications.service'
import { ApplicationsResolver } from './applications/applications.resolver'
import { FieldsService } from './fields/fields.service'
import { FieldsResolver } from './fields/fields.resolver'
import { ListItemsService } from './listItems/listItems.service'
import { ListItemsResolver } from './listItems/listItems.resolver'
import { OrganizationsService } from './organizations/organizations.service'
import { OrganizationsResolver } from './organizations/organizations.resolver'
import { ScreensService } from './screens/screens.service'
import { ScreensResolver } from './screens/screens.resolver'
import { SectionsService } from './sections/sections.service'
import { SectionsResolver } from './sections/sections.resolver'
import { ServicesResolver } from './services/services.resolver'
import { ServicesService } from './services/services.service'
import { ApplicantsResolver } from './applicants/applicants.resolver'
import { ApplicantsService } from './applicants/applicants.service'
import { LoggingModule } from '@island.is/logging'
import { CertificationsResolver } from './certification/certification.resolver'
import { CertificationsService } from './certification/certification.service'
import { OrganizationPermissionsResolver } from './organizationPermissions/organizationPermissions.resolver'
import { OrganizationPermissionsService } from './organizationPermissions/organizationPermissions.service'
import { CmsModule } from '@island.is/cms'

@Module({
  providers: [
    FormsService,
    FormsResolver,
    ApplicationsService,
    ApplicationsResolver,
    FieldsService,
    FieldsResolver,
    ListItemsService,
    ListItemsResolver,
    OrganizationsService,
    OrganizationsResolver,
    ScreensService,
    ScreensResolver,
    SectionsService,
    SectionsResolver,
    ServicesResolver,
    ServicesService,
    ApplicantsResolver,
    ApplicantsService,
    CertificationsResolver,
    CertificationsService,
    OrganizationPermissionsResolver,
    OrganizationPermissionsService,
    CmsModule,
  ],
  exports: [],
  imports: [FormSystemClientModule, LoggingModule],
})
export class FormSystemModule {}
