import { setCodeOwner } from '@island.is/infra-tracing'
import { CodeOwners } from '@island.is/shared/constants'
import { Controller, Get, INestApplication } from '@nestjs/common'
import { APP_INTERCEPTOR } from '@nestjs/core'
import { Test, TestingModule } from '@nestjs/testing'
import request from 'supertest'
import { CodeOwner } from './code-owner.decorator'
import { CodeOwnerInterceptor } from './code-owner.interceptor'

// Mock the logging module
jest.mock('@island.is/infra-tracing', () => ({
  setCodeOwner: jest.fn(),
}))

// Test controller with decorated endpoints
@Controller('test')
class TestController {
  @CodeOwner(CodeOwners.Core)
  @Get('with-owner')
  getWithOwner() {
    return { message: 'with owner' }
  }

  @Get('without-owner')
  getWithoutOwner() {
    return { message: 'without owner' }
  }
}

describe('CodeOwnerInterceptor', () => {
  let app: INestApplication

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [TestController],
      providers: [
        {
          provide: APP_INTERCEPTOR,
          useClass: CodeOwnerInterceptor,
        },
      ],
    }).compile()

    app = moduleFixture.createNestApplication()
    await app.init()
  })

  afterEach(async () => {
    await app.close()
    jest.clearAllMocks()
  })

  it('should call setCodeOwner when CodeOwner decorator is present', async () => {
    // Make request to endpoint with CodeOwner decorator
    await request(app.getHttpServer())
      .get('/test/with-owner')
      .expect(200)
      .expect({ message: 'with owner' })

    // Verify that setCodeOwner was called with correct parameters
    expect(setCodeOwner).toHaveBeenCalledWith(CodeOwners.Core)
  })

  it('should not call setCodeOwner when CodeOwner decorator is not present', async () => {
    // Make request to endpoint without CodeOwner decorator
    await request(app.getHttpServer())
      .get('/test/without-owner')
      .expect(200)
      .expect({ message: 'without owner' })

    // Verify that setCodeOwner was not called
    expect(setCodeOwner).not.toHaveBeenCalled()
  })

  it('should handle multiple requests correctly', async () => {
    // Make multiple requests to both endpoints
    await Promise.all([
      request(app.getHttpServer()).get('/test/with-owner'),
      request(app.getHttpServer()).get('/test/without-owner'),
      request(app.getHttpServer()).get('/test/with-owner'),
    ])

    // Verify that setCodeOwner was called exactly twice (for the two 'with-owner' requests)
    expect(setCodeOwner).toHaveBeenCalledTimes(2)
    expect(setCodeOwner).toHaveBeenCalledWith(CodeOwners.Core)
  })
})
