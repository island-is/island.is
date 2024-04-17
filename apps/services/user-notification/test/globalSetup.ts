import { GenericContainer, Wait } from 'testcontainers'
import { register } from 'tsconfig-paths'

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

export default async () => {
  await Promise.all([startPostgres(), startSQS()])
}
