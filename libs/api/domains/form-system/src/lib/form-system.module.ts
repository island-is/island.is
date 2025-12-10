import { FormSystemClientModule } from '@island.is/clients/form-system'
import { NationalRegistryV3ClientModule } from '@island.is/clients/national-registry-v3'
import { CompanyRegistryClientModule } from '@island.is/clients/rsk/company-registry'
import { CmsModule } from '@island.is/cms'
import { LoggingModule } from '@island.is/logging'
import { Module } from '@nestjs/common'
import { ApplicationsResolver } from './applications/applications.resolver'
import { ApplicationsService } from './applications/applications.service'
import { CertificationsResolver } from './certification/certification.resolver'
import { CertificationsService } from './certification/certification.service'
import { CompanyRegistryResolver } from './company/companyRegistry.resolver'
import { FieldsResolver } from './fields/fields.resolver'
import { FieldsService } from './fields/fields.service'
import { FilesResolver } from './files/files.resolver'
import { FilesService } from './files/files.service'
import { FormApplicantTypesResolver } from './formApplicantTypes/formApplicantTypes.resolver'
import { FormApplicantTypesService } from './formApplicantTypes/formApplicantTypes.service'
import { FormsResolver } from './forms/forms.resolver'
import { FormsService } from './forms/forms.service'
import { FormUrlsResolver } from './formUrls/formUrls.resolver'
import { FormUrlsService } from './formUrls/formUrls.service'
import { ListItemsResolver } from './listItems/listItems.resolver'
import { ListItemsService } from './listItems/listItems.service'
import { NationalRegistryResolver } from './nationalRegistry/nationalRegistry.resolver'
import { OrganizationPermissionsResolver } from './organizationPermissions/organizationPermissions.resolver'
import { OrganizationPermissionsService } from './organizationPermissions/organizationPermissions.service'
import { OrganizationsResolver } from './organizations/organizations.resolver'
import { OrganizationsService } from './organizations/organizations.service'
import { OrganizationUrlsResolver } from './organizationUrls/organizationUrls.resolver'
import { OrganizationUrlsService } from './organizationUrls/organizationUrls.service'
import { ScreensResolver } from './screens/screens.resolver'
import { ScreensService } from './screens/screens.service'
import { SectionsResolver } from './sections/sections.resolver'
import { SectionsService } from './sections/sections.service'
import { TranslationsResolver } from './translations/translations.resolver'
import { TranslationsService } from './translations/translations.service'

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
    CertificationsResolver,
    CertificationsService,
    OrganizationPermissionsResolver,
    OrganizationPermissionsService,
    OrganizationUrlsResolver,
    OrganizationUrlsService,
    FormUrlsResolver,
    FormUrlsService,
    FormApplicantTypesResolver,
    FormApplicantTypesService,
    CmsModule,
    NationalRegistryResolver,
    CompanyRegistryResolver,
    FilesService,
    FilesResolver,
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
