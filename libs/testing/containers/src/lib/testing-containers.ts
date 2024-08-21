import { GenericContainer, StartedTestContainer, Wait } from 'testcontainers'

let postgresContainer: StartedTestContainer
let redisClusterContainers: StartedTestContainer[]
let localstackContainer: StartedTestContainer

const portConfig = {
  AWS: parseInt(process.env.AWS_PORT || '4566', 10),
  postgres: parseInt(process.env.DB_PORT || '5432', 10),
  redis: process.env.REDIS_PORT
    ? [parseInt(process.env.REDIS_PORT, 10)]
    : [6379],
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
    .withStartupTimeout(20000)
    .withExposedPorts(portConfig.postgres)
    .start()

  const port = postgresContainer.getMappedPort(5432)
  process.env.DB_PORT = `${port}`
  process.env.DB_HOST = postgresContainer.getHost()
}

export const stopPostgres = async () => {
  await postgresContainer.stop()
}

export const startRedis = async () => {
  redisClusterContainers = await Promise.all(
    portConfig.redis.slice(1).map(async (port) => {
      const node = await new GenericContainer(
        'public.ecr.aws/bitnami/redis:7.0',
      )
        .withName(uniqueName('redis'))
        .withEnv('REDIS_CLUSTER_CREATOR', 'yes')
        .withExposedPorts(port)
        .start()
      process.env[`REDIS_${port}_PORT`] = node.getMappedPort(port).toString()
      return node
    }),
  )

  redisClusterContainers.push(
    await new GenericContainer('public.ecr.aws/bitnami/redis:7.0')
      .withName(uniqueName('redis'))
      .withEnv('REDIS_CLUSTER_CREATOR', 'yes')
      .withEnv('REDIS_CLUSTER_REPLICAS', '1')
      .withEnv(
        'REDIS_NODES',
        JSON.stringify(redisClusterContainers.map((n) => n.getHost())),
      )
      .withEnv('IP', '0.0.0.0')
      .withEnv('ALLOW_EMPTY_PASSWORD', 'yes')
      .withEnv('REDIS_PORT_NUMBER', portConfig.redis[0].toString())
      .withExposedPorts(...portConfig.redis)
      .start(),
  )
  process.env.REDIS_NODES = JSON.stringify(
    redisClusterContainers.map(
      (n) => `${n.getHost()}:${n.getMappedPort(portConfig.redis[0])}`,
    ),
  )
}

export const stopRedis = () => {
  redisClusterContainers.map((c) => c.stop())
}

export const startLocalstack = async () => {
  localstackContainer = await new GenericContainer(
    'public.ecr.aws/localstack/localstack:3',
  )
    .withName(uniqueName('localstack'))
    .withExposedPorts(portConfig.AWS)
    .withWaitStrategy(Wait.forLogMessage('Ready.'))
    .start()

  process.env.AWS_ENDPOINT = `http://${localstackContainer.getHost()}:${localstackContainer.getMappedPort(
    portConfig.AWS,
  )}`
  process.env.SQS_ENDPOINT = process.env.AWS_ENDPOINT
  process.env.AWS_REGION = 'eu-west-1'
}

export const stopLocalstack = async () => {
  await localstackContainer.stop()
}
