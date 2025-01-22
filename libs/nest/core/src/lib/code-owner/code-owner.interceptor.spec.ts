import { withCodeOwner } from '@island.is/infra-tracing'
import { CodeOwners } from '@island.is/shared/constants'
import { Controller, Get, INestApplication } from '@nestjs/common'
import { APP_INTERCEPTOR } from '@nestjs/core'
import { Test, TestingModule } from '@nestjs/testing'
import request from 'supertest'
import { CodeOwner } from './code-owner.decorator'
import { CodeOwnerInterceptor } from './code-owner.interceptor'

// Mock the logging module
jest.mock('@island.is/infra-tracing', () => ({
  withCodeOwner: jest.fn((codeOwner, callback) => callback()),
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

  it('should call withCodeOwner when CodeOwner decorator is present', async () => {
    // Make request to endpoint with CodeOwner decorator
    await request(app.getHttpServer())
      .get('/test/with-owner')
      .expect(200)
      .expect({ message: 'with owner' })

    // Verify that withCodeOwner was called with correct parameters
    expect(withCodeOwner).toHaveBeenCalledWith(
      CodeOwners.Core,
      expect.any(Function),
    )
  })

  it('should not call withCodeOwner when CodeOwner decorator is not present', async () => {
    // Make request to endpoint without CodeOwner decorator
    await request(app.getHttpServer())
      .get('/test/without-owner')
      .expect(200)
      .expect({ message: 'without owner' })

    // Verify that withCodeOwner was not called
    expect(withCodeOwner).not.toHaveBeenCalled()
  })

  it('should handle multiple requests correctly', async () => {
    // Make multiple requests to both endpoints
    await Promise.all([
      request(app.getHttpServer()).get('/test/with-owner'),
      request(app.getHttpServer()).get('/test/without-owner'),
      request(app.getHttpServer()).get('/test/with-owner'),
    ])

    // Verify that withCodeOwner was called exactly twice (for the two 'with-owner' requests)
    expect(withCodeOwner).toHaveBeenCalledTimes(2)
    expect(withCodeOwner).toHaveBeenCalledWith(
      CodeOwners.Core,
      expect.any(Function),
    )
  })

  it('should properly wrap and execute the handler', async () => {
    // Arrange
    let handlerExecuted = false
    ;(withCodeOwner as jest.Mock).mockImplementation((codeOwner, callback) => {
      handlerExecuted = true
      return callback()
    })

    // Act
    await request(app.getHttpServer())
      .get('/test/with-owner')
      .expect(200)
      .expect({ message: 'with owner' })

    // Assert
    expect(handlerExecuted).toBe(true)
    expect(withCodeOwner).toHaveBeenCalledWith(
      CodeOwners.Core,
      expect.any(Function),
    )
  })
})
