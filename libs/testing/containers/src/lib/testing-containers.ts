import { GenericContainer, StartedTestContainer, Wait } from 'testcontainers'

let postgresContainer: StartedTestContainer
let redisClusterContainer: StartedTestContainer
let localstackContainer: StartedTestContainer

const portConfig = {
  SQS: parseInt(process.env.SQS_PORT || '4566', 10),
  postgres: parseInt(process.env.DB_PORT || '5432', 10),
  redis: [7000, 7001, 7002, 7003, 7004, 7005],
}

const uniqueName = (name: string) => {
  const newName = `${name}-${Math.random().toString(16).slice(2, 8)}`
  return newName
}

export const startPostgres = async () => {
  const name = 'test_db'
  postgresContainer = await new GenericContainer(
    'public.ecr.aws/docker/library/postgres:15.3-alpine',
  )
    .withName(uniqueName('postgres'))
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
  try {
    await postgresContainer.stop()
  } catch (err) {
    console.log(`Error tearing down postgres ${err.message}`, err)
  }
}

export const startRedisCluster = async () => {
  redisClusterContainer = await new GenericContainer(
    'public.ecr.aws/bitnami/redis-cluster:5.0.14',
  )
    .withName(uniqueName('redis'))
    .withEnv('IP', '0.0.0.0')
    .withExposedPorts(...portConfig.redis)
    .start()
}

export const stopRedis = () => {
  redisClusterContainer.stop()
}

export const startLocalstack = async () => {
  localstackContainer = await new GenericContainer(
    'public.ecr.aws/localstack/localstack:3',
  )
    .withName(uniqueName('localstack'))
    .withExposedPorts(portConfig.SQS)
    .withWaitStrategy(Wait.forLogMessage('Ready.'))
    .start()

  process.env.SQS_ENDPOINT = `http://${localstackContainer.getHost()}:${localstackContainer.getMappedPort(
    portConfig.SQS,
  )}`
}

export const stopLocalstack = async () => {
  await localstackContainer.stop()
}
