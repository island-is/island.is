import { BrowserContext, expect, test } from '@playwright/test'
import { urls } from '../../../support/utils'
import { session } from '../../../support/session'
import {
  DefaultStub,
  HttpMethod,
  Imposter,
  Mountebank,
  Proxy,
  ProxyMode,
} from '@anev/ts-mountebank'
import { helpers } from '../../../support/locator-helpers'

test.use({ baseURL: urls.islandisBaseUrl })

test.describe('Service portal', () => {
  let context: BrowserContext
  test.beforeAll(async ({ browser }) => {
    context = await session({
      browser: browser,
      storageState: 'service-portal.json',
      homeUrl: `${urls.islandisBaseUrl}/minarsidur`,
      phoneNumber: '0103019',
      idsLoginOn: true,
    })
  })
  test.afterAll(async () => {
    await context.close()
  })
  test.only('should have clickable navigation bar', async () => {
    // const mb = new Mountebank()
    // const imposter = new Imposter()
    //   .withPort(9091)
    //   .withStub(new DefaultStub('/', HttpMethod.GET, 'testbody', 500))
    // await mb.createImposter(imposter)
    const page = await context.newPage()
    await page.goto('/minarsidur')
    await expect(
      await page.locator('a[href^="/minarsidur/"]:has(svg):visible').nth(4),
    ).toBeTruthy()
  })
  test('should have user ${fakeUser.name} logged in', async () => {
    const page = await context.newPage()
    await page.goto('/minarsidur')
    await expect(
      page.locator('role=heading[name="Gervimaður Afríka"]'),
    ).toBeVisible()
  })
  test('should have Pósthólf', async () => {
    const page = await context.newPage()
    await page.goto('/minarsidur')
    await expect(page.locator('text=Pósthólf')).toBeVisible()
    await page.locator('a[href="/minarsidur/postholf"]').click()
    await expect(page.locator('text=Hér getur þú fundið skjöl')).toBeVisible()
  })
})
