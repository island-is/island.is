import { TestingModuleBuilder } from '@nestjs/testing/testing-module.builder'
import { getQueueToken } from '@nestjs/bull'

class MockQueue {
  process = jest.fn()
  on = jest.fn()
}

interface UseBullQueue {
  name: string
}

export default ({ name }: UseBullQueue) => ({
  override: (builder: TestingModuleBuilder) =>
    builder.overrideProvider(getQueueToken(name)).useValue(new MockQueue()),
})
