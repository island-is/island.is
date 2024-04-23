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

  test.afterAll(async () => {
    await context.close()
  })

  test('licenses', async () => {
    const page = await context.newPage()
    await disableI18n(page)

    await test.step('should display data', async () => {
      // Arrange
      await page.goto(icelandicAndNoPopupUrl('minarsidur/skirteini'))

      const title = page.getByRole('heading', {
        name: 'Skírteinin þín',
      })
      await expect(title).toBeVisible()
    })
  })

  test.describe('Drivers license tests', () => {
    test('license is rendered in list', async () => {
      const page = await context.newPage()
      await disableI18n(page)

      await test.step('should display data', async () => {
        // Arrange
        await page.goto(icelandicAndNoPopupUrl('minarsidur/skirteini'))

        const title = page.getByText('Ökuréttindi')
        await title.waitFor()
        await expect(title).toBeVisible()
      })
    })
    test('navigate to detail', async () => {
      const page = await context.newPage()
      await disableI18n(page)

      await test.step('should display data', async () => {
        // Arrange
        await page.goto(icelandicAndNoPopupUrl('minarsidur/skirteini'))

        const drivers = page.locator('[href*="okurettindi"]')
        await drivers.waitFor()
        await drivers.click()

        const title = page.getByRole('heading', {
          name: 'Ökuréttindin þín',
        })

        await expect(title).toBeVisible()
      })
    })
    /*
    test('querying for pkpass', async () => {
      const page = await context.newPage()
      await disableI18n(page)


      await test.step('should display data', async () => {
        // Arrange
        await page.goto(
          icelandicAndNoPopupUrl(
            'minarsidur/skirteini/rikislogreglustjori/okurettindi/default',
          ),
        )

        const button = page.getByRole('button', {
          name: 'Senda í síma',
        })
      })
      })*/
  })

  test.describe('ADR license tests', () => {
    test('ADR license is rendered in list', async () => {
      const page = await context.newPage()
      await disableI18n(page)

      await test.step('should display data', async () => {
        // Arrange
        await page.goto(icelandicAndNoPopupUrl('minarsidur/skirteini'))

        const title = page.getByText('ADR réttindi')
        await title.waitFor()
        await expect(title).toBeVisible()
      })
    })
    test('navigate to adr license detail', async () => {
      const page = await context.newPage()
      await disableI18n(page)

      await test.step('should display data', async () => {
        // Arrange
        await page.goto(icelandicAndNoPopupUrl('minarsidur/skirteini'))

        const drivers = page.locator('[href*="adrrettindi"]')
        await drivers.waitFor()
        await drivers.click()

        const title = page.getByRole('heading', {
          name: 'ADR réttindin þín',
        })

        await expect(title).toBeVisible()
      })
    })
    /*
    test('querying for pkpass', async () => {
      const page = await context.newPage()
      await disableI18n(page)


      await test.step('should display data', async () => {
        // Arrange
        await page.goto(
          icelandicAndNoPopupUrl(
            'minarsidur/skirteini/rikislogreglustjori/okurettindi/default',
          ),
        )

        const button = page.getByRole('button', {
          name: 'Senda í síma',
        })
      })
      })*/
  })

  test.describe('Work machine license tests', () => {
    test('Work machine license is rendered in list', async () => {
      const page = await context.newPage()
      await disableI18n(page)

      await test.step('should display data', async () => {
        // Arrange
        await page.goto(icelandicAndNoPopupUrl('minarsidur/skirteini'))

        const title = page.getByText('Vinnuvélaréttindi')
        await title.waitFor()
        await expect(title).toBeVisible()
      })
    })
    test('navigate to work machine license detail', async () => {
      const page = await context.newPage()
      await disableI18n(page)

      await test.step('should display data', async () => {
        // Arrange
        await page.goto(icelandicAndNoPopupUrl('minarsidur/skirteini'))

        const drivers = page.locator('[href*="vinnuvelarettindi"]')
        await drivers.waitFor()
        await drivers.click()

        const title = page.getByRole('heading', {
          name: 'Vinnuvélaréttindin þín',
        })

        await expect(title).toBeVisible()
      })
    })
    /*
    test('querying for pkpass', async () => {
      const page = await context.newPage()
      await disableI18n(page)


      await test.step('should display data', async () => {
        // Arrange
        await page.goto(
          icelandicAndNoPopupUrl(
            'minarsidur/skirteini/rikislogreglustjori/okurettindi/default',
          ),
        )

        const button = page.getByRole('button', {
          name: 'Senda í síma',
        })
      })
      })*/
  })

  test.describe('Disability license tests', () => {
    test('disability license is rendered in list', async () => {
      const page = await context.newPage()
      await disableI18n(page)

      await test.step('should display data', async () => {
        // Arrange
        await page.goto(icelandicAndNoPopupUrl('minarsidur/skirteini'))

        const title = page.getByText('Örorkuskírteini')
        await title.waitFor()
        await expect(title).toBeVisible()
      })
    })
    test('navigate to disability license detail', async () => {
      const page = await context.newPage()
      await disableI18n(page)

      await test.step('should display data', async () => {
        // Arrange
        await page.goto(icelandicAndNoPopupUrl('minarsidur/skirteini'))

        const drivers = page.locator('[href*="ororkuskirteini"]')
        await drivers.waitFor()
        await drivers.click()

        const title = page.getByRole('heading', {
          name: 'Örorkuskírteinið þitt',
        })

        await expect(title).toBeVisible()
      })
    })
    /*
    test('querying for pkpass', async () => {
      const page = await context.newPage()
      await disableI18n(page)


      await test.step('should display data', async () => {
        // Arrange
        await page.goto(
          icelandicAndNoPopupUrl(
            'minarsidur/skirteini/rikislogreglustjori/okurettindi/default',
          ),
        )

        const button = page.getByRole('button', {
          name: 'Senda í síma',
        })
      })
      })*/
  })
})
