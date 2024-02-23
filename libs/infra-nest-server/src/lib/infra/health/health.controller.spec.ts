import { HttpStatus, Injectable, Module } from '@nestjs/common'
import {
  SequelizeModule,
  SequelizeModuleOptions,
  SequelizeOptionsFactory,
} from '@nestjs/sequelize'
import { HealthCheckError, SequelizeHealthIndicator } from '@nestjs/terminus'
import request from 'supertest'

// Intentional circular dependency as this is only tests
// eslint-disable-next-line @nx/enforce-module-boundaries
import { testServer, useDatabase } from '@island.is/testing/nest'

@Injectable()
export class SequelizeConfigService implements SequelizeOptionsFactory {
  createSequelizeOptions(): SequelizeModuleOptions {
    return {}
  }
}

@Module({
  imports: [SequelizeModule.forRootAsync({ useClass: SequelizeConfigService })],
  providers: [SequelizeConfigService],
})
class TestModule {}

describe('HealthController', () => {
  describe('with database', () => {
    it('returns 200 with ok status when db is online', async () => {
      // Arrange
      const app = await testServer({
        appModule: TestModule,
        enableVersioning: true,
        hooks: [
          useDatabase({ type: 'sqlite', provider: SequelizeConfigService }),
        ],
        healthCheck: {
          database: true,
        },
      })

      // Act
      const response = await request(app.getHttpServer()).get('/health/check')

      // Assert
      expect(response.status).toBe(HttpStatus.OK)
      expect(response.body).toMatchObject({
        status: 'ok',
        info: { database: { status: 'up' } },
        error: {},
        details: { database: { status: 'up' } },
      })

      // Cleanup
      await app.cleanUp?.()
    })

    it('returns 503 with error status when db is down', async () => {
      // Arrange
      const mockPingCheck = jest.fn().mockRejectedValue(
        new HealthCheckError('db is down', {
          database: { status: 'down' },
        }),
      )
      const app = await testServer({
        appModule: TestModule,
        enableVersioning: true,
        healthCheck: {
          database: true,
        },
        hooks: [
          useDatabase({ type: 'sqlite', provider: SequelizeConfigService }),
        ],
        override: (builder) =>
          builder.overrideProvider(SequelizeHealthIndicator).useValue({
            pingCheck: mockPingCheck,
          }),
      })

      // Act
      const response = await request(app.getHttpServer()).get('/health/check')

      // Assert
      //expect(mockPingCheck).toHaveBeenCalledTimes(1)
      expect(response.status).toBe(HttpStatus.SERVICE_UNAVAILABLE)
      expect(response.body).toMatchObject({
        status: 'error',
        info: {},
        error: { database: { status: 'down' } },
        details: { database: { status: 'down' } },
      })

      // Cleanup
      await app.cleanUp?.()
    })
  })
})
