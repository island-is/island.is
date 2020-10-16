import { Module } from '@nestjs/common'
import { GraphQLModule } from '@nestjs/graphql'
import { RecyclingPartnerModule } from './modules/recyclingPartner'
import { AuthModule } from './modules/auth'
import { GdprModule, UserModule } from './modules'
import { CarownerModule } from './modules/carowner'
import { SequelizeModule } from '@nestjs/sequelize'
import { SequelizeConfigService } from './sequelizeConfig.service'

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
    GdprModule,
  ],
  //providers: [BackendAPI],
})
export class AppModule {}
