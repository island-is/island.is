import { AuthModule } from '@island.is/auth-nest-tools'
import { Module } from '@nestjs/common'
import { GraphQLModule } from '@nestjs/graphql'
import { NationalRegistryClientConfig } from '@island.is/clients/national-registry-v2'
import { ConfigModule, XRoadConfig } from '@island.is/nest/config'

import { environment } from '../environments'
import { BackendAPI } from '../services'
import {
  UserModule,
  ApplicationModule,
  MunicipalityModule,
  FileModule,
  StaffModule,
  PersonalTaxReturnModule,
} from './modules/'
import { MunicipalityNationalRegistryModule } from './modules/municpalityNationalRegistryModule'
import { PersonalTaxReturnConfig } from '@island.is/clients/rsk/personal-tax-return'

const debug = !environment.production
const playground = debug || process.env.GQL_PLAYGROUND_ENABLED === 'true'
const autoSchemaFile = environment.production
  ? true
  : 'apps/financial-aid/api.graphql'

@Module({
  imports: [
    GraphQLModule.forRoot({
      debug,
      playground,
      autoSchemaFile,
      path: '/api/graphql',
      context: ({ req }) => req,
      dataSources: () => ({
        backendApi: new BackendAPI(),
      }),
    }),
    AuthModule.register(environment.identityServerAuth),
    UserModule,
    ApplicationModule,
    MunicipalityModule,
    FileModule,
    MunicipalityNationalRegistryModule,
    StaffModule,
    PersonalTaxReturnModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [
        XRoadConfig,
        NationalRegistryClientConfig,
        PersonalTaxReturnConfig,
      ],
    }),
  ],
})
export class AppModule {}
