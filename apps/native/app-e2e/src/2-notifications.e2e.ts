import { by, device, element, expect } from 'detox'
import { testIDs } from '../../app/src/utils/test-ids'
import { config } from './utils';

describe('Notifications', () => {
  beforeAll(async () => {
    await device.launchApp({
      permissions: {
        faceid: 'YES',
        notifications: 'YES',
      },
      url: `${config.bundleId}://e2e/disable-applock`,
    });
  })

  it('should show home screen', async () => {
    await expect(element(by.id(testIDs.SCREEN_HOME))).toBeVisible()
  })

  it('should show notifications screen', async () => {
    await element(by.id(testIDs.TOPBAR_NOTIFICATIONS_BUTTON)).tap()
    await expect(element(by.id(testIDs.SCREEN_NOTIFICATIONS))).toBeVisible()
  })

  it('should be able to tap open notification detail', async () => {
    await element(by.id(testIDs.NOTIFICATION_CARD_BUTTON)).atIndex(0).tap()
    await expect(
      element(by.id(testIDs.SCREEN_NOTIFICATION_DETAIL)),
    ).toBeVisible()
  })
})
