import { GenericContainer } from 'testcontainers'

export default async () => {
  const lc = await new GenericContainer(
    `public.ecr.aws/s4w6t4b6/localstack/localstack:0.11.1`,
  )
    .withEnv('SERVICES', 'sqs')
    .withExposedPorts(4566)
    .start()

  ;(global as any).__localstack__ = lc

  process.env.SQS_ENDPOINT = `http://${lc.getHost()}:${lc.getMappedPort(4566)}`
}
