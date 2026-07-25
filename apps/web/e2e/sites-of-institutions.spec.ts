import slugify from 'slugify'

import {
  type BrowserContext,
  expect,
  type Page,
  session,
  test,
} from '@island.is/testing/e2e'

type GetByRole = Pick<Page, 'getByRole'>['getByRole']
type GetByRoleParameters = Parameters<GetByRole>

type Orgs = {
  organisationName: string
  organisationHome?: string
  skip?: boolean
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
  { organisationName: 'Opinber nýsköpun', skip: true },
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

test.describe('Sites of institutions', { tag: '@fast' }, () => {
  let context: BrowserContext
  test.beforeAll(async ({ browser }) => {
    context = await session({
      browser,
      idsLoginOn: false,
      homeUrl: '/s',
    })
  })
  test.afterAll(async () => {
    await context.close()
  })
  orgs.forEach(
    ({
      organisationName,
      organisationHome = `/${slugify(organisationName, { lower: true })}`,
      target,
      skip,
    }) => {
      test(organisationName, async () => {
        if (skip) return
        const page = await context.newPage()
        const url = `/s${organisationHome}`

        const response = await page.goto(url, { timeout: 30000 })
        expect(response?.ok()).toBe(true)

        // Verify we landed on the correct URL
        expect(page.url()).toContain(url)

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
    },
  )
})
