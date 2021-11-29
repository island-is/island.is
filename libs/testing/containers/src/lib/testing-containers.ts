import { GenericContainer, StartedTestContainer, Wait } from 'testcontainers'

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace NodeJS {
    interface Global {
      __CONTAINER_POSTGRES__: StartedTestContainer
    }
  }
}

export const startPostgres = async () => {
  const name = 'test_db'
  const container = await new GenericContainer(
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

  const port = container.getMappedPort(5432)
  process.env.DB_PORT = `${port}`

  global.__CONTAINER_POSTGRES__ = container
}

export const stopPostgres = () => {
  global.__CONTAINER_POSTGRES__.stop()
}
