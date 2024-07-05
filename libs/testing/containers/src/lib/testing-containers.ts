import { GenericContainer, StartedTestContainer, Wait } from 'testcontainers'

let postgresContainer: StartedTestContainer
let redisClusterContainer: StartedTestContainer

const portConfig = {
  SQS: parseInt(process.env.SQS_PORT || '9324', 10),
  postgres: parseInt(process.env.DB_PORT || '5432', 10),
  redis: [7000, 7001, 7002, 7003, 7004, 7005],
}

export const startPostgres = async () => {
  const name = 'test_db'
  postgresContainer = await new GenericContainer(
    'public.ecr.aws/docker/library/postgres:15.3-alpine',
  )
    .withName(`postgres-${Math.random().toString(16).slice(2, 8)}`)
    .withEnv('POSTGRES_DB', name)
    .withEnv('POSTGRES_USER', name)
    .withEnv('POSTGRES_PASSWORD', name)
    .withHealthCheck({
      test: `PGPASSWORD=${name} psql -U ${name} -d ${name} -c 'SELECT 1'`,
      interval: 1000,
      timeout: 3000,
      retries: 5,
      startPeriod: 1000,
    })
    .withWaitStrategy(Wait.forHealthCheck())
    .withExposedPorts(portConfig.postgres)
    .start()

  const port = postgresContainer.getMappedPort(5432)
  process.env.DB_PORT = `${port}`
  process.env.DB_HOST = postgresContainer.getHost()
}

export const stopPostgres = async (): Promise<void> => {
  await postgresContainer.stop()
}

export const startRedisCluster = async () => {
  redisClusterContainer = await new GenericContainer(
    'public.ecr.aws/bitnami/redis-cluster:5.0.14',
  )
    .withName(`redis-cluster-${Math.random().toString(16).slice(2, 8)}`)
    .withEnv('IP', '0.0.0.0')
    .withExposedPorts(...portConfig.redis)
    .start()
}

export const stopRedis = () => {
  redisClusterContainer.stop()
}

export const startLocalstack = async () => {
  const lc = await new GenericContainer(
    'public.ecr.aws/localstack/localstack:3',
  )
    .withName(`localstack-${Math.random().toString(16).slice(2, 8)}`)
    .withExposedPorts(portConfig.SQS)
    .withWaitStrategy(Wait.forLogMessage('Ready.'))
    .start()

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ;(global as any).__localstack__ = lc

  process.env.SQS_ENDPOINT = `http://${lc.getHost()}:${lc.getMappedPort(
    portConfig.SQS,
  )}`
}

export const stopLocalstack = async () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  await ((global as any).__localstack__ as StartedTestContainer).stop()
}
