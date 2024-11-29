import { Test, TestingModule } from '@nestjs/testing'
import { Controller, Get, INestApplication } from '@nestjs/common'
import { CodeOwnerInterceptor } from './code-owner.interceptor'
import { CodeOwner } from './code-owner.decorator'
import request from 'supertest'
import { APP_INTERCEPTOR } from '@nestjs/core'
import { withLoggingContext } from '@island.is/logging'

// Mock the logging module
jest.mock('@island.is/logging', () => ({
  withLoggingContext: jest.fn((context, fn) => fn()),
}))

// Test controller with decorated endpoints
@Controller('test')
class TestController {
  @CodeOwner('team-a')
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

  it('should add logging context when CodeOwner decorator is present', async () => {
    // Make request to endpoint with CodeOwner decorator
    await request(app.getHttpServer())
      .get('/test/with-owner')
      .expect(200)
      .expect({ message: 'with owner' })

    // Verify that withLoggingContext was called with correct parameters
    expect(withLoggingContext).toHaveBeenCalledWith(
      { codeOwner: 'team-a' },
      expect.any(Function),
    )
  })

  it('should not add logging context when CodeOwner decorator is not present', async () => {
    // Make request to endpoint without CodeOwner decorator
    await request(app.getHttpServer())
      .get('/test/without-owner')
      .expect(200)
      .expect({ message: 'without owner' })

    // Verify that withLoggingContext was not called
    expect(withLoggingContext).not.toHaveBeenCalled()
  })

  it('should handle multiple requests correctly', async () => {
    // Make multiple requests to both endpoints
    await Promise.all([
      request(app.getHttpServer()).get('/test/with-owner'),
      request(app.getHttpServer()).get('/test/without-owner'),
      request(app.getHttpServer()).get('/test/with-owner'),
    ])

    // Verify that withLoggingContext was called exactly twice (for the two 'with-owner' requests)
    expect(withLoggingContext).toHaveBeenCalledTimes(2)
    expect(withLoggingContext).toHaveBeenCalledWith(
      { codeOwner: 'team-a' },
      expect.any(Function),
    )
  })
})
