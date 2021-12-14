import { GenericContainer, Wait } from 'testcontainers'

export default async () => {
  const lc = await new GenericContainer('public.ecr.aws/localstack/localstack')
    .withEnv('SERVICES', 'sqs')
    .withExposedPorts(4566)
    .withHealthCheck({
      test: 'curl -f http://localhost:4566/health || exit 1',
      interval: 1000,
      timeout: 10000,
      retries: 10,
      startPeriod: 1000,
    })
    .withWaitStrategy(Wait.forHealthCheck())
    .start()

  ;(global as any).__localstack__ = lc

  process.env.SQS_ENDPOINT = `http://${lc.getHost()}:${lc.getMappedPort(4566)}`
}
