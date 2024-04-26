import { ApolloDriver } from '@nestjs/apollo'
import { Controller, Get, Module } from '@nestjs/common'
import { GraphQLModule, Query, Resolver } from '@nestjs/graphql'
import request, { Test } from 'supertest'

import { testServer } from '@island.is/testing/nest'
import { Logger, LOGGER_PROVIDER } from '@island.is/logging'

import { ProblemModule } from '../problem.module'
import { ProblemOptions } from '../problem.options'

export type CreateRequest = (mode?: 'rest' | 'graphql') => Test

export const setup = async (
  options: {
    problemOptions?: ProblemOptions
    handler?: () => void
    restRoute?: string
  } = {},
): Promise<[CreateRequest, jest.Mock, Logger]> => {
  const handler = jest.fn().mockImplementation(options.handler)
  @Controller()
  class TestController {
    @Get(options?.restRoute)
    testHandler() {
      handler()
    }
  }

  @Resolver()
  class TestResolver {
    @Query(() => Boolean)
    testQuery() {
      handler()
    }
  }

  @Module({
    imports: [
      GraphQLModule.forRoot({
        path: '/graphql',
        driver: ApolloDriver,
        autoSchemaFile: true,
      }),
      options.problemOptions
        ? ProblemModule.forRoot(options.problemOptions)
        : ProblemModule,
    ],
    controllers: [TestController],
    providers: [TestResolver],
  })
  class TestModule {}

  const app = await testServer({
    appModule: TestModule,
  })

  return [
    (mode) =>
      mode === 'graphql'
        ? request(app.getHttpServer())
            .post('/graphql')
            .send({ query: '{ testQuery }' })
        : request(app.getHttpServer()).get(options.restRoute || '/'),
    handler,
    app.get(LOGGER_PROVIDER) as Logger,
  ]
}
