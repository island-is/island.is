import { AuthModule } from '@island.is/auth-nest-tools'
import { LoggingModule } from '@island.is/logging'
import { AuditModule } from '@island.is/nest/audit'
import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'
import { environment } from '../environments'
import { ApplicationsModule } from './modules/applications/applications.module'
import { FieldsModule } from './modules/fields/fields.module'
import { FileModule } from './modules/file/file.module'
import { FormApplicantTypesModule } from './modules/formApplicantTypes/formApplicantTypes.module'
import { FormCertificationTypesModule } from './modules/formCertificationTypes/formCertificationTypes.module'
import { FormsModule } from './modules/forms/forms.module'
import { ListItemsModule } from './modules/listItems/listItems.module'
import { OrganizationPermissionsModule } from './modules/organizationPermissions/organizationPermissions.module'
import { OrganizationsModule } from './modules/organizations/organizations.module'
import { ScreensModule } from './modules/screens/screens.module'
import { SectionsModule } from './modules/sections/sections.module'
import { ServicesModule } from './modules/services/services.module'
import { SequelizeConfigService } from './sequelizeConfig.service'
import { PruneModule } from './modules/services/prune/prune.module'
import { ConfigModule } from '@nestjs/config'
import { XRoadConfig } from '@island.is/nest/config'

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
    ListItemsModule,
    ApplicationsModule,
    FormApplicantTypesModule,
    FormCertificationTypesModule,
    OrganizationPermissionsModule,
    ServicesModule,
    FileModule,
    PruneModule,
    ConfigModule.forRoot({ isGlobal: true, load: [XRoadConfig] }),
  ],
})
export class AppModule {}
