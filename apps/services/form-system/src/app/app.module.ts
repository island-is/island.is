import { AuthModule } from '@island.is/auth-nest-tools'
import { LoggingModule } from '@island.is/logging'
import { AuditModule, AuditConfig } from '@island.is/nest/audit'
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
import { CertificationsModule } from './modules/certifications/certifications.module'
import { SequelizeConfigService } from './sequelizeConfig.service'
import { ListItemsModule } from './modules/listItems/listItems.module'
import { ApplicationsModule } from './modules/applications/applications.module'
import { ConfigModule } from '@nestjs/config'

@Module({
  imports: [
    AuthModule.register(environment.auth),
    AuditModule,
    LoggingModule,
    SequelizeModule.forRootAsync({
      useClass: SequelizeConfigService,
    }),
    OrganizationsModule,
    FormsModule,
    SectionsModule,
    ScreensModule,
    FieldsModule,
    CertificationsModule,
    ListsModule,
    FieldSettingsModule,
    ListItemsModule,
    ApplicationsModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [AuditConfig],
    })
  ],
})
export class AppModule {}
