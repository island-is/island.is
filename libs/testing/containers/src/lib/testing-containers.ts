import { GenericContainer, StartedTestContainer, Wait } from 'testcontainers'

let postgresContainer: StartedTestContainer
let redisClusterContainer: StartedTestContainer

export const startPostgres = async () => {
  const name = 'test_db'
  postgresContainer = await new GenericContainer(
    'public.ecr.aws/docker/library/postgres:11.14-alpine',
  )
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
    .withExposedPorts(5432)
    .start()

  const port = postgresContainer.getMappedPort(5432)
  process.env.DB_PORT = `${port}`
  process.env.DB_HOST = postgresContainer.getHost()
}

export const stopPostgres = async (): Promise<void> => {
  await postgresContainer.stop()
}

export const startRedisCluster = async () => {
  const ports = [7000, 7001, 7002, 7003, 7004, 7005]
  redisClusterContainer = await new GenericContainer(
    'public.ecr.aws/bitnami/redis-cluster:5.0.14',
  )
    .withEnv('IP', '0.0.0.0')
    .withExposedPorts(...ports)
    .start()
}

export const stopRedis = () => {
  redisClusterContainer.stop()
}
