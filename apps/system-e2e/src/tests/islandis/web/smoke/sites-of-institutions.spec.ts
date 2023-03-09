import { test, expect, BrowserContext } from '@playwright/test'
import { urls } from '../../../../support/urls'
import { default as slugify } from 'slugify'
import { session } from '../../../../support/session'

test.use({ baseURL: urls.islandisBaseUrl })

// Name: of institution, home: relative to /s/, disabled: Skip?
type InstitutionHome = {
  name: string
  home?: string
  disabled?: boolean
  target?: string
}
const institutions: InstitutionHome[] = [
  { name: 'Fiskistofa' },
  { name: 'Fjársýslan' },
  { name: 'HSN' },
  { name: 'HSU' },
  { name: 'Landlæknir' },
  { name: 'Landskjörstjórn' },
  { name: 'Opinber nýsköpun', disabled: true },
  { name: 'Opinberir aðilar', home: '/' },
  { name: 'Ríkislögmaður' },
  { name: 'Sjúkratryggingar', target: 'Efnisyfirlit' },
  { name: 'Sýslumenn' },
  { name: 'Sýslumenn/uppboð' },
  { name: 'Útlendingastofnun' },
]

test.describe('Sites of institutions', () => {
  let context: BrowserContext
  test.beforeAll(async ({ browser }) => {
    context = await session({
      browser,
      homeUrl: '/s',
      phoneNumber: '1234567',
      idsLoginOn: false,
    })
  })

  test.skip('test test test', async ({ page }) => {
    const institution = institutions[0]
    await page.goto(institution.name)
  })
  for (const { name, home, disabled, target = name } of institutions) {
    test(`Vefir stofnana - ${name}`, async () => {
      if (disabled) test.skip()
      const page = await context.newPage()
      const slugged = slugify(name, { lower: true })
      const url = `${urls.islandisBaseUrl}/s/${home || slugged}`.replace(
        /\/*$/,
        '',
      )
      await page.goto(url, { waitUntil: 'networkidle' })
      await expect(
        page.getByRole('heading', { name: target }),
      ).toHaveCountGreaterThan(0)
    })
  }
})
