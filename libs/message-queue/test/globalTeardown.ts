import { StartedTestContainer } from 'testcontainers'

export default async () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  await ((global as any).__localstack__ as StartedTestContainer).stop()
}
