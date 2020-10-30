console.log('--- app.module starting')
import { Module } from '@nestjs/common'
import { GraphQLModule } from '@nestjs/graphql'
import { RecyclingPartnerModule } from './modules/recyclingPartner'
import { AuthModule } from './modules/auth'
import { UserModule } from './modules'
import { GdprDbModule } from './modules/gdpr/gdpr.module'
import { CarownerModule } from './modules/carowner'
import { SequelizeModule } from '@nestjs/sequelize'
import { SequelizeConfigService } from './sequelizeConfig.service'
import { RecyclingPartnerDbModule } from './modules/recycling.partner/recycling.partner.module'
import { VehicleModule } from './modules/vehicle/vehicle.module'
import { RecyclingRequestModule } from './modules/recycling.request/recycling.request.module'
import { VehicleOwnerModule } from './modules/vehicle.owner/vehicle.owner.module'
import { SamgongustofaModule } from './modules/samgongustofa/samgongustofa.module'
import { FjarsyslaModule } from './modules/fjarsysla/fjarsysla.module'

const debug = process.env.NODE_ENV === 'development'
const playground = debug || process.env.GQL_PLAYGROUND_ENABLED === 'true'
const autoSchemaFile = debug ? 'apps/skilavottord/ws/src/app/api.graphql' : true

@Module({
  imports: [
    GraphQLModule.forRoot({
      debug,
      playground,
      autoSchemaFile,
      path: '/api/graphql',
    }),
    SequelizeModule.forRootAsync({
      useClass: SequelizeConfigService,
    }),
    AuthModule,
    UserModule,
    CarownerModule,
    RecyclingPartnerModule,
    SamgongustofaModule,
    FjarsyslaModule,
    GdprDbModule,
    RecyclingPartnerDbModule,
    VehicleModule,
    RecyclingRequestModule,
    VehicleOwnerModule,
  ],
  //providers: [BackendAPI],
})
export class AppModule {}
