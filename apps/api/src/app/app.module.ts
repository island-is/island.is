import { Module } from '@nestjs/common'
import { HelloWorldModule } from '@island.is/api/domains/hello-world'
import { GraphQLModule } from '@nestjs/graphql'

const debug = process.env.NODE_ENV === 'development'
const playground = debug || process.env.GQL_PLAYGROUND_ENABLED === 'true'

@Module({
  imports: [
    GraphQLModule.forRoot({
      debug,
      playground,
      autoSchemaFile: 'apps/api/src/api.graphql',
      path: '/api/graphql',
    }),
    HelloWorldModule,
  ],
})
export class AppModule {}
