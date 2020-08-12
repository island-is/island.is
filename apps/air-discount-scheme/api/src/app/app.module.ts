import { Module } from '@nestjs/common'
import { GraphQLModule } from '@nestjs/graphql'

import { AuthModule } from './modules'

const debug = process.env.NODE_ENV === 'development'
const playground = debug || process.env.GQL_PLAYGROUND_ENABLED === 'true'

@Module({
  imports: [
    GraphQLModule.forRoot({
      debug,
      playground,
      autoSchemaFile: 'apps/air-discount-scheme/api/src/api.graphql',
      path: '/api/graphql',
    }),
    AuthModule,
  ],
})
export class AppModule {}
