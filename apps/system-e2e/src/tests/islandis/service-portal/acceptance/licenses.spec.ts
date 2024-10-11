import { test, BrowserContext, expect } from '@playwright/test'
import { icelandicAndNoPopupUrl, urls } from '../../../../support/urls'
import { session } from '../../../../support/session'
import { disableI18n } from '../../../../support/disablers'
import { setupXroadMocks } from './setup-xroad.mocks'
const homeUrl = `${urls.islandisBaseUrl}/minarsidur`

test.use({ baseURL: urls.islandisBaseUrl })

test.describe('MS - Licenses', () => {
  let context: BrowserContext

  test.beforeAll(async ({ browser }) => {
    context = await session({
      browser: browser,
      storageState: 'service-portal-faereyjar.json',
      homeUrl,
      phoneNumber: '0102399',
      idsLoginOn: true,
    })
    await setupXroadMocks()
  })

  test('licenses', async () => {
    const page = await context.newPage()
    await disableI18n(page)

    await test.step('should display each license type in list', async () => {
      // Arrange
      const licenses = [
        'Ökuréttindi',
        'Skotvopnaleyfi',
        'ADR réttindi',
        'Vinnuvélaréttindi',
        'Örorkuskírteini',
        'Almennt veiðikort',
        'P-kort',
        'Evrópska sjúkratryggingakortið',
        'Númer vegabréfs: Well6842',
      ]

      await page.goto(icelandicAndNoPopupUrl('minarsidur/skirteini'))

      const title = page.getByRole('heading', {
        name: 'Skírteinin þín',
      })
      await expect(title).toBeVisible()

      for await (const license of licenses) {
        const element = page.getByText(license)
        await element.waitFor({ timeout: 30000 })
        await expect(element).toBeVisible()
      }
    })
    await test.step(
      'should display the firearm license detail screen',
      async () => {
        //More complex so gets it's own test
        // Arrange
        const element = page.locator(`[href*="skotvopnaleyfi"]`)
        await element.waitFor()
        await element.click()

        const title = page.getByRole('heading', {
          name: 'Skotvopnaleyfið þitt',
        })
        await title.waitFor()
        await expect(title).toBeVisible()

        const rights = page.getByText('Réttindaflokkar')
        await expect(rights).toBeVisible()

        const properties = page.getByText('Skotvopn í eigu leyfishafa')
        await expect(properties).toBeVisible()

        await page.goBack()
      },
    )
    await test.step('should display each detail screen', async () => {
      // Arrange
      const licenses = [
        { title: 'Ökuréttindin þín', ref: 'okurettindi' },
        { title: 'ADR réttindin þín', ref: 'adrrettindi' },
        { title: 'Vinnuvélaréttindin þín', ref: 'vinnuvelarettindi' },
        { title: 'Örorkuskírteinið þitt', ref: 'ororkuskirteini' },
        { title: 'Almennt veiðikort', ref: 'veidikort' },
        { title: 'P-kort', ref: 'pkort' },
        { title: 'Evrópska sjúkratryggingakortið', ref: 'ehic' },
        { title: 'Vegabréf', ref: 'vegabref/Well6842' },
      ]

      for await (const license of licenses) {
        const ref = `[href*="${license.ref}"]`
        const element = page.locator(ref)
        await element.waitFor()
        await element.click()

        const title = page.getByRole('heading', {
          name: license.title,
        })
        await title.waitFor()
        await expect(title).toBeVisible()

        await page.goBack()
      }
    })
    /*
    DON'T REMOVE
    ACTS AS A BASE FOR WHEN THESE TESTS ARE IMPLMENTED

    await test.step(
      'should return a pkpass for each applicable license',
      async () => {
        // Arrange
        const licensesUrl = [
          'minarsidur/skirteini/rikislogreglustjori/skotvopnaleyfi/default',
          'minarsidur/skirteini/rikislogreglustjori/okurettindi/default',
          'minarsidur/skirteini/vinnueftirlitid/adrrettindi/default',
          'minarsidur/skirteini/vinnueftirlitid/vinnuvelarettindi/default',
        ]

        await page.route('/api/graphql?op=generatePkPass', (route) =>
          route.fulfill({
            status: 200,
            path: '../../../fixtures/<my-app>/myError.json',
          }),
        )

        for await (const url of licensesUrl) {
          await page.goto(url)

          const button = page.getByRole('button', { name: 'Senda í síma' })
          await button.waitFor()
          await button.click()
        }
      },
      )*/
  })
})
