import { FormLoaderArgs } from '@island.is/application/types'
import { FeatureFlagClient } from '@island.is/feature-flags'

/**
 * Phase 1 Gate #4: FeatureFlagClient type assertion.
 *
 * Verifies that the NestJS FeatureFlagClient interface is assignable
 * to FormLoaderArgs['featureFlagClient']. Since FormLoaderArgs types
 * featureFlagClient as `unknown`, any value satisfies it — this test
 * documents that compile-time compatibility holds.
 */
describe('FeatureFlagClient type compatibility with FormLoaderArgs', () => {
  it('FeatureFlagClient is assignable to FormLoaderArgs.featureFlagClient', () => {
    const mockClient: FeatureFlagClient = {
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      dispose: () => {},
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      getValue: async () => '' as any,
    }

    const args: FormLoaderArgs = {
      featureFlagClient: mockClient,
    }

    expect(args.featureFlagClient).toBe(mockClient)
  })
})
