import { BadRequestException } from '@nestjs/common'
import type { User } from '@island.is/auth-nest-tools'
import type { OrganizationTitleByNationalIdDataLoader } from '@island.is/cms'
import type { Logger } from '@island.is/logging'
import type { AuditService } from '@island.is/nest/audit'
import type { FeatureFlagService } from '@island.is/nest/feature-flags'

import { NotificationSettingsResolver } from './notificationSettings.resolver'
import type { NotificationSettingsService } from './notificationSettings.service'

describe('NotificationSettingsResolver', () => {
  const user = { nationalId: '0101302989' } as User
  const titleLoader = {} as OrganizationTitleByNationalIdDataLoader

  const setup = (sendersEnabled: boolean) => {
    const service = {
      updateSettings: jest.fn().mockResolvedValue(undefined),
      getNotificationSettings: jest.fn().mockResolvedValue({ senders: [] }),
    }
    const auditService = {
      auditPromise: jest.fn((_audit, promise: Promise<unknown>) => promise),
    }
    const featureFlagService = {
      getValue: jest.fn().mockResolvedValue(sendersEnabled),
    }
    const logger = { info: jest.fn(), warn: jest.fn(), error: jest.fn() }

    const resolver = new NotificationSettingsResolver(
      service as unknown as NotificationSettingsService,
      auditService as unknown as AuditService,
      featureFlagService as unknown as FeatureFlagService,
      logger as unknown as Logger,
    )

    return { resolver, service }
  }

  const input = { senders: [{ senderId: '5402696029', blocked: true }] }

  it('should reject sender changes when the feature flag is disabled', async () => {
    const { resolver, service } = setup(false)

    await expect(
      resolver.updateNotificationCategorySettings(user, titleLoader, input),
    ).rejects.toBeInstanceOf(BadRequestException)
    expect(service.updateSettings).not.toHaveBeenCalled()
  })

  it('should update sender settings when the feature flag is enabled', async () => {
    const { resolver, service } = setup(true)

    await resolver.updateNotificationCategorySettings(user, titleLoader, input)

    expect(service.updateSettings).toHaveBeenCalledWith(user, {
      categories: [],
      senders: input.senders,
    })
  })
})
