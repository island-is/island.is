import { Module } from '@nestjs/common'
import { GraphQLModule } from '@nestjs/graphql'

<<<<<<< HEAD
//import { UserModule, CarModule, RecyclingPartner } from './modules'
import { CarownerModule } from './modules/carowner'
import { RecyclingPartnerModule } from './modules/recyclingPartner'
import { AuthModule } from './modules/auth'
import { UserModule } from './modules/user'
=======
import { UserModule, CarModule } from './modules'
import { CarownerModule } from './modules/carowner'
>>>>>>> master

const debug = process.env.NODE_ENV === 'development'
const playground = debug || process.env.GQL_PLAYGROUND_ENABLED === 'true'

@Module({
  imports: [
    GraphQLModule.forRoot({
      debug,
      playground,
      autoSchemaFile: 'apps/skilavottord/ws/src/app/api.graphql',
    }),
<<<<<<< HEAD
    AuthModule,
    UserModule,
    CarownerModule,
    RecyclingPartnerModule,
=======
    CarownerModule,
>>>>>>> master
  ],
  //providers: [BackendAPI],
})
export class AppModule {}
