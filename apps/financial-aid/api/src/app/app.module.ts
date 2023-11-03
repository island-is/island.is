import { AuthModule } from '@island.is/auth-nest-tools'
import { Module } from '@nestjs/common'
import { ApolloDriver } from '@nestjs/apollo'
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
  MunicipalityNationalRegistryModule,
} from './modules/'

const debug = !environment.production
const playground = debug || process.env.GQL_PLAYGROUND_ENABLED === 'true'
const autoSchemaFile = environment.production
  ? true
  : 'apps/financial-aid/api/src/api.graphql'

@Module({
  imports: [
    GraphQLModule.forRoot({
      driver: ApolloDriver,
      debug,
      playground,
      autoSchemaFile,
      path: '/api/graphql',
      context: ({ req }: any) => req,
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
      load: [XRoadConfig, NationalRegistryClientConfig],
    }),
  ],
})
export class AppModule {}
