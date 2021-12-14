import { StartedTestContainer } from 'testcontainers'

export default async () => {
  await ((global as any).__localstack__ as StartedTestContainer).stop()
}
