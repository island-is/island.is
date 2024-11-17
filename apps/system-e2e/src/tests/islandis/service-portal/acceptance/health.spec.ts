import { test, BrowserContext, expect } from '@playwright/test'
import { icelandicAndNoPopupUrl, urls } from '../../../../support/urls'
import { session } from '../../../../support/session'
import { label } from '../../../../support/i18n'
import { messages } from '@island.is/portals/my-pages/health/messages'
import { disableI18n } from '../../../../support/disablers'
import { setupXroadMocks } from './setup-xroad.mocks'

const homeUrl = `${urls.islandisBaseUrl}/minarsidur`
test.use({ baseURL: urls.islandisBaseUrl })

test.describe('MS - Health', () => {
  let context: BrowserContext

  test.beforeAll(async ({ browser }) => {
    context = await session({
      browser: browser,
      storageState: 'service-portal-faereyjar.json',
      homeUrl,
      phoneNumber: '0102399',
      idsLoginOn: true,
    })
  })

  test.afterAll(async () => {
    await context.close()
  })

  test('dentists', async () => {
    const page = await context.newPage()
    await disableI18n(page)

    await test.step('should display data', async () => {
      // Arrange
      await page.goto(icelandicAndNoPopupUrl('/minarsidur/heilsa/tannlaeknar'))

      const title = page.getByRole('heading', {
        name: 'Tannlæknar',
      })
      await expect(title).toBeVisible()
    })
  })

  test('dentist registration', async () => {
    const page = await context.newPage()
    await setupXroadMocks()
    await disableI18n(page)

    await test.step('should display registration button', async () => {
      // Arrange
      await page.goto(icelandicAndNoPopupUrl('/minarsidur/heilsa/tannlaeknar'))

      const title = page.getByRole('link', {
        name: label(messages.changeRegistration),
      })

      await expect(title).toBeVisible()
      await title.click()

      const row = page.getByRole('row').last()
      await row.hover()

      const save = page.getByRole('button', {
        name: label(messages.healthRegistrationSave),
      })

      await expect(save).toBeVisible()
      await save.click()

      const agreeButton = page.getByRole('button', {
        name: label(messages.healthRegisterModalAccept),
      })

      await expect(agreeButton).toBeVisible()
      await agreeButton.click()

      const newDentist = page.getByRole('heading', {
        name: 'Nýr tannlæknir skráður',
      })

      await expect(newDentist).toBeVisible()
    })
  })

  test('health centers', async () => {
    const page = await context.newPage()
    await disableI18n(page)

    await test.step('should display data', async () => {
      // Arrange
      await page.goto(icelandicAndNoPopupUrl('/minarsidur/heilsa/heilsugaesla'))

      const title = page.getByRole('heading', {
        name: 'Heilsugæsla',
      })
      await expect(title).toBeVisible()
    })
  })

  test('health center registration', async () => {
    const page = await context.newPage()
    await setupXroadMocks()
    await disableI18n(page)

    await test.step('should display registration button', async () => {
      // Arrange
      await page.goto(icelandicAndNoPopupUrl('/minarsidur/heilsa/heilsugaesla'))

      const title = page.getByRole('link', {
        name: label(messages.changeRegistration),
      })

      await expect(title).toBeVisible()
      await title.click()

      await page.getByTestId('accordion-item').first().click()

      const row = page.getByRole('row').first()

      await expect(row).toBeVisible()
      await row.hover()

      const save = page.getByRole('button', {
        name: label(messages.healthRegistrationSave),
      })

      await expect(save).toBeVisible()
      await save.click()

      const agreeButton = page.getByRole('button', {
        name: label(messages.healthRegisterModalAccept),
      })

      await expect(agreeButton).toBeVisible()
      await agreeButton.click()

      const newHealthCenter = page.getByRole('heading', {
        name: 'Ný heilsugæsla skráð',
      })

      await expect(newHealthCenter).toBeVisible()
    })
  })
})
