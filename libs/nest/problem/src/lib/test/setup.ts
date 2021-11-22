import { Controller, Get, Module } from '@nestjs/common'
import request, { Test } from 'supertest'
import { testServer } from '@island.is/infra-nest-server'
import { GraphQLModule, Query, Resolver } from '@nestjs/graphql'
import { Logger, LOGGER_PROVIDER } from '@island.is/logging'
import { ProblemModule } from '../problem.module'

export type CreateRequest = (mode?: 'rest' | 'graphql') => Test

export const setup = async (
  options: {
    handler?: () => void
  } = {},
): Promise<[CreateRequest, jest.Mock, Logger]> => {
  const handler = jest.fn().mockImplementation(options.handler)
  @Controller()
  class TestController {
    @Get()
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
      GraphQLModule.forRoot({ path: '/graphql', autoSchemaFile: true }),
      ProblemModule,
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
        : request(app.getHttpServer()).get('/'),
    handler,
    app.get(LOGGER_PROVIDER) as Logger,
  ]
}
