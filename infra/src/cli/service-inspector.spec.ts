import { service } from '../dsl/dsl'
import { Charts } from '../uber-charts/all-charts'
import {
  collectEnvVarNames,
  listServiceNames,
} from './service-inspector'

jest.mock('../dsl/consts', () => ({
  rootDir: '.',
  COMMON_SECRETS: {},
}))

describe('service-inspector utilities', () => {
  const originalIslandis = Charts.islandis

  beforeEach(() => {
    const testService = service('test-service')
      .env({
        FOO: 'bar',
        BAR: {
          dev: '1',
          staging: '2',
          prod: '3',
        },
      })
      .secrets({
        SECRET_ONE: '/k8s/test-service/SECRET_ONE',
      })

    Charts.islandis = {
      dev: [testService],
      staging: [],
      prod: [],
    }
  })

  afterEach(() => {
    Charts.islandis = originalIslandis
  })

  it('lists service names', () => {
    const services = listServiceNames()
    expect(services).toContain('test-service')
  })

  it('collects env variables from env and secrets', async () => {
    const { variables, context } = await collectEnvVarNames('test-service')
    expect(context.chart).toBe('islandis')
    expect(context.opsEnv).toBe('dev')
    expect(variables).toEqual(
      expect.arrayContaining(['FOO', 'BAR', 'SECRET_ONE']),
    )
  })

  it('throws for unknown services', async () => {
    await expect(
      collectEnvVarNames('missing-service'),
    ).rejects.toThrow('Service "missing-service" not found in DSL')
  })
})
