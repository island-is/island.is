import { GenericContainer, StartedTestContainer, Wait } from 'testcontainers'
import { logger } from '@island.is/logging'

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
  logger.debug(`Unique name: ${newName}`)
  return newName
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

export const stopPostgres = async (): Promise<void> => {
  logger.info(`Stopping postgres...`)
  await postgresContainer.stop()
}

export const startRedis = async () => {
  logger.info('Starting redis cluster...')
  redisClusterContainer = await new GenericContainer(
    'public.ecr.aws/bitnami/redis-cluster:7.0',
  )
    .withName(uniqueName('redis'))
    .withEnv('IP', '0.0.0.0')
    .withEnv('ALLOW_EMPTY_PASSWORD', 'yes')
    .withExposedPorts(...portConfig.redis)
    .start()
  logger.debug('Started redis cluster', { redisClusterContainer })
}

export const stopRedis = () => {
  logger.info('Stopping redis...')
  redisClusterContainer.stop()
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
