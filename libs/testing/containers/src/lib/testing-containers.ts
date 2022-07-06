import { GenericContainer, StartedTestContainer, Wait } from 'testcontainers'

let postgresContainer: StartedTestContainer

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

export const stopPostgres = () => {
  postgresContainer.stop()
}
