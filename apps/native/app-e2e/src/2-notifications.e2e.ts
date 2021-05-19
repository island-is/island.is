import { by, element, waitFor } from 'detox'
import { testIDs } from '../../app/src/utils/test-ids'
import { launchAsynchronizedApp } from './utils';

// @todo CADisplayLink is causing synchronization to hang
//       we can use device.disableSynchronization() but home screen starts inside launchApp
//       so there is no way around it

describe('Notifications', () => {
  beforeAll(async () => {
    await launchAsynchronizedApp();
  })

  it('should show home screen', async () => {
    await waitFor(element(by.id(testIDs.SCREEN_HOME))).toBeVisible()
  })

  it('should show notifications screen', async () => {
    await element(by.id(testIDs.TOPBAR_NOTIFICATIONS_BUTTON)).tap()
    await waitFor(element(by.id(testIDs.SCREEN_NOTIFICATIONS))).toBeVisible()
  })

  it('should be able to tap open notification detail', async () => {
    await element(by.id(testIDs.NOTIFICATION_CARD_BUTTON)).atIndex(0).tap()
    await waitFor(
      element(by.id(testIDs.SCREEN_NOTIFICATION_DETAIL)),
    ).toBeVisible()
  })
})
