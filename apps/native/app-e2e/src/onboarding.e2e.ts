import { device, expect, element, by } from 'detox';
import { testIDs } from '../../app/src/utils/test-ids';
import puppeteer from 'puppeteer';

describe('Authentication', () => {

  let browser: puppeteer.Browser;

  beforeAll(async () => {
    // start app with faceid permissions
    await device.launchApp({
      permissions: {
        faceid: 'YES',
        notifications: 'YES',
      },
    });

    // enroll into biometrics
    await device.setBiometricEnrollment(true);
  });

  afterAll(async () => {
    if (browser) {
      browser.close();
    }
  })

  it('should be able to authenticate', async () => {
    await expect(element(by.id(testIDs.SCREEN_LOGIN))).toBeVisible();
    await expect(element(by.id(testIDs.LOGIN_BUTTON_AUTHENTICATE))).toBeVisible();
    await element(by.id(testIDs.LOGIN_BUTTON_AUTHENTICATE)).tap();

    // @todo only works in iOS, attempt the try/catch and read stack trace method for Android
    const authNonce = await (element(by.id('auth_nonce')) as any).getAttributes();
    const authCode = await (element(by.id('auth_code')) as any).getAttributes();
    const authState = await (element(by.id('auth_state')) as any).getAttributes();

    const redirectUri = 'is.island.app-dev://oauth';
    const params = {
      response_type: 'code',
      code_challenge_method: 'S256',
      nonce: authNonce.text,
      scope: 'openid profile api_resource.scope offline_access',
      code_challenge: authCode.text,
      redirect_uri: redirectUri,
      client_id: '@island.is-app',
      state: authState.text,
    };

    const qs = Object.entries(params).map(kv => kv.map(encodeURIComponent).join('=')).join('&');
    const returnUrl = encodeURIComponent(`/connect/authorize/callback?${qs}`);
    const url = `https://identity-server.dev01.devland.is/login?ReturnUrl=${returnUrl}`

    browser = await puppeteer.launch();

    const page = await browser.newPage();
    await page.goto(url);
    await page.type('#phoneNumber', '010-7789');
    await page.click('#submitPhoneNumber');

    const appUrlRedirect: string = await new Promise(resolve => {
      page.on('response', response => {
        const status = response.status()
        if ((status >= 300) && (status <= 399)) {
          const redirectUrl = response.headers()['location'];
          if (redirectUrl.substr(0, redirectUri.length) === redirectUri) {
            resolve(redirectUrl);
          }
        }
      });
    })
    await browser.close();
    await device.openURL({ url: appUrlRedirect });
    await expect(element(by.id(testIDs.SCREEN_LOGIN))).toBeNotVisible();
  });

  it('should set pin number', async () => {
    await expect(element(by.id(testIDs.SCREEN_ONBOARDING_APP_LOCK))).toBeVisible();
    await element(by.id(testIDs.ENTER_PIN_NUMBER_INPUT)).typeText('1234');
    await element(by.id(testIDs.CONFIRM_PIN_NUMBER_INPUT)).typeText('1234');
    await element(by.id(testIDs.ONBOARDING_APP_LOCK_CONTINUE_BUTTON)).tap();
    await expect(element(by.id(testIDs.SCREEN_ONBOARDING_APP_LOCK))).toBeNotVisible();
  })

  it('should allow notifications', async () => {
    await expect(element(by.id(testIDs.SCREEN_ONBOARDING_NOTIFICATIONS))).toBeVisible();
    await element(by.id(testIDs.ONBOARDING_NOTIFICATIONS_ALLOW_BUTTON)).tap();
    await expect(element(by.id(testIDs.SCREEN_ONBOARDING_NOTIFICATIONS))).toBeNotVisible();
  })

  it('should be able to logout', async () => {
    await expect(element(by.id(testIDs.TOPBAR_USER_BUTTON))).toBeVisible();
    await element(by.id(testIDs.TOPBAR_USER_BUTTON)).tap();
    await expect(element(by.id(testIDs.SCREEN_USER))).toBeVisible();
    await expect(element(by.id(testIDs.LOGOUT_BUTTON))).toBeVisible();
    await element(by.id(testIDs.LOGOUT_BUTTON)).tap();
    await expect(element(by.id(testIDs.SCREEN_LOGIN))).toBeVisible();
  });

  // it('should have app lock screen', async () => {
  //   console.log('wait for app lock');
  //   await waitFor(element(by.id(testIDs.SCREEN_APP_LOCK))).toExist().withTimeout(10000);
  //   console.log('its here, match face')
  //   await device.matchFace();
  //   console.log('face has been matched')
  //   await waitFor(element(by.id(testIDs.SCREEN_APP_LOCK))).toNotExist().withTimeout(10000);
  // });

  // it('should have home screen', async () => {
  //   await expect(element(by.id(testIDs.SCREEN_HOME))).toBeVisible();
  // });

  // it('should have user screen', async () => {
  //   await element(by.id(testIDs.TOPBAR_USER_BUTTON)).tap();
  //   await expect(element(by.id(testIDs.SCREEN_USER))).toBeVisible();
  // })
});
