import { by, element } from 'detox'
import { testIDs } from '../../app/src/utils/test-ids'
import { launchAsynchronizedApp } from './utils'

describe('Notifications', () => {
  beforeAll(async () => {
    await launchAsynchronizedApp()
  })

  it('should show user screen', async () => {
    await waitFor(element(by.id(testIDs.SCREEN_HOME))).toBeVisible()
    // await waitFor(element(by.id(testIDs.SCREEN_USER))).toBeVisible()
    await waitFor(
      element(by.id(testIDs.SCREEN_PERSONAL_INFO)),
    ).toBeVisible()
  })

  it('should have user profile tab open', async () => {
    await waitFor(
      element(by.id(testIDs.SCREEN_PERSONAL_INFO)),
    ).toBeVisible()
    await waitFor(
      element(by.id(testIDs.USER_PROFILE_INFO_DISPLAY_NAME_VALUE)),
    ).toExist()
  })

  it('should be able to tap settings', async () => {
    await element(by.id(testIDs.USER_TABBAR_TAB_SETTINGS)).tap()
    await waitFor(element(by.id(testIDs.USER_SCREEN_SETTINGS))).toBeVisible()
  })

  it('should be able to close user screen', async () => {
    await element(by.id(testIDs.NAVBAR_SHEET_CLOSE_BUTTON)).tap()
    // await waitFor(element(by.id(testIDs.SCREEN_USER))).toBeNotVisible()
  })
})
