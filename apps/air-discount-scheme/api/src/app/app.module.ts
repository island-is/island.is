import { Module } from '@nestjs/common'
import { GraphQLModule } from '@nestjs/graphql'
import { CmsModule } from '@island.is/api/domains/cms'

import { AuthModule, UserModule } from './modules'

const debug = process.env.NODE_ENV === 'development'
const playground = debug || process.env.GQL_PLAYGROUND_ENABLED === 'true'

@Module({
  imports: [
    GraphQLModule.forRoot({
      debug,
      playground,
      autoSchemaFile: 'apps/air-discount-scheme/api.graphql',
      path: '/api/graphql',
      context: ({ req }) => ({ req }),
    }),
    AuthModule,
    UserModule,
    CmsModule,
  ],
})
export class AppModule {}
