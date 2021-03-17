import { device, expect, element, by } from 'detox';

describe('Example', () => {
  beforeAll(async () => {
    await device.launchApp();
  });

  beforeEach(async () => {
    await device.reloadReactNative();
  });

  it('should have welcome screen', async () => {
    await expect(element(by.id('welcome'))).toBeVisible();
  });

  it('should have a button', async () => {
    await expect(element(by.id('button1'))).toBeVisible();
    await element(by.id('button1')).tap();
  });
});
