import { Module } from '@nestjs/common'
import { GraphQLModule } from '@nestjs/graphql'

import { UserModule, CarModule } from './modules'

const debug = process.env.NODE_ENV === 'development'
const playground = debug || process.env.GQL_PLAYGROUND_ENABLED === 'true'

@Module({
  imports: [
    GraphQLModule.forRoot({
      debug,
      playground,
      autoSchemaFile: 'apps/skilavottord/ws/src/app/api.graphql',
    }),
    UserModule,
    CarModule,
  ],
  //providers: [BackendAPI],
})
export class AppModule {}
