import { CreateQueueCommand, SQSClient } from '@aws-sdk/client-sqs'
import { GenericContainer, Wait } from 'testcontainers'
import { register } from 'tsconfig-paths'

import { environment } from './environment'

// eslint-disable-next-line @typescript-eslint/no-var-requires
const tsConfig = require(`../${require('../tsconfig.json').extends}`)
register({ baseUrl: './', paths: tsConfig.compilerOptions.paths })
import { startPostgres } from '@island.is/testing/containers'

const startSQS = async () => {
  const lc = await new GenericContainer(
    `${process.env.DOCKER_REGISTRY ?? ''}localstack/localstack:0.11.1`,
  )
    .withEnv('SERVICES', 'sqs')
    .withExposedPorts(4566)
    .withWaitStrategy(Wait.forLogMessage('Ready.'))
    .start()
  // eslint-disable-next-line
  ;(global as any).__localstack__ = lc

  process.env.SQS_ENDPOINT = `http://${lc.getHost()}:${lc.getMappedPort(4566)}`
}

const setupSqsQueue = async () => {
  const client = new SQSClient({
    region: environment.SQS_REGION,
    endpoint: process.env.SQS_ENDPOINT,
    credentials: {
      accessKeyId: environment.SQS_ACCESS_KEY,
      secretAccessKey: environment.SQS_SECRET_ACCESS_KEY,
    },
  })

  await client.send(
    new CreateQueueCommand({ QueueName: environment.MAIN_QUEUE_NAME }),
  )
  await client.send(
    new CreateQueueCommand({ QueueName: environment.DEAD_LETTER_QUEUE_NAME }),
  )
}

export default async () => {
  await Promise.all([startPostgres(), startSQS()])

  // Setting up the SQS queue to prevent concurrent issues between spec files.
  await setupSqsQueue()
}
