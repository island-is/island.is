import { BrowserContext, expect, Page, test } from '@playwright/test'
import { icelandicAndNoPopupUrl, urls } from '../../../../support/urls'
import { session } from '../../../../support/session'
import { sleep } from '../../../../support/utils'

test.describe('Consultation portal authenticated', () => {
  let context: BrowserContext
  let consultationContext: BrowserContext
  const homeUrl = '/samradsgatt'

  test.beforeAll(async ({ browser }) => {
    context = await session({
      browser: browser,
      storageState: 'consultation-auth.json',
      idsLoginOn: { nextAuth: { nextAuthRoot: 'samradsgatt' } },
      phoneNumber: '0103019',
      homeUrl,
      authTrigger: async (page) => {
        await page.goto(homeUrl)
        await page.getByTestId('menu-login-btn').click()
        return page.url()
      },
    })
  })

  test.afterAll(async () => {
    await context.close()
  })

  test('logged in user should be shown instead of login', async () => {
    const page = await context.newPage()
    await page.goto(icelandicAndNoPopupUrl('/samradsgatt'))

    await expect(
      page.getByRole('button', { name: 'Gervimaður Afríka' }),
    ).toBeVisible()
    await expect(page.getByTestId('menu-login-btn')).not.toBeVisible()

    await page.close()
  })

  test('subscriptions page should show logged in state', async () => {
    const page = await context.newPage()
    await page.goto(icelandicAndNoPopupUrl('/samradsgatt'))

    await page.getByTestId('subscriptions-btn').click()
    await expect(page.getByTestId('subscriptions-title')).toBeVisible()
    await expect(page.getByTestId('action-card')).toBeVisible()
    await expect(page.getByTestId('tab-content')).toBeVisible()
    await expect(
      page.getByRole('button', {
        name: 'Skrá mig inn',
      }),
    ).not.toBeVisible()

    await page.close()
  })

  test('my subscriptions page should show logged in state', async () => {
    const page = await context.newPage()
    await page.goto(icelandicAndNoPopupUrl('/samradsgatt/minaraskriftir'))
    await expect(page.getByTestId('subscriptions-title')).toBeVisible()
    await expect(page.getByTestId('action-card')).not.toBeVisible()
    await expect(page.getByTestId('tab-content')).toBeVisible()

    await page.close()
  })

  test('advices page should show logged in state', async () => {
    const page = await context.newPage()
    await page.goto(icelandicAndNoPopupUrl('/samradsgatt'))

    await page.goto('/umsagnir')
    await expect(page.getByTestId('actionCard')).not.toBeVisible()

    await page.close()
  })

  test('logout button should be visible', async () => {
    const page = await context.newPage()
    await page.goto(icelandicAndNoPopupUrl('/samradsgatt'))

    await page.getByRole('button', { name: 'Gervimaður Afríka' }).click()
    await expect(page.getByRole('button', { name: 'Útskrá' })).toBeVisible()

    await page.close()
  })
})
