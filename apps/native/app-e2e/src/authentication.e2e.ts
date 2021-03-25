import { device, expect, element, by } from 'detox';
import { testIDs } from '../../app/src/utils/test-ids';

describe('Authentication', () => {
  beforeAll(async () => {
    // start app with faceid permissions
    await device.launchApp({
      permissions: {
        faceid: 'YES'
      }
    });
    // enroll into biometrics
    await device.setBiometricEnrollment(true);
  });

  // @todo cannot test app-auth, need to bypass somehow

  // it('should have authenticate screen', async () => {
  //   await expect(element(by.id(testIDs.SCREEN_LOGIN))).toBeVisible();
  //   await expect(element(by.id(testIDs.LOGIN_BUTTON_AUTHENTICATE))).toBeVisible();
  //   await element(by.id(testIDs.LOGIN_BUTTON_AUTHENTICATE)).tap();
  // });

  it('should have app lock screen', async () => {
    console.log('wait for app lock');
    await waitFor(element(by.id(testIDs.SCREEN_APP_LOCK))).toExist().withTimeout(10000);
    console.log('its here, match face')
    await device.matchFace();
    console.log('face has been matched')
    await waitFor(element(by.id(testIDs.SCREEN_APP_LOCK))).toNotExist().withTimeout(10000);
  });

  it('should have home screen', async () => {
    await expect(element(by.id(testIDs.SCREEN_HOME))).toBeVisible();
  });

  it('should have user screen', async () => {
    await element(by.id(testIDs.TOPBAR_USER_BUTTON)).tap();
    await expect(element(by.id(testIDs.SCREEN_USER))).toBeVisible();
  })
});
