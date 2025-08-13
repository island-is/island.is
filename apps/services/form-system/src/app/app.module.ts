import { AuthModule } from '@island.is/auth-nest-tools'
import { LoggingModule } from '@island.is/logging'
import { AuditModule } from '@island.is/nest/audit'
import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'
import { environment } from '../environments'
import { FormsModule } from './modules/forms/forms.module'
import { ScreensModule } from './modules/screens/screens.module'
import { FieldsModule } from './modules/fields/fields.module'
import { OrganizationsModule } from './modules/organizations/organizations.module'
import { SectionsModule } from './modules/sections/sections.module'
import { SequelizeConfigService } from './sequelizeConfig.service'
import { ListItemsModule } from './modules/listItems/listItems.module'
import { ApplicationsModule } from './modules/applications/applications.module'
import { FormApplicantTypesModule } from './modules/formApplicantTypes/formApplicantTypes.module'
import { FormCertificationTypesModule } from './modules/formCertificationTypes/formCertificationTypes.module'
import { OrganizationUrlsModule } from './modules/organizationUrls/organizationUrls.module'
import { FormUrlsModule } from './modules/formUrls/formUrls.module'
import { ServicesModule } from './modules/services/services.module'
import { OrganizationPermissionsModule } from './modules/organizationPermissions/organizationPermissions.module'
import { NationalRegistryV3ClientConfig } from '@island.is/clients/national-registry-v3'
import { ConfigModule, XRoadConfig } from '@island.is/nest/config'
import { CompanyRegistryConfig } from '@island.is/clients/rsk/company-registry'
import { UserProfileClientConfig } from '@island.is/clients/user-profile'

@Module({
  imports: [
    AuthModule.register(environment.auth),
    AuditModule.forRoot(environment.audit),
    LoggingModule,
    OrganizationsModule,
    FormsModule,
    SectionsModule,
    ScreensModule,
    FieldsModule,
    ListItemsModule,
    ApplicationsModule,
    FormApplicantTypesModule,
    FormCertificationTypesModule,
    FormUrlsModule,
    OrganizationPermissionsModule,
    OrganizationUrlsModule,
    ServicesModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [
        NationalRegistryV3ClientConfig,
        XRoadConfig,
        CompanyRegistryConfig,
        UserProfileClientConfig,
      ],
    }),
    SequelizeModule.forRootAsync({
      useClass: SequelizeConfigService,
    }),
  ],
})
export class AppModule {}
