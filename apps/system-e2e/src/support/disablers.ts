import { Page } from '@playwright/test'

type MockGQLOptions = {
  responseKey?: string
  camelCaseResponseKey?: boolean
}

async function mockQGL<T>(
  page: Page,
  op: string,
  mockData: T,
  options: MockGQLOptions = { responseKey: op, camelCaseResponseKey: true },
) {
  await page.route(new RegExp(`/graphql?op=${op}$`), (route) => {
    const data: Record<string, T> = {}
    if (options.camelCaseResponseKey)
      op = op.replace(/^(.)/, (s) => s.toLowerCase())
    data[options?.responseKey ?? op] = mockData
    const response = { data }
    route.fulfill({ body: JSON.stringify(response) })
  })
}

export async function disablePreviousApplications(page: Page) {
  await mockQGL(page, 'ApplicationApplications', [])
}

export async function disableI18n(page: Page) {
  await mockQGL(page, 'GetTranslations', {})
}
