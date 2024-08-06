import { Page } from '@island.is/testing/e2e'

export const graphqlSpy = async (
  page: Page,
  url: string,
  operation: string,
) => {
  const data: { request: unknown; response: unknown }[] = []
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
      (
        fieldExtractor: (op: { request: unknown; response: unknown }) => string,
      ) =>
      () => {
        const op = data[0]
        return op ? fieldExtractor(op) : ''
      },
    data: (
      fieldExtractor: (op: { request: unknown; response: unknown }) => string,
    ) => {
      const op = data[0]
      return op ? fieldExtractor(op) : ''
    },
  }
}

export const mockApi = async (page: Page, url: string, response: unknown) => {
  await page.route(url, async (route, _req) => {
    await route.fulfill({
      status: 200,
      body: JSON.stringify(response),
      contentType: 'application/json',
    })
  })
}

export const verifyRequestCompletion = async (
  page: Page,
  url: string,
  op: string,
) => {
  const response = await page.waitForResponse(
    (resp) =>
      resp.url().includes(url) &&
      resp.request().postDataJSON().operationName === op,
  )

  return await response.json()
}
