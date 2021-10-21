/* eslint-disable @typescript-eslint/no-var-requires */
import { coreErrorMessages } from '@island.is/application/core'

const defaultResult = [
  {
    fullName: 'Tester Successon',
  },
]

class BasicSuccessDataProvider {
  useGraphqlGateway() {
    return Promise.resolve({
      json: () =>
        Promise.resolve({
          data: {
            nationalRegistryFamily: defaultResult,
          },
        }),
    })
  }
}

class BasicFailingDataProvider {
  useGraphqlGateway() {
    return Promise.reject()
  }
}

describe('FamilyInformationProvider', () => {
  beforeEach(() => {
    jest.resetModules()
  })

  const trickEnvironmentCheckToThinkItIs = (type: string) => {
    jest.mock('@island.is/shared/utils', () => ({
      isRunningOnEnvironment: (environment: string) => environment === type,
    }))
  }

  const letGraphqlQueryFromBaseClass = (type: 'succeed' | 'fail') => {
    jest.mock('@island.is/application/core', () => ({
      ...(jest.requireActual('@island.is/application/core') as any),
      BasicDataProvider:
        type === 'succeed'
          ? BasicSuccessDataProvider
          : BasicFailingDataProvider,
    }))
  }

  it('should resolve to empty array on local environment when query fails', async () => {
    // Mock dependencies before importing the provider
    trickEnvironmentCheckToThinkItIs('local')
    letGraphqlQueryFromBaseClass('fail')

    const { FamilyInformationProvider } = require('./FamilyInformationProvider')

    const instance = new FamilyInformationProvider()
    const result = await instance.provide()

    expect(result).toEqual([])
  })

  it('should resolve to response on local environment when query succeeds', async () => {
    // Mock dependencies before importing the provider
    trickEnvironmentCheckToThinkItIs('local')
    letGraphqlQueryFromBaseClass('succeed')

    const { FamilyInformationProvider } = require('./FamilyInformationProvider')

    const instance = new FamilyInformationProvider()
    const result = await instance.provide()

    expect(result).toEqual(defaultResult)
  })

  it('should fail on non-local environments when query fails', async () => {
    // Mock dependencies before importing the provider
    trickEnvironmentCheckToThinkItIs('prod')
    letGraphqlQueryFromBaseClass('fail')

    const { FamilyInformationProvider } = require('./FamilyInformationProvider')
    const instance = new FamilyInformationProvider()

    try {
      await instance.provide()
    } catch (e) {
      expect(e).toEqual({
        reason: coreErrorMessages.errorDataProviderDescription,
      })
    }
  })

  it('should resolve to response on non-local environments when query succeeds', async () => {
    // Mock dependencies before importing the provider
    trickEnvironmentCheckToThinkItIs('prod')
    letGraphqlQueryFromBaseClass('succeed')

    const { FamilyInformationProvider } = require('./FamilyInformationProvider')
    const instance = new FamilyInformationProvider()

    const result = await instance.provide()

    expect(result).toEqual(defaultResult)
  })
})
