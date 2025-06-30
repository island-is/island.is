import slugify from 'slugify'
import { BrowserContext, expect, Page, test } from '@playwright/test'

import { session, urls } from '@island.is/testing/e2e'

type GetByRole = Pick<Page, 'getByRole'>['getByRole']
type GetByRoleParameters = Parameters<GetByRole>

test.use({ baseURL: urls.islandisBaseUrl })
type Orgs = {
  organisationName: string
  organisationHome?: string
  disabled?: boolean
  target?: { role: GetByRoleParameters[0]; options?: GetByRoleParameters[1] }
}
const orgs: Orgs[] = [
  { organisationName: 'Opinberir aðilar', organisationHome: '/' },
  { organisationName: 'Fiskistofa' },
  {
    organisationName: 'Heilbrigðisstofnun Norðurlands',
    organisationHome: '/hsn',
  },
  { organisationName: 'Sjúkratryggingar', target: { role: 'link' } },
  { organisationName: 'Ríkislögmaður' },
  { organisationName: 'Landskjörstjórn', target: { role: 'link' } },
  { organisationName: 'Opinber nýsköpun', disabled: true },
  { organisationName: 'Sýslumenn' },
  { organisationName: 'Fjársýslan' },
  {
    organisationName: 'Heilbrigðisstofnun Suðurlands',
    organisationHome: '/hsu',
  },
  {
    organisationName: 'Landlæknir',
    target: { role: 'link', options: { name: 'Eyðublöð' } },
  },
  { organisationName: 'Útlendingastofnun', target: { role: 'link' } },
]

test.describe('Sites of institutions', () => {
  let context: BrowserContext | undefined
  test.beforeAll(async ({ browser }) => {
    context = await session({
      browser,
      idsLoginOn: false,
      homeUrl: '/s',
    })
  })
  test.afterAll(async () => {
    await context?.close()
  })
  for (const {
    organisationName,
    organisationHome = `/${slugify(organisationName, { lower: true })}`,
    target,
    disabled,
  } of orgs) {
    // eslint-disable-next-line no-loop-func
    test(organisationName, async () => {
      if (disabled || !context) return
      const page = await context.newPage()
      const url = `/s${organisationHome}`
      await page.goto(url)
      await expect(
        page
          .getByRole(target?.role ?? 'heading', {
            ...{ name: organisationName },
            ...target?.options,
          })
          .first(),
      ).toBeVisible()
      await page.close()
    })
  }
})
