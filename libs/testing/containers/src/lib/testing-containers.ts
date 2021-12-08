import { GenericContainer, StartedTestContainer, Wait } from 'testcontainers'

let postgresContainer: StartedTestContainer

export const startPostgres = async () => {
  const name = 'test_db'
  postgresContainer = await new GenericContainer(
    'public.ecr.aws/bitnami/postgresql:11.12.0',
  )
    .withEnv('POSTGRES_DB', name)
    .withEnv('POSTGRES_USER', name)
    .withEnv('POSTGRES_PASSWORD', name)
    .withHealthCheck({
      test: `pg_isready -U ${name}`,
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
}

export const stopPostgres = () => {
  postgresContainer.stop()
}
