import { ApolloDriver } from '@nestjs/apollo'
import { Module } from '@nestjs/common'
import { GraphQLModule } from '@nestjs/graphql'
import { SequelizeModule } from '@nestjs/sequelize'

import { BASE_PATH } from '@island.is/skilavottord/consts'

import { AuthModule as AuthJwtModule } from '@island.is/auth-nest-tools'
import { environment } from '../environments'
import {
  AccessControlModule,
  AuthModule,
  FjarsyslaModule,
  GdprModule,
  MunicipalityModule,
  RecyclingPartnerModule,
  RecyclingRequestModule,
  SamgongustofaModule,
  VehicleModule,
  VehicleOwnerModule,
} from './modules'
import { SequelizeConfigService } from './sequelizeConfig.service'

const debug = process.env.NODE_ENV === 'development'
const playground = debug || process.env.GQL_PLAYGROUND_ENABLED === 'true'
const autoSchemaFile = environment.production
  ? true
  : 'apps/skilavottord/ws/src/api.graphql'

@Module({
  imports: [
    GraphQLModule.forRoot({
      debug,
      playground,
      autoSchemaFile,
      path: `${BASE_PATH}/api/graphql`,
      driver: ApolloDriver,
    }),
    SequelizeModule.forRootAsync({
      useClass: SequelizeConfigService,
    }),
    AuthModule,
    AuthJwtModule.register({
      audience: null,
      issuer: environment.auth.issuer,
    }),
    AccessControlModule,
    RecyclingRequestModule,
    SamgongustofaModule,
    FjarsyslaModule,
    GdprModule,
    RecyclingPartnerModule,
    VehicleModule,
    VehicleOwnerModule,
    MunicipalityModule,
  ],
})
export class AppModule {}
