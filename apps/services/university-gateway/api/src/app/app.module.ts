import { Module } from '@nestjs/common'
import { GraphQLModule } from '@nestjs/graphql'
import { ApolloDriver } from '@nestjs/apollo'

import { CmsTranslationsModule } from '@island.is/cms-translations'
import { ProblemModule } from '@island.is/nest/problem'
//import { SharedAuthModule } from '@island.is/judicial-system/auth'
//import { AuditTrailModule } from '@island.is/judicial-system/audit-trail'

//import { UniversityModule } from './modules/university/university.module'
//import { ExampleModule } from './modules/example/example.module'

import { environment } from '../environments'
import { BackendApi } from './data-sources/backend'

import {
  ApplicationModule,
  CourseModule,
  ProgramModule,
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
    //SharedAuthModule.register({
    //  jwtSecret: environment.auth.jwtSecret,
    //  secretToken: environment.auth.secretToken,
    //}),
    //AuditTrailModule.register(environment.auditTrail),
    ApplicationModule,
    CourseModule,
    ProgramModule,
    //UniversityModule,
    //ExampleModule,
    CmsTranslationsModule,
    ProblemModule.forRoot({ logAllErrors: true }),
    ConfigModule.forRoot({ isGlobal: true }),
  ],
})
export class AppModule {}
