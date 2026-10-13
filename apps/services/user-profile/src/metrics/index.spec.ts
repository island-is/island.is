import { Sequelize } from 'sequelize-typescript'
import { FeatureFlagService } from '@island.is/nest/feature-flags'
import { collectProfileMetrics } from './collect'
import { collectEnabledProfileMetrics } from './index'

jest.mock('./collect', () => ({
  collectProfileMetrics: jest.fn(),
}))

describe('enabled profile metrics', () => {
  const db = {} as Sequelize
  const featureFlagService = {
    getValue: jest.fn(),
  } as unknown as FeatureFlagService

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('does not collect when the feature flag is disabled', async () => {
    featureFlagService.getValue = jest.fn().mockResolvedValue(false)

    await expect(
      collectEnabledProfileMetrics(featureFlagService, db),
    ).resolves.toEqual([{ name: 'all_channels_disabled_users', value: 0 }])

    expect(featureFlagService.getValue).toHaveBeenCalledWith(
      expect.anything(),
      false,
    )
    expect(collectProfileMetrics).not.toHaveBeenCalled()
  })

  it('collects when the feature flag is enabled', async () => {
    const metrics = [{ name: 'all_channels_disabled_users', value: 3 }]
    featureFlagService.getValue = jest.fn().mockResolvedValue(true)
    ;(collectProfileMetrics as jest.Mock).mockResolvedValue(metrics)

    await expect(
      collectEnabledProfileMetrics(featureFlagService, db),
    ).resolves.toEqual(metrics)

    expect(collectProfileMetrics).toHaveBeenCalledWith(db)
  })
})
