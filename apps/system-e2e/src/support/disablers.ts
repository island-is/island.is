import { Page } from '@playwright/test'

async function mockQGL<T>(page: Page, op: string, mockData: T) {
  await page.route('*/api/graphql?op=ApplicationApplications', route => {
    const data: Record<string, T> = {}
    data[op] = mockData
    const response = {data}
    route.fulfill({ body: JSON.stringify(response) })
  })
}

export async function disablePreviousApplications(page: Page) {
  await mockQGL(page, 'ApplicationApplications', [])
}

export async function disableI18n(page: Page) {
  await mockQGL(page, 'getTranslations', {})
}
