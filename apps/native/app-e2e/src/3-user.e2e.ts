import { by, device, element } from 'detox'
import { testIDs } from '../../app/src/utils/test-ids'
import { config } from './utils'

describe('Notifications', () => {
  beforeAll(async () => {
    await device.launchApp({
      permissions: {
        faceid: 'YES',
        notifications: 'YES',
      },
      url: `${config.bundleId}://e2e/disable-applock`,
    })
  })

  it('should show user screen', async () => {
    await waitFor(element(by.id(testIDs.SCREEN_HOME))).toBeVisible()
    console.log('Disable synchronization')
    await device.disableSynchronization()
    await element(by.id(testIDs.TOPBAR_USER_BUTTON)).tap()
    await waitFor(element(by.id(testIDs.SCREEN_USER))).toBeVisible()
    await waitFor(element(by.id(testIDs.USER_SCREEN_PROFILE_INFO))).toBeVisible()
  })

  it('should have user profile tab open', async () => {
    await waitFor(element(by.id(testIDs.USER_SCREEN_PROFILE_INFO))).toBeVisible()
    await waitFor(element(by.id(testIDs.USER_PROFILE_INFO_DISPLAY_NAME_VALUE))).toExist();
  })

  it('should be able to tap settings', async () => {
    await element(by.id(testIDs.USER_TABBAR_TAB_SETTINGS)).tap()
    await waitFor(element(by.id(testIDs.USER_SCREEN_SETTINGS))).toBeVisible()
  })

  it('should be able to close user screen', async () => {
    await element(by.id(testIDs.NAVBAR_SHEET_CLOSE_BUTTON)).tap()
    await waitFor(element(by.id(testIDs.SCREEN_USER))).toBeNotVisible()
  })
})
