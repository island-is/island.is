import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { SequelizeModule } from '@nestjs/sequelize'

import {
  DelegationConfig,
  SequelizeConfigService,
} from '@island.is/auth-api-lib'
import { AuthModule } from '@island.is/auth-nest-tools'
import { RskRelationshipsClientConfig } from '@island.is/clients-rsk-relationships'
import { NationalRegistryClientConfig } from '@island.is/clients/national-registry-v2'
import { NationalRegistryV3ClientConfig } from '@island.is/clients/national-registry-v3'
import { CompanyRegistryConfig } from '@island.is/clients/rsk/company-registry'
import { SyslumennClientConfig } from '@island.is/clients/syslumenn'
import { ZendeskServiceConfig } from '@island.is/clients/zendesk'
import { AuditModule } from '@island.is/nest/audit'
import { IdsClientConfig, XRoadConfig } from '@island.is/nest/config'
import { FeatureFlagConfig } from '@island.is/nest/feature-flags'
import { ProblemModule } from '@island.is/nest/problem'

import { environment } from '../environments'
import { AccessModule } from './modules/access/access.module'
import { ClientsModule } from './modules/clients/clients.module'
import { GrantTypesModule } from './modules/grant-types/grant-types.module'
import { IdpProviderModule } from './modules/idp-provider/idp-provider.module'
import { PersonalRepresentativeModule } from './modules/personal-representative/personal-representative.module'
import { ResourcesModule } from './modules/resources/resources.module'
import { TranslationModule } from './modules/translation/translation.module'
import { UsersModule } from './modules/users/users.module'
import { ClientsModule as ClientsV2Module } from './v2/clients/clients.module'
import { DelegationAdminModule } from './v2/delegations/delegation-admin.module'
import { ProvidersModule } from './v2/providers/providers.module'
import { ScopesModule } from './v2/scopes/scopes.module'
import { ClientSecretsModule } from './v2/secrets/client-secrets.module'
import { TenantsModule } from './v2/tenants/tenants.module'
import { IdentityConfirmationApiModule } from './v2/identity-confirmation/identity-confirmation.module'

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
    ClientsV2Module,
    ClientSecretsModule,
    IdentityConfirmationApiModule,
    ProblemModule,
    ProvidersModule,
    ScopesModule,
    DelegationAdminModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [
        DelegationConfig,
        RskRelationshipsClientConfig,
        NationalRegistryClientConfig,
        NationalRegistryV3ClientConfig,
        CompanyRegistryConfig,
        FeatureFlagConfig,
        XRoadConfig,
        IdsClientConfig,
        SyslumennClientConfig,
        ZendeskServiceConfig,
      ],
      envFilePath: ['.env', '.env.secret'],
    }),
  ],
})
export class AppModule {}
