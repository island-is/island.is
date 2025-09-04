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
import { ApplicantsResolver } from './applicants/applicants.resolver'
import { ApplicantsService } from './applicants/applicants.service'
import { LoggingModule } from '@island.is/logging'
import { CertificationsResolver } from './certification/certification.resolver'
import { CertificationsService } from './certification/certification.service'
import { OrganizationPermissionsResolver } from './organizationPermissions/organizationPermissions.resolver'
import { OrganizationPermissionsService } from './organizationPermissions/organizationPermissions.service'
import { CmsModule } from '@island.is/cms'
import { TranslationsService } from './translations/translations.service'
import { TranslationsResolver } from './translations/translations.resolver'
import { OrganizationUrlsResolver } from './organizationUrls/organizationUrls.resolver'
import { OrganizationUrlsService } from './organizationUrls/organizationUrls.service'
import { FormUrlsResolver } from './formUrls/formUrls.resolver'
import { FormUrlsService } from './formUrls/formUrls.service'
import { NationalRegistryV3ClientModule } from '@island.is/clients/national-registry-v3'
import { CompanyRegistryClientModule } from '@island.is/clients/rsk/company-registry'
import { CompanyRegistryResolver } from './company/companyRegistry.resolver'
import { NationalRegistryResolver } from './nationalRegistry/nationalRegistry.resolver'

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
    TranslationsResolver,
    TranslationsService,
    ApplicantsResolver,
    ApplicantsService,
    CertificationsResolver,
    CertificationsService,
    OrganizationPermissionsResolver,
    OrganizationPermissionsService,
    OrganizationUrlsResolver,
    OrganizationUrlsService,
    FormUrlsResolver,
    FormUrlsService,
    NationalRegistryResolver,
    CompanyRegistryResolver,
  ],
  exports: [],
  imports: [
    FormSystemClientModule,
    LoggingModule,
    CmsModule,
    NationalRegistryV3ClientModule,
    CompanyRegistryClientModule,
  ],
})
export class FormSystemModule {}
