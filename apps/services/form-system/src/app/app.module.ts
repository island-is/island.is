import { AuthModule } from '@island.is/auth-nest-tools'
import { LoggingModule } from '@island.is/logging'
import { AuditModule } from '@island.is/nest/audit'
import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'
import { environment } from '../environments'
import { FormsModule } from './modules/forms/forms.module'
import { ScreensModule } from './modules/screens/screens.module'
import { FieldsModule } from './modules/fields/fields.module'
import { OrganizationListTypesModule } from './modules/organizationListTypes/organizationListTypes.module'
import { OrganizationsModule } from './modules/organizations/organizations.module'
import { SectionsModule } from './modules/sections/sections.module'
import { SequelizeConfigService } from './sequelizeConfig.service'
import { ListItemsModule } from './modules/listItems/listItems.module'
import { ApplicationsModule } from './modules/applications/applications.module'
import { FormApplicantTypesModule } from './modules/formApplicantTypes/formApplicantTypes.module'
import { FormCertificationTypesModule } from './modules/formCertificationTypes/formCertificationTypes.module'
import { OrganizationFieldTypesModule } from './modules/organizationFieldTypes/organizationFieldTypes.module'
import { OrganizationUrlsModule } from './modules/organizationUrls/organizationUrls.module'
import { FormUrlsModule } from './modules/formUrls/formUrls.module'
import { ServicesModule } from './modules/services/services.module'
import { ConfigModule } from '@nestjs/config'
import { CmsConfig } from '@island.is/clients/cms'
import { OrganizationPermissionsModule } from './modules/organizationPermissions/organizationPermissions.module'

@Module({
  imports: [
    AuthModule.register(environment.auth),
    AuditModule.forRoot(environment.audit),
    LoggingModule,
    SequelizeModule.forRootAsync({
      useClass: SequelizeConfigService,
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      load: [CmsConfig],
    }),
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
    OrganizationFieldTypesModule,
    OrganizationListTypesModule,
    OrganizationUrlsModule,
    ServicesModule,
  ],
})
export class AppModule {}
