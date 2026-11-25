import { NotificationCommands } from '@island.is/form-system/shared'
import { ConfigType, XRoadConfig } from '@island.is/nest/config'
import { Logger } from '@island.is/logging'
import { AuthService } from './auth.service'
import { NotifyService } from './notify.service'

describe('NotifyService.sendNotification', () => {
  it.each([
    { xRoadBasePath: '', xRoadClient: 'client' },
    { xRoadBasePath: 'https://xroad.example/', xRoadClient: '' },
    { xRoadBasePath: '', xRoadClient: '' },
  ])(
    'returns an unsuccessful response for missing configuration %j',
    async (config) => {
      const authService = { getAccessToken: jest.fn() }
      const logger = { error: jest.fn() }
      const service = new NotifyService(
        authService as unknown as AuthService,
        config as ConfigType<typeof XRoadConfig>,
        logger as unknown as Logger,
      )
      const enhancedFetch = jest.fn()
      service.enhancedFetch = enhancedFetch

      await expect(
        service.sendNotification(
          {
            applicationId: 'application-id',
            nationalId: '',
            actorNationalId: '',
            organizationNationalId: '',
            slug: 'form-slug',
            isTest: true,
            command: NotificationCommands.VALIDATE,
          },
          'external-service',
        ),
      ).resolves.toEqual({ operationSuccessful: false })

      expect(authService.getAccessToken).not.toHaveBeenCalled()
      expect(enhancedFetch).not.toHaveBeenCalled()
      expect(logger.error).toHaveBeenCalledWith(
        'form system notification configuration missing',
        expect.objectContaining({
          missingXRoadBase: !config.xRoadBasePath,
          missingXRoadClient: !config.xRoadClient,
          datadogEvent: 'form_system_notification_send_failed',
        }),
      )
    },
  )
})
