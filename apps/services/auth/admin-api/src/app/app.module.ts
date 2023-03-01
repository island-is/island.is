import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { SequelizeModule } from '@nestjs/sequelize'

import {
  SequelizeConfigService,
  DelegationConfig,
} from '@island.is/auth-api-lib'
import { AuthModule } from '@island.is/auth-nest-tools'
import { AuditModule } from '@island.is/nest/audit'
import { ProblemModule } from '@island.is/nest/problem'

import { environment } from '../environments'
import { UsersModule } from './modules/users/users.module'
import { GrantTypesModule } from './modules/grant-types/grant-types.module'
import { ClientsModule } from './modules/clients/clients.module'
import { ResourcesModule } from './modules/resources/resources.module'
import { AccessModule } from './modules/access/access.module'
import { IdpProviderModule } from './modules/idp-provider/idp-provider.module'
import { TranslationModule } from './modules/translation/translation.module'
import { PersonalRepresentativeModule } from './modules/personal-representative/personal-representative.module'
import { TenantsModule } from './tenants/tenants.module'

@Module({
  imports: [
    AuditModule.forRoot(environment.audit),
    AuthModule.register(environment.auth),
    SequelizeModule.forRootAsync({
      useClass: SequelizeConfigService,
    }),
    UsersModule,
    ClientsModule,
    ResourcesModule,
    GrantTypesModule,
    AccessModule,
    IdpProviderModule,
    TranslationModule,
    PersonalRepresentativeModule,
    TenantsModule,
    ProblemModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [DelegationConfig],
      envFilePath: ['.env', '.env.secret'],
    }),
  ],
})
export class AppModule {}
