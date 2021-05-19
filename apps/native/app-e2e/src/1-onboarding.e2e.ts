import { device, expect, element, by, waitFor } from 'detox';
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
      url: `${config.bundleId}://e2e/cookie/X29hdXRoMl9kZXY9eW1IYXpIdklrMFlGelJSU0dvX3NTa2NIUlhtNDR5d3AxaWRINzdXbHlmOEdnR1VVWnNJRUVaZ1Y1amZZNjNVZGNsTHBwWTRpU285dXd0MlJmczN2c2JabGhkdnpYUXpRZ1N0Z0l4aGFoTFpqdWtjTVNtbDhHZXBsdGw1QUxVZzEzNGJxeHBZNHR3MmtmV2RRQmNXUEZ6S2pSN3EwN0JCcU9vQmR0NVZkZk1SQ29WTzlLd1RlVUc5ZnUwcWRoZmgwc1c5M19GS3gwUndEemJBWTV2eFo0bjU5X1A1WjF4TDd3czBmdnc9PXwxNjIxMzM1MDgxfExiQ2NhU3N1TmlTUlBtYzBkNFQxa3JrTEhlM1JuWVpWcXYtRVpqem9qdVk9`
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
      prompt_delegations: 'true',
      response_type: 'code',
      ui_locales: 'en-US',
      code_challenge_method: 'S256',
      nonce: authNonce.text,
      scope: config.identityServer.scopes.join(' '),
      code_challenge: authCode.text,
      redirect_uri: redirectUri,
      client_id: config.identityServer.clientId,
      state: authState.text,
    };

    const qs = Object.entries(params).map(kv => kv.map(encodeURIComponent).join('=')).join('&');
    const returnUrl = encodeURIComponent(`/connect/authorize/callback?${qs}`);
    const url = `${config.identityServer.issuer}/login?ReturnUrl=${returnUrl}`

    console.log({
      params,
      returnUrl,
      url
    })

    // wait 1s
    await new Promise(r => setTimeout(r, 1000));

    browser = await puppeteer.launch();

    const page = await browser.newPage();
    await page.goto(url);
    page.on('response', (response: puppeteer.HTTPResponse) => {
      const status = response.status();
      console.log(status, response.url());
      if (status !== 200) {
        console.log(response.headers())
      }
    });
    await page.type('#phoneNumber', config.phoneNumber);
    await page.click('#submitPhoneNumber');
    await page.screenshot({  path: './app-e2e/artifacts/pupp-login.png' })

    const appUrlRedirect: string = await new Promise(resolve => {
      page.on('response', (response: puppeteer.HTTPResponse) => {
        const status = response.status()
        const headers = response.headers();
        if ((status >= 300) && (status <= 399)) {
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
    await device.disableSynchronization();
    await waitFor(element(by.id(testIDs.SCREEN_ONBOARDING_NOTIFICATIONS))).toBeVisible();
    await element(by.id(testIDs.ONBOARDING_NOTIFICATIONS_ALLOW_BUTTON)).tap();
    await waitFor(element(by.id(testIDs.SCREEN_ONBOARDING_NOTIFICATIONS))).toBeNotVisible();
  })

  it('should show home screen', async () => {
    await waitFor(element(by.id(testIDs.SCREEN_HOME))).toBeVisible();
  })
});
