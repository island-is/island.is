import { Module } from '@nestjs/common'
import { GraphQLModule } from '@nestjs/graphql'

//import { UserModule, CarModule, RecyclingPartner } from './modules'
import { CarownerModule } from './modules/carowner'
import { RecyclingPartnerModule } from './modules/recyclingPartner'
import { AuthModule } from './modules/auth'
import { UserModule } from './modules/user'

const debug = process.env.NODE_ENV === 'development'
const playground = debug || process.env.GQL_PLAYGROUND_ENABLED === 'true'

@Module({
  imports: [
    GraphQLModule.forRoot({
      debug,
      playground,
      autoSchemaFile: 'apps/skilavottord/ws/src/app/api.graphql',
    }),
    CarownerModule,
    RecyclingPartnerModule,
  ],
  //providers: [BackendAPI],
})
export class AppModule {}
