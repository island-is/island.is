import { device, expect, element, by } from 'detox';
import { testIDs } from '../../app/src/utils/test-ids';
import puppeteer from 'puppeteer';
import { config } from './utils';

console.log(config);

describe('Authentication', () => {

  let browser: puppeteer.Browser;

  beforeAll(async () => {
    await device.clearKeychain();

    // start app with faceid permissions
    await device.launchApp({
      delete: true,
      permissions: {
        faceid: 'YES',
        notifications: 'YES',
      },
      // set cognito auth
      url: `${config.bundleId}://e2e/cookie/X29hdXRoMl9kZXY9WEpYQ29ETVJKR0U0LVBxTjJuRmFaMElkOTVZT3ZMdEtOTHFwMzFHZ0E0MVJ0bjV1QzVEc19ua3E2b3FJY2FRNERoeEMxTDRVZm5UZThuZ0pfTlEwektJMXh2X0FIT202OFkwSmRneVBlek15Y1QzN2JGSWk5VVFiZmd2M2hhcndDTEpFSGxNRnR0WWo3Tk5FWWZlTnI1YVg4X0RHNm92QUVpNWV3YW9Tazg4cm5hZTBxSlloMjVPbWh3YjNVS2pjLWhfbzBvUC1SbG5HSUJJc3FpT3phUXhnZjh2RGJyMTRHd0RtMEE9PXwxNjIxMDc0OTI3fGVMMEQwd3pzRV9jOWhDXy1PUFRDSDZfV3JYaUlfeXRKWmRPQzg4R0RkVzQ9`
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

    const redirectUri = `${config.bundleId}://oauth`;
    const params = {
      response_type: 'code',
      code_challenge_method: 'S256',
      nonce: authNonce.text,
      scope: config.identityServer.scopes,
      code_challenge: authCode.text,
      redirect_uri: redirectUri,
      client_id: config.identityServer.clientId,
      state: authState.text,
    };

    const qs = Object.entries(params).map(kv => kv.map(encodeURIComponent).join('=')).join('&');
    const returnUrl = encodeURIComponent(`/connect/authorize/callback?${qs}`);
    const url = `${config.identityServer.issuer}/login?ReturnUrl=${returnUrl}`

    browser = await puppeteer.launch();

    const page = await browser.newPage();
    await page.goto(url);
    await page.type('#phoneNumber', config.phoneNumber);
    await page.click('#submitPhoneNumber');
    await page.screenshot({  path: './app-e2e/artifacts/pupp-login.png' })

    const appUrlRedirect: string = await new Promise(resolve => {
      page.on('response', (response: puppeteer.HTTPResponse) => {
        const status = response.status()
        const headers = response.headers();
        console.log({ status }, response.url());
        if ((status >= 300) && (status <= 399)) {
          console.log({ headers });
          const redirectUrl = headers['location'];
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
    await expect(element(by.id(testIDs.SCREEN_ONBOARDING_ENTER_PIN))).toBeVisible();
    await element(by.id(testIDs.PIN_KEYPAD_BUTTON_1)).tap();
    await element(by.id(testIDs.PIN_KEYPAD_BUTTON_2)).tap();
    await element(by.id(testIDs.PIN_KEYPAD_BUTTON_3)).tap();
    await element(by.id(testIDs.PIN_KEYPAD_BUTTON_4)).tap();
    await expect(element(by.id(testIDs.SCREEN_ONBOARDING_ENTER_PIN))).toBeNotVisible();
  })

  it('should confirm pin number', async () => {
    await expect(element(by.id(testIDs.SCREEN_ONBOARDING_CONFIRM_PIN))).toBeVisible();
    await element(by.id(testIDs.PIN_KEYPAD_BUTTON_1)).tap();
    await element(by.id(testIDs.PIN_KEYPAD_BUTTON_2)).tap();
    await element(by.id(testIDs.PIN_KEYPAD_BUTTON_3)).tap();
    await element(by.id(testIDs.PIN_KEYPAD_BUTTON_4)).tap();
    await expect(element(by.id(testIDs.SCREEN_ONBOARDING_CONFIRM_PIN))).toBeNotVisible();
  })

  it('should allow biometrics', async () => {
    await expect(element(by.id(testIDs.SCREEN_ONBOARDING_BIOMETRICS))).toBeVisible();
    await element(by.id(testIDs.ONBOARDING_BIOMETRICS_USE_BUTTON)).tap();
    await device.matchFace();
    await expect(element(by.id(testIDs.SCREEN_ONBOARDING_BIOMETRICS))).toBeNotVisible();
  })

  it('should allow notifications', async () => {
    await expect(element(by.id(testIDs.SCREEN_ONBOARDING_NOTIFICATIONS))).toBeVisible();
    await element(by.id(testIDs.ONBOARDING_NOTIFICATIONS_ALLOW_BUTTON)).tap();
    await expect(element(by.id(testIDs.SCREEN_ONBOARDING_NOTIFICATIONS))).toBeNotVisible();
  })

  it('should show home screen', async () => {
    await expect(element(by.id(testIDs.SCREEN_HOME))).toBeVisible();
  })
});
