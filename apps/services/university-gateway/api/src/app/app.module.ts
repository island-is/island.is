import { Module } from '@nestjs/common'
import { GraphQLModule } from '@nestjs/graphql'
import { ApolloDriver } from '@nestjs/apollo'

import { CmsTranslationsModule } from '@island.is/cms-translations'
import { ProblemModule } from '@island.is/nest/problem'

import { environment } from '../environments'
import { BackendApi } from './data-sources/backend'

import {
  ApplicationModule,
  CourseModule,
  ProgramModule,
  UniversityModule,
} from './modules'
import { ConfigModule } from '@nestjs/config'

const debug = !environment.production
const playground = debug || process.env.GQL_PLAYGROUND_ENABLED === 'true'
const autoSchemaFile = environment.production
  ? true
  : 'apps/university-gateway/api.graphql'

@Module({
  imports: [
    GraphQLModule.forRoot({
      driver: ApolloDriver,
      debug,
      playground,
      autoSchemaFile,
      cache: 'bounded',
      path: '/api/graphql',
      context: ({ req }: never) => ({ req }),
      dataSources: () => ({ backendApi: new BackendApi() }),
    }),
    ApplicationModule,
    CourseModule,
    ProgramModule,
    UniversityModule,
    CmsTranslationsModule,
    ProblemModule.forRoot({ logAllErrors: true }),
    ConfigModule.forRoot({ isGlobal: true }),
  ],
})
export class AppModule {}
