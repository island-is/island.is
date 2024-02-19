import { Controller, Post, Module } from '@nestjs/common'
import request from 'supertest'

import { bootstrap } from './bootstrap'
import { HealthCheckOptionsProviderKey } from './infra/health/types'
import { InfraNestServer } from './types'

@Controller()
class TestController {
  @Post()
  helloWorld() {
    return 'OK'
  }
}

@Module({
  controllers: [TestController],
})
class TestModule {}

const testBootstrap = (options?: Partial<Parameters<typeof bootstrap>[0]>) => {
  return bootstrap({
    name: 'Test app',
    appModule: TestModule,
    collectMetrics: false,
    port: 0,
    ...options,
  })
}

const largeJsonBodyLimit = 200 * 1024 // 200kb
const largeJsonBodySize = 100 * 1024 // 100kb
const largeJsonBody = { data: new Array(largeJsonBodySize).fill('a').join('') }

describe('Bootstrap', () => {
  let nestServer: InfraNestServer | undefined

  afterEach(async () => {
    if (nestServer) {
      await nestServer.close()
    }
    nestServer = undefined
  })

  it('works', async () => {
    nestServer = await testBootstrap()
    const server = request(nestServer.server)
    await server.post('/').expect(201, 'OK')
  })

  it('has 100kb json body limit', async () => {
    nestServer = await testBootstrap()
    const server = request(nestServer.server)
    await server.post('/').send(largeJsonBody).expect(413)
  })

  it('has overridable json body limit', async () => {
    nestServer = await testBootstrap({
      jsonBodyLimit: largeJsonBodyLimit,
    })
    const server = request(nestServer.server)
    await server.post('/').send(largeJsonBody).expect(201, 'OK')
  })

  it('configures health checks options default', async () => {
    // Act
    nestServer = await testBootstrap()

    // Assert
    const healthCheckOptions = nestServer.app.get(HealthCheckOptionsProviderKey)
    expect(healthCheckOptions).toMatchObject({
      timeout: 1000,
    })
  })

  it('configures health checks options with database', async () => {
    // Act
    nestServer = await testBootstrap({ healthCheck: { database: true } })

    // Assert
    const healthCheckOptions = nestServer.app.get(HealthCheckOptionsProviderKey)
    expect(healthCheckOptions).toMatchObject({
      timeout: 1000,
      database: true,
    })
  })

  it('disables health checks', async () => {
    // Act
    nestServer = await testBootstrap({ healthCheck: false })

    // Assert
    const response = await request(nestServer.server).get('/health/check')
    expect(response.status).toBe(404)
    expect(response.body).toMatchObject({ error: 'Not Found', statusCode: 404 })
  })
})
