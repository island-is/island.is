import { TestApp } from '@island.is/testing/nest'

export const useTestDelegations = () => ({
  override: (builder: TestingModuleBuilder) => {
    return builder
  },
  extend: (app: TestApp) => {},
})
