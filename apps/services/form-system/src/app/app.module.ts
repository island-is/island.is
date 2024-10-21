import { AuthModule } from '@island.is/auth-nest-tools'
import { LoggingModule } from '@island.is/logging'
import { AuditModule } from '@island.is/nest/audit'
import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'
import { environment } from '../environments'
import { FormsModule } from './modules/forms/forms.module'
import { ScreensModule } from './modules/screens/screens.module'
import { FieldSettingsModule } from './modules/fieldSettings/fieldSettings.module'
import { FieldsModule } from './modules/fields/fields.module'
import { ListsModule } from './modules/lists/lists.module'
import { OrganizationsModule } from './modules/organizations/organizations.module'
import { SectionsModule } from './modules/sections/sections.module'
import { SequelizeConfigService } from './sequelizeConfig.service'
import { ListItemsModule } from './modules/listItems/listItems.module'
import { ApplicationsModule } from './modules/applications/applications.module'
import { ValuesModule } from './modules/values/values.module'
import { FormApplicantsModule } from './modules/formApplicants/formApplicants.module'
import { FormCertificationsModule } from './modules/formCertifications/formCertifications.module'
import { OrganizationCertificationsModule } from './modules/organizationCertifications/organizationCertifications.module'

@Module({
  imports: [
    AuthModule.register(environment.auth),
    AuditModule.forRoot(environment.audit),
    LoggingModule,
    SequelizeModule.forRootAsync({
      useClass: SequelizeConfigService,
    }),
    OrganizationsModule,
    FormsModule,
    SectionsModule,
    ScreensModule,
    FieldsModule,
    ListsModule,
    FieldSettingsModule,
    ListItemsModule,
    ApplicationsModule,
    ValuesModule,
    FormApplicantsModule,
    FormCertificationsModule,
    OrganizationCertificationsModule,
  ],
})
export class AppModule {}
