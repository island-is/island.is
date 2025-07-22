import { Page } from '@playwright/test'

export async function graphqlSpy(page: Page, url: string, operation: string) {
  const data: { request: any; response: any }[] = []
  await page.route(url, async (route, req) => {
    const response = await page.request.fetch(req)
    if (
      req.method() === 'POST' &&
      req.postDataJSON().operationName === operation
    ) {
      data.push({
        request: req.postDataJSON(),
        response: await response.json(),
      })
    }
    await route.fulfill({ response })
  })
  return {
    extractor:
      (fieldExtractor: (op: { request: any; response: any }) => string) =>
      () => {
        const op = data[0]
        return op ? fieldExtractor(op) : ''
      },
    data: (fieldExtractor: (op: { request: any; response: any }) => string) => {
      const op = data[0]
      return op ? fieldExtractor(op) : ''
    },
  }
}

export async function mockApi(page: Page, url: string, response: any) {
  await page.route(url, async (route, req) => {
    await route.fulfill({
      status: 200,
      body: JSON.stringify(response),
      contentType: 'application/json',
    })
  })
}

export async function verifyRequestCompletion(
  page: Page,
  url: string,
  op: string,
) {
  const response = await page.waitForResponse(
    (resp) =>
      resp.url().includes(url) &&
      resp.request().postDataJSON().operationName === op,
  )

  return await response.json()
}
