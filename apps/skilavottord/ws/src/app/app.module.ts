import { Module } from '@nestjs/common'
import { ApolloDriver } from '@nestjs/apollo'
import { GraphQLModule } from '@nestjs/graphql'
import { SequelizeModule } from '@nestjs/sequelize'

import { BASE_PATH } from '@island.is/skilavottord/consts'

import {
  AccessControlModule,
  AuthModule,
  GdprModule,
  VehicleModule,
  RecyclingRequestModule,
  RecyclingPartnerModule,
  VehicleOwnerModule,
  SamgongustofaModule,
  FjarsyslaModule,
  //AppSysRecyclingReqModule,
} from './modules'
import { AuthModule as AuthJwtModule } from '@island.is/auth-nest-tools'
import { SequelizeConfigService } from './sequelizeConfig.service'
import { environment } from '../environments'

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
      issuer: 'https://identity-server.dev01.devland.is',
    }),
    AccessControlModule,
    RecyclingRequestModule,
    SamgongustofaModule,
    FjarsyslaModule,
    GdprModule,
    RecyclingPartnerModule,
    VehicleModule,
    VehicleOwnerModule,
    //AppSysRecyclingReqModule,
  ],
})
export class AppModule {}
