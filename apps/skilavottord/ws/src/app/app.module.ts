import { Module } from '@nestjs/common'
import { GraphQLModule } from '@nestjs/graphql'
import { SequelizeModule } from '@nestjs/sequelize'

import { BASE_PATH } from '@island.is/skilavottord/consts'

import { environment } from '../environments'

import {
  AccessControlModule,
  AuthModule,
  FjarsyslaModule,
  GdprModule,
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
  : 'apps/skilavottord/api.graphql'

@Module({
  imports: [
    GraphQLModule.forRoot({
      debug,
      playground,
      autoSchemaFile,
      path: `${BASE_PATH}/api/graphql`,
    }),
    SequelizeModule.forRootAsync({
      useClass: SequelizeConfigService,
    }),
    AuthModule,
    AccessControlModule,
    RecyclingRequestModule,
    SamgongustofaModule,
    FjarsyslaModule,
    GdprModule,
    RecyclingPartnerModule,
    VehicleModule,
    VehicleOwnerModule,
  ],
})
export class AppModule {}
