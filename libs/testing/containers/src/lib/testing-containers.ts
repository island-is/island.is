import { GenericContainer, StartedTestContainer, Wait } from 'testcontainers'
import { logger } from '@island.is/logging'

let postgresContainer: StartedTestContainer
let redisClusterContainers: StartedTestContainer[]
let localstackContainer: StartedTestContainer

const portConfig = {
  SQS: parseInt(process.env.SQS_PORT || '4566', 10),
  postgres: parseInt(process.env.DB_PORT || '5432', 10),
  redis: [6379],
}

const uniqueName = (name: string) => {
  return `${name}-${Math.random().toString(16).slice(2, 8)}`
}

export const startPostgres = async () => {
  logger.info(`Starting postgres...`)
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
  logger.debug(`Started postgres container with name ${name}`, {
    postgresContainer,
  })

  const port = postgresContainer.getMappedPort(5432)
  process.env.DB_PORT = `${port}`
  process.env.DB_HOST = postgresContainer.getHost()
  logger.debug('Set environment config', {
    port: process.env.DB_PORT,
    host: process.env.DB_HOST,
  })
}

export const stopPostgres = async () => {
  logger.info(`Stopping postgres...`)
  await postgresContainer.stop()
}

export const startRedis = async () => {
  logger.info('Starting redis cluster...')
  logger.debug('Configuring Redis slaves')
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

  logger.debug('Configuring Redis master')
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
      .withExposedPorts(portConfig.redis[0])
      .start(),
  )
  process.env.REDIS_NODES = JSON.stringify(
    redisClusterContainers.map(
      (n) => `${n.getHost()}:${n.getMappedPort(portConfig.redis[0])}`,
    ),
  )

  logger.debug('Started redis cluster', {
    nodes: redisClusterContainers,
    REDIS_NODES: process.env.REDIS_NODES,
  })
}

export const stopRedis = () => {
  logger.info('Stopping redis...')
  redisClusterContainers.map((c) => c.stop())
}

export const startLocalstack = async () => {
  logger.info('Starting localstack...')
  localstackContainer = await new GenericContainer(
    'public.ecr.aws/localstack/localstack:3',
  )
    .withName(uniqueName('localstack'))
    .withExposedPorts(portConfig.SQS)
    .withWaitStrategy(Wait.forLogMessage('Ready.'))
    .start()
  logger.debug('Started localstack', { localstackContainer })

  process.env.SQS_ENDPOINT = `http://${localstackContainer.getHost()}:${localstackContainer.getMappedPort(
    portConfig.SQS,
  )}`
  logger.debug('Set environment config', {
    SQS_ENDPOINT: process.env.SQS_ENDPOINT,
  })
}

export const stopLocalstack = async () => {
  logger.info('Stopping localstack...')
  await localstackContainer.stop()
}
