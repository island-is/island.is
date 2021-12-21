import { TestApp } from '@island.is/testing/nest'
import request from 'supertest'
import { createCurrentUser } from '@island.is/testing/fixtures'
import { IdsUserGuard, MockAuthGuard } from '@island.is/auth-nest-tools'
import { ApplicationScope } from '@island.is/auth/scopes'
import { INestApplication } from '@nestjs/common'
import { setup } from '../../../../test/setup'
import { ApplicationLifeCycleService } from './application-lifecycle.service'

const currentUser = createCurrentUser()
let app: INestApplication
const nationalId = '1234564321'
let server: request.SuperTest<request.Test>
let lifeCycleService: ApplicationLifeCycleService

beforeAll(async () => {
  app = await setup({
    override: (builder) =>
      builder.overrideGuard(IdsUserGuard).useValue(
        new MockAuthGuard({
          nationalId,
          scope: [ApplicationScope.read, ApplicationScope.write],
        }),
      ),
  })

  lifeCycleService = app.get<ApplicationLifeCycleService>(
    ApplicationLifeCycleService,
  )
  server = request(app.getHttpServer())
})
describe('Example functional test', () => {
  let app: TestApp

  afterAll(async () => {
    await app.cleanUp()
  })
})
